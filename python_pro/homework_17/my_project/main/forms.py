"""
Forms for user authentication, profile management, and password management in the Django application.
"""

from django import forms  # type: ignore
from django.core.exceptions import ValidationError  # type: ignore

from main.models import User
from .models import UserProfile


class RegistrationForm(forms.Form):
    """
    A form used for registering a new user.
    """

    username = forms.CharField(
        widget=forms.TextInput(attrs={"class": "form-control"}), label="Username"
    )
    password = forms.CharField(
        widget=forms.PasswordInput(attrs={"class": "form-control"}), label="Password"
    )
    password_conf = forms.CharField(
        widget=forms.PasswordInput(attrs={"class": "form-control"}),
        label="Confirm Password",
    )
    email = forms.EmailField(
        widget=forms.EmailInput(attrs={"class": "form-control"}), label="Email"
    )

    def clean_password_conf(self) -> str:
        """
        Validates that the password and password confirmation match.
        """
        password = self.cleaned_data.get("password")
        password_conf = self.cleaned_data.get("password_conf")

        if password != password_conf:
            raise ValidationError("Passwords must match")

        return password

    def clean_email(self) -> str:
        """
        Checks if the email is already registered.
        """
        email = self.cleaned_data.get("email")

        if User.objects.filter(email=email).exists():
            raise ValidationError("Email already registered")

        return email

    def clean_username(self) -> str:
        """
        Checks if the username is already taken.
        """
        username = self.cleaned_data.get("username")

        if User.objects.filter(username=username).exists():
            raise ValidationError("Username already registered")

        return username


class UserProfileForm(forms.ModelForm):
    """
    A form for viewing a user profile.
    """

    avatar = forms.ImageField(widget=forms.FileInput(attrs={"class": "form-control"}))
    birth_date = forms.DateField(
        widget=forms.DateInput(attrs={"type": "date", "class": "form-control"})
    )
    bio = forms.CharField(widget=forms.Textarea(attrs={"class": "form-control"}))
    location = forms.CharField(widget=forms.Textarea(attrs={"class": "form-control"}))

    class Meta:
        model = UserProfile
        fields = ("avatar", "bio", "birth_date", "location")


class PasswordChangeForm(forms.Form):
    """
    A form for changing the user's password.
    """

    current_password = forms.CharField(
        widget=forms.PasswordInput(attrs={"class": "form-control"})
    )
    new_password = forms.CharField(
        widget=forms.PasswordInput(attrs={"class": "form-control"})
    )
    new_password_conf = forms.CharField(
        widget=forms.PasswordInput(attrs={"class": "form-control"})
    )

    def clean_new_password_conf(self):
        """
        Validates that the new password and the confirmation match.
        """
        current_password = self.cleaned_data.get("current_password")
        new_password = self.cleaned_data.get("new_password")
        new_password_conf = self.cleaned_data.get("new_password_conf")

        if new_password != new_password_conf:
            raise ValidationError("Passwords must match")

        if current_password == new_password:
            raise ValidationError("Password must be different")

        return new_password_conf


class LoginForm(forms.Form):
    """
    A form for logging in a user.
    """

    username = forms.CharField(widget=forms.TextInput(attrs={"class": "form-control"}))
    password = forms.CharField(
        widget=forms.PasswordInput(attrs={"class": "form-control"})
    )

    def clean_username(self) -> str:
        """
        Validates that the username is not empty.
        """
        username = self.cleaned_data.get("username")

        if not username:
            raise ValidationError("Username cannot be empty")

        return username

    def clean_password(self) -> str:
        """
        Validates that the password is not empty.
        """
        password = self.cleaned_data.get("password")

        if not password:
            raise ValidationError("Password cannot be empty")

        return password
