from rest_framework import serializers
from .models import Cart, CartItem, CartAbandonment
from apps.products.serializers import ProductListSerializer


class CartItemSerializer(serializers.ModelSerializer):
    product = ProductListSerializer(read_only=True)
    subtotal = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    current_price = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    price_changed = serializers.BooleanField(read_only=True)
    is_available = serializers.BooleanField(read_only=True)
    is_reserved = serializers.BooleanField(read_only=True)

    class Meta:
        model = CartItem
        fields = [
            "id", "product", "variant", "quantity",
            "price_at_add", "price_locked_at", "current_price",
            "price_changed", "is_available", "is_reserved", "reservation_id",
            "subtotal", "created_at", "updated_at"
        ]


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    subtotal = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    discount_amount = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    total = serializers.DecimalField(max_digits=12, decimal_places=2, read_only=True)
    item_count = serializers.IntegerField(read_only=True)
    coupon_code = serializers.CharField(read_only=True)
    is_expired = serializers.BooleanField(read_only=True)

    class Meta:
        model = Cart
        fields = [
            "id", "items", "status", "subtotal", "discount_amount",
            "coupon_code", "total", "item_count", "is_expired",
            "expires_at", "created_at", "updated_at"
        ]


class CartAddItemSerializer(serializers.Serializer):
    product_id = serializers.IntegerField()
    variant_id = serializers.IntegerField(required=False, allow_null=True)
    quantity = serializers.IntegerField(min_value=1, max_value=100)
    reserve_stock = serializers.BooleanField(default=True)


class CartUpdateItemSerializer(serializers.Serializer):
    quantity = serializers.IntegerField(min_value=0, max_value=100)


class CartApplyCouponSerializer(serializers.Serializer):
    code = serializers.CharField(max_length=50)


class CartAbandonmentSerializer(serializers.ModelSerializer):
    cart = CartSerializer(read_only=True)

    class Meta:
        model = CartAbandonment
        fields = ["id", "cart", "email_sent", "reminder_count", "converted_to_order", "created_at"]