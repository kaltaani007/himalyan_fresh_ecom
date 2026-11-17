from django.shortcuts import get_object_or_404
from rest_framework import generics, permissions, status, filters
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import BlogCategory, BlogPost, Testimonial, Newsletter
from .serializers import (
    BlogCategorySerializer, BlogPostSerializer,
    TestimonialSerializer, NewsletterSubscribeSerializer
)


class BlogListView(generics.ListCreateAPIView):
    serializer_class = BlogPostSerializer
    permission_classes = [permissions.AllowAny]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    filter_backends = [filters.SearchFilter]
    search_fields = ["title", "excerpt", "content", "category__name"]
    pagination_class = None

    def get_queryset(self):
        qs = BlogPost.objects.filter(status="published").select_related(
            "category", "author", "district"
        ).order_by("-published_at")

        category_param = self.request.query_params.get("category")
        if category_param and category_param != "all":
            qs = qs.filter(category__slug=category_param)

        district_param = self.request.query_params.get("district")
        if district_param:
            qs = qs.filter(district__slug=district_param)

        return qs


class FeaturedBlogsView(generics.ListAPIView):
    serializer_class = BlogPostSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None

    def get_queryset(self):
        return BlogPost.objects.filter(
            status="published", is_featured=True
        ).select_related("category", "author", "district").order_by("-published_at")[:6]


class BlogCategoryListView(generics.ListAPIView):
    serializer_class = BlogCategorySerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None

    def get_queryset(self):
        return BlogCategory.objects.filter(is_active=True).order_by("order", "name")


class BlogDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = BlogPostSerializer
    permission_classes = [permissions.AllowAny]
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    lookup_field = "slug"

    def get_queryset(self):
        return BlogPost.objects.select_related("category", "author", "district")

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        BlogPost.objects.filter(pk=instance.pk).update(view_count=instance.view_count + 1)
        instance.view_count += 1
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def patch(self, request, *args, **kwargs):
        instance = self.get_object()
        if "featured_image" in request.FILES or "image" in request.FILES:
            instance.featured_image = request.FILES.get("featured_image") or request.FILES.get("image")
            instance.featured_image_url = ""
            instance.save(update_fields=["featured_image", "featured_image_url", "updated_at"])
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(self.get_serializer(instance).data)


class BlogRelatedView(generics.ListAPIView):
    serializer_class = BlogPostSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None

    def get_queryset(self):
        post = get_object_or_404(BlogPost, slug=self.kwargs["slug"])
        return BlogPost.objects.filter(
            status="published"
        ).exclude(pk=post.pk).select_related("category", "author", "district")[:3]


class DistrictBlogsView(generics.ListAPIView):
    serializer_class = BlogPostSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None

    def get_queryset(self):
        return BlogPost.objects.filter(
            status="published", district__slug=self.kwargs["slug"]
        ).select_related("category", "author", "district")


class TestimonialListView(generics.ListAPIView):
    serializer_class = TestimonialSerializer
    permission_classes = [permissions.AllowAny]
    pagination_class = None

    def get_queryset(self):
        return Testimonial.objects.filter(is_active=True).order_by("order", "-created_at")


class NewsletterSubscribeView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = (request.data.get("email") or "").strip().lower()
        if not email or "@" not in email:
            return Response({"error": "Please enter a valid email address."}, status=status.HTTP_400_BAD_REQUEST)
        obj, created = Newsletter.objects.get_or_create(
            email=email,
            defaults={"is_active": True},
        )
        if not created and not obj.is_active:
            obj.is_active = True
            obj.save(update_fields=["is_active"])
        return Response(
            {
                "subscribed": True,
                "email": obj.email,
                "message": "Welcome to the Himalayan Harvest Club!" if created else "You are already subscribed!",
            },
            status=status.HTTP_201_CREATED if created else status.HTTP_200_OK,
        )
