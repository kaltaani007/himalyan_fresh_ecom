from rest_framework import serializers
from .models import Payment, PaymentMethod


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = ["id", "payment_method", "amount", "currency", "transaction_id", "status", "created_at"]


class PaymentMethodSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentMethod
        fields = ["id", "payment_type", "gateway", "is_default", "is_verified", "last_four", "card_brand", "expiry_month", "expiry_year", "created_at"]
        read_only_fields = ["id", "is_verified", "last_four", "card_brand", "created_at"]