import json
from rest_framework.renderers import JSONRenderer


class APIJSONRenderer(JSONRenderer):
    charset = "utf-8"

    def render(self, data, accepted_media_type=None, renderer_context=None):
        if data is None:
            return super().render(data, accepted_media_type, renderer_context)

        response = renderer_context.get("response", None)

        if response and hasattr(response, "status_code"):
            if not hasattr(data, "get"):
                data = {"data": data}

            if response.status_code >= 400:
                output = {
                    "success": False,
                    "error": {
                        "code": response.status_code,
                        "message": data.get("detail", "An error occurred")
                    }
                }
            elif response.status_code == 204:
                return super().render("", accepted_media_type, renderer_context)
            else:
                output = {"success": True, "data": data}

            return super().render(output, accepted_media_type, renderer_context)

        return super().render(data, accepted_media_type, renderer_context)