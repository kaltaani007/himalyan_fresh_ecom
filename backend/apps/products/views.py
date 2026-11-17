from django.db.models import Avg, Q
from django.shortcuts import get_object_or_404
from rest_framework import generics, filters, permissions, status
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend

from .models import (
    Category, District, Product, ProductImage, Banner, Wishlist, Coupon, Review
)
from .serializers import (
    CategorySerializer, DistrictSerializer, ProductListSerializer,
    ProductDetailSerializer, ProductWriteSerializer, ProductImageSerializer,
    BannerSerializer, WishlistSerializer, CouponValidateSerializer,
    ReviewSerializer
)


class CategoryListCreateView(generics.ListCreateAPIView):
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    pagination_class = None

    def get_queryset(self):
        return Category.objects.filter(parent__isnull=True, is_active=True).order_by("order", "name")


class CategoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CategorySerializer
    permission_classes = [permissions.AllowAny]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    lookup_field = "slug"
    queryset = Category.objects.all()

    def patch(self, request, *args, **kwargs):
        instance = self.get_object()
        if "image" in request.FILES:
            instance.image = request.FILES["image"]
            instance.image_url = ""
            instance.save(update_fields=["image", "image_url", "updated_at"])
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(self.get_serializer(instance).data)


class CategoryProductsView(generics.ListAPIView):
    serializer_class = ProductListSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None

    def get_queryset(self):
        slug = self.kwargs["slug"]
        return Product.objects.filter(
            is_active=True, category__slug=slug
        ).select_related("category", "district").prefetch_related("images", "reviews")


class DistrictListCreateView(generics.ListCreateAPIView):
    serializer_class = DistrictSerializer
    permission_classes = [permissions.AllowAny]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    pagination_class = None

    def get_queryset(self):
        return District.objects.filter(is_active=True).order_by("order", "name")


class DistrictDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = DistrictSerializer
    permission_classes = [permissions.AllowAny]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    lookup_field = "slug"
    queryset = District.objects.all()

    def patch(self, request, *args, **kwargs):
        instance = self.get_object()
        if "image" in request.FILES:
            instance.image = request.FILES["image"]
            instance.image_url = ""
            instance.save(update_fields=["image", "image_url", "updated_at"])
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(self.get_serializer(instance).data)


class DistrictProductsView(generics.ListAPIView):
    serializer_class = ProductListSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None

    def get_queryset(self):
        slug = self.kwargs["slug"]
        district = get_object_or_404(District, slug=slug)
        return Product.objects.filter(
            is_active=True
        ).filter(
            Q(district=district) | Q(origin__iexact=district.name)
        ).select_related("category", "district").prefetch_related("images", "reviews").distinct()


class ProductListCreateView(generics.ListCreateAPIView):
    permission_classes = [permissions.AllowAny]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["name", "description", "sku", "origin", "category__name", "district__name"]
    ordering_fields = ["base_price", "created_at", "name"]
    pagination_class = None

    def get_serializer_class(self):
        if self.request.method == "POST":
            return ProductWriteSerializer
        return ProductListSerializer

    def get_queryset(self):
        qs = Product.objects.filter(is_active=True).select_related(
            "category", "district"
        ).prefetch_related("images", "reviews")

        category_param = self.request.query_params.get("category")
        if category_param and category_param != "all":
            if category_param.isdigit():
                qs = qs.filter(category_id=int(category_param))
            else:
                qs = qs.filter(category__slug=category_param)

        district_param = self.request.query_params.get("district")
        if district_param:
            qs = qs.filter(Q(district__slug=district_param) | Q(origin__iexact=district_param))

        featured = self.request.query_params.get("is_featured")
        if featured in ("true", "1", "True"):
            qs = qs.filter(is_featured=True)

        sort = self.request.query_params.get("sort")
        if sort == "price-low":
            qs = qs.order_by("base_price")
        elif sort == "price-high":
            qs = qs.order_by("-base_price")
        elif sort == "rating":
            qs = qs.annotate(avg_rating=Avg("reviews__rating")).order_by("-avg_rating", "-is_featured")
        elif sort == "newest":
            qs = qs.order_by("-created_at")
        else:
            qs = qs.order_by("-is_featured", "-created_at")

        return qs

    def create(self, request, *args, **kwargs):
        serializer = ProductWriteSerializer(data=request.data, context={"request": request})
        serializer.is_valid(raise_exception=True)
        product = serializer.save()

        # Handle uploaded product image(s) in same multipart request
        uploaded_files = request.FILES.getlist("images") or (
            [request.FILES["image"]] if "image" in request.FILES else []
        )
        for idx, file_obj in enumerate(uploaded_files):
            ProductImage.objects.create(
                product=product,
                image=file_obj,
                alt_text=request.data.get("alt_text", product.name),
                is_primary=(idx == 0),
                order=idx,
            )

        out = ProductDetailSerializer(product, context={"request": request})
        return Response(out.data, status=status.HTTP_201_CREATED)


