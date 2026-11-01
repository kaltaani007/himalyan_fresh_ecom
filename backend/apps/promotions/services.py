from django.db.models import Q
from django.utils import timezone
from django.core.exceptions import ValidationError
import logging

logger = logging.getLogger(__name__)


class PromotionService:
    def __init__(self):
        self.applied_promotions = []
        self.total_discount = 0

    def validate_coupon(self, code, user=None, cart=None):
        from apps.promotions.models import Promotion, Coupon

        try:
            coupon = Coupon.objects.select_related("promotion").get(code=code.upper())
            promotion = coupon.promotion

            if not promotion.is_valid():
                return False, "Coupon is expired or invalid"

            if promotion.min_order_amount and cart and cart.subtotal < promotion.min_order_amount:
                return False, f"Minimum order of ₹{promotion.min_order_amount} required"

            if user:
                user_usage = promotion.user_usage.filter(user=user).count()
                if user_usage >= promotion.usage_limit_per_user:
                    return False, "You've already used this coupon"

            return True, {"promotion": promotion, "coupon": coupon}

        except Coupon.DoesNotExist:
            return False, "Invalid coupon code"

    def get_applicable_promotions(self, cart, user=None):
        from apps.promotions.models import Promotion

        now = timezone.now()
        promotions = Promotion.objects.filter(
            status="active",
            valid_from__lte=now,
            valid_until__gte=now,
        ).filter(
            Q(usage_limit__isnull=True) | Q(used_count__lt=models.F("usage_limit"))
        )

        applicable = []
        for promotion in promotions:
            if self._check_promotion_rules(promotion, cart, user):
                applicable.append(promotion)

        applicable.sort(key=lambda p: p.stack_priority, reverse=True)
        return applicable

    def _check_promotion_rules(self, promotion, cart, user):
        from apps.promotions.models import PromotionRule

        if not promotion.rules.exists():
            return True

        for rule in promotion.rules.all():
            if not self._evaluate_rule(rule, cart, user):
                return False

        return True

    def _evaluate_rule(self, rule, cart, user):
        from apps.promotions.models import PromotionRule

        cart_value = cart.subtotal if cart else 0
        product_ids = [item.product_id for item in cart.items.all()] if cart else []
        product_categories = [item.product.category_id for item in cart.items.all() if item.product.category_id] if cart else []

        if rule.rule_type == "cart_value":
            return self._compare_values(cart_value, rule.comparison_type, rule.value.get("min_amount", 0))

        elif rule.rule_type == "product_count":
            item_count = cart.items.count() if cart else 0
            return self._compare_values(item_count, rule.comparison_type, rule.value.get("min_items", 0))

        elif rule.rule_type == "first_order" and user:
            from apps.orders.models import Order
            has_previous_orders = Order.objects.filter(user=user).exists()
            if rule.value.get("first_order_only") and has_previous_orders:
                return False
            return True

        elif rule.rule_type == "product":
            rule_product_ids = rule.value.get("product_ids", [])
            return bool(set(product_ids) & set(rule_product_ids))

        elif rule.rule_type == "category":
            rule_category_ids = rule.value.get("category_ids", [])
            return bool(set(product_categories) & set(rule_category_ids))

        return True

    def _compare_values(self, actual, comparison, expected):
        if comparison == "eq":
            return actual == expected
        elif comparison == "neq":
            return actual != expected
        elif comparison == "gt":
            return actual > expected
        elif comparison == "gte":
            return actual >= expected
        elif comparison == "lt":
            return actual < expected
        elif comparison == "lte":
            return actual <= expected
        elif comparison == "in":
            return actual in expected
        elif comparison == "not_in":
            return actual not in expected
        return True

    def calculate_discounts(self, cart, user=None, coupon_code=None):
        from apps.promotions.models import UserPromotionUsage

        total_discount = 0
        applied_promotions = []

        if coupon_code:
            valid, result = self.validate_coupon(coupon_code, user, cart)
            if valid:
                promotion = result["promotion"]
                discount = promotion.calculate_discount(cart.subtotal)
                if discount > 0:
                    total_discount += discount
                    applied_promotions.append({
                        "promotion_id": promotion.id,
                        "promotion_name": promotion.name,
                        "discount_amount": discount,
                        "code": result["coupon"].code,
                    })
            else:
                raise ValidationError(result)

        automatic_promotions = self.get_applicable_promotions(cart, user)
        non_stackable = [p for p in automatic_promotions if not p.is_stackable]
        stackable = [p for p in automatic_promotions if p.is_stackable]

        if non_stackable and not coupon_code:
            best_promotion = non_stackable[0]
            discount = best_promotion.calculate_discount(cart.subtotal)
            if discount > 0:
                total_discount += discount
                applied_promotions.append({
                    "promotion_id": best_promotion.id,
                    "promotion_name": best_promotion.name,
                    "discount_amount": discount,
                })
        elif not coupon_code:
            for promotion in stackable:
                discount = promotion.calculate_discount(cart.subtotal - total_discount)
                if discount > 0:
                    total_discount += discount
                    applied_promotions.append({
                        "promotion_id": promotion.id,
                        "promotion_name": promotion.name,
                        "discount_amount": discount,
                    })

        self.applied_promotions = applied_promotions
        self.total_discount = total_discount

        return {
            "total_discount": total_discount,
            "applied_promotions": applied_promotions,
            "final_total": cart.subtotal - total_discount,
        }

    def record_usage(self, user, order, discount_amount):
        for promo in self.applied_promotions:
            from apps.promotions.models import Promotion, UserPromotionUsage

            try:
                promotion = Promotion.objects.get(id=promo["promotion_id"])
                promotion.used_count += 1
                promotion.save(update_fields=["used_count"])

                UserPromotionUsage.objects.create(
                    user=user,
                    promotion=promotion,
                    order=order,
                    discount_amount=discount_amount,
                )
            except Exception as e:
                logger.error(f"Failed to record promotion usage: {str(e)}")

    def check_flash_sale_availability(self, promotion_id):
        from apps.promotions.models import FlashSale

        try:
            flash_sale = FlashSale.objects.get(promotion_id=promotion_id)
            available = flash_sale.max_quantity - flash_sale.sold_quantity
            return available > 0, available
        except FlashSale.DoesNotExist:
            return True, float("inf")

    def reserve_flash_sale(self, promotion_id, quantity, user_id):
        from apps.promotions.models import FlashSale

        try:
            flash_sale = FlashSale.objects.select_for_update().get(promotion_id=promotion_id)
            available = flash_sale.max_quantity - flash_sale.sold_quantity

            if quantity > available:
                raise ValidationError(f"Only {available} units available")

            flash_sale.sold_quantity += quantity
            flash_sale.save(update_fields=["sold_quantity"])
            return True
        except FlashSale.DoesNotExist:
            raise ValidationError("Flash sale not found")


promotion_service = PromotionService()

from django.db import models