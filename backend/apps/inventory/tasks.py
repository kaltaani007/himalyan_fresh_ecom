from celery import shared_task
from django.db import models
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
import logging

logger = logging.getLogger(__name__)


@shared_task(bind=True)
def release_expired_reservations(self):
    from apps.inventory.services import inventory_service

    try:
        count = inventory_service.release_expired_reservations()
        logger.info(f"Released {count} expired reservations")
        return {"status": "completed", "released_count": count}
    except Exception as e:
        logger.error(f"Failed to release expired reservations: {str(e)}")
        raise self.retry(exc=e, countdown=60)


@shared_task
def check_low_stock():
    from apps.inventory.models import Stock, StockAlert
    from django.contrib.auth import get_user_model

    User = get_user_model()

    low_stock_items = Stock.objects.filter(
        is_active=True,
        available_quantity__lte=models.F("low_stock_threshold")
    ).select_related("warehouse")

    for stock in low_stock_items:
        existing_alert = StockAlert.objects.filter(
            stock=stock,
            alert_type="low_stock",
            is_resolved=False,
        ).exists()

        if not existing_alert:
            StockAlert.objects.create(
                stock=stock,
                alert_type="low_stock",
                quantity_threshold=stock.low_stock_threshold,
            )

    if low_stock_items.exists():
        admin_users = User.objects.filter(is_staff=True, is_active=True)
        if admin_users.exists():
            subject = f"Low Stock Alert - {low_stock_items.count()} items"
            message = f"""
            <h2>Low Stock Alert</h2>
            <p>The following items are running low:</p>
            <ul>
                {''.join([f'<li>{stock.product_name} ({stock.warehouse.code}): {stock.available_quantity} left</li>' for stock in low_stock_items[:10]])}
            </ul>
            """
            send_mail(
                subject=subject,
                message=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email for user in admin_users[:5]],
                fail_silently=True,
                html_message=message,
            )

    return {"status": "completed", "low_stock_count": low_stock_items.count()}


@shared_task
def check_expiring_stock():
    from apps.inventory.models import Stock, StockAlert
    from datetime import timedelta

    thirty_days = timezone.now().date() + timedelta(days=30)

    expiring_items = Stock.objects.filter(
        is_active=True,
        expiry_date__lte=thirty_days,
        expiry_date__gte=timezone.now().date(),
    )

    for stock in expiring_items:
        existing_alert = StockAlert.objects.filter(
            stock=stock,
            alert_type="expiring",
            is_resolved=False,
        ).exists()

        if not existing_alert:
            StockAlert.objects.create(
                stock=stock,
                alert_type="expiring",
                quantity_threshold=stock.available_quantity,
                notes=f"Expires on {stock.expiry_date}",
            )

    return {"status": "completed", "expiring_count": expiring_items.count()}


@shared_task
def cleanup_old_movements(days=90):
    from apps.inventory.models import StockMovement
    from datetime import timedelta

    cutoff = timezone.now() - timedelta(days=days)
    deleted = StockMovement.objects.filter(created_at__lt=cutoff).delete()

    logger.info(f"Cleaned up {deleted[0]} old stock movements")
    return {"status": "completed", "deleted_count": deleted[0]}


