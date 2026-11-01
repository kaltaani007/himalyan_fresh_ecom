from django.urls import path
from .views import (
    CartView, CartAddView, CartUpdateView, CartRemoveView,
    CartApplyCouponView, CartRemoveCouponView, CartCheckoutView
)

urlpatterns = [
    path("", CartView.as_view(), name="cart"),
    path("add/", CartAddView.as_view(), name="cart_add"),
    path("update/<int:item_id>/", CartUpdateView.as_view(), name="cart_update"),
    path("remove/<int:item_id>/", CartRemoveView.as_view(), name="cart_remove"),
    path("apply-coupon/", CartApplyCouponView.as_view(), name="cart_apply_coupon"),
    path("remove-coupon/", CartRemoveCouponView.as_view(), name="cart_remove_coupon"),
    path("checkout/", CartCheckoutView.as_view(), name="cart_checkout"),
]