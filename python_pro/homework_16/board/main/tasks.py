from celery import shared_task
from django.utils import timezone
from datetime import timedelta
from .models import Ad


@shared_task
def deactivate_expired_ads() -> None:
    """
    This Celery task deactivates all ads that have been active for more than 30 days.
    """
    expired_ads = Ad.objects.filter(
        is_active=True, created_at__lte=timezone.now() - timedelta(days=30)
    )
    expired_ads.update(is_active=False)
