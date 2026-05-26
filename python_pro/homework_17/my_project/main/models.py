"""
Models for user profile management in the Django application.
"""

from django.db import models  # type: ignore
from django.contrib.auth.models import User  # type: ignore


class UserProfile(models.Model):
    """
    A model representing a user's profile.
    """

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(max_length=500, blank=True)
    birth_date = models.DateField(null=True, blank=True)
    location = models.TextField(blank=True)
    avatar = models.ImageField(upload_to="avatars/", blank=True)

    def __str__(self) -> str:
        return f"{self.user}"
