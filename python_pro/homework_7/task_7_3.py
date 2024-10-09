"""task 7 3"""

import pytest


class User:
    """
    A class to represent a user.
    """

    def __init__(self, name: str, age: int) -> None:
        self._name = name
        self._age = age

    def __repr__(self) -> str:
        return f"Name: {self._name}, age: {self._age}"

    @property
    def name(self) -> str:
        """
        Gets the name of the individual.
        :return: The name of the individual.
        """
        return self._name

    @property
    def age(self) -> int:
        """
        Gets the age of the individual.
        :return: The age of the individual.
        """
        return self._age


class UserManager:
    """
    A class to manage a collection of users.
    """

    def __init__(self) -> None:
        self._users = []  # type: list[User]

    def add_user(self, name: str, age: int) -> None:
        """
        Adds a new user to the list of users.
        :param name: The name of the user to be added.
        :param age: The age of the user to be added.
        """
        self._users.append(User(name, age))

    def remove_user(self, name_: str) -> None:
        """
        Removes a user from the list of users by their name.
        :param name_: The name of the user to be removed.
        """
        self._users = [user for user in self._users if user.name != name_]

    def get_all_users(self) -> list:
        """
        Retrieves the list of all users.
        :return: A list of User instances representing all users.
        """
        return self._users


@pytest.fixture(name="user_manager")
def fixture_user_manager() -> UserManager:
    """
    Fixture for creating a UserManager instance with predefined users.
    :return: An instance of UserManager populated with three users.
    """
    um = UserManager()
    um.add_user(name="John", age=23)
    um.add_user(name="Jane", age=20)
    um.add_user(name="Jack", age=30)
    return um


def test_add_users(user_manager) -> None:
    """
    Test the addition of new users to the UserManager instance.
    :param user_manager: An instance of UserManager populated with initial users (John, Jane, Jack)
                        as provided by the fixture.
    """
    assert len(user_manager.get_all_users()) == 3
    user_manager.add_user("Isaac", 40)
    user_manager.add_user("Julia", 45)
    assert len(user_manager.get_all_users()) == 5


def test_remove_users(user_manager) -> None:
    """
    Test the removal of users from the UserManager instance.
    :param user_manager: An instance of UserManager populated with initial users (John, Jane, Jack)
                        as provided by the fixture.
    """
    assert len(user_manager.get_all_users()) == 3
    user_manager.remove_user("John")
    assert len(user_manager.get_all_users()) == 2


@pytest.mark.skipif(
    lambda user_manager: len(user_manager.get_all_users()) < 4,  # type: ignore
    reason="should be at least 4 users",
)
def test_remove_initial_users(user_manager) -> None:
    """
    Test the removal of multiple initial users from the UserManager instance.
    :param user_manager: An instance of UserManager populated with initial users (John, Jane, Jack)
                        as provided by the fixture.
    """
    user_manager.remove_user("John")
    user_manager.remove_user("Jane")
    user_manager.remove_user("Jack")