class FeaturedProductsView(generics.ListAPIView):
    serializer_class = ProductListSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None

    def get_queryset(self):
        return Product.objects.filter(
            is_active=True, is_featured=True
        ).select_related("category", "district").prefetch_related("images", "reviews")[:8]


class ProductDetailView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [permissions.AllowAny]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    lookup_field = "slug"
    lookup_url_kwarg = "slug"

    def get_serializer_class(self):
        if self.request.method in ("PUT", "PATCH"):
            return ProductWriteSerializer
        return ProductDetailSerializer

    def get_queryset(self):
        return Product.objects.select_related("category", "district").prefetch_related(
            "images", "variants", "reviews__user"
        )

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", True)
        instance = self.get_object()
        serializer = ProductWriteSerializer(instance, data=request.data, partial=partial, context={"request": request})
        serializer.is_valid(raise_exception=True)
        product = serializer.save()
        out = ProductDetailSerializer(product, context={"request": request})
        return Response(out.data)


class ProductRelatedView(generics.ListAPIView):
    serializer_class = ProductListSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None

    def get_queryset(self):
        product = get_object_or_404(Product, slug=self.kwargs["slug"])
        return Product.objects.filter(
            is_active=True, category=product.category
        ).exclude(id=product.id).select_related("category", "district").prefetch_related("images", "reviews")[:4]


class ProductImageUploadView(APIView):
    permission_classes = [permissions.AllowAny]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, slug):
        product = get_object_or_404(Product, slug=slug)
        image_file = request.FILES.get("image")
        if not image_file:
            return Response({"error": "Image file is required under field 'image'."}, status=status.HTTP_400_BAD_REQUEST)

        is_primary = str(request.data.get("is_primary", "false")).lower() in ("true", "1", "yes")
        alt_text = request.data.get("alt_text", product.name)

        if is_primary or not product.images.exists():
            product.images.update(is_primary=False)
            is_primary = True

        next_order = product.images.count()
        img_obj = ProductImage.objects.create(
            product=product,
            image=image_file,
            alt_text=alt_text,
            is_primary=is_primary,
            order=next_order,
        )
        return Response(
            ProductImageSerializer(img_obj, context={"request": request}).data,
            status=status.HTTP_201_CREATED,
        )


class ProductImageDetailView(APIView):
    permission_classes = [permissions.AllowAny]

    def patch(self, request, pk):
        img_obj = get_object_or_404(ProductImage, pk=pk)
        if str(request.data.get("is_primary", "")).lower() in ("true", "1", "yes"):
            img_obj.product.images.update(is_primary=False)
            img_obj.is_primary = True
        if "alt_text" in request.data:
            img_obj.alt_text = request.data["alt_text"]
        img_obj.save()
        return Response(ProductImageSerializer(img_obj, context={"request": request}).data)

    def delete(self, request, pk):
        img_obj = get_object_or_404(ProductImage, pk=pk)
        product = img_obj.product
        was_primary = img_obj.is_primary
        img_obj.delete()
        if was_primary:
            first_remaining = product.images.first()
            if first_remaining:
                first_remaining.is_primary = True
                first_remaining.save(update_fields=["is_primary"])
        return Response(status=status.HTTP_204_NO_CONTENT)


class ProductReviewsView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer
    pagination_class = None

    def get_permissions(self):
        if self.request.method == "GET":
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_queryset(self):
        return Review.objects.filter(
            product_id=self.kwargs["product_id"]
        ).select_related("user").order_by("-created_at")

    def perform_create(self, serializer):
        product = get_object_or_404(Product, id=self.kwargs["product_id"])
        Review.objects.update_or_create(
            product=product,
            user=self.request.user,
            defaults={
                "rating": serializer.validated_data["rating"],
                "title": serializer.validated_data.get("title", ""),
                "comment": serializer.validated_data.get("comment", ""),
            },
        )


class BannerListView(generics.ListAPIView):
    serializer_class = BannerSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None

    def get_queryset(self):
        return Banner.objects.filter(is_active=True).order_by("position")


class WishlistView(generics.ListCreateAPIView):
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = None

    def get_queryset(self):
        return self.request.user.wishlist.select_related("product__category").prefetch_related("product__images")


class WishlistRemoveView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = "product_id"
    lookup_url_kwarg = "product_id"

    def get_queryset(self):
        return self.request.user.wishlist.all()

    def get_object(self):
        return get_object_or_404(self.get_queryset(), product_id=self.kwargs["product_id"])


class CouponValidateView(generics.GenericAPIView):
    serializer_class = CouponValidateSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = CouponValidateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        code = serializer.validated_data["code"]
        subtotal = serializer.validated_data["subtotal"]

        try:
            coupon = Coupon.objects.get(code__iexact=code)
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
