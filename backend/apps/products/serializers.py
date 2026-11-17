from rest_framework import serializers
from .models import (
    Category, District, Product, ProductImage, ProductVariant,
    Review, Banner, Wishlist, Coupon
)


def build_media_url(serializer, image_field, fallback_url=""):
    if image_field:
        try:
            url = image_field.url
            request = serializer.context.get("request")
            return request.build_absolute_uri(url) if request else url
        except ValueError:
            pass
    return fallback_url or ""


class CategorySerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    image_file = serializers.ImageField(source="image", write_only=True, required=False)
    product_count = serializers.SerializerMethodField()
    children = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = [
            "id", "name", "slug", "description", "image", "image_file", "image_url",
            "parent", "is_active", "order", "product_count", "children", "created_at"
        ]

    def get_image(self, obj):
        return build_media_url(self, obj.image, obj.image_url)

    def get_product_count(self, obj):
        return obj.products.filter(is_active=True).count()

    def get_children(self, obj):
        children = obj.children.filter(is_active=True)
        return CategorySerializer(children, many=True, context=self.context).data


class DistrictSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    image_file = serializers.ImageField(source="image", write_only=True, required=False)
    products_count = serializers.SerializerMethodField()
    blogs_count = serializers.SerializerMethodField()

    class Meta:
        model = District
        fields = [
            "id", "name", "slug", "description", "image", "image_file", "image_url",
            "specialties", "altitude", "population", "famous_for", "climate",
            "products_count", "blogs_count", "is_active", "order"
        ]

    def get_image(self, obj):
        return build_media_url(self, obj.image, obj.image_url)

    def get_products_count(self, obj):
        return obj.products.filter(is_active=True).count()

    def get_blogs_count(self, obj):
        return obj.blog_posts.filter(status="published").count()


class ProductImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = ProductImage
        fields = ["id", "image", "alt_text", "is_primary", "order"]

    def get_image(self, obj):
        return build_media_url(self, obj.image, obj.image_url)


class ProductImageUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["id", "product", "image", "alt_text", "is_primary", "order"]
        read_only_fields = ["product"]


class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = ["id", "sku", "variant_type", "variant_value", "price", "stock_quantity", "is_active"]


class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.SerializerMethodField()
    user_name = serializers.SerializerMethodField()

    class Meta:
        model = Review
        fields = [
            "id", "product", "user", "user_name", "rating", "title", "comment",
            "is_verified_purchase", "helpful_count", "created_at"
        ]
        read_only_fields = ["id", "product", "user", "user_name", "is_verified_purchase", "helpful_count", "created_at"]

    def get_user_name(self, obj):
        full = f"{obj.user.first_name} {obj.user.last_name}".strip()
        return full or obj.user.username

    def get_user(self, obj):
        avatar = ""
        if getattr(obj.user, "avatar", None):
            avatar = build_media_url(self, obj.user.avatar)
        return {
            "id": obj.user.id,
            "name": self.get_user_name(obj),
            "avatar": avatar or f"https://ui-avatars.com/api/?name={self.get_user_name(obj)}&background=1e4631&color=fff",
        }


