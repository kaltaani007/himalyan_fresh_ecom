from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()


class NotificationTemplate(models.Model):
    CHANNEL_CHOICES = [
        ("email", "Email"),
        ("sms", "SMS"),
        ("whatsapp", "WhatsApp"),
        ("push", "Push Notification"),
    ]

    EVENT_CHOICES = [
        ("order_placed", "Order Placed"),
        ("order_confirmed", "Order Confirmed"),
        ("order_shipped", "Order Shipped"),
        ("order_delivered", "Order Delivered"),
        ("order_cancelled", "Order Cancelled"),
        ("payment_success", "Payment Success"),
        ("payment_failed", "Payment Failed"),
        ("refund_initiated", "Refund Initiated"),
        ("refund_processed", "Refund Processed"),
        ("coupon_available", "Coupon Available"),
        ("back_in_stock", "Back in Stock"),
        ("abandoned_cart", "Abandoned Cart"),
    ]

    name = models.CharField(max_length=100)
    event = models.CharField(max_length=50, choices=EVENT_CHOICES, unique=True)
    channel = models.CharField(max_length=20, choices=CHANNEL_CHOICES)
    subject = models.CharField(max_length=255, blank=True)
    body_template = models.TextField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "notification_templates"
        verbose_name_plural = "Notification Templates"

    def __str__(self):
        return f"{self.event} - {self.channel}"


class Notification(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("sent", "Sent"),
        ("failed", "Failed"),
        ("read", "Read"),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="sent_notifications")
    template = models.ForeignKey(NotificationTemplate, on_delete=models.SET_NULL, null=True, blank=True)
    channel = models.CharField(max_length=20)
    subject = models.CharField(max_length=255, blank=True)
    message = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    metadata = models.JSONField(default=dict, blank=True)
    sent_at = models.DateTimeField(null=True, blank=True)
    read_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "sent_notifications"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["user", "status"]),
            models.Index(fields=["created_at"]),
        ]

    def __str__(self):
        return f"{self.user.email} - {self.subject[:30]}"


class EmailVerification(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="email_verifications")
    token = models.CharField(max_length=255, unique=True)
    email = models.EmailField()
    is_verified = models.BooleanField(default=False)
    expires_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "email_verifications"

    def __str__(self):
        return f"{self.email} - {self.token[:10]}"