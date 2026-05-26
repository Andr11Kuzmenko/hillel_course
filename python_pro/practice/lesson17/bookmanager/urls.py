from django.urls import path

from . import views

urlpatterns = [
    path('', views.book_list, name='book_list'),
    path('add/', views.add_book, name='add_book'),
    path('edit/<int:book_id>/', views.edit_book, name='edit_book'),
    path('add_author/', views.add_author, name='add_author'),
    path('add2/', views.book_create_or_edit, name='add_book2'),
]
