import os
from celery import Celery
from celery.schedules import crontab

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings.base")

app = Celery("ecomhub")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()

app.conf.beat_schedule = {
    "sync-elasticsearch": {
        "task": "apps.search.tasks.sync_products",
        "schedule": crontab(minute="*/15"),
    },
    "cleanup-expired-carts": {
        "task": "apps.cart.tasks.cleanup_expired_carts",
        "schedule": crontab(hour=2, minute=0),
    },
    "release-expired-reservations": {
        "task": "apps.inventory.tasks.release_expired_reservations",
        "schedule": crontab(minute="*/5"),
    },
    "process-abandoned-carts": {
        "task": "apps.notifications.tasks.send_abandoned_cart_reminders",
        "schedule": crontab(hour=1, minute=0),
    },
    "check-low-stock": {
        "task": "apps.inventory.tasks.check_low_stock",
        "schedule": crontab(hour=8, minute=0),
    },
    "check-expiring-stock": {
        "task": "apps.inventory.tasks.check_expiring_stock",
        "schedule": crontab(hour=9, minute=0),
    },
    "create-abandonment-records": {
        "task": "apps.cart.tasks.create_abandonment_records",
        "schedule": crontab(hour=3, minute=0),
    },
    "process-abandoned-cart-emails": {
        "task": "apps.cart.tasks.process_abandoned_carts",
        "schedule": crontab(hour=10, minute=0),
    },
}

@app.task(bind=True, ignore_result=True)
def debug_task(self):
    print(f"Request: {self.request!r}")