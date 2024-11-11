"""
Signal handler for sending an email notification to a user when a new ad is created.
"""

from django.contrib.auth.models import User

from django.core.mail import send_mail
from django.db.models.signals import post_save
from django.dispatch import receiver

from .models import Ad


@receiver(post_save, sender=Ad)
def send_email(sender, instance, created, **kwargs) -> None:
    """
    Sends an email notification to the user when a new Ad is created.
    :param sender: The model that triggered the signal (Ad in this case).
    :param instance: The instance of the model that was saved.
    :param created: A boolean indicating whether this is a new instance or an update.
    """
    if created:
        subject = "The Ad has been created"
        msg = "Your Ad has been successfully created"
        from_email = "a.kuzmenko.12.94@gmail.com"
        user = User.objects.get(id=instance.user_id)
        recipient_list = [user.email]
        send_mail(subject, msg, from_email, recipient_list)
