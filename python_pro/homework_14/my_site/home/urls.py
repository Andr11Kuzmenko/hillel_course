from django.urls import path, re_path

from . import views

urlpatterns = [
    path('home/', views.home_view, name='home'),
    path('about/', views.about_view, name='about'),
    path('contact/', views.contact_view, name='contact'),
    re_path(r'^post/(?P<id_>\d+)/', views.post_view, name='post_view'),
    re_path(r'^profile/(?P<username>[a-zA-Z]+)/', views.profile_view, name='profile_view'),
]
