from celery import shared_task
import logging

logger = logging.getLogger(__name__)


@shared_task(bind=True)
def sync_products(self, product_ids=None):
    from apps.search.documents import ProductDocument

    try:
        from apps.products.models import Product

        queryset = Product.objects.filter(is_active=True)
        if product_ids:
            queryset = queryset.filter(id__in=product_ids)

        count = 0
        for product in queryset.iterator():
            product_document = ProductDocument()
            product_document.update(product)
            count += 1

        logger.info(f"Synced {count} products to Elasticsearch")
        return {"status": "completed", "synced": count}
    except Exception as e:
        logger.error(f"Product sync failed: {str(e)}")
        raise self.retry(exc=e, countdown=120)


@shared_task(bind=True)
def sync_categories(self):
    from apps.products.models import Category
    from elasticsearch_dsl import connections

    try:
        from django.conf import settings
        es_config = settings.ELASTICSEARCH_DSL["default"]
        connections.create_connection(alias="default", hosts=[es_config["hosts"]])

        from apps.search.documents import ProductDocument
        ProductDocument._index.delete(ignore=404)
        ProductDocument.init()

        queryset = Category.objects.filter(is_active=True)
        for category in queryset.iterator():
            sync_products.delay()

        return {"status": "completed", "categories_processed": queryset.count()}
    except Exception as e:
        logger.error(f"Category sync failed: {str(e)}")
        raise self.retry(exc=e, countdown=120)


@shared_task
def index_single_product(product_id):
    from apps.search.documents import ProductDocument
    from apps.products.models import Product

    try:
        product = Product.objects.get(id=product_id)
        product_document = ProductDocument()
        product_document.update(product)
        logger.info(f"Indexed product {product_id}")
        return {"status": "completed", "product_id": product_id}
    except Product.DoesNotExist:
        logger.error(f"Product {product_id} not found")
        return {"status": "failed", "error": "Product not found"}


@shared_task
def remove_from_index(product_id):
    from apps.search.documents import ProductDocument

    try:
        ProductDocument().delete(product_id)
        logger.info(f"Removed product {product_id} from index")
        return {"status": "completed", "product_id": product_id}
    except Exception as e:
        logger.error(f"Failed to remove product {product_id}: {str(e)}")
        return {"status": "failed", "error": str(e)}