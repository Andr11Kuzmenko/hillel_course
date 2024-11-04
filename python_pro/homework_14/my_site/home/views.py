from django.http import HttpResponse


def home_view(request):
    return HttpResponse("Welcome to the main page")


def about_view(request):
    return HttpResponse("About us")


def contact_view(request):
    return HttpResponse("Contact us")


def post_view(request, id_):
    return HttpResponse(f"You are looking at the post with the id: {id_}")


def profile_view(request, username):
    return HttpResponse(f"You are looking at the profile of {username}")
