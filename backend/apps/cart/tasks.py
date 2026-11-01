from celery import shared_task
from django.utils import timezone
from datetime import timedelta
import logging

logger = logging.getLogger(__name__)


@shared_task
def cleanup_expired_carts():
    from apps.cart.models import Cart
    from apps.inventory.services import inventory_service

    expired_carts = Cart.objects.filter(
        status="active",
        expires_at__lt=timezone.now(),
    )

    count = 0
    for cart in expired_carts:
        if inventory_service.release_cart_reservations(cart.id):
            cart.status = "expired"
            cart.save(update_fields=["status", "updated_at"])
            count += 1

    logger.info(f"Expired {count} carts and released their reservations")
    return {"status": "completed", "expired_count": count}


@shared_task
def create_abandonment_records():
    from apps.cart.models import Cart, CartAbandonment

    threshold = timezone.now() - timedelta(hours=24)

    abandoned_carts = Cart.objects.filter(
        status="active",
        updated_at__lt=threshold,
        user__isnull=False,
    ).exclude(
        abandonment_records__isnull=False
    )

    created = 0
    for cart in abandoned_carts:
        CartAbandonment.objects.create(cart=cart)
        created += 1

    logger.info(f"Created {created} abandonment records")
    return {"status": "completed", "created_count": created}


@shared_task
def process_abandoned_carts():
    from apps.cart.models import Cart, CartAbandonment
    from datetime import timedelta
    from django.conf import settings

    threshold = timezone.now() - timedelta(hours=48)

    abandonments = CartAbandonment.objects.filter(
        cart__status="active",
        cart__updated_at__lt=threshold,
        email_sent=False,
    ).select_related("cart__user")

    for abandonment in abandonments:
        cart = abandonment.cart
        user = cart.user

        if not user or not user.email:
            continue

        from django.core.mail import send_mail
        from django.conf import settings

        subject = "You left something behind!"
        message = f"""
        <h2>Complete Your Purchase</h2>
        <p>Hi {user.username},</p>
        <p>You have items in your cart that are waiting for you:</p>
        <ul>
            {''.join([f'<li>{item.product.name} - ₹{item.price_at_add} x {item.quantity}</li>' for item in cart.items.all()])}
        </ul>
        <p><strong>Total: ₹{cart.subtotal}</strong></p>
        <p><a href="{settings.CORS_ALLOWED_ORIGINS[0]}/cart">Complete your purchase</a></p>
        """

        try:
            send_mail(
                subject=subject,
                message=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                fail_silently=True,
                html_message=message,
            )
            abandonment.email_sent = True
            abandonment.reminder_count += 1
            abandonment.last_reminder_at = timezone.now()
            abandonment.save()
        except Exception as e:
            logger.error(f"Failed to send abandonment email: {str(e)}")

    return {"status": "completed", "emails_sent": abandonments.count()}