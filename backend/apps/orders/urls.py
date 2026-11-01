from django.urls import path
from .views import CheckoutView, OrderListView, OrderDetailView, OrderCancelView, RefundRequestView, ShipmentListView

urlpatterns = [
    path("checkout/", CheckoutView.as_view(), name="checkout"),
    path("", OrderListView.as_view(), name="order_list"),
    path("<str:order_number>/", OrderDetailView.as_view(), name="order_detail"),
    path("<str:order_number>/cancel/", OrderCancelView.as_view(), name="order_cancel"),
    path("<str:order_number>/refund/", RefundRequestView.as_view(), name="refund_request"),
    path("<str:order_number>/shipments/", ShipmentListView.as_view(), name="shipment_list"),
]
