"""
This module contains the configuration for the 'main' Django application.
"""

from django.apps import AppConfig


class MainConfig(AppConfig):
    """
    Configuration class for the 'main' Django application.
    """

    default_auto_field = "django.db.models.BigAutoField"
    name = "main"

    def ready(self):
        import main.signals
