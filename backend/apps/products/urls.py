from django.urls import path
from .views import (
    CategoryListCreateView, CategoryDetailView, CategoryProductsView,
    DistrictListCreateView, DistrictDetailView, DistrictProductsView,
    ProductListCreateView, ProductDetailView, ProductRelatedView,
    FeaturedProductsView, ProductImageUploadView, ProductImageDetailView,
    ProductReviewsView, BannerListView, WishlistView,
    WishlistRemoveView, CouponValidateView, ReviewCreateView
)

urlpatterns = [
    path("", ProductListCreateView.as_view(), name="product_list"),
    path("featured/", FeaturedProductsView.as_view(), name="featured_products"),
    path("categories/", CategoryListCreateView.as_view(), name="product_category_list"),
    path("images/<int:pk>/", ProductImageDetailView.as_view(), name="product_image_detail"),
    path("<int:product_id>/reviews/", ProductReviewsView.as_view(), name="product_reviews"),
    path("<slug:slug>/related/", ProductRelatedView.as_view(), name="product_related"),
    path("<slug:slug>/upload-image/", ProductImageUploadView.as_view(), name="product_image_upload"),
    path("<slug:slug>/", ProductDetailView.as_view(), name="product_detail"),
]
