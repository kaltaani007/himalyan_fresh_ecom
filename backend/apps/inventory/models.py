from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.conf import settings
import uuid

User = get_user_model()


class Warehouse(models.Model):
    name = models.CharField(max_length=100)
    code = models.CharField(max_length=20, unique=True)
    address = models.TextField(blank=True)
    is_active = models.BooleanField(default=True)
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "warehouses"
        verbose_name_plural = "Warehouses"

    def __str__(self):
        return self.name


class Stock(models.Model):
    STATUS_CHOICES = [
        ("available", "Available"),
        ("reserved", "Reserved"),
        ("damaged", "Damaged"),
        ("expired", "Expired"),
        ("sold", "Sold"),
    ]

    product_id = models.IntegerField()
    product_name = models.CharField(max_length=255)
    sku = models.CharField(max_length=50)
    warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE, related_name="stocks")
    total_quantity = models.IntegerField(default=0)
    available_quantity = models.IntegerField(default=0)
    reserved_quantity = models.IntegerField(default=0)
    damaged_quantity = models.IntegerField(default=0)
    expired_quantity = models.IntegerField(default=0)
    low_stock_threshold = models.IntegerField(default=10)
    reorder_point = models.IntegerField(default=20)
    max_stock_level = models.IntegerField(default=1000)
    expiry_date = models.DateField(null=True, blank=True)
    batch_number = models.CharField(max_length=50, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "stocks"
        indexes = [
            models.Index(fields=["product_id", "warehouse"]),
            models.Index(fields=["sku"]),
            models.Index(fields=["is_active"]),
        ]

    def __str__(self):
        return f"{self.product_name} - {self.warehouse.code}"

    @property
    def is_low_stock(self):
        return self.available_quantity <= self.low_stock_threshold

    @property
    def needs_reorder(self):
        return self.available_quantity <= self.reorder_point


class StockReservation(models.Model):
    RESERVATION_STATUS = [
        ("pending", "Pending"),
        ("confirmed", "Confirmed"),
        ("released", "Released"),
        ("expired", "Expired"),
        ("failed", "Failed"),
    ]

    reservation_id = models.CharField(max_length=50, unique=True, editable=False)
    stock = models.ForeignKey(Stock, on_delete=models.CASCADE, related_name="reservations")
    quantity = models.IntegerField()
    status = models.CharField(max_length=20, choices=RESERVATION_STATUS, default="pending")
    expires_at = models.DateTimeField()
    confirmed_at = models.DateTimeField(null=True, blank=True)
    released_at = models.DateTimeField(null=True, blank=True)
    cart_id = models.IntegerField(null=True, blank=True, db_index=True)
    order_id = models.IntegerField(null=True, blank=True, db_index=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "stock_reservations"
        indexes = [
            models.Index(fields=["status", "expires_at"]),
            models.Index(fields=["cart_id"]),
            models.Index(fields=["order_id"]),
            models.Index(fields=["user"]),
        ]

    def __str__(self):
        return f"Reservation {self.reservation_id} - {self.quantity} units"

    def save(self, *args, **kwargs):
        if not self.reservation_id:
            self.reservation_id = f"RES-{uuid.uuid4().hex[:12].upper()}"
        if not self.expires_at:
            from django.conf import settings
            reservation_timeout = getattr(
                settings,
                "STOCK_RESERVATION_TIMEOUT",
                getattr(settings, "CART_RESERVATION_TIMEOUT", 900)
            )
            self.expires_at = timezone.now() + timezone.timedelta(seconds=reservation_timeout)
        super().save(*args, **kwargs)

    @property
    def is_expired(self):
        return timezone.now() > self.expires_at and self.status in ["pending", "confirmed"]

    @property
    def is_valid(self):
        return self.status in ["pending", "confirmed"] and not self.is_expired

    @property
    def time_remaining_seconds(self):
        if self.status not in ["pending", "confirmed"]:
            return 0
        delta = self.expires_at - timezone.now()
        return max(0, int(delta.total_seconds()))

    def release(self, reason="manual"):
        if self.status in ["released", "expired"]:
            return False

        self.status = "released"
        self.released_at = timezone.now()
        self.metadata = self.metadata or {}
        self.metadata["release_reason"] = reason
        self.save()

        self.stock.reserved_quantity = max(0, self.stock.reserved_quantity - self.quantity)
        self.stock.available_quantity += self.quantity
        self.stock.save()
        return True

    def confirm(self):
        if self.status != "pending":
            return False

        self.status = "confirmed"
        self.confirmed_at = timezone.now()
        self.save()

        self.stock.reserved_quantity -= self.quantity
        self.stock.available_quantity -= self.quantity
        self.stock.save()
        return True

    def mark_expired(self):
        if self.status not in ["pending", "confirmed"]:
            return False

        self.status = "expired"
        self.metadata = self.metadata or {}
        self.metadata["expired_at"] = timezone.now().isoformat()
        self.save()

        self.stock.reserved_quantity = max(0, self.stock.reserved_quantity - self.quantity)
        self.stock.available_quantity += self.quantity
        self.stock.save()
        return True


class StockMovement(models.Model):
    MOVEMENT_TYPE = [
        ("in", "Stock In"),
        ("out", "Stock Out"),
        ("transfer", "Transfer"),
        ("reservation", "Reservation"),
        ("release", "Release"),
        ("adjustment", "Adjustment"),
        ("damaged", "Damaged"),
        ("expired", "Expired"),
    ]

    stock = models.ForeignKey(Stock, on_delete=models.CASCADE, related_name="movements")
    movement_type = models.CharField(max_length=20, choices=MOVEMENT_TYPE)
    quantity = models.IntegerField()
    reference_type = models.CharField(max_length=50, blank=True)
    reference_id = models.CharField(max_length=50, blank=True)
    notes = models.TextField(blank=True)
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "stock_movements"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["reference_type", "reference_id"]),
        ]

    def __str__(self):
        return f"{self.movement_type} - {self.quantity} units"


class StockAlert(models.Model):
    ALERT_TYPE = [
        ("low_stock", "Low Stock"),
        ("out_of_stock", "Out of Stock"),
        ("expiring", "Expiring Soon"),
        ("expired", "Expired"),
        ("overstock", "Overstock"),
    ]

    stock = models.ForeignKey(Stock, on_delete=models.CASCADE, related_name="alerts")
    alert_type = models.CharField(max_length=20, choices=ALERT_TYPE)
    quantity_threshold = models.IntegerField()
    is_resolved = models.BooleanField(default=False)
    resolved_at = models.DateTimeField(null=True, blank=True)
    resolved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "stock_alerts"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.alert_type} - {self.stock.product_name}"