from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework_simplejwt.exceptions import InvalidToken, AuthenticationFailed


class LenientJWTAuthentication(JWTAuthentication):
    """
    Extends SimpleJWT's JWTAuthentication so that an expired or invalid token
    does not block public (AllowAny) endpoints such as categories, districts,
    products, blogs, and testimonials.

    If the token is valid, it authenticates the user as normal.
    If the token is invalid or expired, it falls back to AnonymousUser (returning None).
    Protected endpoints requiring IsAuthenticated will still cleanly reject unauthenticated
    requests via DRF permission checks.
    """

    def authenticate(self, request):
        header = self.get_header(request)
        if header is None:
            return None

        raw_token = self.get_raw_token(header)
        if raw_token is None:
            return None

        try:
            validated_token = self.get_validated_token(raw_token)
            return self.get_user(validated_token), validated_token
        except (InvalidToken, AuthenticationFailed, Exception):
            return None
