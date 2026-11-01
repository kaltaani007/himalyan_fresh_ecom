from rest_framework import generics, filters, permissions
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from .models import Category, Product, Banner, Wishlist, Coupon, Review
from .serializers import (
    CategorySerializer, ProductListSerializer, ProductDetailSerializer,
    BannerSerializer, WishlistSerializer, CouponSerializer, CouponValidateSerializer,
    ReviewSerializer
)


class CategoryListView(generics.ListAPIView):
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        return Category.objects.filter(parent__isnull=True, is_active=True)


class ProductListView(generics.ListAPIView):
    serializer_class = ProductListSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ["category", "brand", "is_featured"]
    search_fields = ["name", "description", "sku"]
    ordering_fields = ["base_price", "created_at", "name"]
    
    def get_queryset(self):
        return Product.objects.filter(is_active=True)


class FeaturedProductsView(generics.ListAPIView):
    serializer_class = ProductListSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        return Product.objects.filter(is_active=True, is_featured=True)[:8]


class ProductDetailView(generics.RetrieveAPIView):
    serializer_class = ProductDetailSerializer
    permission_classes = [permissions.AllowAny]
    lookup_field = "slug"
    lookup_url_kwarg = "slug"
    
    def get_queryset(self):
        return Product.objects.prefetch_related("images", "variants", "reviews")


class BannerListView(generics.ListAPIView):
    serializer_class = BannerSerializer
    permission_classes = [permissions.AllowAny]
    
    def get_queryset(self):
        from django.utils import timezone
        now = timezone.now()
        return Banner.objects.filter(
            is_active=True,
            start_date__lte=now,
            end_date__gte=now
        )


class WishlistView(generics.ListCreateAPIView):
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        return self.request.user.wishlist.all()


class WishlistRemoveView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = "product_id"
    lookup_url_kwarg = "product_id"
    
    def get_queryset(self):
        return self.request.user.wishlist.all()
    
    def get_object(self):
        return self.get_queryset().get(product_id=self.kwargs["product_id"])


class CouponValidateView(generics.GenericAPIView):
    serializer_class = CouponValidateSerializer
    permission_classes = [permissions.AllowAny]
    
    def post(self, request):
        serializer = CouponValidateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        code = serializer.validated_data["code"]
        subtotal = serializer.validated_data["subtotal"]
        
        try:
            coupon = Coupon.objects.get(code=code)
        except Coupon.DoesNotExist:
            return Response({"error": "Invalid coupon code"}, status=404)
        
        if not coupon.is_valid():
            return Response({"error": "Coupon is not valid or has expired"}, status=400)
        
        if subtotal < coupon.min_order_amount:
            return Response({
                "error": f"Minimum order amount of {coupon.min_order_amount} required"
            }, status=400)
        
        discount = coupon.calculate_discount(subtotal)
        return Response({
            "valid": True,
            "code": coupon.code,
            "discount_type": coupon.discount_type,
            "discount_value": coupon.discount_value,
            "discount_amount": discount,
            "new_subtotal": subtotal - discount
        })


class ReviewCreateView(generics.CreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
