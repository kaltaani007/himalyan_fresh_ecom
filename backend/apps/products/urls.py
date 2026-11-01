from django.urls import path
from .views import (
    CategoryListView, ProductListView, ProductDetailView,
    FeaturedProductsView, BannerListView, WishlistView,
    WishlistRemoveView, CouponValidateView, ReviewCreateView
)

urlpatterns = [
    path("products/", ProductListView.as_view(), name="product_list"),
    path("products/<slug:slug>/", ProductDetailView.as_view(), name="product_detail"),
    path("products/featured/", FeaturedProductsView.as_view(), name="featured_products"),
    path("products/categories/", CategoryListView.as_view(), name="category_list"),
    path("banners/", BannerListView.as_view(), name="banner_list"),
    path("wishlist/", WishlistView.as_view(), name="wishlist"),
    path("wishlist/remove/<int:product_id>/", WishlistRemoveView.as_view(), name="wishlist_remove"),
    path("coupons/validate/", CouponValidateView.as_view(), name="coupon_validate"),
    path("reviews/", ReviewCreateView.as_view(), name="review_create"),
]
