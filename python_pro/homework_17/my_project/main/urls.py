from django.urls import path
from django.conf.urls.static import static
from django.conf import settings

from . import views

urlpatterns = [
    path("profile/", views.profile_view, name="profile"),
    path("register/", views.register_view, name="register"),
    path("change_password/", views.change_password_view, name="change_password"),
    path("edit_profile/", views.edit_profile_view, name="edit_profile"),
    path("", views.home_view, name="home"),
    path("logout/", views.logout_view, name="logout"),
    path("login/", views.login_view, name="login"),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
