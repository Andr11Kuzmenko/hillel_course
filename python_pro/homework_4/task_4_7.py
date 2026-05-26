import logging

logging.basicConfig(
    level=logging.INFO,
    handlers=[
        logging.FileHandler("task_4_7.log"),
        logging.StreamHandler()
    ],
)


def log_a_call(func):

    def wrapper(self, *args, **kwargs):
        logging.info(f"Method: {func.__name__} has been called with args: {args}")
        return func(self, *args, **kwargs)

    return wrapper


def log_methods(cls):
    original_add = cls.add
    original_subtract = cls.subtract

    @log_a_call
    def add(self, *args, **kwargs):
        return original_add(self, *args, **kwargs)

    @log_a_call
    def subtract(self, *args, **kwargs):
        return original_subtract(self, *args, **kwargs)

    cls.add = add
    cls.subtract = subtract

    return cls


@log_methods
class MyClass:
    def add(self, a, b):
        return a + b

    def subtract(self, a, b):
        return a - b


obj = MyClass()
assert obj.add(5, 3) == 8, "Test 1"
assert obj.subtract(5, 3) == 2, "Test 2"
