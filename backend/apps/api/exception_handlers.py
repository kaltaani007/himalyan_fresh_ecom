from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
import logging
import traceback

logger = logging.getLogger("api_errors")


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is not None:
        error_response = {
            "success": False,
            "error": {
                "code": response.status_code,
                "message": str(exc.detail) if hasattr(exc, "detail") else str(exc),
            }
        }

        if isinstance(exc.detail, dict):
            for key, value in exc.detail.items():
                if isinstance(value, list) and len(value) > 0:
                    if hasattr(value[0], "detail"):
                        error_response["error"]["message"] = value[0].detail
                    else:
                        error_response["error"]["message"] = f"{key}: {value[0]}"
                    break

        response.data = error_response
        return response

    logger.error(f"Unhandled exception: {str(exc)}\n{traceback.format_exc()}")

    return Response(
        {
            "success": False,
            "error": {
                "code": 500,
                "message": "Internal server error",
                "details": str(exc) if str(exc) else "An unexpected error occurred"
            }
        },
        status=status.HTTP_500_INTERNAL_SERVER_ERROR
    )


class APIResponse:
    @staticmethod
    def success(data=None, message=None, status_code=200):
        response = {"success": True}
        if message:
            response["message"] = message
        if data is not None:
            response["data"] = data
        return Response(response, status=status_code)

    @staticmethod
    def error(message, code=400, errors=None):
        response = {
            "success": False,
            "error": {
                "code": code,
                "message": message
            }
        }
        if errors:
            response["error"]["details"] = errors
        return Response(response, status=code)

    @staticmethod
    def paginated(data, count, page, page_size):
        return Response({
            "success": True,
            "data": data,
            "pagination": {
                "count": count,
                "page": page,
                "page_size": page_size,
                "total_pages": (count + page_size - 1) // page_size
            }
        })