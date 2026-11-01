from rest_framework import serializers


class ProductSearchSerializer(serializers.Serializer):
    query = serializers.CharField(required=False, allow_blank=True)
    category = serializers.CharField(required=False)
    min_price = serializers.FloatField(required=False, min_value=0)
    max_price = serializers.FloatField(required=False, min_value=0)
    brand = serializers.CharField(required=False)
    is_featured = serializers.BooleanField(required=False)
    sort_by = serializers.ChoiceField(
        choices=["relevance", "price_asc", "price_desc", "newest", "rating"],
        default="relevance"
    )
    page = serializers.IntegerField(default=1, min_value=1)
    page_size = serializers.IntegerField(default=20, min_value=1, max_value=100)


class SearchResultSerializer(serializers.Serializer):
    id = serializers.IntegerField()
    name = serializers.CharField()
    slug = serializers.SerializerMethodField()
    current_price = serializers.FloatField()
    base_price = serializers.FloatField()
    discount_percentage = serializers.SerializerMethodField()
    images = serializers.ListField(child=serializers.CharField())
    category = serializers.DictField()
    brand = serializers.CharField(allow_null=True)
    average_rating = serializers.FloatField()
    total_reviews = serializers.IntegerField()

    def get_slug(self, obj):
        return getattr(obj, "slug", None)

    def get_discount_percentage(self, obj):
        if hasattr(obj, "discount_percentage"):
            return obj.discount_percentage
        base = getattr(obj, "base_price", 0)
        current = getattr(obj, "current_price", base)
        if base and current < base:
            return int(((base - current) / base) * 100)
        return 0


class FacetSerializer(serializers.Serializer):
    categories = serializers.ListField(child=serializers.DictField())
    price_ranges = serializers.ListField(child=serializers.DictField())
    brands = serializers.ListField(child=serializers.DictField())