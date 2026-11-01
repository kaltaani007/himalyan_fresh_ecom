from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from django.conf import settings
import uuid

User = get_user_model()


class BlogCategory(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to="blog_categories/", null=True, blank=True)
    is_active = models.BooleanField(default=True)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "blog_categories"
        verbose_name_plural = "Blog Categories"
        ordering = ["order", "name"]

    def __str__(self):
        return self.name


class BlogTag(models.Model):
    name = models.CharField(max_length=50)
    slug = models.SlugField(unique=True)
    is_active = models.BooleanField(default=True)

    class Meta:
        db_table = "blog_tags"
        ordering = ["name"]

    def __str__(self):
        return self.name


class BlogPost(models.Model):
    STATUS_CHOICES = [
        ("draft", "Draft"),
        ("published", "Published"),
        ("scheduled", "Scheduled"),
        ("archived", "Archived"),
    ]

    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    excerpt = models.TextField(max_length=500)
    content = models.TextField()
    featured_image = models.ImageField(upload_to="blog_posts/", null=True, blank=True)

    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="blog_posts")

    category = models.ForeignKey(BlogCategory, on_delete=models.SET_NULL, null=True, related_name="posts")
    tags = models.ManyToManyField(BlogTag, related_name="posts", blank=True)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="draft")
    published_at = models.DateTimeField(null=True, blank=True)

    view_count = models.IntegerField(default=0)
    like_count = models.IntegerField(default=0)
    share_count = models.IntegerField(default=0)

    meta_title = models.CharField(max_length=70, blank=True)
    meta_description = models.CharField(max_length=160, blank=True)
    meta_keywords = models.CharField(max_length=255, blank=True)

    is_featured = models.BooleanField(default=False)
    is_indexable = models.BooleanField(default=True)
    allow_comments = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "blog_posts"
        verbose_name_plural = "Blog Posts"
        ordering = ["-published_at"]
        indexes = [
            models.Index(fields=["status", "published_at"]),
            models.Index(fields=["category", "status"]),
            models.Index(fields=["author", "status"]),
        ]

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = f"{uuid.uuid4().hex[:8]}-{self.title.lower().replace(' ', '-')[:50]}"

        if self.status == "published" and not self.published_at:
            self.published_at = timezone.now()

        if not self.meta_title:
            self.meta_title = self.title[:70]
        if not self.meta_description:
            self.meta_description = self.excerpt[:160]

        super().save(*args, **kwargs)

    @property
    def reading_time_minutes(self):
        words = len(self.content.split())
        return max(1, round(words / 200))

    @property
    def is_published(self):
        return self.status == "published" and self.published_at and self.published_at <= timezone.now()


class BlogComment(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("approved", "Approved"),
        ("spam", "Spam"),
        ("deleted", "Deleted"),
    ]

    post = models.ForeignKey(BlogPost, on_delete=models.CASCADE, related_name="comments")
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name="blog_comments")
    author_name = models.CharField(max_length=100)
    author_email = models.EmailField()

    parent = models.ForeignKey("self", on_delete=models.CASCADE, null=True, blank=True, related_name="replies")

    content = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")

    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)

    likes_count = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "blog_comments"
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["post", "status"]),
            models.Index(fields=["author", "status"]),
        ]

    def __str__(self):
        return f"Comment by {self.author_name} on {self.post.title[:30]}"


class BlogLike(models.Model):
    post = models.ForeignKey(BlogPost, on_delete=models.CASCADE, related_name="likes")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="blog_likes")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "blog_likes"
        unique_together = ["post", "user"]


class BlogShare(models.Model):
    PLATFORMS = [
        ("facebook", "Facebook"),
        ("twitter", "Twitter"),
        ("linkedin", "LinkedIn"),
        ("whatsapp", "WhatsApp"),
        ("email", "Email"),
    ]

    post = models.ForeignKey(BlogPost, on_delete=models.CASCADE, related_name="shares")
    platform = models.CharField(max_length=20, choices=PLATFORMS)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "blog_shares"


class Newsletter(models.Model):
    email = models.EmailField(unique=True)
    is_active = models.BooleanField(default=True)
    is_verified = models.BooleanField(default=False)
    verification_token = models.CharField(max_length=64, blank=True)
    subscribed_at = models.DateTimeField(auto_now_add=True)
    unsubscribed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = "newsletters"
        ordering = ["-subscribed_at"]

    def __str__(self):
        return self.email


class NewsletterCampaign(models.Model):
    STATUS_CHOICES = [
        ("draft", "Draft"),
        ("scheduled", "Scheduled"),
        ("sending", "Sending"),
        ("sent", "Sent"),
        ("failed", "Failed"),
    ]

    subject = models.CharField(max_length=255)
    content = models.TextField()
    preview_text = models.CharField(max_length=150, blank=True)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="draft")

    scheduled_at = models.DateTimeField(null=True, blank=True)
    sent_at = models.DateTimeField(null=True, blank=True)

    recipients_count = models.IntegerField(default=0)
    opened_count = models.IntegerField(default=0)
    clicked_count = models.IntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "newsletter_campaigns"
        ordering = ["-created_at"]

    def __str__(self):
        return self.subject