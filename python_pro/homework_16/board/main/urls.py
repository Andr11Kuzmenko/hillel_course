from django.urls import path

from . import views

urlpatterns = [
    path("", views.show_all, name="home"),
    path("category/<int:category_id>/", views.show_category, name="show_category"),
]
