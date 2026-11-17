from django.urls import path, include
from .schema import urlpatterns as schema_urls
from apps.products.views import (
    CategoryListCreateView, CategoryDetailView, CategoryProductsView,
    DistrictListCreateView, DistrictDetailView, DistrictProductsView,
    BannerListView, WishlistView, WishlistRemoveView, CouponValidateView
)
from apps.content.views import (
    DistrictBlogsView, TestimonialListView, NewsletterSubscribeView
)

urlpatterns = [
    path("auth/", include("apps.accounts.urls")),
    path("products/", include("apps.products.urls")),

    # Categories API
    path("categories/", CategoryListCreateView.as_view(), name="v1_category_list"),
    path("categories/<slug:slug>/products/", CategoryProductsView.as_view(), name="v1_category_products"),
    path("categories/<slug:slug>/", CategoryDetailView.as_view(), name="v1_category_detail"),

    # Districts API
    path("districts/", DistrictListCreateView.as_view(), name="v1_district_list"),
    path("districts/<slug:slug>/products/", DistrictProductsView.as_view(), name="v1_district_products"),
    path("districts/<slug:slug>/blogs/", DistrictBlogsView.as_view(), name="v1_district_blogs"),
    path("districts/<slug:slug>/", DistrictDetailView.as_view(), name="v1_district_detail"),

    # Content: Blogs, Testimonials, Newsletter
    path("blogs/", include("apps.content.urls")),
    path("testimonials/", TestimonialListView.as_view(), name="v1_testimonial_list"),
    path("newsletter/subscribe/", NewsletterSubscribeView.as_view(), name="v1_newsletter_subscribe"),

    # Storefront utilities
    path("banners/", BannerListView.as_view(), name="v1_banner_list"),
    path("wishlist/", WishlistView.as_view(), name="v1_wishlist"),
    path("wishlist/<int:product_id>/", WishlistRemoveView.as_view(), name="v1_wishlist_remove"),
    path("coupons/validate/", CouponValidateView.as_view(), name="v1_coupon_validate"),

    path("cart/", include("apps.cart.urls")),
    path("orders/", include("apps.orders.urls")),
    path("payments/", include("apps.payments.urls")),
    path("admin/", include("apps.admin_panel.urls")),
    path("search/", include("apps.search.urls")),
] + schema_urls
