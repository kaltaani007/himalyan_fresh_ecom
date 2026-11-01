from django.contrib import admin
from .models import (
    BlogCategory, BlogTag, BlogPost, 
    BlogComment, BlogLike, BlogShare,
    Newsletter, NewsletterCampaign
)


@admin.register(BlogCategory)
class BlogCategoryAdmin(admin.ModelAdmin):
    list_display = ["name", "slug", "is_active", "order", "created_at"]
    list_filter = ["is_active"]
    search_fields = ["name", "description"]
    prepopulated_fields = {"slug": ["name"]}


@admin.register(BlogTag)
class BlogTagAdmin(admin.ModelAdmin):
    list_display = ["name", "slug", "is_active"]
    list_filter = ["is_active"]
    search_fields = ["name"]
    prepopulated_fields = {"slug": ["name"]}


@admin.register(BlogPost)
class BlogPostAdmin(admin.ModelAdmin):
    list_display = ["title", "author", "category", "status", "is_featured", "published_at", "view_count", "created_at"]
    list_filter = ["status", "is_featured", "category", "created_at"]
    search_fields = ["title", "excerpt", "content"]
    prepopulated_fields = {"slug": ["title"]}
    date_hierarchy = "published_at"
    ordering = ["-published_at"]


@admin.register(BlogComment)
class BlogCommentAdmin(admin.ModelAdmin):
    list_display = ["author_name", "post", "status", "created_at"]
    list_filter = ["status", "created_at"]
    search_fields = ["author_name", "content"]
    date_hierarchy = "created_at"


@admin.register(BlogLike)
class BlogLikeAdmin(admin.ModelAdmin):
    list_display = ["post", "user", "created_at"]
    list_filter = ["created_at"]


@admin.register(BlogShare)
class BlogShareAdmin(admin.ModelAdmin):
    list_display = ["post", "platform", "user", "created_at"]
    list_filter = ["platform", "created_at"]


@admin.register(Newsletter)
class NewsletterAdmin(admin.ModelAdmin):
    list_display = ["email", "is_active", "is_verified", "subscribed_at"]
    list_filter = ["is_active", "is_verified"]
    search_fields = ["email"]
    date_hierarchy = "subscribed_at"


@admin.register(NewsletterCampaign)
class NewsletterCampaignAdmin(admin.ModelAdmin):
    list_display = ["subject", "status", "scheduled_at", "sent_at", "recipients_count"]
    list_filter = ["status", "created_at"]
    search_fields = ["subject", "content"]
    date_hierarchy = "created_at"