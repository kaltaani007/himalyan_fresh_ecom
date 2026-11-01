from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.conf import settings
import uuid

User = get_user_model()


class Promotion(models.Model):
    PROMOTION_TYPES = [
        ("coupon", "Coupon Code"),
        ("automatic", "Automatic Discount"),
        ("flash_sale", "Flash Sale"),
        ("bundle", "Product Bundle"),
        ("bogo", "Buy One Get One"),
        ("free_shipping", "Free Shipping"),
    ]

    STATUS_CHOICES = [
        ("draft", "Draft"),
        ("scheduled", "Scheduled"),
        ("active", "Active"),
        ("paused", "Paused"),
        ("expired", "Expired"),
        ("cancelled", "Cancelled"),
    ]

    name = models.CharField(max_length=200)
    slug = models.SlugField(unique=True)
    promotion_type = models.CharField(max_length=20, choices=PROMOTION_TYPES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="draft")

    description = models.TextField(blank=True)
    terms_conditions = models.TextField(blank=True)

    discount_type = models.CharField(max_length=20, blank=True)
    discount_value = models.DecimalField(max_digits=10, decimal_places=2)
    max_discount_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)

    min_order_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    min_quantity = models.IntegerField(null=True, blank=True)

    usage_limit = models.IntegerField(null=True, blank=True)
    usage_limit_per_user = models.IntegerField(default=1)
    used_count = models.IntegerField(default=0)

    is_stackable = models.BooleanField(default=False)
    stack_priority = models.IntegerField(default=0)

    is_featured = models.BooleanField(default=False)
    show_on_homepage = models.BooleanField(default=False)

    valid_from = models.DateTimeField()
    valid_until = models.DateTimeField()

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "promotions"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["status", "valid_from", "valid_until"]),
            models.Index(fields=["promotion_type"]),
        ]

    def __str__(self):
        return f"{self.name} ({self.status})"

    def is_valid(self):
        now = timezone.now()
        return (
            self.status == "active"
            and self.valid_from <= now <= self.valid_until
            and (self.usage_limit is None or self.used_count < self.usage_limit)
        )

    def calculate_discount(self, amount, quantity=1):
        if not self.is_valid():
            return 0

        if self.min_order_amount and amount < self.min_order_amount:
            return 0

        if self.min_quantity and quantity < self.min_quantity:
            return 0

        if self.discount_type == "percentage":
            discount = (amount * self.discount_value) / 100
        elif self.discount_type == "fixed":
            discount = self.discount_value
        else:
            discount = 0

        if self.max_discount_amount and discount > self.max_discount_amount:
            discount = self.max_discount_amount

        return min(discount, amount)


class Coupon(models.Model):
    CODE_TYPES = [
        ("alphanumeric", "Alphanumeric"),
        ("numeric", "Numeric"),
        ("alphabetical", "Alphabetical"),
    ]

    code = models.CharField(max_length=50, unique=True)
    code_type = models.CharField(max_length=20, choices=CODE_TYPES, default="alphanumeric")
    promotion = models.ForeignKey(Promotion, on_delete=models.CASCADE, related_name="coupons")

    is_single_use = models.BooleanField(default=False)
    is_exclusive = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "promotion_coupons"

    def __str__(self):
        return self.code


class PromotionRule(models.Model):
    RULE_TYPES = [
        ("product", "Specific Products"),
        ("category", "Specific Categories"),
        ("brand", "Specific Brands"),
        ("user_type", "User Type"),
        ("first_order", "First Order Only"),
        ("user_segment", "User Segment"),
        ("cart_value", "Cart Value"),
        ("product_count", "Product Count"),
    ]

    COMPARISON_TYPES = [
        ("eq", "Equal to"),
        ("neq", "Not equal to"),
        ("gt", "Greater than"),
        ("gte", "Greater than or equal to"),
        ("lt", "Less than"),
        ("lte", "Less than or equal to"),
        ("in", "In list"),
        ("not_in", "Not in list"),
    ]

    promotion = models.ForeignKey(Promotion, on_delete=models.CASCADE, related_name="rules")
    rule_type = models.CharField(max_length=20, choices=RULE_TYPES)
    comparison_type = models.CharField(max_length=10, choices=COMPARISON_TYPES, default="in")
    value = models.JSONField()
    is_exclusive = models.BooleanField(default=False)

    class Meta:
        db_table = "promotion_rules"

    def __str__(self):
        return f"{self.promotion.name} - {self.rule_type}"


class PromotionTarget(models.Model):
    TARGET_TYPES = [
        ("product", "Product"),
        ("category", "Category"),
        ("collection", "Collection"),
    ]

    promotion = models.ForeignKey(Promotion, on_delete=models.CASCADE, related_name="targets")
    target_type = models.CharField(max_length=20, choices=TARGET_TYPES)
    target_id = models.IntegerField()

    class Meta:
        db_table = "promotion_targets"
        unique_together = ["promotion", "target_type", "target_id"]


class UserPromotionUsage(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="promotion_usage")
    promotion = models.ForeignKey(Promotion, on_delete=models.CASCADE, related_name="user_usage")
    order = models.ForeignKey("orders.Order", on_delete=models.SET_NULL, null=True)
    discount_amount = models.DecimalField(max_digits=10, decimal_places=2)
    used_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "user_promotion_usage"
        unique_together = ["user", "promotion", "order"]


class FlashSale(models.Model):
    promotion = models.OneToOneField(Promotion, on_delete=models.CASCADE, related_name="flash_sale")
    max_quantity = models.IntegerField()
    sold_quantity = models.IntegerField(default=0)
    per_user_limit = models.IntegerField(default=1)

    class Meta:
        db_table = "flash_sales"


class Bundle(models.Model):
    promotion = models.OneToOneField(Promotion, on_delete=models.CASCADE, related_name="bundle")
    bundle_name = models.CharField(max_length=200)
    bundle_products = models.JSONField()
    bundle_price = models.DecimalField(max_digits=10, decimal_places=2)
    savings = models.DecimalField(max_digits=10, decimal_places=2)

    class Meta:
        db_table = "bundles"


class FreeShippingRule(models.Model):
    promotion = models.OneToOneField(Promotion, on_delete=models.CASCADE, related_name="free_shipping")
    min_order_amount = models.DecimalField(max_digits=10, decimal_places=2)
    shipping_method = models.CharField(max_length=50, blank=True)
    is_applicable = models.BooleanField(default=True)

    class Meta:
        db_table = "free_shipping_rules"