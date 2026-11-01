from elasticsearch_dsl import Q
from django_elasticsearch_dsl.search import Search
from django.conf import settings
import logging

logger = logging.getLogger(__name__)


class ProductSearchService:
    SYNONYMS = {
        "apple": ["apples", "apple fruit", "himachal apple"],
        "kashmir": ["kashmiri", "kashmir saffron", "kashmiri products"],
        "rajma": ["red kidney beans", "kidney beans"],
    }

    def __init__(self):
        self.index_name = "products"

    def search(
        self,
        query=None,
        category=None,
        min_price=None,
        max_price=None,
        brand=None,
        is_featured=None,
        sort_by="relevance",
        page=1,
        page_size=20,
    ):
        from apps.search.documents import ProductDocument

        search = ProductDocument.search()
        search = search.filter("term", is_active=True)

        if query:
            query_lower = query.lower()
            syns = self.SYNONYMS.get(query_lower, [])
            query_queries = [Q("match", name__raw={"query": query, "boost": 3})]

            for syn in syns:
                query_queries.append(Q("match", name__raw={"query": syn, "boost": 2}))

            query_queries.append(Q("match", description={"query": query, "boost": 1}))
            query_queries.append(Q("match", name={"query": query}))

            search = search.query(Q("bool", should=query_queries, minimum_should_match=1))

        if category:
            search = search.query("nested", path="category", query=Q("term", category__slug=category))

        if min_price is not None:
            search = search.filter("range", current_price={"gte": min_price})

        if max_price is not None:
            search = search.filter("range", current_price={"lte": max_price})

        if brand:
            search = search.filter("term", brand__raw=brand)

        if is_featured is not None:
            search = search.filter("term", is_featured=is_featured)

        sort_options = {
            "relevance": "_score",
            "price_asc": "current_price",
            "price_desc": "-current_price",
            "newest": "-created_at",
            "rating": "-average_rating",
        }

        sort_field = sort_options.get(sort_by, "_score")
        if sort_field != "_score":
            search = search.sort(sort_field)

        start = (page - 1) * page_size
        search = search[start : start + page_size]

        return search

    def get_suggestions(self, query, limit=10):
        from apps.search.documents import ProductDocument

        search = ProductDocument.search()
        search = search.filter("term", is_active=True)

        search = search.query(
            "bool",
            should=[
                Q("match", name__suggest={"input": query}),
                Q("prefix", name__raw={"value": query.lower(), "boost": 2}),
            ],
            minimum_should_match=1,
        )

        search = search[:limit]
        return search

    def get_facets(self, query=None, category=None):
        from apps.search.documents import ProductDocument

        search = ProductDocument.search()
        search = search.filter("term", is_active=True)

        if query:
            search = search.query("multi_match", query=query, fields=["name", "description"])

        if category:
            search = search.query("nested", path="category", query=Q("term", category__slug=category))

        search.aggs.bucket("categories", "nested", path="category", aggs={
            "category_terms": {"terms": {"field": "category.name.keyword", "size": 20}}
        })

        search.aggs.bucket("price_ranges", "range", field="current_price", ranges=[
            {"to": 100},
            {"from": 100, "to": 500},
            {"from": 500, "to": 1000},
            {"from": 1000, "to": 5000},
            {"from": 5000},
        ])

        search.aggs.bucket("brands", "terms", field="brand.keyword", size=20)

        return search.execute()


product_search = ProductSearchService()