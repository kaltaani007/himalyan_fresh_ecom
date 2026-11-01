import uuid
from decimal import Decimal
from django.db import models
from django.contrib.auth import get_user_model
from django.core.exceptions import ValidationError

User = get_user_model()


class Category(models.Model):
    name = models.CharField(max_length=100)
    slug = models.SlugField(unique=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to="categories/", null=True, blank=True)
    parent = models.ForeignKey("self", on_delete=models.CASCADE, null=True, blank=True, related_name="children")
    is_active = models.BooleanField(default=True)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = "categories"
        verbose_name_plural = "Categories"
        ordering = ["order", "name"]
        
    def __str__(self):
        return self.name
    
    def get_full_path(self):
        if self.parent:
            return f"{self.parent.get_full_path()} > {self.name}"
        return self.name


class Product(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    sku = models.CharField(max_length=50, unique=True)
    description = models.TextField()
    category = models.ForeignKey(Category, on_delete=models.SET_NULL, null=True, related_name="products")
    brand = models.CharField(max_length=100, blank=True)
    base_price = models.DecimalField(max_digits=10, decimal_places=2)
    discount_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    cost_price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = "products"
        ordering = ["-created_at"]
        
    def __str__(self):
        return self.name
    
    @property
    def current_price(self):
        return self.discount_price if self.discount_price else self.base_price
    
    @property
    def discount_percentage(self):
        if self.discount_price and self.discount_price < self.base_price:
            return int(((self.base_price - self.discount_price) / self.base_price) * 100)
        return 0


class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="images")
    image = models.ImageField(upload_to="products/")
    alt_text = models.CharField(max_length=255, blank=True)
    is_primary = models.BooleanField(default=False)
    order = models.IntegerField(default=0)
    
    class Meta:
        db_table = "product_images"
        ordering = ["order"]
        
    def __str__(self):
        return f"{self.product.name} - Image {self.order}"


class ProductVariant(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="variants")
    sku = models.CharField(max_length=50, unique=True)
    variant_type = models.CharField(max_length=50)
    variant_value = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    stock_quantity = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = "product_variants"
        unique_together = ["product", "variant_type", "variant_value"]
        
    def __str__(self):
        return f"{self.product.name} - {self.variant_type}: {self.variant_value}"


class Inventory(models.Model):
    variant = models.ForeignKey(ProductVariant, on_delete=models.CASCADE, related_name="inventory")
    warehouse_location = models.CharField(max_length=50, blank=True)
    quantity = models.IntegerField(default=0)
    reserved_quantity = models.IntegerField(default=0)
    low_stock_threshold = models.IntegerField(default=10)
    
    class Meta:
        db_table = "inventory"
        
    @property
    def available_quantity(self):
        return self.quantity - self.reserved_quantity


class Review(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="reviews")
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="reviews")
    rating = models.IntegerField(choices=[(i, i) for i in range(1, 6)])
    title = models.CharField(max_length=255, blank=True)
    comment = models.TextField(blank=True)
    is_verified_purchase = models.BooleanField(default=False)
    helpful_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = "reviews"
        unique_together = ["product", "user"]
        
    def __str__(self):
        return f"{self.user.username}'s review on {self.product.name}"


class Banner(models.Model):
    title = models.CharField(max_length=255)
    subtitle = models.CharField(max_length=255, blank=True)
    image = models.ImageField(upload_to="banners/")
    link_url = models.CharField(max_length=255, blank=True)
    position = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    start_date = models.DateTimeField(null=True, blank=True)
    end_date = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        db_table = "banners"
        ordering = ["position"]
        
    def __str__(self):
        return self.title


class Wishlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="wishlist")
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="wishlisted_by")
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = "wishlists"
        unique_together = ["user", "product"]
        
    def __str__(self):
        return f"{self.user.username} - {self.product.name}"


class Coupon(models.Model):
    DISCOUNT_TYPES = [
        ("percentage", "Percentage"),
        ("fixed", "Fixed Amount"),
    ]
    
    code = models.CharField(max_length=50, unique=True)
    discount_type = models.CharField(max_length=20, choices=DISCOUNT_TYPES)
    discount_value = models.DecimalField(max_digits=10, decimal_places=2)
    min_order_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    valid_from = models.DateTimeField()
    valid_until = models.DateTimeField()
    usage_limit = models.IntegerField(null=True, blank=True)
    used_count = models.IntegerField(default=0)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        db_table = "coupons"
        
    def __str__(self):
        return self.code
    
    def is_valid(self):
        from django.utils import timezone
        now = timezone.now()
        return (
            self.is_active and
            self.valid_from <= now <= self.valid_until and
            (self.usage_limit is None or self.used_count < self.usage_limit)
        )
    
    def calculate_discount(self, subtotal):
        if not self.is_valid() or subtotal < self.min_order_amount:
            return 0
        if self.discount_type == "percentage":
            return (subtotal * self.discount_value) / 100
        return min(self.discount_value, subtotal)


class CategoryAttribute(models.Model):
    ATTRIBUTE_TYPES = [
        ("text", "Text"),
        ("number", "Number"),
        ("boolean", "Boolean"),
        ("select", "Select"),
        ("multiselect", "Multi-Select"),
    ]

    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="attributes")
    name = models.CharField(max_length=100)
    slug = models.SlugField()
    attribute_type = models.CharField(max_length=20, choices=ATTRIBUTE_TYPES, default="text")
    unit = models.CharField(max_length=20, blank=True)
    is_required = models.BooleanField(default=False)
    is_filterable = models.BooleanField(default=False)
    is_searchable = models.BooleanField(default=False)
    display_on_frontend = models.BooleanField(default=True)
    display_on_product_page = models.BooleanField(default=True)
    order = models.IntegerField(default=0)
    options = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = "category_attributes"
        unique_together = ["category", "slug"]
        ordering = ["order", "name"]

    def __str__(self):
        return f"{self.category.name} - {self.name}"


class ProductAttributeValue(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name="attribute_values")
    attribute = models.ForeignKey(CategoryAttribute, on_delete=models.CASCADE, related_name="product_values")
    value_text = models.CharField(max_length=500, blank=True)
    value_number = models.DecimalField(max_digits=15, decimal_places=4, null=True, blank=True)
    value_boolean = models.BooleanField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "product_attribute_values"
        unique_together = ["product", "attribute"]
        indexes = [
            models.Index(fields=["attribute", "value_text"]),
        ]

    def __str__(self):
        return f"{self.product.name} - {self.attribute.name}: {self.value_text or self.value_number}"

    @property
    def value(self):
        if self.attribute.attribute_type == "text":
            return self.value_text
        elif self.attribute.attribute_type in ["number", "select"]:
            return self.value_number
        elif self.attribute.attribute_type == "boolean":
            return self.value_boolean
        return self.value_text

    def clean(self):
        if self.attribute.attribute_type == "number" and self.value_text:
            try:
                self.value_number = Decimal(self.value_text)
            except:
                raise ValidationError(f"Invalid number value for {self.attribute.name}")
