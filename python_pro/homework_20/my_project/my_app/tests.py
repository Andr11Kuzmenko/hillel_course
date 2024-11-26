import pytest
from django.contrib.auth.models import User
from datetime import date, timedelta

from .forms import TaskForm  # type: ignore
from .serializers import TaskSerializer


class TestTaskForm:
    def test_valid_form(self):
        form_data = {
            "title": "Test Task",
            "description": "Description for the task.",
            "due_date": date.today() + timedelta(days=1),
        }
        form = TaskForm(data=form_data)
        assert form.is_valid()

    def test_form_with_empty_title(self):
        form_data = {
            "title": "",
            "description": "Description for the task.",
            "due_date": date.today() + timedelta(days=1),
        }
        form = TaskForm(data=form_data)
        assert not form.is_valid()
        assert "title" in form.errors

    def test_due_date_in_past(self):
        form_data = {
            "title": "Test Task",
            "description": "Description for the task.",
            "due_date": date.today() - timedelta(days=1),
        }
        form = TaskForm(data=form_data)
        assert not form.is_valid()
        assert "due_date" in form.errors


@pytest.mark.parametrize(
    "form_data,expected",
    [
        (
            {
                "title": "Test Task",
                "description": "Description",
                "due_date": date.today() + timedelta(days=1),
            },
            True,
        ),
        (
            {
                "title": "",
                "description": "Description",
                "due_date": date.today() + timedelta(days=1),
            },
            False,
        ),
        (
            {
                "title": "Task",
                "description": "Description",
                "due_date": date.today() - timedelta(days=1),
            },
            False,
        ),
    ],
)
def test_task_form(form_data, expected):
    form = TaskForm(data=form_data)
    assert form.is_valid() == expected


@pytest.fixture
def user():
    return User(id=1, username="testuser", email="test@example.com")


class TestTaskWithUserSerializer:
    def test_valid_serializer_with_user(self, user):
        data = {
            "title": "Test Task",
            "description": "Description for the task.",
            "due_date": date.today() + timedelta(days=1),
            "user": {"id": user.id, "username": user.username, "email": user.email},
        }
        serializer = TaskSerializer(data=data)
        assert serializer.is_valid()


@pytest.mark.parametrize(
    "data,expected",
    [
        (
            {
                "title": "Test Task",
                "description": "Description",
                "due_date": date.today() + timedelta(days=1),
                "user": {"id": 1, "username": "testuser", "email": "test@example.com"},
            },
            True,
        ),
    ],
)
def test_task_with_user_serializer(data, expected):
    serializer = TaskSerializer(data=data)
    assert serializer.is_valid() == expected
