from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    CustomLoginView, RegisterView, GoogleAuthView, CurrentUserView,
    AddressListCreateView, AddressRetrieveUpdateDestroyView,
    NotificationListView, NotificationMarkReadView,
    PasswordResetRequestView, LogoutView
)

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", CustomLoginView.as_view(), name="login"),
    path("google/", GoogleAuthView.as_view(), name="google_auth"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("token/obtain/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("forgot-password/", PasswordResetRequestView.as_view(), name="forgot_password"),
    path("me/", CurrentUserView.as_view(), name="current_user"),
    path("profile/addresses/", AddressListCreateView.as_view(), name="address_list_create"),
    path("profile/addresses/<int:id>/", AddressRetrieveUpdateDestroyView.as_view(), name="address_detail"),
    path("notifications/", NotificationListView.as_view(), name="notification_list"),
    path("notifications/<int:notification_id>/read/", NotificationMarkReadView.as_view(), name="notification_read"),
]
