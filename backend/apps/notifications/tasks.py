from celery import shared_task
from django.utils import timezone
from django.core.mail import send_mail
from django.conf import settings
import logging

logger = logging.getLogger(__name__)


@shared_task(bind=True, max_retries=3)
def send_email_task(self, subject, message, recipient_list, from_email=None):
    try:
        send_mail(
            subject=subject,
            message=message,
            from_email=from_email or settings.DEFAULT_FROM_EMAIL,
            recipient_list=recipient_list,
            fail_silently=False,
            html_message=message,
        )
        logger.info(f"Email sent to {recipient_list}")
        return {"status": "sent", "recipients": recipient_list}
    except Exception as e:
        logger.error(f"Failed to send email: {str(e)}")
        raise self.retry(exc=e, countdown=60)


@shared_task(bind=True, max_retries=3)
def send_order_confirmation_email(self, user_id, order_id, order_number):
    from apps.accounts.models import User
    from apps.orders.models import Order
    from apps.notifications.models import Notification

    try:
        user = User.objects.get(id=user_id)
        order = Order.objects.get(id=order_id)

        subject = f"Order Confirmation - {order_number}"
        message = f"""
        <h2>Thank you for your order!</h2>
        <p>Dear {user.first_name or user.username},</p>
        <p>Your order <strong>{order_number}</strong> has been confirmed.</p>
        <h3>Order Details:</h3>
        <ul>
            <li>Total Amount: ₹{order.total_amount}</li>
            <li>Payment Status: {order.payment_status}</li>
            <li>Order Status: {order.status}</li>
        </ul>
        <p>We will notify you when your order is shipped.</p>
        <p>Thank you for shopping with us!</p>
        """

        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
            html_message=message,
        )

        Notification.objects.create(
            user=user,
            channel="email",
            subject=subject,
            message=message,
            status="sent",
            sent_at=timezone.now(),
            metadata={"order_id": order_id, "order_number": order_number},
        )

        return {"status": "sent", "order": order_number}
    except Exception as e:
        logger.error(f"Failed to send order confirmation: {str(e)}")
        raise self.retry(exc=e, countdown=60)


@shared_task(bind=True, max_retries=3)
def send_order_status_update(self, user_id, order_id, new_status):
    from apps.accounts.models import User
    from apps.orders.models import Order

    try:
        user = User.objects.get(id=user_id)
        order = Order.objects.get(id=order_id)

        status_messages = {
            "confirmed": "Your order has been confirmed and will be processed soon.",
            "shipped": f"Your order has been shipped. Tracking: {order.shipments.first().tracking_number if order.shipments.exists() else 'N/A'}",
            "delivered": "Your order has been delivered. Thank you for shopping with us!",
            "cancelled": "Your order has been cancelled. Refund will be processed within 5-7 business days.",
        }

        subject = f"Order {order.order_number} - Status Update"
        message = f"""
        <h2>Order Status Update</h2>
        <p>Dear {user.first_name or user.username},</p>
        <p>{status_messages.get(new_status, f'Your order status is now: {new_status}')}</p>
        <p>Order Number: {order.order_number}</p>
        """

        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=False,
            html_message=message,
        )

        return {"status": "sent"}
    except Exception as e:
        logger.error(f"Failed to send status update: {str(e)}")
        raise self.retry(exc=e, countdown=60)


@shared_task
def send_abandoned_cart_reminders():
    from apps.cart.models import Cart, CartItem
    from django.utils import timezone
    from datetime import timedelta

    threshold = timezone.now() - timedelta(hours=24)

    abandoned_carts = Cart.objects.filter(
        updated_at__lt=threshold,
        user__isnull=False,
    ).select_related("user").prefetch_related("items__product")

    for cart in abandoned_carts:
        if cart.items.exists() and cart.subtotal > 0:
            user = cart.user
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

            send_mail(
                subject=subject,
                message=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                fail_silently=True,
                html_message=message,
            )

    return {"carts_processed": abandoned_carts.count()}


@shared_task
def send_coupon_to_users(user_ids, coupon_code):
    from apps.accounts.models import User
    from apps.products.models import Coupon

    try:
        coupon = Coupon.objects.get(code=coupon_code)
        users = User.objects.filter(id__in=user_ids)

        for user in users:
            subject = f"Exclusive Offer: {coupon_code}"
            message = f"""
            <h2>Special Offer Just For You!</h2>
            <p>Hi {user.username},</p>
            <p>Use code <strong>{coupon_code}</strong> to get amazing discounts!</p>
            <ul>
                <li>Discount: {coupon.discount_value}% off</li>
                <li>Minimum Order: ₹{coupon.min_order_amount}</li>
                <li>Valid Until: {coupon.valid_until.strftime('%d %b %Y')}</li>
            </ul>
            <p><a href="{settings.CORS_ALLOWED_ORIGINS[0]}">Shop Now</a></p>
            """

            send_mail(
                subject=subject,
                message=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                fail_silently=True,
                html_message=message,
            )

        return {"emails_sent": users.count()}
    except Exception as e:
        logger.error(f"Failed to send coupons: {str(e)}")
        return {"status": "failed", "error": str(e)}