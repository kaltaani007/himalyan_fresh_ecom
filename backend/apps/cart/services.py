from django.db import transaction
from django.utils import timezone
from django.core.exceptions import ValidationError
import logging
from decimal import Decimal

logger = logging.getLogger(__name__)


class CartService:
    @classmethod
    def get_or_create_cart(cls, request):
        from .models import Cart

        if request.user.is_authenticated:
            cart, created = Cart.objects.get_or_create(
                user=request.user,
                status="active",
                defaults={"expires_at": timezone.now() + timezone.timedelta(minutes=15)}
            )
        else:
            session_key = request.session.session_key
            if not session_key:
                request.session.create()
                session_key = request.session.session_key

            cart, created = Cart.objects.get_or_create(
                session_key=session_key,
                status="active",
                defaults={"expires_at": timezone.now() + timezone.timedelta(minutes=15)}
            )

        if cart.is_expired:
            from apps.inventory.services import inventory_service
            inventory_service.release_cart_reservations(cart.id)
            cart.status = "expired"
            cart.save()
            cart = Cart.objects.create(
                user=request.user if request.user.is_authenticated else None,
                session_key=session_key,
                expires_at=timezone.now() + timezone.timedelta(minutes=15)
            )

        return cart

    @classmethod
    @transaction.atomic
    def add_item(cls, cart, product_id, variant_id=None, quantity=1, reserve_stock=True):
        from .models import CartItem
        from apps.products.models import Product, ProductVariant
        from apps.inventory.services import inventory_service

        try:
            product = Product.objects.get(id=product_id, is_active=True)
        except Product.DoesNotExist:
            raise ValidationError("Product not found")

        variant = None
        if variant_id:
            try:
                variant = ProductVariant.objects.get(id=variant_id, product=product, is_active=True)
            except ProductVariant.DoesNotExist:
                raise ValidationError("Product variant not found")

        price = variant.price if variant and variant.price else product.current_price

        if variant:
            available = variant.stock_quantity
        else:
            from apps.products.models import Inventory
            inv = Inventory.objects.filter(variant__product=product).first()
            available = inv.available_quantity if inv else 0

        if available < quantity:
            raise ValidationError(f"Only {available} units available")

        item, created = CartItem.objects.get_or_create(
            cart=cart,
            product=product,
            variant=variant,
            defaults={
                "price_at_add": price,
                "quantity": quantity,
            }
        )

        if not created:
            item.quantity += quantity
            if item.price_changed:
                item.price_at_add = price
            item.save()

        if reserve_stock:
            try:
                reservation = inventory_service.reserve_stock(
                    product_id=product.id,
                    quantity=item.quantity,
                    user=cart.user,
                    cart_id=cart.id,
                )
                item.reservation_id = reservation.reservation_id
                item.is_reserved = True
                item.save(update_fields=["reservation_id", "is_reserved"])
            except ValidationError as e:
                logger.warning(f"Failed to reserve stock: {str(e)}")

        cart.recalculate_subtotal()
        cart.expires_at = timezone.now() + timezone.timedelta(minutes=15)
        cart.save(update_fields=["expires_at", "updated_at"])

        return item

    @classmethod
    @transaction.atomic
    def update_item_quantity(cls, cart, item_id, quantity):
        from .models import CartItem
        from apps.inventory.services import inventory_service

        try:
            item = CartItem.objects.get(id=item_id, cart=cart)
        except CartItem.DoesNotExist:
            raise ValidationError("Item not found in cart")

        if quantity == 0:
            return cls.remove_item(cart, item_id)

        item.quantity = quantity

        if item.reservation_id:
            try:
                inventory_service.release_reservation(item.reservation_id)
            except Exception as e:
                logger.warning(f"Failed to release old reservation: {str(e)}")

            try:
                reservation = inventory_service.reserve_stock(
                    product_id=item.product_id,
                    quantity=quantity,
                    user=cart.user,
                    cart_id=cart.id,
                )
                item.reservation_id = reservation.reservation_id
                item.is_reserved = True
            except ValidationError as e:
                logger.warning(f"Failed to reserve updated stock: {str(e)}")
                item.is_reserved = False

        item.save()
        cart.recalculate_subtotal()

        return item

    @classmethod
    @transaction.atomic
    def remove_item(cls, cart, item_id):
        from .models import CartItem
        from apps.inventory.services import inventory_service

        try:
            item = CartItem.objects.get(id=item_id, cart=cart)
        except CartItem.DoesNotExist:
            raise ValidationError("Item not found in cart")

        if item.reservation_id:
            try:
                inventory_service.release_reservation(item.reservation_id)
            except Exception as e:
                logger.warning(f"Failed to release reservation: {str(e)}")

        item.delete()
        cart.recalculate_subtotal()

        return True

    @classmethod
    def apply_coupon(cls, cart, coupon_code):
        from apps.products.models import Coupon

        if cart.coupon_code:
            raise ValidationError("Coupon already applied. Remove it first.")

        try:
            coupon = Coupon.objects.get(code=coupon_code)
        except Coupon.DoesNotExist:
            raise ValidationError("Invalid coupon code")

        return cart.apply_coupon(coupon)

    @classmethod
    def remove_coupon(cls, cart):
        cart.remove_coupon()
        return True

    @classmethod
    @transaction.atomic
    def convert_to_order(cls, cart, order_data):
        from .models import CartItem
        from apps.orders.models import Order, OrderItem
        from apps.inventory.services import inventory_service
        from django.conf import settings

        if cart.items.count() == 0:
            raise ValidationError("Cart is empty")

        order = Order.objects.create(
            user=cart.user,
            status="pending",
            subtotal=cart.subtotal,
            discount_amount=cart.discount_amount,
            coupon_code=cart.coupon_code,
            tax_amount=order_data.get("tax_amount", 0),
            shipping_cost=order_data.get("shipping_cost", 0),
            shipping_address=order_data.get("shipping_address"),
            billing_address=order_data.get("billing_address", order_data.get("shipping_address")),
            payment_method=order_data.get("payment_method", "prepaid"),
            notes=order_data.get("notes", ""),
            ip_address=order_data.get("ip_address"),
            user_agent=order_data.get("user_agent"),
        )

        order.calculate_total()
        order.create_snapshots()

        for item in cart.items.all():
            order_item = OrderItem.create_from_product(
                order=order,
                product=item.product,
                variant=item.variant,
                quantity=item.quantity,
                price=item.price_at_add,
            )
            order_item.save()

            if item.reservation_id:
                try:
                    inventory_service.confirm_reservation(item.reservation_id, order.id)
                except Exception as e:
                    logger.warning(f"Failed to confirm reservation: {str(e)}")

        cart.convert_to_order(order.id)

        return order


cart_service = CartService()