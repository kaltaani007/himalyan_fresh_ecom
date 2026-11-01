from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.conf import settings
import uuid
from apps.accounts.models import Address
from apps.products.models import Product, ProductVariant

User = get_user_model()


class Order(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("confirmed", "Confirmed"),
        ("processing", "Processing"),
        ("packed", "Packed"),
        ("shipped", "Shipped"),
        ("delivered", "Delivered"),
        ("cancelled", "Cancelled"),
        ("refunded", "Refunded"),
        ("return_requested", "Return Requested"),
        ("returning", "Returning"),
        ("returned", "Returned"),
    ]

    PAYMENT_STATUS_CHOICES = [
        ("pending", "Pending"),
        ("authorized", "Authorized"),
        ("paid", "Paid"),
        ("failed", "Failed"),
        ("refunded", "Refunded"),
        ("partially_refunded", "Partially Refunded"),
    ]

    PAYMENT_METHODS = [
        ("cod", "Cash on Delivery"),
        ("prepaid", "Prepaid"),
        ("card", "Debit/Credit Card"),
        ("upi", "UPI"),
        ("wallet", "Wallet"),
        ("netbanking", "Net Banking"),
    ]

    order_number = models.CharField(max_length=20, unique=True, db_index=True)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="orders")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending", db_index=True)
    payment_status = models.CharField(max_length=25, choices=PAYMENT_STATUS_CHOICES, default="pending", db_index=True)
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHODS, blank=True)

    subtotal = models.DecimalField(max_digits=12, decimal_places=2)
    tax_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    shipping_cost = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    discount_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    coupon_code = models.CharField(max_length=50, blank=True)
    total_amount = models.DecimalField(max_digits=12, decimal_places=2)

    shipping_address_snapshot = models.JSONField(default=dict)
    billing_address_snapshot = models.JSONField(default=dict)
    user_snapshot = models.JSONField(default=dict)
    payment_snapshot = models.JSONField(default=dict)

    shipping_address = models.ForeignKey(Address, on_delete=models.SET_NULL, null=True, blank=True, related_name="shipping_orders")
    billing_address = models.ForeignKey(Address, on_delete=models.SET_NULL, null=True, blank=True, related_name="billing_orders")

    payment_transaction_id = models.CharField(max_length=100, blank=True)
    payment_gateway = models.CharField(max_length=50, blank=True)

    estimated_delivery = models.DateField(null=True, blank=True)
    delivered_at = models.DateTimeField(null=True, blank=True)

    notes = models.TextField(blank=True)
    customer_notes = models.TextField(blank=True)

    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)

    source = models.CharField(max_length=20, default="web")
    affiliate_code = models.CharField(max_length=50, blank=True)

    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)
    confirmed_at = models.DateTimeField(null=True, blank=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)
    cancelled_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="cancelled_orders")
    cancellation_reason = models.TextField(blank=True)

    class Meta:
        db_table = "orders"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["status", "created_at"]),
            models.Index(fields=["user", "created_at"]),
            models.Index(fields=["payment_status"]),
        ]

    def __str__(self):
        return self.order_number

    def save(self, *args, **kwargs):
        if not self.order_number:
            prefix = getattr(settings, "ORDER_NUMBER_PREFIX", "ORD")
            self.order_number = f"{prefix}-{uuid.uuid4().hex[:10].upper()}"
        super().save(*args, **kwargs)

    def _create_snapshot(self, address, address_type):
        if not address:
            return {}
        return {
            "full_name": address.full_name,
            "address_line1": address.address_line1,
            "address_line2": address.address_line2,
            "city": address.city,
            "state": address.state,
            "postal_code": address.postal_code,
            "country": address.country,
            "phone": address.phone,
            "address_type": address_type,
        }

    def create_snapshots(self):
        if self.shipping_address:
            self.shipping_address_snapshot = self._create_snapshot(self.shipping_address, "shipping")
        if self.billing_address:
            self.billing_address_snapshot = self._create_snapshot(self.billing_address, "billing")
        if self.user:
            self.user_snapshot = {
                "id": self.user.id,
                "email": self.user.email,
                "first_name": self.user.first_name,
                "last_name": self.user.last_name,
                "phone": getattr(self.user, "phone", ""),
            }
        self.save(update_fields=["shipping_address_snapshot", "billing_address_snapshot", "user_snapshot"])

    def calculate_total(self):
        self.total_amount = self.subtotal + self.tax_amount + self.shipping_cost - self.discount_amount
        return self.total_amount

    def confirm(self):
        self.status = "confirmed"
        self.confirmed_at = timezone.now()
        self.save(update_fields=["status", "confirmed_at", "updated_at"])

    def cancel(self, reason="", user=None):
        self.status = "cancelled"
        self.cancelled_at = timezone.now()
        self.cancelled_by = user
        self.cancellation_reason = reason
        self.save(update_fields=["status", "cancelled_at", "cancelled_by", "cancellation_reason", "updated_at"])

    @property
    def is_cancellable(self):
        return self.status in ["pending", "confirmed", "processing"]

    @property
    def is_refundable(self):
        return self.payment_status == "paid" and self.status in ["cancelled", "delivered"]

    @property
    def can_return(self):
        return self.status == "delivered"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="items")

    product_id = models.IntegerField()
    product_name = models.CharField(max_length=255)
    product_slug = models.CharField(max_length=255, blank=True)
    product_sku = models.CharField(max_length=50, blank=True)
    product_image = models.URLField(blank=True)

    variant_id = models.IntegerField(null=True, blank=True)
    variant_info = models.CharField(max_length=255, blank=True)

    quantity = models.IntegerField()
    unit_price = models.DecimalField(max_digits=12, decimal_places=2)
    discount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    tax_rate = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    tax_amount = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    total_price = models.DecimalField(max_digits=12, decimal_places=2)

    is_cancelled = models.BooleanField(default=False)
    cancelled_at = models.DateTimeField(null=True, blank=True)
    cancellation_reason = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "order_items"
        indexes = [
            models.Index(fields=["order", "product_id"]),
        ]

    def __str__(self):
        return f"{self.product_name} x {self.quantity}"

    @property
    def subtotal(self):
        return self.unit_price * self.quantity

    @property
    def final_price(self):
        return self.total_price

    def save(self, *args, **kwargs):
        if not self.total_price:
            self.total_price = (self.unit_price * self.quantity) - self.discount + self.tax_amount
        super().save(*args, **kwargs)

    @classmethod
    def create_from_product(cls, order, product, variant=None, quantity=1, price=None):
        current_price = price or product.current_price
        image = product.images.filter(is_primary=True).first()
        image_url = image.image.url if image else ""

        variant_info = ""
        if variant:
            variant_info = f"{variant.variant_type}: {variant.variant_value}"
            variant_id = variant.id
        else:
            variant_id = None

        return cls(
            order=order,
            product_id=product.id,
            product_name=product.name,
            product_slug=product.slug,
            product_sku=product.sku,
            product_image=image_url,
            variant_id=variant_id,
            variant_info=variant_info,
            quantity=quantity,
            unit_price=current_price,
        )


