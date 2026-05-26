"""
Views for user authentication, registration, profile management, and password management.
"""

from django.contrib import messages  # type: ignore
from django.contrib.auth import authenticate, login, logout  # type: ignore
from django.shortcuts import render, redirect, get_object_or_404  # type: ignore

from main.models import User
from .forms import UserProfileForm, PasswordChangeForm, RegistrationForm, LoginForm
from .models import UserProfile


def register_view(request):
    """
    Handles the user registration process.
    """
    if request.method == "POST":
        form = RegistrationForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data.get("username")
            password = form.cleaned_data.get("password")
            email = form.cleaned_data.get("email")
            user = User.objects.create_user(
                username=username, password=password, email=email
            )
            UserProfile.objects.create(user=user)
            user = authenticate(request, username=username, password=password)
            login(request, user)
            messages.success(request, "User has been registered successfully!")
            return redirect("profile")
    else:
        form = RegistrationForm()
    return render(request, "main/register.html", {"form": form})


def profile_view(request):
    """
    Displays the user's profile page.
    """
    user_profile = get_object_or_404(UserProfile, user=request.user.id)
    return render(request, "main/profile.html", {"user_profile": user_profile})


def edit_profile_view(request):
    """
    Allows the user to edit their profile information.
    """
    user_profile = UserProfile.objects.get(user=request.user.id)
    if request.method == "POST":
        form = UserProfileForm(request.POST, request.FILES, instance=user_profile)
        if form.is_valid():
            form.save()
            messages.success(request, "Your profile has been updated!")
            return redirect("profile")
    else:
        form = UserProfileForm(instance=user_profile)
    return render(request, "main/edit_profile.html", {"form": form})


def change_password_view(request):
    """
    Allows the user to change their password.
    """
    user_data = User.objects.get(id=request.user.id)
    print(user_data)
    if request.method == "POST":
        form = PasswordChangeForm(request.POST)
        if form.is_valid():
            password = form.cleaned_data.get("new_password")
            user_data.set_password(password)
            user_data.save()
            messages.success(request, "Your password has been updated!")
            return redirect("login")
    else:
        form = PasswordChangeForm()
    return render(request, "main/change_password.html", {"form": form})


def home_view(request):
    """
    Renders the home page of the application.
    """
    return render(request, "base.html")


def logout_view(request):
    """
    Logs the user out and redirects to the home page.
    """
    logout(request)
    return redirect("home")


def login_view(request):
    """
    Handles the user login process.
    """
    if request.method == "POST":
        form = LoginForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data.get("username").strip()
            password = form.cleaned_data.get("password").strip()
            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                messages.success(request, "You are now logged in!")
                return redirect("home")
            else:
                messages.error(request, "Invalid username or password!")
                return redirect("login")
    else:
        form = LoginForm()
    return render(request, "main/login.html", {"form": form})
