from django.urls import path, include
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    RegisterView, CurrentUserView, AddressListCreateView,
    AddressRetrieveUpdateDestroyView, NotificationListView,
    NotificationMarkReadView, PasswordResetRequestView, LogoutView
)

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("forgot-password/", PasswordResetRequestView.as_view(), name="forgot_password"),
    path("me/", CurrentUserView.as_view(), name="current_user"),
    path("profile/addresses/", AddressListCreateView.as_view(), name="address_list_create"),
    path("profile/addresses/<int:id>/", AddressRetrieveUpdateDestroyView.as_view(), name="address_detail"),
    path("notifications/", NotificationListView.as_view(), name="notification_list"),
    path("notifications/<int:notification_id>/read/", NotificationMarkReadView.as_view(), name="notification_read"),
    path("google/", include("social_django.urls")),
]
