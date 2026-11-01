from django.contrib import admin
from .models import Stock, StockReservation, StockMovement, StockAlert, Warehouse


@admin.register(Warehouse)
class WarehouseAdmin(admin.ModelAdmin):
    list_display = ["name", "code", "is_active", "is_default"]
    list_filter = ["is_active", "is_default"]
    search_fields = ["name", "code"]


@admin.register(Stock)
class StockAdmin(admin.ModelAdmin):
    list_display = ["product_name", "sku", "warehouse", "total_quantity", "available_quantity", "reserved_quantity", "is_active"]
    list_filter = ["is_active", "warehouse"]
    search_fields = ["product_name", "sku"]
    readonly_fields = ["available_quantity", "reserved_quantity", "damaged_quantity", "expired_quantity"]


@admin.register(StockReservation)
class StockReservationAdmin(admin.ModelAdmin):
    list_display = ["reservation_id", "stock", "quantity", "status", "expires_at", "cart_id", "order_id", "created_at"]
    list_filter = ["status", "created_at"]
    search_fields = ["reservation_id", "cart_id", "order_id"]
    readonly_fields = ["reservation_id", "expires_at", "created_at", "updated_at"]


@admin.register(StockMovement)
class StockMovementAdmin(admin.ModelAdmin):
    list_display = ["stock", "movement_type", "quantity", "reference_type", "reference_id", "created_at"]
    list_filter = ["movement_type", "created_at"]
    search_fields = ["reference_id"]
    readonly_fields = ["created_at"]


@admin.register(StockAlert)
class StockAlertAdmin(admin.ModelAdmin):
    list_display = ["stock", "alert_type", "quantity_threshold", "is_resolved", "created_at"]
    list_filter = ["alert_type", "is_resolved"]
    search_fields = ["stock__product_name"]