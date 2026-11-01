from django.urls import path
from .views import (
    StripePaymentView, RazorpayPaymentView, PaymentConfirmView, PaymentListView,
    StripeWebhookView, RazorpayWebhookView, CODOrderView, PaymentMethodsView
)

urlpatterns = [
    path("stripe/create/", StripePaymentView.as_view(), name="stripe_create_payment"),
    path("razorpay/create/", RazorpayPaymentView.as_view(), name="razorpay_create_payment"),
    path("cod/create/", CODOrderView.as_view(), name="cod_create_payment"),
    path("confirm/<str:order_number>/", PaymentConfirmView.as_view(), name="payment_confirm"),
    path("history/", PaymentListView.as_view(), name="payment_history"),
    path("history/<str:order_number>/", PaymentListView.as_view(), name="order_payment_history"),
    path("methods/", PaymentMethodsView.as_view(), name="payment_methods"),
    path("methods/<int:pk>/", PaymentMethodsView.as_view(), name="payment_method_detail"),
    path("webhooks/stripe/", StripeWebhookView.as_view(), name="stripe_webhook"),
    path("webhooks/razorpay/", RazorpayWebhookView.as_view(), name="razorpay_webhook"),
]