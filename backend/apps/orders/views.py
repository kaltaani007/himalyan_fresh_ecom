from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from django.db import transaction
from .models import Order, OrderItem, Shipment, RefundRequest
from .serializers import OrderSerializer, OrderCreateSerializer, ShipmentSerializer, RefundRequestSerializer
from apps.cart.models import Cart, CartItem
from apps.accounts.models import Address
from apps.products.models import Product, Coupon
from decimal import Decimal


class CheckoutView(APIView):
    permission_classes = [IsAuthenticated]
    
    @transaction.atomic
    def post(self, request):
        serializer = OrderCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        user = request.user
        cart = get_object_or_404(Cart, user=user)
        cart_items = cart.items.all()
        
        if not cart_items.exists():
            return Response({"error": "Cart is empty"}, status=status.HTTP_400_BAD_REQUEST)
        
        data = serializer.validated_data
        subtotal = cart.subtotal
        
        shipping_address = None
        billing_address = None
        
        if data.get("shipping_address_id"):
            shipping_address = get_object_or_404(Address, id=data["shipping_address_id"], user=user)
        if data.get("billing_address_id"):
            billing_address = get_object_or_404(Address, id=data["billing_address_id"], user=user)
        
        discount_amount = Decimal("0")
        coupon = data.get("coupon")
        if coupon:
            discount_amount = coupon.calculate_discount(subtotal)
        
        shipping_cost = Decimal("50.00") if subtotal < Decimal("500.00") else Decimal("0.00")
        tax_amount = (subtotal - discount_amount) * Decimal("0.18")
        total_amount = subtotal - discount_amount + shipping_cost + tax_amount
        
        order = Order.objects.create(
            user=user,
            subtotal=subtotal,
            tax_amount=tax_amount,
            shipping_cost=shipping_cost,
            discount_amount=discount_amount,
            total_amount=total_amount,
            shipping_address=shipping_address,
            billing_address=billing_address,
            payment_method=data["payment_method"],
            notes=data.get("notes", ""),
            payment_status="pending"
        )
        
        for item in cart_items:
            OrderItem.objects.create(
                order=order,
                product=item.product,
                variant=item.variant,
                product_name=item.product.name,
                variant_info=f"{item.variant.variant_type}: {item.variant.variant_value}" if item.variant else "",
                quantity=item.quantity,
                unit_price=item.price_at_add,
                total_price=item.subtotal
            )
        
        cart_items.delete()
        
        if coupon:
            coupon.used_count += 1
            coupon.save()
        
        return Response(OrderSerializer(order).data, status=status.HTTP_201_CREATED)


class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related("items")


class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = "order_number"
    lookup_url_kwarg = "order_number"
    
    def get_queryset(self):
        return Order.objects.filter(user=self.request.user).prefetch_related("items", "shipments")


class OrderCancelView(APIView):
    permission_classes = [IsAuthenticated]
    
    def post(self, request, order_number):
        order = get_object_or_404(Order, order_number=order_number, user=request.user)
        
        if order.status not in ["pending", "confirmed"]:
            return Response({"error": "Cannot cancel order in current status"}, status=status.HTTP_400_BAD_REQUEST)
        
        order.status = "cancelled"
        order.save()
        
        return Response({"status": "order cancelled", "order": OrderSerializer(order).data})


class RefundRequestView(generics.CreateAPIView):
    serializer_class = RefundRequestSerializer
    permission_classes = [IsAuthenticated]
    
    def perform_create(self, serializer):
        order_number = self.kwargs["order_number"]
        order = get_object_or_404(Order, order_number=order_number, user=self.request.user)
        serializer.save(user=self.request.user, order=order, amount=order.total_amount)


class ShipmentListView(generics.ListAPIView):
    serializer_class = ShipmentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        order_number = self.kwargs["order_number"]
        order = get_object_or_404(Order, order_number=order_number, user=self.request.user)
        return order.shipments.all()
