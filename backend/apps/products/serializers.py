from rest_framework import serializers
from .models import Category, Product, ProductImage, ProductVariant, Review, Banner, Wishlist, Coupon


class CategorySerializer(serializers.ModelSerializer):
    product_count = serializers.SerializerMethodField()
    children = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ["id", "name", "slug", "description", "image", "parent", 
                  "is_active", "order", "product_count", "children", "created_at"]
    
    def get_product_count(self, obj):
        return obj.products.filter(is_active=True).count()
    
    def get_children(self, obj):
        children = obj.children.filter(is_active=True)
        return CategorySerializer(children, many=True).data


class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = ["id", "image", "alt_text", "is_primary", "order"]


class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = ["id", "sku", "variant_type", "variant_value", "price", "stock_quantity", "is_active"]


class ReviewSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Review
        fields = ["id", "user_name", "rating", "title", "comment", 
                  "is_verified_purchase", "helpful_count", "created_at"]
    
    def get_user_name(self, obj):
        return obj.user.first_name or obj.user.username


class ProductListSerializer(serializers.ModelSerializer):
    images = serializers.SerializerMethodField()
    primary_image = serializers.SerializerMethodField()
    category_name = serializers.CharField(source="category.name", read_only=True)
    average_rating = serializers.SerializerMethodField()
    review_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = ["id", "name", "slug", "sku", "base_price", "discount_price", 
                  "is_featured", "primary_image", "images", "category_name",
                  "average_rating", "review_count", "created_at"]
    
    def get_images(self, obj):
        images = obj.images.all()[:4]
        return ProductImageSerializer(images, many=True).data
    
    def get_primary_image(self, obj):
        primary = obj.images.filter(is_primary=True).first()
        if not primary:
            primary = obj.images.first()
        if primary:
            return primary.image.url
        return None
    
    def get_average_rating(self, obj):
        reviews = obj.reviews.all()
        if not reviews:
            return 0
        return sum(r.rating for r in reviews) / len(reviews)
    
    def get_review_count(self, obj):
        return obj.reviews.count()


class ProductDetailSerializer(ProductListSerializer):
    variants = ProductVariantSerializer(many=True, read_only=True)
    reviews = serializers.SerializerMethodField()
    
    class Meta(ProductListSerializer.Meta):
        fields = ProductListSerializer.Meta.fields + ["description", "brand", "category", 
                  "category_name", "variants", "reviews", "updated_at"]
    
    def get_reviews(self, obj):
        reviews = obj.reviews.all()[:5]
        return ReviewSerializer(reviews, many=True).data


class BannerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Banner
        fields = ["id", "title", "subtitle", "image", "link_url", "position", "is_active"]


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
        return Wishlist.objects.create(user=user, product=product)


class CouponSerializer(serializers.ModelSerializer):
    class Meta:
        model = Coupon
        fields = ["id", "code", "discount_type", "discount_value", "min_order_amount",
                  "valid_from", "valid_until", "usage_limit", "used_count", "is_active"]
    
    def validate(self, data):
        if data.get("discount_type") == "percentage" and data.get("discount_value", 0) > 100:
            raise serializers.ValidationError({"discount_value": "Percentage cannot exceed 100"})
        return data


class CouponValidateSerializer(serializers.Serializer):
    code = serializers.CharField()
    subtotal = serializers.DecimalField(max_digits=10, decimal_places=2)
