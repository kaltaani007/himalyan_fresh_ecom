import time
import json
import logging
from django.utils.deprecation import MiddlewareMixin

logger = logging.getLogger("api_access")


class RequestLoggingMiddleware(MiddlewareMixin):
    def process_request(self, request):
        request.start_time = time.time()
        return None

    def process_response(self, request, response):
        if hasattr(request, "start_time"):
            duration = time.time() - request.start_time
            log_data = {
                "method": request.method,
                "path": request.path,
                "query_params": dict(request.GET),
                "status_code": response.status_code,
                "duration_ms": round(duration * 1000, 2),
                "user": str(request.user) if request.user.is_authenticated else "anonymous",
                "ip": self.get_client_ip(request),
            }

            if request.method in ["POST", "PUT", "PATCH"]:
                if hasattr(request, "body") and request.body:
                    try:
                        body = json.loads(request.body)
                        if "password" in str(body):
                            body.pop("password", None)
                            body.pop("password1", None)
                            body.pop("password2", None)
                        log_data["body_size"] = len(request.body)
                    except:
                        log_data["body_size"] = len(request.body)

            if response.status_code >= 500:
                logger.error(json.dumps(log_data))
            elif response.status_code >= 400:
                logger.warning(json.dumps(log_data))
            else:
                logger.info(json.dumps(log_data))

        return response

    @staticmethod
    def get_client_ip(request):
        x_forwarded_for = request.META.get("HTTP_X_FORWARDED_FOR")
        if x_forwarded_for:
            return x_forwarded_for.split(",")[0]
        return request.META.get("REMOTE_ADDR", "")


class SecurityHeadersMiddleware(MiddlewareMixin):
    def process_response(self, request, response):
        response["X-Content-Type-Options"] = "nosniff"
        response["X-Frame-Options"] = "DENY"
        response["X-XSS-Protection"] = "1; mode=block"
        response["Referrer-Policy"] = "strict-origin-when-cross-origin"

        if not request.is_secure():
            response["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"

        return response


class APIVersionMiddleware(MiddlewareMixin):
    def process_request(self, request):
        version = request.META.get("HTTP_API_VERSION", "v1")
        request.api_version = version
        return None


class CORSCustomHeadersMiddleware(MiddlewareMixin):
    def process_response(self, request, response):
        response["Access-Control-Expose-Headers"] = "X-Total-Count, X-Page-Number, X-Page-Size"
        response["Access-Control-Allow-Credentials"] = "true"
        return response