class ProductListSerializer(serializers.ModelSerializer):
    price = serializers.SerializerMethodField()
    original_price = serializers.SerializerMethodField()
    images = serializers.SerializerMethodField()
    primary_image = serializers.SerializerMethodField()
    category = CategorySerializer(read_only=True)
    category_slug = serializers.CharField(source="category.slug", read_only=True, default="")
    category_name = serializers.CharField(source="category.name", read_only=True, default="")
    district = DistrictSerializer(read_only=True)
    rating = serializers.SerializerMethodField()
    average_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = [
            "id", "name", "slug", "sku", "description", "full_description",
            "price", "original_price", "base_price", "discount_price",
            "is_featured", "is_bestseller", "is_seasonal", "in_stock",
            "badges", "origin", "weight", "tags", "nutrition_info", "farm_info",
            "primary_image", "images", "category", "category_slug", "category_name",
            "district", "rating", "average_rating", "review_count", "created_at"
        ]

    def get_price(self, obj):
        return float(obj.discount_price if obj.discount_price else obj.base_price)

    def get_original_price(self, obj):
        if obj.discount_price and obj.discount_price < obj.base_price:
            return float(obj.base_price)
        return None

    def get_images(self, obj):
        images = obj.images.all()
        return ProductImageSerializer(images, many=True, context=self.context).data

    def get_primary_image(self, obj):
        primary = obj.images.filter(is_primary=True).first() or obj.images.first()
        if primary:
            return build_media_url(self, primary.image, primary.image_url)
        return None

    def get_average_rating(self, obj):
        reviews = obj.reviews.all()
        if not reviews:
            return 4.8
        return round(sum(r.rating for r in reviews) / len(reviews), 1)

    def get_rating(self, obj):
        return self.get_average_rating(obj)

    def get_review_count(self, obj):
        return obj.reviews.count()


class ProductDetailSerializer(ProductListSerializer):
    variants = ProductVariantSerializer(many=True, read_only=True)
    reviews = serializers.SerializerMethodField()

    class Meta(ProductListSerializer.Meta):
        fields = ProductListSerializer.Meta.fields + ["brand", "variants", "reviews", "updated_at"]

    def get_reviews(self, obj):
        reviews = obj.reviews.select_related("user").order_by("-created_at")[:20]
        return ReviewSerializer(reviews, many=True, context=self.context).data


class ProductWriteSerializer(serializers.ModelSerializer):
    category_slug = serializers.SlugRelatedField(
        source="category", slug_field="slug", queryset=Category.objects.all(), required=False, allow_null=True
    )
    district_slug = serializers.SlugRelatedField(
        source="district", slug_field="slug", queryset=District.objects.all(), required=False, allow_null=True
    )

    class Meta:
        model = Product
        fields = [
            "id", "name", "slug", "sku", "description", "full_description",
            "category", "category_slug", "district", "district_slug",
            "brand", "base_price", "discount_price", "origin", "weight",
            "badges", "tags", "in_stock", "is_featured", "is_bestseller", "is_seasonal", "is_active"
        ]
        extra_kwargs = {
            "slug": {"required": False},
            "sku": {"required": False},
        }

    def create(self, validated_data):
        from django.utils.text import slugify
        import uuid
        if not validated_data.get("slug"):
            base_slug = slugify(validated_data["name"])
            slug = base_slug
            if Product.objects.filter(slug=slug).exists():
                slug = f"{base_slug}-{uuid.uuid4().hex[:5]}"
            validated_data["slug"] = slug
        if not validated_data.get("sku"):
            validated_data["sku"] = f"HF-{uuid.uuid4().hex[:8].upper()}"
        return super().create(validated_data)


class BannerSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = Banner
        fields = ["id", "title", "subtitle", "image", "link_url", "position", "is_active"]

    def get_image(self, obj):
        return build_media_url(self, obj.image)


class WishlistSerializer(serializers.ModelSerializer):
    product = ProductListSerializer(read_only=True)
    product_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Wishlist
        fields = ["id", "product", "product_id", "created_at"]

    def create(self, validated_data):
        user = self.context["request"].user
        product_id = validated_data.pop("product_id")
        product = Product.objects.get(id=product_id)
        obj, _ = Wishlist.objects.get_or_create(user=user, product=product)
        return obj


class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = [
            "id", "code", "discount_type", "discount_value", "min_order_amount",
            "valid_from", "valid_until", "usage_limit", "used_count", "is_active"
        ]

    def validate(self, data):
        if data.get("discount_type") == "percentage" and data.get("discount_value", 0) > 100:
            raise serializers.ValidationError({"discount_value": "Percentage cannot exceed 100"})
        return data


class CouponValidateSerializer(serializers.Serializer):
    code = serializers.CharField()
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2)
