from django.db import transaction
from django.utils import timezone
from django.conf import settings
import hashlib
import hmac
import json
import logging

logger = logging.getLogger(__name__)


class PaymentService:
    @classmethod
    def create_payment(cls, order, payment_method, gateway="stripe", amount=None):
        from apps.payments.models import Payment

        payment = Payment.objects.create(
            order=order,
            payment_method=payment_method,
            gateway=gateway,
            amount=amount or order.total_amount,
            status="pending",
        )

        return payment

    @classmethod
    def initiate_payment(cls, payment):
        if payment.gateway == "stripe":
            return cls._initiate_stripe_payment(payment)
        elif payment.gateway == "razorpay":
            return cls._initiate_razorpay_payment(payment)
        else:
            raise ValueError(f"Unsupported gateway: {payment.gateway}")

    @classmethod
    def _initiate_stripe_payment(cls, payment):
        import stripe
        stripe.api_key = settings.STRIPE_SECRET_KEY

        try:
            intent = stripe.PaymentIntent.create(
                amount=int(payment.amount * 100),
                currency="inr",
                metadata={
                    "order_id": payment.order.id,
                    "payment_id": payment.id,
                },
                automatic_payment_methods={"enabled": True},
            )

            payment.gateway_transaction_id = intent.id
            payment.metadata = {
                "client_secret": intent.client_secret,
            }
            payment.save(update_fields=["gateway_transaction_id", "metadata", "updated_at"])

            return {
                "client_secret": intent.client_secret,
                "payment_intent_id": intent.id,
            }
        except stripe.error.StripeError as e:
            logger.error(f"Stripe payment initiation failed: {str(e)}")
            payment.mark_failed(str(e))
            raise

    @classmethod
    def _initiate_razorpay_payment(cls, payment):
        import razorpay
        client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

        order = client.order.create({
            "amount": int(payment.amount * 100),
            "currency": "INR",
            "payment_capture": 1,
            "notes": {
                "order_id": payment.order.id,
                "payment_id": payment.id,
            }
        })

        payment.gateway_transaction_id = order["id"]
        payment.metadata = {"razorpay_order_id": order["id"]}
        payment.save(update_fields=["gateway_transaction_id", "metadata", "updated_at"])

        return {
            "order_id": order["id"],
            "key_id": settings.RAZORPAY_KEY_ID,
        }

    @classmethod
    @transaction.atomic
    def handle_payment_success(cls, payment_id, transaction_id, gateway_data=None):
        from apps.payments.models import Payment

        payment = Payment.objects.select_for_update().get(id=payment_id)
        payment.mark_completed(transaction_id, gateway_data)

        order = payment.order
        order.payment_status = "paid"
        order.payment_transaction_id = transaction_id
        order.payment_method = payment.payment_method
        order.save(update_fields=["payment_status", "payment_transaction_id", "payment_method", "updated_at"])

        from apps.inventory.services import inventory_service
        from apps.cart.models import Cart
        try:
            cart = Cart.objects.get(user=order.user, status="active")
            inventory_service.convert_cart_to_order(cart, order.id)
        except Cart.DoesNotExist:
            pass

        from apps.notifications.services import notification_service
        try:
            notification_service.send_order_confirmation(order)
        except Exception as e:
            logger.error(f"Failed to send order confirmation: {str(e)}")

        return payment

    @classmethod
    @transaction.atomic
    def handle_payment_failure(cls, payment_id, reason, gateway_data=None):
        from apps.payments.models import Payment

        payment = Payment.objects.select_for_update().get(id=payment_id)
        payment.mark_failed(reason)

        order = payment.order
        order.payment_status = "failed"
        order.save(update_fields=["payment_status", "updated_at"])

        from apps.inventory.services import inventory_service
        from apps.cart.models import Cart
        try:
            cart = Cart.objects.get(user=order.user, status="active")
            inventory_service.release_cart_reservations(cart.id)
        except Cart.DoesNotExist:
            pass

        return payment

    @classmethod
    @transaction.atomic
    def handle_webhook(cls, gateway, event_type, payload, signature=None):
        from apps.payments.models import PaymentWebhookEvent, Payment
        from apps.orders.models import Order

        event_id = payload.get("id") or f"{gateway}_{timezone.now().timestamp()}"

        event, created = PaymentWebhookEvent.objects.get_or_create(
            event_id=event_id,
            defaults={
                "gateway": gateway,
                "event_type": event_type,
                "payload": payload,
            }
        )

        if not created and event.is_processed:
            return {"status": "already_processed"}

        is_valid = cls._verify_webhook_signature(gateway, payload, signature)
        event.signature_valid = is_valid

        order_id = payload.get("metadata", {}).get("order_id") or payload.get("data", {}).get("object", {}).get("metadata", {}).get("order_id")
        if order_id:
            try:
                order = Order.objects.get(id=order_id)
                event.order = order
                payment = order.payments.first()
                if payment:
                    event.payment = payment
            except Order.DoesNotExist:
                pass

        try:
            if event_type in ["payment_intent.succeeded", "charge.succeeded"]:
                transaction_id = payload.get("id")
                cls.handle_payment_success(payment.id if payment else None, transaction_id, payload)
                event.is_processed = True

            elif event_type in ["payment_intent.payment_failed", "charge.failed"]:
                reason = payload.get("data", {}).get("object", {}).get("failure_message", "Payment failed")
                cls.handle_payment_failure(payment.id if payment else None, reason, payload)
                event.is_processed = True

            elif event_type == "charge.refunded":
                if payment:
                    payment.status = "refunded"
                    payment.refunded_at = timezone.now()
                    payment.save(update_fields=["status", "refunded_at", "updated_at"])
                event.is_processed = True

            event.processed_at = timezone.now()

        except Exception as e:
            event.processing_error = str(e)
            logger.error(f"Webhook processing error: {str(e)}")

        event.save()
        return {"status": "processed" if event.is_processed else "failed", "error": event.processing_error}

    @classmethod
    def _verify_webhook_signature(cls, gateway, payload, signature):
        if not signature:
            return False

        if gateway == "stripe":
            return cls._verify_stripe_signature(payload, signature)
        elif gateway == "razorpay":
            return cls._verify_razorpay_signature(payload, signature)

        return False

    @classmethod
    def _verify_stripe_signature(cls, payload, signature):
        import stripe
        webhook_secret = settings.STRIPE_WEBHOOK_SECRET

        try:
            sig = hmac.new(
                webhook_secret.encode("utf-8"),
                payload.encode("utf-8"),
                hashlib.sha256,
            ).hexdigest()
            return hmac.compare_digest(sig, signature)
        except Exception as e:
            logger.error(f"Stripe signature verification failed: {str(e)}")
            return False

    @classmethod
    def _verify_razorpay_signature(cls, payload, signature):
        import razorpay
        webhook_secret = settings.RAZORPAY_WEBHOOK_SECRET

        try:
            client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))
            return client.utility.verify_webhook_signature(payload, signature, webhook_secret)
        except Exception as e:
            logger.error(f"Razorpay signature verification failed: {str(e)}")
            return False

    @classmethod
    def initiate_refund(cls, payment, amount=None):
        refund_amount = amount or payment.amount

        if payment.gateway == "stripe":
            return cls._initiate_stripe_refund(payment, refund_amount)
        elif payment.gateway == "razorpay":
            return cls._initiate_razorpay_refund(payment, refund_amount)

        raise ValueError(f"Unsupported gateway for refund: {payment.gateway}")

    @classmethod
    def _initiate_stripe_refund(cls, payment, amount):
        import stripe
        stripe.api_key = settings.STRIPE_SECRET_KEY

        refund = stripe.Refund.create(
            payment_intent=payment.gateway_transaction_id,
            amount=int(amount * 100),
        )

        logger.info(f"Stripe refund initiated: {refund.id}")
        return refund

    @classmethod
    def _initiate_razorpay_refund(cls, payment, amount):
        import razorpay
        client = razorpay.Client(auth=(settings.RAZORPAY_KEY_ID, settings.RAZORPAY_KEY_SECRET))

        refund = client.payment.refund(payment.gateway_transaction_id, {
            "amount": int(amount * 100),
        })

        logger.info(f"Razorpay refund initiated: {refund['id']}")
        return refund


payment_service = PaymentService()