class Shipment(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("label_created", "Label Created"),
        ("picked_up", "Picked Up"),
        ("in_transit", "In Transit"),
        ("out_for_delivery", "Out for Delivery"),
        ("delivered", "Delivered"),
        ("failed", "Failed"),
        ("returned", "Returned"),
    ]

    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="shipments")
    shipment_number = models.CharField(max_length=50, unique=True)

    carrier = models.CharField(max_length=50)
    service_type = models.CharField(max_length=50, blank=True)
    tracking_number = models.CharField(max_length=100, blank=True)
    tracking_url = models.URLField(blank=True)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")

    shipping_cost = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    weight = models.DecimalField(max_digits=8, decimal_places=2, null=True, blank=True)

    label_generated_at = models.DateTimeField(null=True, blank=True)
    picked_up_at = models.DateTimeField(null=True, blank=True)
    shipped_at = models.DateTimeField(null=True, blank=True)
    delivered_at = models.DateTimeField(null=True, blank=True)
    failed_at = models.DateTimeField(null=True, blank=True)

    current_location = models.CharField(max_length=255, blank=True)
    estimated_delivery = models.DateField(null=True, blank=True)

    events = models.JSONField(default=list)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "shipments"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.shipment_number} - {self.order.order_number}"


class RefundRequest(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
        ("processed", "Processed"),
        ("failed", "Failed"),
    ]

    REFUND_TYPE = [
        ("full", "Full Refund"),
        ("partial", "Partial Refund"),
    ]

    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="refund_requests")
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    refund_type = models.CharField(max_length=20, choices=REFUND_TYPE, default="full")

    reason = models.TextField()
    reason_category = models.CharField(max_length=50, blank=True)
    images = models.JSONField(default=list)

    requested_amount = models.DecimalField(max_digits=12, decimal_places=2)
    approved_amount = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")

    admin_notes = models.TextField(blank=True)
    processed_at = models.DateTimeField(null=True, blank=True)
    processed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name="processed_refunds")

    refund_transaction_id = models.CharField(max_length=100, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "refund_requests"
        ordering = ["-created_at"]

    def __str__(self):
        return f"Refund {self.id} - {self.order.order_number}"