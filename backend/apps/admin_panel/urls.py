from django.urls import path
from .views import (
    DashboardView, AdminOrderListView, AdminOrderUpdateView,
    AdminProductListView, AdminProductCreateView, AdminUserListView,
    AdminCouponListView, AdminCouponCreateView
)

urlpatterns = [
    path("dashboard/", DashboardView.as_view(), name="admin_dashboard"),
    path("orders/", AdminOrderListView.as_view(), name="admin_orders"),
    path("orders/<str:order_number>/", AdminOrderUpdateView.as_view(), name="admin_order_update"),
    path("products/", AdminProductListView.as_view(), name="admin_products"),
    path("products/create/", AdminProductCreateView.as_view(), name="admin_product_create"),
    path("users/", AdminUserListView.as_view(), name="admin_users"),
    path("coupons/", AdminCouponListView.as_view(), name="admin_coupons"),
    path("coupons/create/", AdminCouponCreateView.as_view(), name="admin_coupon_create"),
]