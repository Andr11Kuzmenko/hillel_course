from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from .models import Book
from django.contrib.auth.models import User


class BookTest(TestCase):
    def setUp(self):
        Book.objects.create(
            title="The Adventures of Sherlock Holmes",
            author="Sir Arthur Conan Doyle",
            genre="Detective",
            publication_year=1892,
        )
        Book.objects.create(
            title="The Hound of the Baskervilles",
            author="Sir Arthur Conan Doyle",
            genre="Detective",
            publication_year=1902,
        )
        Book.objects.create(
            title="White Fang",
            author="Jack London",
            genre="Adventure",
            publication_year=1906,
        )
        Book.objects.create(
            title="The Call of the Wild",
            author="Jack London",
            genre="Adventure",
            publication_year=1903,
        )
        Book.objects.create(
            title="The Raven",
            author="Edgar Allan Poe",
            genre="Poetry",
            publication_year=1845,
        )
        Book.objects.create(
            title="The Tell-Tale Heart",
            author="Edgar Allan Poe",
            genre="Horror",
            publication_year=1843,
        )

        self.regular_user = User.objects.create_user(
            username="user", password="userpassword"
        )
        self.admin_user = User.objects.create_superuser(
            username="admin", password="adminpassword"
        )

        self.client = APIClient()

        response = self.client.post(
            "/api/token/", {"username": "user", "password": "userpassword"}
        )
        self.regular_user_token = response.data["token"]

        response = self.client.post(
            "/api/token/", {"username": "admin", "password": "adminpassword"}
        )
        self.admin_user_token = response.data["token"]

    def test_filter_books_by_author(self):
        url = reverse("book-list")
        response = self.client.get(url, {"author": "Sir Arthur Conan Doyle"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 2)

    def test_filter_books_by_title_contains(self):
        url = reverse("book-list")
        response = self.client.get(url, {"title_contains": "Call"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)

    def test_filter_books_by_genre(self):
        url = reverse("book-list")
        response = self.client.get(url, {"genre": "Adventure"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 2)

    def test_filter_books_by_publication_year(self):
        url = reverse("book-list")
        response = self.client.get(url, {"publication_year": 1902})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)

    def test_filter_books_by_multiple_fields(self):
        url = reverse("book-list")
        response = self.client.get(url, {"author": "Jack London", "genre": "Adventure"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 2)

    def test_authenticate_with_token(self):
        url = reverse("book-list")
        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.regular_user_token)
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_book_as_admin(self):
        url = reverse("book-list")
        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.admin_user_token)
        data = {
            "title": "The New Adventure",
            "author": "New Author",
            "genre": "Adventure",
            "publication_year": 2024,
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["title"], "The New Adventure")

    def test_create_book_as_regular_user(self):
        url = reverse("book-list")
        self.client.credentials(HTTP_AUTHORIZATION="Token " + self.regular_user_token)
        data = {
            "title": "The New Adventure",
            "author": "New Author",
            "genre": "Adventure",
            "publication_year": 2024,
        }
        response = self.client.post(url, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
