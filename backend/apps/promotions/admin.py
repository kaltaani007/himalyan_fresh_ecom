from django.contrib import admin
from .models import (
    Promotion, Coupon, PromotionRule, PromotionTarget,
    UserPromotionUsage, FlashSale, Bundle, FreeShippingRule
)


class PromotionRuleInline(admin.TabularInline):
    model = PromotionRule
    extra = 1


class PromotionTargetInline(admin.TabularInline):
    model = PromotionTarget
    extra = 1


@admin.register(Promotion)
class PromotionAdmin(admin.ModelAdmin):
    list_display = ["name", "promotion_type", "status", "discount_value", "valid_from", "valid_until", "used_count"]
    list_filter = ["status", "promotion_type", "is_featured", "is_stackable"]
    search_fields = ["name", "slug"]
    prepopulated_fields = {"slug": ("name",)}
    inlines = [PromotionRuleInline, PromotionTargetInline]
    readonly_fields = ["used_count", "created_at", "updated_at"]


@admin.register(Coupon)
class CouponAdmin(admin.ModelAdmin):
    list_display = ["code", "promotion", "is_single_use", "is_exclusive", "created_at"]
    list_filter = ["is_single_use", "is_exclusive"]
    search_fields = ["code", "promotion__name"]


@admin.register(PromotionRule)
class PromotionRuleAdmin(admin.ModelAdmin):
    list_display = ["promotion", "rule_type", "comparison_type", "value"]
    list_filter = ["rule_type", "promotion__promotion_type"]
    search_fields = ["promotion__name"]


@admin.register(FlashSale)
class FlashSaleAdmin(admin.ModelAdmin):
    list_display = ["promotion", "max_quantity", "sold_quantity", "per_user_limit"]
    readonly_fields = ["sold_quantity"]


@admin.register(Bundle)
class BundleAdmin(admin.ModelAdmin):
    list_display = ["promotion", "bundle_name", "bundle_price", "savings"]


@admin.register(FreeShippingRule)
class FreeShippingRuleAdmin(admin.ModelAdmin):
    list_display = ["promotion", "min_order_amount", "is_applicable"]


@admin.register(UserPromotionUsage)
class UserPromotionUsageAdmin(admin.ModelAdmin):
    list_display = ["user", "promotion", "order", "discount_amount", "used_at"]
    list_filter = ["used_at"]
    search_fields = ["user__email", "promotion__name"]