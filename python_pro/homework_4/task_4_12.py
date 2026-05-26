class LoggingMeta(type):

    def __new__(cls, name, bases, attrs):

        def __setattr__(self, key: str, value: object) -> None:
            """
            method is called when an attribute is changed. prints a log to the console
            :param key:
            :param value:
            """
            object.__setattr__(self, key, value)
            print(f"Logging: modified '{key}'")

        def __getattribute__(self, key: str) -> object:
            """
            method is called when an attribute is accessed. prints a log to the console
            :param key:
            """
            print(f"Logging: accessed '{key}'")
            return object.__getattribute__(self, key)

        attrs["__setattr__"] = __setattr__
        attrs["__getattribute__"] = __getattribute__

        return super().__new__(cls, name, bases, attrs)


class MyClass(metaclass=LoggingMeta):
    def __init__(self, name):
        self.name = name


obj = MyClass("Python")
print(obj.name)  # Logging: accessed 'name'
obj.name = "New Python"  # Logging: modified 'name'
