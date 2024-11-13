"""
This module defines views for displaying lists of categories, ads, and comments,
as well as details for specific categories and their associated active ads.
"""

from django.http import HttpRequest, HttpResponse
from django.shortcuts import render

from .models import Ad, Category, Comment


def show_all(request: HttpRequest) -> HttpResponse:
    """
    Renders the main home page displaying all categories, ads, and comments.
    :param request: The HTTP request object
    """
    context = {
        "categories": Category.objects.all(),
        "ads": Ad.objects.all(),
        "comments": Comment.objects.all(),
    }
    return render(request, "main/home.html", context)


def show_category(request: HttpRequest, category_id: int) -> HttpResponse:
    """
    Renders a specific category page showing the category details and its active ads.
    :param request: The HTTP request object.
    :param category_id: The ID of the category to be displayed.
    """
    category = Category.objects.get(id=category_id)
    ads = category.active_ads()
    context = {
        "category": category,
        "ads": ads,
    }
    return render(request, "main/category.html", context)
