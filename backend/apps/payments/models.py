from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from apps.orders.models import Order

User = get_user_model()


class Payment(models.Model):
    PAYMENT_STATUS_CHOICES = [
        ("pending", "Pending"),
        ("initiated", "Initiated"),
        ("authorized", "Authorized"),
        ("captured", "Captured"),
        ("completed", "Completed"),
        ("failed", "Failed"),
        ("cancelled", "Cancelled"),
        ("refunded", "Refunded"),
        ("partially_refunded", "Partially Refunded"),
    ]

    PAYMENT_METHODS = [
        ("card", "Credit/Debit Card"),
        ("upi", "UPI"),
        ("netbanking", "Net Banking"),
        ("wallet", "Wallet"),
        ("cod", "Cash on Delivery"),
    ]

    GATEWAY_CHOICES = [
        ("stripe", "Stripe"),
        ("razorpay", "Razorpay"),
        ("paytm", "Paytm"),
        ("cashfree", "Cashfree"),
    ]

    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="payments")
    payment_method = models.CharField(max_length=20, choices=PAYMENT_METHODS)
    gateway = models.CharField(max_length=20, choices=GATEWAY_CHOICES, blank=True)

    amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=3, default="INR")

    transaction_id = models.CharField(max_length=100, blank=True, db_index=True)
    gateway_transaction_id = models.CharField(max_length=100, blank=True)
    external_order_id = models.CharField(max_length=100, blank=True)

    status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default="pending", db_index=True)

    metadata = models.JSONField(default=dict, blank=True)
    response_data = models.JSONField(default=dict, blank=True)

    payment_url = models.URLField(blank=True)

    authorized_at = models.DateTimeField(null=True, blank=True)
    captured_at = models.DateTimeField(null=True, blank=True)
    failed_at = models.DateTimeField(null=True, blank=True)
    refunded_at = models.DateTimeField(null=True, blank=True)

    failure_reason = models.TextField(blank=True)

    retry_count = models.IntegerField(default=0)
    max_retries = models.IntegerField(default=3)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "payments"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["status", "created_at"]),
            models.Index(fields=["transaction_id"]),
            models.Index(fields=["order", "status"]),
        ]

    def __str__(self):
        return f"Payment {self.transaction_id or self.id} - ₹{self.amount}"

    def mark_completed(self, transaction_id=None, gateway_data=None):
        self.status = "completed"
        self.captured_at = timezone.now()
        if transaction_id:
            self.transaction_id = transaction_id
        if gateway_data:
            self.response_data = gateway_data
        self.save(update_fields=["status", "captured_at", "transaction_id", "response_data", "updated_at"])

    def mark_failed(self, reason=""):
        self.status = "failed"
        self.failed_at = timezone.now()
        self.failure_reason = reason
        self.save(update_fields=["status", "failed_at", "failure_reason", "updated_at"])

    def process_refund(self, amount=None):
        from .services import payment_service
        refund_amount = amount or self.amount
        return payment_service.initiate_refund(self, refund_amount)


class PaymentWebhookEvent(models.Model):
    GATEWAY_CHOICES = [
        ("stripe", "Stripe"),
        ("razorpay", "Razorpay"),
        ("paytm", "Paytm"),
        ("cashfree", "Cashfree"),
    ]

    payment = models.ForeignKey(Payment, on_delete=models.CASCADE, related_name="webhook_events", null=True, blank=True)
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name="payment_webhooks", null=True, blank=True)

    gateway = models.CharField(max_length=20, choices=GATEWAY_CHOICES)
    event_type = models.CharField(max_length=100)
    event_id = models.CharField(max_length=100, unique=True)

    payload = models.JSONField()
    signature_valid = models.BooleanField(default=False)

    is_processed = models.BooleanField(default=False)
    processed_at = models.DateTimeField(null=True, blank=True)
    processing_error = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "payment_webhook_events"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["is_processed", "created_at"]),
            models.Index(fields=["gateway", "event_type"]),
        ]

    def __str__(self):
        return f"Webhook {self.event_type} - {self.gateway}"


class PaymentMethod(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="payment_methods")
    payment_type = models.CharField(max_length=20)
    gateway = models.CharField(max_length=20)

    is_default = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)

    gateway_token = models.CharField(max_length=255, blank=True)
    last_four = models.CharField(max_length=4, blank=True)
    card_brand = models.CharField(max_length=20, blank=True)
    expiry_month = models.IntegerField(null=True, blank=True)
    expiry_year = models.IntegerField(null=True, blank=True)

    metadata = models.JSONField(default=dict, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "payment_methods"
        unique_together = ["user", "gateway", "gateway_token"]

    def __str__(self):
        return f"{self.user.email} - {self.payment_type}"