import uuid
from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    is_customer = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    
    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username"]
    
    class Meta:
        db_table = "users"
        
    def __str__(self):
        return self.email


class UserProfile(models.Model):
    GENDER_CHOICES = [
        ("M", "Male"),
        ("F", "Female"),
        ("O", "Other"),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    avatar = models.ImageField(upload_to="avatars/", null=True, blank=True)
    date_of_birth = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = "user_profiles"
        
    def __str__(self):
        return f"{self.user.email}'s profile"


class Address(models.Model):
    ADDRESS_TYPES = [
        ("billing", "Billing"),
        ("shipping", "Shipping"),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="addresses")
    address_type = models.CharField(max_length=20, choices=ADDRESS_TYPES, default="shipping")
    full_name = models.CharField(max_length=100)
    company = models.CharField(max_length=100, blank=True)
    address_line1 = models.CharField(max_length=255)
    address_line2 = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100)
    state = models.CharField(max_length=100)
    postal_code = models.CharField(max_length=20)
    country = models.CharField(max_length=100, default="India")
    phone = models.CharField(max_length=20)
    is_default = models.BooleanField(default=False)
    
    class Meta:
        db_table = "addresses"
        verbose_name_plural = "Addresses"
        
    def __str__(self):
        return f"{self.full_name}, {self.city}"


class Notification(models.Model):
    NOTIFICATION_TYPES = [
        ("order", "Order"),
        ("promotion", "Promotion"),
        ("system", "System"),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notifications")
    title = models.CharField(max_length=255)
    message = models.TextField()
    notification_type = models.CharField(max_length=20, choices=NOTIFICATION_TYPES)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = "notifications"
        ordering = ["-created_at"]
        
    def __str__(self):
        return f"{self.title} - {self.user.email}"
