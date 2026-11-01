from django.db import models
from django_elasticsearch_dsl import Document, fields
from django_elasticsearch_dsl.registries import registry
from apps.products.models import Product, Category


@registry.register_document
class ProductDocument(Document):
    name = fields.TextField(
        attr="name",
        fields={
            "raw": fields.KeywordField(),
            "suggest": fields.CompletionField(),
        }
    )
    slug = fields.KeywordField()
    description = fields.TextField(
        attr="description",
        fields={
            "raw": fields.KeywordField(),
        }
    )
    sku = fields.KeywordField()
    base_price = fields.FloatField()
    discount_price = fields.FloatField()
    current_price = fields.FloatField()
    category = fields.NestedField(
        properties={
            "id": fields.IntegerField(),
            "name": fields.TextField(),
            "slug": fields.KeywordField(),
        }
    )
    brand = fields.KeywordField()
    is_featured = fields.BooleanField()
    is_active = fields.BooleanField()
    average_rating = fields.FloatField()
    total_reviews = fields.IntegerField()
    images = fields.ListField(fields.KeywordField())
    tags = fields.ListField(fields.KeywordField())
    created_at = fields.DateField()

    class Index:
        name = "products"
        settings = {
            "number_of_shards": 1,
            "number_of_replicas": 0,
        }

    class Django:
        model = Product

        fields = []

    def prepare_category(self, instance):
        if instance.category:
            return {
                "id": instance.category.id,
                "name": instance.category.name,
                "slug": instance.category.slug,
            }
        return None

    def prepare_current_price(self, instance):
        return float(instance.current_price)

    def prepare_average_rating(self, instance):
        reviews = instance.reviews.all()
        if reviews.exists():
            return float(reviews.aggregate(models.Avg("rating"))["rating__avg"] or 0)
        return 0

    def prepare_total_reviews(self, instance):
        return instance.reviews.count()

    def prepare_images(self, instance):
        return [img.image.url for img in instance.images.filter(is_primary=True)]

    def prepare_tags(self, instance):
        return []

    def prepare_is_active(self, instance):
        return instance.is_active

    def get_instances_from_related(self, instance):
        return instance.category