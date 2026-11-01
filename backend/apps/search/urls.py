from django.urls import path
from .views import ProductSearchView, ProductSuggestionsView, ProductFacetsView, ReindexProductsView

urlpatterns = [
    path("products/", ProductSearchView.as_view(), name="product-search"),
    path("suggestions/", ProductSuggestionsView.as_view(), name="product-suggestions"),
    path("facets/", ProductFacetsView.as_view(), name="product-facets"),
    path("reindex/", ReindexProductsView.as_view(), name="reindex-products"),
]