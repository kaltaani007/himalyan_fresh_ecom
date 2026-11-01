from social_core.pipeline.utils import partial_load
from social_core.pipeline.social_auth import load_extra_data
from django.contrib.auth import get_user_model

User = get_user_model()


def get_user(backend, details, response, uid, username, user=None, *args, **kwargs):
    if user:
        return {"user": user}
    try:
        user = User.objects.get(email=details.get("email"))
        return {"user": user}
    except User.DoesNotExist:
        return {"user": None, "is_new": True}
