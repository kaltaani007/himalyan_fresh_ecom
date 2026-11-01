from rest_framework import serializers
from .models import Order, OrderItem, Shipment, RefundRequest
from apps.accounts.serializers import AddressSerializer


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = ["id", "product", "variant", "product_name", "variant_info", 
                  "quantity", "unit_price", "total_price"]


class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    shipping_address = AddressSerializer(read_only=True)
    billing_address = AddressSerializer(read_only=True)
    
    class Meta:
        model = Order
        fields = ["id", "order_number", "status", "subtotal", "tax_amount", "shipping_cost",
                  "discount_amount", "total_amount", "payment_method", "payment_status",
                  "shipping_address", "billing_address", "notes", "items", "created_at", "updated_at"]


class OrderCreateSerializer(serializers.Serializer):
    shipping_address_id = serializers.IntegerField(required=False)
    billing_address_id = serializers.IntegerField(required=False)
    payment_method = serializers.CharField()
    coupon_code = serializers.CharField(required=False, allow_blank=True)
    notes = serializers.CharField(required=False, allow_blank=True)
    
    def validate(self, data):
        from apps.products.models import Coupon
        from django.utils import timezone
        
        coupon_code = data.get("coupon_code")
        if coupon_code:
            try:
                coupon = Coupon.objects.get(code=coupon_code)
                if not coupon.is_valid():
                    raise serializers.ValidationError({"coupon_code": "Invalid or expired coupon"})
                data["coupon"] = coupon
            except Coupon.DoesNotExist:
                raise serializers.ValidationError({"coupon_code": "Invalid coupon code"})
        return data


class ShipmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Shipment
        fields = ["id", "carrier", "tracking_number", "status", "shipped_at", "delivered_at", "current_location"]


class RefundRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = RefundRequest
        fields = ["id", "reason", "amount", "status", "admin_notes", "created_at", "resolved_at"]
        read_only_fields = ["id", "status", "admin_notes", "created_at", "resolved_at"]
