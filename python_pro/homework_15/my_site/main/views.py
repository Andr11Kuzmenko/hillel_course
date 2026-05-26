"""
This module defines views for rendering templates and displaying data for contacts and services.
"""

from django.http import HttpResponse
from django.shortcuts import render  # type: ignore
from django.views.generic import TemplateView  # type: ignore

from .models import Contacts, Services  # type: ignore


def home_view(request) -> HttpResponse:
    """
    Renders the home page template.
    :param request: The HTTP request object.
    :return: The rendered home page.
    """
    return render(request, "main/home.html")


def about_view(request) -> HttpResponse:
    """
    Renders the about page template.
    :param request: The HTTP request object.
    :return: The rendered about page.
    """
    return render(request, "main/about.html")


class ContactView(TemplateView):
    """
    View for displaying a list of contacts from the Contacts model.
    """

    template_name = "main/contacts.html"

    def get_context_data(self, **kwargs) -> dict:
        """
        Adds contacts and header information to the context for rendering.
        """
        context = super().get_context_data(**kwargs)
        context["contacts"] = Contacts.objects.all()
        context["header"] = ["Name", "Title", "Email", "Phone"]
        return context


class ServiceView(TemplateView):
    """
    View for displaying a list of services from the Services model.
    """

    template_name = "main/services.html"

    def get_context_data(self, **kwargs) -> dict:
        """
        Adds services and header information to the context for rendering.
        """
        context = super().get_context_data(**kwargs)
        context["services"] = Services.objects.all()
        context["header"] = ["Name", "Description", "Price"]
        return context
