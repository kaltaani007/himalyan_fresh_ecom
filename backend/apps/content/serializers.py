from rest_framework import serializers
from .models import BlogCategory, BlogPost, Testimonial, Newsletter
from apps.products.serializers import DistrictSerializer, build_media_url


class BlogCategorySerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = BlogCategory
        fields = ["id", "name", "slug", "description", "image"]

    def get_image(self, obj):
        return build_media_url(self, obj.image)


class BlogPostSerializer(serializers.ModelSerializer):
    summary = serializers.CharField(source="excerpt")
    image = serializers.SerializerMethodField()
    category = BlogCategorySerializer(read_only=True)
    author = serializers.SerializerMethodField()
    read_time = serializers.IntegerField(source="reading_time_minutes", read_only=True)
    views = serializers.IntegerField(source="view_count", read_only=True)
    likes = serializers.IntegerField(source="like_count", read_only=True)
    district = DistrictSerializer(read_only=True)

    class Meta:
        model = BlogPost
        fields = [
            "id", "title", "slug", "summary", "content", "image",
            "category", "author", "published_at", "read_time",
            "is_featured", "is_trending", "views", "likes", "district"
        ]

    def get_image(self, obj):
        return build_media_url(self, obj.featured_image, obj.featured_image_url)

    def get_author(self, obj):
        name = obj.author_name
        if not name and obj.author:
            name = f"{obj.author.first_name} {obj.author.last_name}".strip() or obj.author.username
        name = name or "Himalaya Fresh Editorial"
        avatar = obj.author_avatar_url or f"https://ui-avatars.com/api/?name={name}&background=1e4631&color=fff"
        return {
            "id": obj.author.id if obj.author else 1,
            "name": name,
            "avatar": avatar,
            "bio": obj.author_bio or "Himalayan agricultural specialist",
            "role": obj.author_role or "Contributor",
        }


class TestimonialSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    product = serializers.CharField(source="product_name")
    purchase = serializers.CharField(source="product_name")

    class Meta:
        model = Testimonial
        fields = ["id", "name", "location", "image", "rating", "product", "purchase", "text"]

    def get_image(self, obj):
        return build_media_url(self, obj.avatar, obj.avatar_url)


class NewsletterSubscribeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Newsletter
        fields = ["email"]
