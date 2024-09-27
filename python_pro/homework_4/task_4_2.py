class FunctionException(Exception):
    pass


def call_function(obj_: object, method_name: str, *args):
    """
    calls a function from an object
    :param obj_:
    :param method_name: function name to call
    :param args: arguments that the function might use
    :return:
    """
    if not hasattr(obj_, method_name):
        raise FunctionException(f"'{method_name}' is not defined")
    return getattr(obj_, method_name)(*args)


class Calculator:

    @staticmethod
    def add(a: int, b: int) -> int:
        """
        adds two numbers together
        :param a:
        :param b:
        :return:
        """
        return a + b

    @staticmethod
    def subtract(a: int, b: int) -> int:
        """
        subtracts b from a
        :param a:
        :param b:
        :return:
        """
        return a - b


calc = Calculator()
assert call_function(calc, "add", 10, 5) == 15, "Test 1"
assert call_function(calc, "subtract", 10, 5) == 5, "Test 2"
print("OK")
