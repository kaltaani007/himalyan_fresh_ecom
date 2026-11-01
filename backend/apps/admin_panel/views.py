from rest_framework import generics, permissions
from rest_framework.response import Response
from rest_framework.views import APIView
from django.contrib.auth import get_user_model
from apps.orders.models import Order
from apps.products.models import Product, Category, Coupon
from apps.accounts.models import Address

User = get_user_model()


class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.is_staff


class DashboardView(APIView):
    permission_classes = [IsAdminUser]
    
    def get(self, request):
        total_users = User.objects.count()
        total_orders = Order.objects.count()
        total_products = Product.objects.count()
        total_revenue = sum(order.total_amount for order in Order.objects.filter(payment_status="paid"))
        
        recent_orders = Order.objects.all()[:5]
        
        return Response({
            "total_users": total_users,
            "total_orders": total_orders,
            "total_products": total_products,
            "total_revenue": float(total_revenue),
            "recent_orders": [
                {
                    "order_number": o.order_number,
                    "user": o.user.email,
                    "total": float(o.total_amount),
                    "status": o.status,
                    "created_at": o.created_at
                }
                for o in recent_orders
            ]
        })


class AdminOrderListView(generics.ListAPIView):
    permission_classes = [IsAdminUser]
    
    def get(self, request):
        status_filter = request.query_params.get("status")
        queryset = Order.objects.all()
        if status_filter:
            queryset = queryset.filter(status=status_filter)
        
        return Response({
            "count": queryset.count(),
            "orders": [
                {
                    "id": o.id,
                    "order_number": o.order_number,
                    "user": o.user.email,
                    "total_amount": float(o.total_amount),
                    "status": o.status,
                    "payment_status": o.payment_status,
                    "created_at": o.created_at
                }
                for o in queryset[:50]
            ]
        })


class AdminOrderUpdateView(APIView):
    permission_classes = [IsAdminUser]
    
    def put(self, request, order_number):
        order = Order.objects.get(order_number=order_number)
        new_status = request.data.get("status")
        if new_status:
            order.status = new_status
            order.save()
        return Response({"status": "updated", "order": order.order_number})


class AdminProductListView(generics.ListAPIView):
    permission_classes = [IsAdminUser]
    
    def get(self, request):
        queryset = Product.objects.all()
        return Response({
            "count": queryset.count(),
            "products": [
                {
                    "id": p.id,
                    "name": p.name,
                    "sku": p.sku,
                    "price": float(p.base_price),
                    "is_active": p.is_active,
                    "stock": sum(v.stock_quantity for v in p.variants.all())
                }
                for p in queryset[:50]
            ]
        })


class AdminProductCreateView(APIView):
    permission_classes = [IsAdminUser]
    
    def post(self, request):
        data = request.data
        category = None
        if data.get("category_id"):
            category = Category.objects.get(id=data["category_id"])
        
        product = Product.objects.create(
            name=data["name"],
            slug=data["name"].lower().replace(" ", "-"),
            sku=data.get("sku", f"SKU-{data['name'][:5].upper()}"),
            description=data.get("description", ""),
            category=category,
            brand=data.get("brand", ""),
            base_price=data["base_price"],
            discount_price=data.get("discount_price"),
            is_active=data.get("is_active", True)
        )
        return Response({"id": product.id, "name": product.name}, status=201)


class AdminUserListView(generics.ListAPIView):
    permission_classes = [IsAdminUser]
    
    def get(self, request):
        queryset = User.objects.all()
        return Response({
            "count": queryset.count(),
            "users": [
                {
                    "id": u.id,
                    "email": u.email,
                    "username": u.username,
                    "is_staff": u.is_staff,
                    "date_joined": u.date_joined
                }
                for u in queryset[:50]
            ]
        })


class AdminCouponListView(generics.ListAPIView):
    permission_classes = [IsAdminUser]
    
    def get(self, request):
        queryset = Coupon.objects.all()
        return Response({
            "count": queryset.count(),
            "coupons": [
                {
                    "id": c.id,
                    "code": c.code,
                    "discount_type": c.discount_type,
                    "discount_value": float(c.discount_value),
                    "is_active": c.is_active,
                    "used_count": c.used_count
                }
                for c in queryset
            ]
        })


class AdminCouponCreateView(APIView):
    permission_classes = [IsAdminUser]
    
    def post(self, request):
        data = request.data
        coupon = Coupon.objects.create(
            code=data["code"],
            discount_type=data["discount_type"],
            discount_value=data["discount_value"],
            min_order_amount=data.get("min_order_amount", 0),
            valid_from=data["valid_from"],
            valid_until=data["valid_until"],
            usage_limit=data.get("usage_limit"),
            is_active=True
        )
        return Response({"id": coupon.id, "code": coupon.code}, status=201)