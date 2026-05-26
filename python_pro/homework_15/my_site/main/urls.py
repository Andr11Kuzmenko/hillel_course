"""
URL configuration for the main application.
"""

from django.urls import path

from . import views  # type: ignore

urlpatterns = [
    path("", views.home_view, name="home"),
    path("about/", views.about_view, name="about"),
    path("contacts/", views.ContactView.as_view(), name="contacts"),
    path("services/", views.ServiceView.as_view(), name="services"),
]