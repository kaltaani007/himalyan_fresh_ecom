from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.core.exceptions import ValidationError
from .models import Cart, CartItem
from .serializers import CartSerializer, CartAddItemSerializer, CartUpdateItemSerializer, CartApplyCouponSerializer
from .services import cart_service


class CartView(generics.RetrieveAPIView):
    serializer_class = CartSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        cart = cart_service.get_or_create_cart(self.request)
        return cart


class CartAddView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = CartAddItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        cart = cart_service.get_or_create_cart(request)

        try:
            item = cart_service.add_item(
                cart=cart,
                product_id=serializer.validated_data["product_id"],
                variant_id=serializer.validated_data.get("variant_id"),
                quantity=serializer.validated_data["quantity"],
                reserve_stock=serializer.validated_data.get("reserve_stock", True),
            )
            return Response(CartSerializer(cart).data, status=status.HTTP_200_OK)
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class CartUpdateView(APIView):
    permission_classes = [AllowAny]

    def put(self, request, item_id):
        serializer = CartUpdateItemSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        cart = cart_service.get_or_create_cart(request)

        try:
            cart_service.update_item_quantity(
                cart=cart,
                item_id=item_id,
                quantity=serializer.validated_data["quantity"],
            )
            return Response(CartSerializer(cart).data)
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class CartRemoveView(APIView):
    permission_classes = [AllowAny]

    def delete(self, request, item_id):
        cart = cart_service.get_or_create_cart(request)

        try:
            cart_service.remove_item(cart, item_id)
            return Response(CartSerializer(cart).data)
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class CartApplyCouponView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = CartApplyCouponSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        cart = cart_service.get_or_create_cart(request)

        try:
            success, message = cart_service.apply_coupon(cart, serializer.validated_data["code"])
            if success:
                return Response({
                    "success": True,
                    "message": message,
                    "cart": CartSerializer(cart).data
                })
            return Response({"success": False, "message": message}, status=status.HTTP_400_BAD_REQUEST)
        except ValidationError as e:
            return Response({"success": False, "message": str(e)}, status=status.HTTP_400_BAD_REQUEST)


class CartRemoveCouponView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        cart = cart_service.get_or_create_cart(request)
        cart_service.remove_coupon(cart)
        return Response({
            "success": True,
            "message": "Coupon removed",
            "cart": CartSerializer(cart).data
        })


class CartCheckoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        cart = cart_service.get_or_create_cart(request)

        if cart.items.count() == 0:
            return Response({"error": "Cart is empty"}, status=status.HTTP_400_BAD_REQUEST)

        order_data = {
            "shipping_address": request.data.get("shipping_address"),
            "billing_address": request.data.get("billing_address"),
            "payment_method": request.data.get("payment_method", "prepaid"),
            "notes": request.data.get("notes", ""),
            "tax_amount": request.data.get("tax_amount", 0),
            "shipping_cost": request.data.get("shipping_cost", 0),
            "ip_address": self.get_client_ip(request),
            "user_agent": request.META.get("HTTP_USER_AGENT", ""),
        }

        try:
            order = cart_service.convert_to_order(cart, order_data)
            return Response({
                "success": True,
                "order_id": order.id,
                "order_number": order.order_number,
                "total_amount": str(order.total_amount)
            }, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def get_client_ip(self, request):
        x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
        if x_forwarded_for:
            ip = x_forwarded_for.split(",")[0]
        else:
            ip = request.META.get("REMOTE_ADDR")
        return ip