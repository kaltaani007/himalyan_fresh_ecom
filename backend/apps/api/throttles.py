from rest_framework.throttling import UserRateThrottle, AnonRateThrottle
from django.core.cache import cache


class BurstRateThrottle(UserRateThrottle):
    scope = "burst"
    rate = "100/minute"


class SustainedRateThrottle(UserRateThrottle):
    scope = "sustained"
    rate = "1000/day"


class LoginRateThrottle(AnonRateThrottle):
    scope = "login"
    rate = "5/minute"


class OrderRateThrottle(UserRateThrottle):
    scope = "orders"
    rate = "10/minute"


class PaymentRateThrottle(UserRateThrottle):
    scope = "payments"
    rate = "20/minute"


class CartRateThrottle(AnonRateThrottle):
    scope = "cart"
    rate = "30/minute"


class SearchRateThrottle(AnonRateThrottle):
    scope = "search"
    rate = "60/minute"


class ProductListRateThrottle(AnonRateThrottle):
    scope = "product_list"
    rate = "120/minute"


class CheckoutRateThrottle(UserRateThrottle):
    scope = "checkout"
    rate = "5/minute"


class ContactRateThrottle(AnonRateThrottle):
    scope = "contact"
    rate = "3/minute"


class CustomUserRateThrottle(UserRateThrottle):
    scope = "user"
    rate = "200/minute"

    def get_rate(self):
        return self.parse_rate(self.rate)

    def allow_request(self, request, view):
        self.request = request
        if not request.user or not request.user.is_authenticated:
            return True

        cache_key = f"throttle_user_{request.user.id}_{self.scope}"
        hits = cache.get(cache_key, 0)

        if hits >= self.parse_rate(self.rate)[0]:
            return False

        return True

    def throttle_failure(self):
        return False

    def wait(self):
        return 60


class IPBurstRateThrottle(AnonRateThrottle):
    scope = "ip_burst"
    rate = "50/minute"

    def get_cache_key(self, request, view):
        if request.user and request.user.is_authenticated:
            ident = request.user.pk
        else:
            ident = self.get_ident(request)

        return self.cache_format % {
            "scope": self.scope,
            "ident": ident
        }


class IPSustainedRateThrottle(AnonRateThrottle):
    scope = "ip_sustained"
    rate = "500/day"

    def get_cache_key(self, request, view):
        if request.user and request.user.is_authenticated:
            ident = request.user.pk
        else:
            ident = self.get_ident(request)

        return self.cache_format % {
            "scope": self.scope,
            "ident": ident
        }