"""
This module defines the models for the application, including UserProfile, Category,
Ad, and Comment.
"""

from datetime import datetime

from django.contrib.auth.models import User  # type: ignore
from django.core.validators import MinValueValidator  # type: ignore
from django.db import models  # type: ignore


class UserProfile(models.Model):
    """
    Represents a user profile that extends the default Django User model.
    """

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")
    phone = models.CharField(max_length=20, blank=True)

    def all_comments(self) -> models.QuerySet:
        """
        Returns all comments associated with this user profile.
        :return: A queryset of all the comments associated with the user profile.
        """
        return self.comments

    def __str__(self) -> str:
        """
        String representation of the UserProfile.
        :return: The string representation of the user.
        """

        return f"{self.user}"


class Category(models.Model):
    """
    Represents a category for Ads.
    """

    name = models.CharField(max_length=50, unique=True)
    description = models.CharField(max_length=255)

    class Meta:
        verbose_name_plural = "Categories"

    def count_active_ads(self) -> int:
        """
        Returns the number of active ads in this category.
        :return: The number of active ads in the category.
        """
        return self.ads.filter(is_active=True).count()

    def last_month_created_ads(self) -> models.QuerySet:
        """
        Returns ads created in the last month for this category.
        :return: A queryset of ads created in the last month for this category.
        """
        return self.ads.filter(created_at__gte=datetime.today().month)

    def active_ads(self) -> models.QuerySet:
        """
        Returns all active ads in this category.
        :return: A queryset of active ads in the category.
        """
        return self.ads.filter(is_active=True)

    def __str__(self) -> str:
        """
        String representation of the Category.
        :return: The name of the category.
        """
        return self.name


class Ad(models.Model):
    """
    Represents an Ad in the application.
    """

    title = models.CharField(max_length=50)
    description = models.CharField(max_length=255)
    price = models.FloatField(validators=[MinValueValidator(0)])
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    user = models.ForeignKey(UserProfile, on_delete=models.CASCADE, related_name="ads")
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name="ads")

    def count_comments(self) -> int:
        """
        Returns the number of comments for this ad.
        :return: The number of comments associated with the ad.
        """
        return self.comments.count()

    def short_description(self) -> str:
        """
        Returns a shortened version of the ad's description (up to 100 characters).
        :return: A shortened description of the ad.
        """
        return self.description[:100]

    def __str__(self) -> str:
        """
        String representation of the Ad.
        :return: The title of the ad.
        """
        return self.title


class Comment(models.Model):
    """
    Represents a comment on an ad.
    """

    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    ad = models.ForeignKey(Ad, on_delete=models.CASCADE, related_name="comments")
    user = models.ForeignKey(
        UserProfile, on_delete=models.CASCADE, related_name="comments"
    )

    def __str__(self) -> str:
        """
        String representation of the Comment.
        :return: The first 100 characters of the comment content.
        """
        return self.content[:100]
