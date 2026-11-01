from django.contrib import admin
from .models import Order, OrderItem, Shipment, RefundRequest

class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ["order_number", "user", "status", "total_amount", "payment_status", "created_at"]
    list_filter = ["status", "payment_status", "created_at"]
    search_fields = ["order_number", "user__email"]
    inlines = [OrderItemInline]

@admin.register(Shipment)
class ShipmentAdmin(admin.ModelAdmin):
    list_display = ["order", "carrier", "tracking_number", "status", "shipped_at"]
    list_filter = ["status"]

@admin.register(RefundRequest)
class RefundRequestAdmin(admin.ModelAdmin):
    list_display = ["order", "user", "requested_amount", "status", "created_at"]
    list_filter = ["status"]
