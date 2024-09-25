import re

EMAIL_REGEX = re.compile(
    r"([A-Za-z0-9]+[.-_])*[A-Za-z0-9]+@[A-Za-z0-9-]+(\.[A-Z|a-z]{2,})+"
)


class User:

    def __init__(self, first_name: str, last_name: str, email: str):
        self.__first_name = first_name
        self.__last_name = last_name
        self.__email = email

    @property
    def first_name(self) -> str:
        return self.__first_name

    @first_name.setter
    def first_name(self, value: str):
        self.__first_name = value

    @property
    def last_name(self) -> str:
        return self.__last_name

    @last_name.setter
    def last_name(self, value: str):
        self.__last_name = value

    @property
    def email(self) -> str:
        return self.__email

    @email.setter
    def email(self, value: str):
        if re.fullmatch(EMAIL_REGEX, value):
            self.__email = value
        else:
            raise ValueError("Invalid email")


user1 = User("Joe", "Joe", "some_email@test.com")
try:
    user1.first_name = "test"
    user1.email = "invalid.email.com"
except ValueError as ve:
    print(ve)
