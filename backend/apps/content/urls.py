from django.urls import path
from .views import (
    BlogListView, FeaturedBlogsView, BlogCategoryListView,
    BlogDetailView, BlogRelatedView
)

urlpatterns = [
    path("", BlogListView.as_view(), name="blog_list"),
    path("featured/", FeaturedBlogsView.as_view(), name="blog_featured"),
    path("categories/", BlogCategoryListView.as_view(), name="blog_categories"),
    path("<slug:slug>/related/", BlogRelatedView.as_view(), name="blog_related"),
    path("<slug:slug>/", BlogDetailView.as_view(), name="blog_detail"),
]
