from typing import Callable


def create_class(class_name: str, methods_: dict[str, Callable]) -> object:
    """
    function that creates a new class and returns it
    :param class_name:
    :param methods_:
    :return: created class
    """
    return type(class_name, (object,), methods_)


def say_hello(self) -> str:
    """
    :return: 'Hello!'
    """
    return "Hello!"


def say_goodbye(self) -> str:
    """
    :return: 'Goodbye!'
    """
    return "Goodbye!"


methods = {"say_hello": say_hello, "say_goodbye": say_goodbye}

MyDynamicClass = create_class("MyDynamicClass", methods)

obj = MyDynamicClass()
assert obj.say_hello() == "Hello!", "Test 1"
assert obj.say_goodbye() == "Goodbye!", "Test 2"
print("OK")
