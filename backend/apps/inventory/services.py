from django.db import transaction
from django.utils import timezone
from django.conf import settings
from django.core.exceptions import ValidationError
import logging

logger = logging.getLogger(__name__)


class InventoryService:
    RESERVATION_TIMEOUT = getattr(settings, "CART_RESERVATION_TIMEOUT", 900)

    @classmethod
    def check_availability(cls, product_id, warehouse_id=None, quantity=1):
        from apps.inventory.models import Stock

        stock_query = Stock.objects.filter(
            product_id=product_id,
            is_active=True,
        )

        if warehouse_id:
            stock_query = stock_query.filter(warehouse_id=warehouse_id)

        stock = stock_query.first()

        if not stock:
            return {"available": False, "reason": "Product not found in inventory"}

        if stock.available_quantity < quantity:
            return {
                "available": False,
                "reason": "Insufficient stock",
                "available_quantity": stock.available_quantity,
                "requested_quantity": quantity,
            }

        return {
            "available": True,
            "available_quantity": stock.available_quantity,
            "stock_id": stock.id,
        }

    @classmethod
    @transaction.atomic
    def reserve_stock(cls, product_id, quantity, user=None, cart_id=None, warehouse_id=None):
        from apps.inventory.models import Stock, StockReservation

        stock_query = Stock.objects.select_for_update().filter(
            product_id=product_id,
            is_active=True,
            available_quantity__gte=quantity,
        )

        if warehouse_id:
            stock_query = stock_query.filter(warehouse_id=warehouse_id)

        stock = stock_query.first()

        if not stock:
            raise ValidationError("Product not available or insufficient stock")

        reservation = StockReservation.objects.create(
            stock=stock,
            quantity=quantity,
            status="pending",
            user=user,
            cart_id=cart_id,
        )

        stock.available_quantity -= quantity
        stock.reserved_quantity += quantity
        stock.save()

        logger.info(f"Reserved {quantity} units of product {product_id} for reservation {reservation.reservation_id}")

        return reservation

    @classmethod
    @transaction.atomic
    def confirm_reservation(cls, reservation_id, order_id=None):
        from apps.inventory.models import StockReservation

        reservation = StockReservation.objects.select_for_update().get(
            reservation_id=reservation_id,
            status__in=["pending", "confirmed"],
        )

        if reservation.is_expired:
            reservation.status = "expired"
            reservation.release()
            raise ValidationError("Reservation has expired")

        if order_id:
            reservation.order_id = order_id

        reservation.confirm()

        logger.info(f"Confirmed reservation {reservation_id} for order {order_id}")

        return reservation

    @classmethod
    @transaction.atomic
    def release_reservation(cls, reservation_id):
        from apps.inventory.models import StockReservation

        reservation = StockReservation.objects.select_for_update().get(
            reservation_id=reservation_id,
            status__in=["pending", "confirmed"],
        )

        reservation.release()

        logger.info(f"Released reservation {reservation_id}")

        return reservation

    @classmethod
    @transaction.atomic
    def release_cart_reservations(cls, cart_id):
        from apps.inventory.models import StockReservation

        reservations = StockReservation.objects.filter(
            cart_id=cart_id,
            status__in=["pending", "confirmed"],
        )

        released = []
        for reservation in reservations:
            reservation.release()
            released.append(reservation.reservation_id)

        logger.info(f"Released {len(released)} reservations for cart {cart_id}")

        return released

    @classmethod
    @transaction.atomic
    def convert_cart_to_order(cls, cart, order_id):
        from apps.inventory.models import StockReservation

        reservations = StockReservation.objects.filter(
            cart_id=cart.id,
            status="pending",
        )

        confirmed = []
        for reservation in reservations:
            try:
                reservation.order_id = order_id
                reservation.confirm()
                confirmed.append(reservation.reservation_id)
            except Exception as e:
                logger.error(f"Failed to confirm reservation {reservation.reservation_id}: {str(e)}")
                reservation.release()

        logger.info(f"Converted {len(confirmed)} reservations to order {order_id}")

        return confirmed

    @classmethod
    def get_reservation_status(cls, reservation_id):
        from apps.inventory.models import StockReservation

        try:
            reservation = StockReservation.objects.get(reservation_id=reservation_id)
            return {
                "reservation_id": reservation.reservation_id,
                "status": reservation.status,
                "quantity": reservation.quantity,
                "expires_at": reservation.expires_at,
                "is_expired": reservation.is_expired,
            }
        except StockReservation.DoesNotExist:
            return None

    @classmethod
    def release_expired_reservations(cls):
        from apps.inventory.models import StockReservation

        expired = StockReservation.objects.filter(
            status__in=["pending", "confirmed"],
            expires_at__lt=timezone.now(),
        )

        count = 0
        for reservation in expired:
            try:
                reservation.status = "expired"
                reservation.release()
                count += 1
            except Exception as e:
                logger.error(f"Failed to release expired reservation {reservation.reservation_id}: {str(e)}")

        logger.info(f"Released {count} expired reservations")

        return count

    @classmethod
    @transaction.atomic
    def adjust_stock(cls, stock_id, adjustment_type, quantity, notes=None, user=None):
        from apps.inventory.models import Stock, StockMovement

        stock = Stock.objects.select_for_update().get(id=stock_id)

        if adjustment_type == "add":
            stock.available_quantity += quantity
            stock.total_quantity += quantity
        elif adjustment_type == "remove":
            if stock.available_quantity < quantity:
                raise ValidationError("Cannot remove more than available quantity")
            stock.available_quantity -= quantity
            stock.total_quantity -= quantity
        elif adjustment_type == "reserve":
            stock.reserved_quantity += quantity
            stock.available_quantity -= quantity
        elif adjustment_type == "release":
            stock.reserved_quantity -= quantity
            stock.available_quantity += quantity
        elif adjustment_type == "damage":
            stock.damaged_quantity += quantity
            stock.available_quantity -= quantity
        elif adjustment_type == "expire":
            stock.expired_quantity += quantity
            stock.available_quantity -= quantity

        stock.save()

        movement = StockMovement.objects.create(
            stock=stock,
            movement_type=adjustment_type,
            quantity=quantity,
            reference_type="manual",
            notes=notes,
            created_by=user,
        )

        logger.info(f"Adjusted stock {stock_id} by {adjustment_type}: {quantity}")

        return stock

    @classmethod
    def get_low_stock_products(cls, warehouse_id=None):
        from apps.inventory.models import Stock

        stock_query = Stock.objects.filter(
            is_active=True,
        ).filter(
            available_quantity__lte=models.F("low_stock_threshold")
        )

        if warehouse_id:
            stock_query = stock_query.filter(warehouse_id=warehouse_id)

        return stock_query.order_by("available_quantity")


inventory_service = InventoryService()