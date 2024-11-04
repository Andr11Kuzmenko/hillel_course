"""
View functions for handling various pages in the Django application.
"""

from django.http import HttpResponse, HttpRequest  # type: ignore
from django.shortcuts import render  # type: ignore


def home_view(request: HttpRequest) -> HttpResponse:
    """
    Render the home page template.
    :param request: The HTTP request object containing metadata about the request.
    :return: A response object that renders the "home/home.html" template.
    """
    return render(request, "home/home.html")


def about_view(request: HttpRequest) -> HttpResponse:
    """
    Render the About page template.
    :param request: The HTTP request object containing metadata about the request.
    :return: A response object that renders the "home/about.html" template.
    """
    return render(request, "home/about.html")


def contact_view(request: HttpRequest) -> HttpResponse:
    """
    Render the Contact page template.
    :param request: The HTTP request object containing metadata about the request.
    :return: A response object that renders the "home/contact.html" template.
    """
    return render(request, "home/contact.html")


def post_view(request: HttpRequest, id_: int) -> HttpResponse:
    """
    Display details of a specific post identified by its ID.
    :param request: The HTTP request object containing metadata about the request.
    :param id_: The unique identifier of the post.
    :return: A response object containing the message with the post ID.
    """
    return HttpResponse(f"You are looking at the post with the id: {id_}")


def profile_view(request: HttpRequest, username: str) -> HttpResponse:
    """
    Display the profile of a specific user identified by their username.
    :param request: The HTTP request object containing metadata about the request.
    :param username: The username of the profile to display.
    :return: A response object containing the message with the username.
    """
    return HttpResponse(f"You are looking at the profile of {username}")


def event_view(request: HttpRequest, year: int, month: int, day: int) -> HttpResponse:
    """
    Display an event date specified by year, month, and day.
    :param request: The HTTP request object containing metadata about the request.
    :param year: The year of the event.
    :param month: The month of the event.
    :param day: The day of the event.
    :return: A response object containing the message with the event date.
    """
    return HttpResponse(f"Event Date: {year}-{month}-{day}")
