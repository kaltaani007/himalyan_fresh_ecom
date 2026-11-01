from django.urls import path, include
from .schema import urlpatterns as schema_urls

urlpatterns = [
    path("auth/", include("apps.accounts.urls")),
    path("products/", include("apps.products.urls")),
    path("cart/", include("apps.cart.urls")),
    path("orders/", include("apps.orders.urls")),
    path("payments/", include("apps.payments.urls")),
    path("admin/", include("apps.admin_panel.urls")),
    path("search/", include("apps.search.urls")),
] + schema_urls