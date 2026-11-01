from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils import timezone
import logging

logger = logging.getLogger(__name__)


class NotificationService:
    CHANNELS = ["email", "sms", "whatsapp", "push"]

    def send(self, user, channel, subject, message, metadata=None):
        if channel == "email":
            return self.send_email(user.email, subject, message, metadata)
        elif channel == "sms":
            return self.send_sms(user.phone, message, metadata)
        elif channel == "whatsapp":
            return self.send_whatsapp(user.phone, message, metadata)
        elif channel == "push":
            return self.send_push(user, message, metadata)
        else:
            raise ValueError(f"Unknown channel: {channel}")

    def send_email(self, to_email, subject, message, metadata=None):
        try:
            send_mail(
                subject=subject,
                message=message,
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[to_email],
                fail_silently=False,
                html_message=message,
            )
            logger.info(f"Email sent to {to_email}")
            return {"status": "sent", "channel": "email", "to": to_email}
        except Exception as e:
            logger.error(f"Failed to send email to {to_email}: {str(e)}")
            return {"status": "failed", "channel": "email", "error": str(e)}

    def send_sms(self, phone, message, metadata=None):
        try:
            if not phone:
                return {"status": "failed", "channel": "sms", "error": "No phone number"}

            provider = getattr(settings, "SMS_CONFIG", {}).get("provider", "twilio")

            if provider == "twilio":
                return self._send_twilio_sms(phone, message)
            elif provider == "aws_sns":
                return self._send_aws_sns_sms(phone, message)
            else:
                logger.warning(f"SMS provider {provider} not configured")
                return {"status": "skipped", "channel": "sms", "reason": "provider not configured"}

        except Exception as e:
            logger.error(f"Failed to send SMS to {phone}: {str(e)}")
            return {"status": "failed", "channel": "sms", "error": str(e)}

    def send_whatsapp(self, phone, message, metadata=None):
        try:
            if not phone:
                return {"status": "failed", "channel": "whatsapp", "error": "No phone number"}

            logger.info(f"WhatsApp message would be sent to {phone}: {message[:50]}...")
            return {"status": "sent", "channel": "whatsapp", "to": phone}

        except Exception as e:
            logger.error(f"Failed to send WhatsApp to {phone}: {str(e)}")
            return {"status": "failed", "channel": "whatsapp", "error": str(e)}

    def send_push(self, user, message, metadata=None):
        try:
            logger.info(f"Push notification would be sent to user {user.id}: {message[:50]}...")
            return {"status": "sent", "channel": "push", "user_id": user.id}
        except Exception as e:
            logger.error(f"Failed to send push to user {user.id}: {str(e)}")
            return {"status": "failed", "channel": "push", "error": str(e)}

    def _send_twilio_sms(self, phone, message):
        from twilio.rest import Client
        from twilio.base.exceptions import TwilioException

        sms_config = getattr(settings, "SMS_CONFIG", {})
        client = Client(
            sms_config.get("twilio_account_sid"),
            sms_config.get("twilio_auth_token"),
        )

        result = client.messages.create(
            body=message,
            from_=sms_config.get("twilio_phone_number"),
            to=phone,
        )

        logger.info(f"Twilio SMS sent: {result.sid}")
        return {"status": "sent", "channel": "sms", "twilio_sid": result.sid}

    def _send_aws_sns_sms(self, phone, message):
        import boto3
        sns = boto3.client(
            "sns",
            aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
            aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            region_name=settings.AWS_S3_REGION_NAME,
        )

        result = sns.publish(
            PhoneNumber=phone,
            Message=message,
            MessageAttributes={
                "SMSType": {"DataType": "String", "StringValue": "Transactional"}
            }
        )

        logger.info(f"AWS SNS SMS sent: {result['MessageId']}")
        return {"status": "sent", "channel": "sms", "message_id": result["MessageId"]}

    def send_order_confirmation(self, order):
        from apps.accounts.models import User
        from apps.notifications.models import Notification

        user = order.user
        subject = f"Order Confirmed - {order.order_number}"
        message = self._render_template("order_confirmation.html", {
            "order": order,
            "user": user,
        })

        result = self.send_email(user.email, subject, message)

        Notification.objects.create(
            user=user,
            channel="email",
            subject=subject,
            message=message[:500],
            status="sent" if result["status"] == "sent" else "failed",
            metadata={"order_id": order.id, "order_number": order.order_number},
            sent_at=timezone.now() if result["status"] == "sent" else None,
        )

        if user.phone:
            sms_message = f"Order {order.order_number} confirmed! Total: ₹{order.total_amount}. Thank you for shopping with us!"
            self.send_sms(user.phone, sms_message)

        return result

    def send_order_status_update(self, order, new_status):
        from apps.notifications.models import Notification

        user = order.user

        status_messages = {
            "confirmed": "Your order has been confirmed and will be processed soon.",
            "processing": "Your order is being processed and prepared for shipment.",
            "packed": "Your order has been packed and will be shipped soon.",
            "shipped": f"Your order has been shipped! Track: {order.shipments.first().tracking_number if order.shipments.exists() else 'Coming soon'}",
            "delivered": "Your order has been delivered. Thank you for shopping with us!",
            "cancelled": "Your order has been cancelled. Refund will be processed within 5-7 days.",
        }

        subject = f"Order Update - {order.order_number}"
        message = status_messages.get(new_status, f"Order status: {new_status}")

        html_message = self._render_template("order_status_update.html", {
            "order": order,
            "user": user,
            "status_message": message,
            "new_status": new_status,
        })

        self.send_email(user.email, subject, html_message)

        if user.phone:
            self.send_sms(user.phone, f"Order {order.order_number}: {message}")

        return {"status": "sent"}

    def send_payment_update(self, order, payment_status):
        from apps.notifications.models import Notification

        user = order.user

        messages = {
            "paid": f"Payment successful for order {order.order_number}. Amount: ₹{order.total_amount}",
            "failed": f"Payment failed for order {order.order_number}. Please try again.",
            "refunded": f"Payment refunded for order {order.order_number}. Amount: ₹{order.total_amount}",
        }

        subject = f"Payment Update - {order.order_number}"
        message = messages.get(payment_status, f"Payment status: {payment_status}")

        self.send_email(user.email, subject, f"<p>{message}</p>")

        if user.phone:
            self.send_sms(user.phone, message)

        return {"status": "sent"}

    def send_refund_processed(self, refund):
        from apps.notifications.models import Notification

        order = refund.order
        user = order.user

        subject = f"Refund Processed - {order.order_number}"
        message = f"Refund of ₹{refund.approved_amount} has been processed for order {order.order_number}."

        self.send_email(user.email, subject, f"<p>{message}</p>")

        if user.phone:
            self.send_sms(user.phone, message)

        return {"status": "sent"}

    def _render_template(self, template_name, context):
        try:
            return render_to_string(f"emails/{template_name}", context)
        except Exception as e:
            logger.warning(f"Template {template_name} not found, using plain text")
            return f"Order: {context.get('order', {})}"


notification_service = NotificationService()