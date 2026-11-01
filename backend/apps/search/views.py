from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django_elasticsearch_dsl.search import Search
import logging

from .services import product_search
from .serializers import ProductSearchSerializer, SearchResultSerializer, FacetSerializer

logger = logging.getLogger(__name__)


class ProductSearchView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        serializer = ProductSearchSerializer(data=request.query_params)
        serializer.is_valid(raise_exception=True)
        params = serializer.validated_data

        try:
            search_results = product_search.search(
                query=params.get("query"),
                category=params.get("category"),
                min_price=params.get("min_price"),
                max_price=params.get("max_price"),
                brand=params.get("brand"),
                is_featured=params.get("is_featured"),
                sort_by=params.get("sort_by", "relevance"),
                page=params.get("page", 1),
                page_size=params.get("page_size", 20),
            )

            results = []
            for hit in search_results:
                results.append({
                    "id": hit.meta.id,
                    "name": hit.name,
                    "slug": hit.slug,
                    "current_price": hit.current_price,
                    "base_price": hit.base_price,
                    "images": hit.images,
                    "category": hit.category,
                    "brand": hit.brand,
                    "average_rating": hit.average_rating,
                    "total_reviews": hit.total_reviews,
                })

            total = search_results.count()
            page = params.get("page", 1)
            page_size = params.get("page_size", 20)

            return Response({
                "results": results,
                "count": total,
                "page": page,
                "page_size": page_size,
                "total_pages": (total + page_size - 1) // page_size,
            })

        except Exception as e:
            logger.error(f"Search error: {str(e)}")
            return Response(
                {"error": "Search service unavailable", "detail": str(e)},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )


class ProductSuggestionsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        query = request.query_params.get("q", "")
        limit = int(request.query_params.get("limit", 10))

        if not query or len(query) < 2:
            return Response({"suggestions": []})

        try:
            suggestions = product_search.get_suggestions(query, limit=limit)
            results = []

            for hit in suggestions:
                results.append({
                    "id": hit.meta.id,
                    "name": hit.name,
                    "slug": hit.slug,
                    "category": hit.category.get("name") if hit.category else None,
                })

            return Response({"suggestions": results})

        except Exception as e:
            logger.error(f"Suggestions error: {str(e)}")
            return Response({"suggestions": []})


class ProductFacetsView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        query = request.query_params.get("q", "")
        category = request.query_params.get("category", "")

        try:
            facets = product_search.get_facets(query=query or None, category=category or None)

            return Response({
                "categories": [
                    {"name": bucket.key, "count": bucket.doc_count}
                    for bucket in facets.aggregations.categories.category_terms.buckets
                ],
                "price_ranges": [
                    {"key": bucket.key, "count": bucket.doc_count}
                    for bucket in facets.aggregations.price_ranges.buckets
                ],
                "brands": [
                    {"name": bucket.key, "count": bucket.doc_count}
                    for bucket in facets.aggregations.brands.buckets
                ],
            })

        except Exception as e:
            logger.error(f"Facets error: {str(e)}")
            return Response({
                "categories": [],
                "price_ranges": [],
                "brands": [],
            })


class ReindexProductsView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        from .tasks import sync_products

        product_ids = request.data.get("product_ids")
        sync_products.delay(product_ids=product_ids)

        return Response({"status": "Indexing started"})