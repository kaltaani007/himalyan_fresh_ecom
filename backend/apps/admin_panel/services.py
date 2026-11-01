from django.core.cache import cache
from django.conf import settings
import logging

logger = logging.getLogger(__name__)


class CacheService:
    CACHE_KEYS = {
        "categories": "categories:all",
        "category_tree": "categories:tree",
        "featured_products": "products:featured",
        "product_detail": "products:detail:{id}",
        "product_list": "products:list:{page}",
        "banners": "banners:active",
        "homepage_data": "homepage:data",
        "shipping_rules": "shipping:rules",
        "coupon_validate": "coupon:validate:{code}",
    }

    TIMEOUTS = {
        "default": 300,
        "categories": 3600,
        "featured_products": 600,
        "product_detail": 300,
        "banners": 300,
        "homepage_data": 300,
    }

    @staticmethod
    def get(key, default=None):
        try:
            return cache.get(key, default)
        except Exception as e:
            logger.warning(f"Cache get error for {key}: {str(e)}")
            return default

    @staticmethod
    def set(key, value, timeout=None):
        try:
            timeout = timeout or settings.CACHES["default"]["TIMEOUT"]
            cache.set(key, value, timeout)
            return True
        except Exception as e:
            logger.warning(f"Cache set error for {key}: {str(e)}")
            return False

    @staticmethod
    def delete(key):
        try:
            cache.delete(key)
            return True
        except Exception as e:
            logger.warning(f"Cache delete error for {key}: {str(e)}")
            return False

    @classmethod
    def get_categories(cls):
        return cls.get(cls.CACHE_KEYS["categories"])

    @classmethod
    def set_categories(cls, data, timeout=None):
        timeout = timeout or cls.TIMEOUTS["categories"]
        return cls.set(cls.CACHE_KEYS["categories"], data, timeout)

    @classmethod
    def invalidate_categories(cls):
        cls.delete(cls.CACHE_KEYS["categories"])
        cls.delete(cls.CACHE_KEYS["category_tree"])

    @classmethod
    def get_product(cls, product_id):
        key = cls.CACHE_KEYS["product_detail"].format(id=product_id)
        return cls.get(key)

    @classmethod
    def set_product(cls, product_id, data, timeout=None):
        key = cls.CACHE_KEYS["product_detail"].format(id=product_id)
        timeout = timeout or cls.TIMEOUTS["product_detail"]
        return cls.set(key, data, timeout)

    @classmethod
    def invalidate_product(cls, product_id):
        key = cls.CACHE_KEYS["product_detail"].format(id=product_id)
        cls.delete(key)

    @classmethod
    def get_featured_products(cls):
        return cls.get(cls.CACHE_KEYS["featured_products"])

    @classmethod
    def set_featured_products(cls, data, timeout=None):
        timeout = timeout or cls.TIMEOUTS["featured_products"]
        return cls.set(cls.CACHE_KEYS["featured_products"], data, timeout)

    @classmethod
    def invalidate_featured_products(cls):
        cls.delete(cls.CACHE_KEYS["featured_products"])

    @classmethod
    def get_banners(cls):
        return cls.get(cls.CACHE_KEYS["banners"])

    @classmethod
    def set_banners(cls, data, timeout=None):
        timeout = timeout or cls.TIMEOUTS["banners"]
        return cls.set(cls.CACHE_KEYS["banners"], data, timeout)

    @classmethod
    def get_homepage_data(cls):
        return cls.get(cls.CACHE_KEYS["homepage_data"])

    @classmethod
    def set_homepage_data(cls, data, timeout=None):
        timeout = timeout or cls.TIMEOUTS["homepage_data"]
        return cls.set(cls.CACHE_KEYS["homepage_data"], data, timeout)

    @classmethod
    def invalidate_homepage(cls):
        cls.delete(cls.CACHE_KEYS["homepage_data"])
        cls.delete(cls.CACHE_KEYS["banners"])
        cls.delete(cls.CACHE_KEYS["featured_products"])


cache_service = CacheService()