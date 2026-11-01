from django.contrib import admin
from .models import (
    Category, Product, ProductImage, ProductVariant, Inventory,
    Review, Banner, Wishlist, Coupon, CategoryAttribute, ProductAttributeValue
)


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "parent", "is_active", "order"]
    prepopulated_fields = {"slug": ("name",)}


class ProductAttributeValueInline(admin.TabularInline):
    model = ProductAttributeValue
    extra = 0


class ProductImageInline(admin.TabularInline):
    model = ProductImage
    extra = 1


class ProductVariantInline(admin.TabularInline):
    model = ProductVariant
    extra = 1


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ["name", "sku", "category", "base_price", "discount_price", "is_featured", "is_active"]
    list_filter = ["is_featured", "is_active", "category"]
    prepopulated_fields = {"slug": ("name",)}
    inlines = [ProductImageInline, ProductVariantInline, ProductAttributeValueInline]


@admin.register(CategoryAttribute)
class CategoryAttributeAdmin(admin.ModelAdmin):
    list_display = ["name", "category", "attribute_type", "is_filterable", "is_required", "order"]
    list_filter = ["attribute_type", "category"]
    search_fields = ["name", "category__name"]
    prepopulated_fields = {"slug": ("name",)}


@admin.register(ProductAttributeValue)
class ProductAttributeValueAdmin(admin.ModelAdmin):
    list_display = ["product", "attribute", "value_text", "value_number"]
    list_filter = ["attribute__category", "attribute"]
    search_fields = ["product__name", "attribute__name"]


@admin.register(Review)
class ReviewAdmin(admin.ModelAdmin):
    list_display = ["product", "user", "rating", "created_at"]
    list_filter = ["rating"]


@admin.register(Banner)
class BannerAdmin(admin.ModelAdmin):
    list_display = ["title", "position", "is_active", "start_date", "end_date"]
    list_filter = ["is_active", "position"]


@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = ["code", "discount_type", "discount_value", "is_active", "valid_from", "valid_until"]
    list_filter = ["discount_type", "is_active"]
    search_fields = ["code"]


@admin.register(Wishlist)
class WishlistAdmin(admin.ModelAdmin):
    list_display = ["user", "product", "created_at"]
    list_filter = ["created_at"]
    search_fields = ["user__email", "product__name"]