from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.conf import settings
from apps.products.models import Product, ProductVariant

User = get_user_model()


class Cart(models.Model):
    STATUS_CHOICES = [
        ("active", "Active"),
        ("converted", "Converted to Order"),
        ("abandoned", "Abandoned"),
        ("expired", "Expired"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name="carts")
    session_key = models.CharField(max_length=40, null=True, blank=True, db_index=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="active", db_index=True)
    subtotal = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    discount_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    coupon_code = models.CharField(max_length=50, blank=True)
    expires_at = models.DateTimeField(null=True, blank=True, db_index=True)
    order_id = models.IntegerField(null=True, blank=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "carts"
        indexes = [
            models.Index(fields=["status", "expires_at"]),
            models.Index(fields=["user", "status"]),
        ]

    def __str__(self):
        return f"Cart {self.id} - {self.user.email if self.user else self.session_key}"

    def save(self, *args, **kwargs):
        if not self.expires_at:
            cart_timeout = getattr(settings, "CART_RESERVATION_TIMEOUT", 900)
            self.expires_at = timezone.now() + timezone.timedelta(seconds=cart_timeout)
        super().save(*args, **kwargs)

    @property
    def is_expired(self):
        return timezone.now() > self.expires_at and self.status == "active"

    @property
    def item_count(self):
        return sum(item.quantity for item in self.items.all())

    @property
    def total(self):
        return self.subtotal - self.discount_amount

    def recalculate_subtotal(self):
        self.subtotal = sum(item.subtotal for item in self.items.all())
        self.save(update_fields=["subtotal", "updated_at"])

    def apply_coupon(self, coupon):
        from apps.products.models import Coupon

        if hasattr(coupon, 'is_valid') and coupon.is_valid():
            if coupon.min_order_amount and self.subtotal < coupon.min_order_amount:
                return False, f"Minimum order amount of ₹{coupon.min_order_amount} required"

            self.discount_amount = coupon.calculate_discount(self.subtotal)
            self.coupon_code = coupon.code
            self.save(update_fields=["discount_amount", "coupon_code", "updated_at"])
            return True, f"Coupon applied! You save ₹{self.discount_amount}"

        return False, "Invalid or expired coupon"

    def remove_coupon(self):
        self.coupon_code = ""
        self.discount_amount = 0
        self.save(update_fields=["coupon_code", "discount_amount", "updated_at"])

    def convert_to_order(self, order_id):
        self.status = "converted"
        self.order_id = order_id
        self.save(update_fields=["status", "order_id", "updated_at"])

    def expire(self):
        self.status = "expired"
        self.save(update_fields=["status", "updated_at"])


class CartItem(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="items")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="cart_items")
    variant = models.ForeignKey(ProductVariant, on_delete=models.SET_NULL, null=True, blank=True)
    quantity = models.PositiveIntegerField(default=1)
    price_at_add = models.DecimalField(max_digits=12, decimal_places=2)
    price_locked_at = models.DateTimeField(null=True, blank=True)
    reservation_id = models.CharField(max_length=50, blank=True, db_index=True)
    is_reserved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "cart_items"
        unique_together = ["cart", "product", "variant"]
        indexes = [
            models.Index(fields=["reservation_id"]),
        ]

    def __str__(self):
        return f"{self.product.name} x {self.quantity}"

    @property
    def subtotal(self):
        return self.price_at_add * self.quantity

    @property
    def current_price(self):
        return self.product.current_price

    @property
    def price_changed(self):
        return self.price_at_add != self.current_price

    @property
    def is_available(self):
        if self.variant:
            return self.variant.is_active and self.variant.stock_quantity >= self.quantity
        return self.product.is_active and self.product.current_price > 0

    def update_price(self):
        self.price_at_add = self.product.current_price
        self.price_locked_at = timezone.now()
        self.save(update_fields=["price_at_add", "price_locked_at", "updated_at"])


class CartAbandonment(models.Model):
    cart = models.ForeignKey(Cart, on_delete=models.CASCADE, related_name="abandonment_records")
    email_sent = models.BooleanField(default=False)
    reminder_count = models.IntegerField(default=0)
    last_reminder_at = models.DateTimeField(null=True, blank=True)
    converted_to_order = models.BooleanField(default=False)
    order_id = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "cart_abandonments"

    def __str__(self):
        return f"Abandonment record for Cart {self.cart_id}"