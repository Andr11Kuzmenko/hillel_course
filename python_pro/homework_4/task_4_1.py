from numbers import Number


class SomeTestClass:
    inner_int_var: int = 1
    inner_str_var: str = "test"

    def __init__(self, description_: str):
        """
        object initializer
        :param description_:
        """
        self.description = description_


def analyze_object(obj_: object) -> None:
    """
    prints information about the object and its properties
    :param obj_:
    """
    print(f"Object type: {type(obj_)}")
    for k, attr in obj_.__dict__.items():
        print(f"{k}: {type(attr)}")
    print()


def some_function():
    pass


analyze_object(some_function)
analyze_object(SomeTestClass)
analyze_object(SomeTestClass("Test"))
analyze_object(Number)
