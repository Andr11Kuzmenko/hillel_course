"""
This module is responsible for configuring the Django Admin interface for the models.
"""

from django.contrib import admin

from .models import Category, Ad, Comment


class AdAdmin(admin.ModelAdmin):
    """
    Admin interface configuration for the Ad model.
    """

    list_filter = ("category__name", "is_active")
    list_display = ("title", "price", "category", "is_active")


class CategoryAdmin(admin.ModelAdmin):
    """
    Admin interface configuration for the Category model.
    """

    list_display = ("name", "description")


class CommentAdmin(admin.ModelAdmin):
    """
    Admin interface configuration for the Comment model.
    """

    list_display = ("id", "ad", "content")


admin.site.register(Ad, AdAdmin)
admin.site.register(Category, CategoryAdmin)
admin.site.register(Comment, CommentAdmin)
