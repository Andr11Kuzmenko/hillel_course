"""
URL configuration for the main app of the Django project.
"""

from django.urls import path, re_path  # type: ignore

from . import views

urlpatterns = [
    path("home/", views.home_view, name="home"),
    path("about/", views.about_view, name="about"),
    path("contact/", views.contact_view, name="contact"),
    re_path(r"^post/(?P<id_>\d+)/", views.post_view, name="post_view"),
    re_path(
        r"^profile/(?P<username>[a-zA-Z]+)/", views.profile_view, name="profile_view"
    ),
    re_path(
        r"event/(?P<year>\d{4})/(?P<month>\d{2})/(?P<day>\d{2})/",
        views.event_view,
        name="event_view",
    ),
]
