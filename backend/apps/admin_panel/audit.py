from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()


class AuditLog(models.Model):
    ACTION_TYPES = [
        ("create", "Create"),
        ("update", "Update"),
        ("delete", "Delete"),
        ("view", "View"),
        ("login", "Login"),
        ("logout", "Logout"),
        ("export", "Export"),
        ("import", "Import"),
        ("approve", "Approve"),
        ("reject", "Reject"),
        ("cancel", "Cancel"),
    ]

    TARGET_TYPES = [
        ("user", "User"),
        ("product", "Product"),
        ("order", "Order"),
        ("category", "Category"),
        ("coupon", "Coupon"),
        ("promotion", "Promotion"),
        ("payment", "Payment"),
        ("refund", "Refund"),
        ("shipment", "Shipment"),
        ("settings", "Settings"),
    ]

    actor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="audit_logs")
    action = models.CharField(max_length=20, choices=ACTION_TYPES)
    target_type = models.CharField(max_length=20, choices=TARGET_TYPES)
    target_id = models.IntegerField(null=True, blank=True)
    target_name = models.CharField(max_length=255, blank=True)

    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)

    changes = models.JSONField(default=dict, blank=True)
    old_values = models.JSONField(default=dict, blank=True)
    new_values = models.JSONField(default=dict, blank=True)

    status = models.CharField(max_length=20, default="success")
    error_message = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        db_table = "audit_logs"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["actor", "created_at"]),
            models.Index(fields=["target_type", "target_id"]),
            models.Index(fields=["action", "created_at"]),
        ]

    def __str__(self):
        return f"{self.actor} - {self.action} - {self.target_type} - {self.created_at}"


class AuditLogService:
    @staticmethod
    def log(actor, action, target_type, target_id=None, target_name="",
            changes=None, old_values=None, new_values=None,
            ip_address=None, user_agent="", status="success", error_message=""):
        if changes is None:
            changes = {}
        if old_values is None:
            old_values = {}
        if new_values is None:
            new_values = {}

        return AuditLog.objects.create(
            actor=actor,
            action=action,
            target_type=target_type,
            target_id=target_id,
            target_name=target_name,
            changes=changes,
            old_values=old_values,
            new_values=new_values,
            ip_address=ip_address,
            user_agent=user_agent,
            status=status,
            error_message=error_message,
        )

    @staticmethod
    def log_create(actor, target_type, target_id, target_name, new_values, request=None):
        return AuditLogService.log(
            actor=actor,
            action="create",
            target_type=target_type,
            target_id=target_id,
            target_name=target_name,
            new_values=new_values,
            old_values={},
            changes={"created": list(new_values.keys())},
            ip_address=AuditLogService._get_ip(request),
            user_agent=AuditLogService._get_user_agent(request),
        )

    @staticmethod
    def log_update(actor, target_type, target_id, target_name, old_values, new_values, request=None):
        changes = {}
        for key in new_values:
            if key in old_values and old_values[key] != new_values[key]:
                changes[key] = {"old": old_values[key], "new": new_values[key]}

        return AuditLogService.log(
            actor=actor,
            action="update",
            target_type=target_type,
            target_id=target_id,
            target_name=target_name,
            old_values=old_values,
            new_values=new_values,
            changes=changes,
            ip_address=AuditLogService._get_ip(request),
            user_agent=AuditLogService._get_user_agent(request),
        )

    @staticmethod
    def log_delete(actor, target_type, target_id, target_name, old_values, request=None):
        return AuditLogService.log(
            actor=actor,
            action="delete",
            target_type=target_type,
            target_id=target_id,
            target_name=target_name,
            old_values=old_values,
            changes={"deleted": True},
            ip_address=AuditLogService._get_ip(request),
            user_agent=AuditLogService._get_user_agent(request),
        )

    @staticmethod
    def _get_ip(request):
        if request:
            x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
            if x_forwarded_for:
                return x_forwarded_for.split(",")[0]
            return request.META.get("REMOTE_ADDR")
        return None

    @staticmethod
    def _get_user_agent(request):
        if request:
            return request.META.get("HTTP_USER_AGENT", "")
        return ""

    @staticmethod
    def get_recent_logs(actor=None, target_type=None, limit=100):
        queryset = AuditLog.objects.all()

        if actor:
            queryset = queryset.filter(actor=actor)
        if target_type:
            queryset = queryset.filter(target_type=target_type)

        return queryset[:limit]


audit_log_service = AuditLogService()