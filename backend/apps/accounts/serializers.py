from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import UserProfile, Address, Notification

User = get_user_model()


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ["avatar", "date_of_birth", "gender", "created_at", "updated_at"]


class UserSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = ["id", "email", "username", "first_name", "last_name", "phone", 
                  "is_customer", "is_staff", "profile", "date_joined", "last_login"]
        read_only_fields = ["id", "email", "is_staff", "date_joined", "last_login"]


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ["email", "username", "password", "password_confirm", "first_name", "last_name"]
        
    def validate(self, data):
        if data["password"] != data["password_confirm"]:
            raise serializers.ValidationError({"password_confirm": "Passwords do not match"})
        return data
    
    def create(self, validated_data):
        validated_data.pop("password_confirm")
        password = validated_data.pop("password")
        user = User.objects.create(**validated_data)
        user.set_password(password)
        user.save()
        UserProfile.objects.create(user=user)
        return user


class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ["id", "address_type", "full_name", "company", "address_line1", 
                  "address_line2", "city", "state", "postal_code", "country", 
                  "phone", "is_default"]
        read_only_fields = ["id"]
    
    def create(self, validated_data):
        address = self.context["request"].user.addresses.create(**validated_data)
        return address


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ["id", "title", "message", "notification_type", "is_read", "created_at"]
        read_only_fields = ["id", "title", "message", "notification_type", "created_at"]


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()


class PasswordResetConfirmSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    new_password = serializers.CharField(min_length=8)
    new_password_confirm = serializers.CharField()
    
    def validate(self, data):
        if data["new_password"] != data["new_password_confirm"]:
            raise serializers.ValidationError({"new_password_confirm": "Passwords do not match"})
        return data
