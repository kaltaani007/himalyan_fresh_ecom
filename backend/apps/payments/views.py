from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.shortcuts import get_object_or_404
from django.conf import settings
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_exempt
import stripe
import json
import logging

from .models import Payment, PaymentMethod
from .serializers import PaymentSerializer, PaymentMethodSerializer
from .services import payment_service
from apps.orders.models import Order

logger = logging.getLogger(__name__)

stripe.api_key = settings.STRIPE_SECRET_KEY


class StripePaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        order_number = request.data.get("order_number")
        order = get_object_or_404(Order, order_number=order_number, user=request.user)

        if order.payment_status == "paid":
            return Response({"error": "Order already paid"}, status=status.HTTP_400_BAD_REQUEST)

        payment = payment_service.create_payment(order, "card", "stripe")

        try:
            result = payment_service.initiate_payment(payment)
            return Response({
                "client_secret": result.get("client_secret"),
                "payment_id": payment.id,
            })
        except Exception as e:
            payment.mark_failed(str(e))
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class RazorpayPaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        order_number = request.data.get("order_number")
        order = get_object_or_404(Order, order_number=order_number, user=request.user)

        if order.payment_status == "paid":
            return Response({"error": "Order already paid"}, status=status.HTTP_400_BAD_REQUEST)

        payment = payment_service.create_payment(order, "upi", "razorpay")

        try:
            result = payment_service.initiate_payment(payment)
            return Response({
                "order_id": result.get("order_id"),
                "key_id": result.get("key_id"),
                "payment_id": payment.id,
            })
        except Exception as e:
            payment.mark_failed(str(e))
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class PaymentConfirmView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, order_number):
        order = get_object_or_404(Order, order_number=order_number, user=request.user)
        payment = Payment.objects.filter(order=order).first()

        if not payment:
            return Response({"error": "Payment not found"}, status=status.HTTP_404_NOT_FOUND)

        payment.mark_completed()

        order.payment_status = "paid"
        order.status = "confirmed"
        order.save()

        return Response({"status": "payment confirmed", "order": order.order_number})


class PaymentListView(generics.ListAPIView):
    serializer_class = PaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        order_number = self.kwargs.get("order_number")
        if order_number:
            order = get_object_or_404(Order, order_number=order_number, user=self.request.user)
            return Payment.objects.filter(order=order)
        return Payment.objects.filter(order__user=self.request.user)


@method_decorator(csrf_exempt, name="dispatch")
class StripeWebhookView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        payload = request.body
        signature = request.headers.get("stripe-signature")

        try:
            event = stripe.Webhook.construct_event(
                payload, signature, settings.STRIPE_WEBHOOK_SECRET
            )
        except stripe.error.SignatureVerificationError:
            return Response({"error": "Invalid signature"}, status=status.HTTP_400_BAD_REQUEST)
        except json.JSONDecodeError:
            return Response({"error": "Invalid payload"}, status=status.HTTP_400_BAD_REQUEST)

        result = payment_service.handle_webhook(
            gateway="stripe",
            event_type=event["type"],
            payload=event.get("data", {}).get("object", {}),
            signature=signature,
        )

        return Response({"status": result.get("status")})


@method_decorator(csrf_exempt, name="dispatch")
class RazorpayWebhookView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        payload = json.loads(request.body)
        signature = request.headers.get("x-razorpay-signature")

        result = payment_service.handle_webhook(
            gateway="razorpay",
            event_type=payload.get("event", "unknown"),
            payload=payload,
            signature=signature,
        )

        return Response({"status": result.get("status")})


class CODOrderView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        order_number = request.data.get("order_number")
        order = get_object_or_404(Order, order_number=order_number, user=request.user)

        if order.payment_status == "paid":
            return Response({"error": "Order already paid"}, status=status.HTTP_400_BAD_REQUEST)

        payment = Payment.objects.create(
            order=order,
            payment_method="cod",
            amount=order.total_amount,
            status="pending",
        )

        order.payment_method = "cod"
        order.payment_status = "pending"
        order.status = "confirmed"
        order.save()

        return Response({
            "success": True,
            "message": "COD order placed successfully",
            "payment_id": payment.id,
            "order_number": order.order_number,
        })


class PaymentMethodsView(generics.ListCreateAPIView):
    serializer_class = PaymentMethodSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return PaymentMethod.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        existing_default = PaymentMethod.objects.filter(
            user=self.request.user, is_default=True
        ).first()
        if existing_default:
            existing_default.is_default = False
            existing_default.save()

        serializer.save(user=self.request.user)