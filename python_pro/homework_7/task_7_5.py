"""task 7 5"""

import pytest


def divide(a: int, b: int) -> float:
    """
    Divides two integers and returns the result as a float.
    :param a: The dividend (numerator).
    :param b: The divisor (denominator). Must not be zero.
    :return: The result of the division 'a / b'.
    """
    if not b:
        raise ZeroDivisionError
    return a / b


def test_zero_division():
    """
    Tests that the divide function raises a ZeroDivisionError when dividing by zero.
    """
    with pytest.raises(ZeroDivisionError):
        divide(1, 0)


def test_correct_division():
    """
    Tests the correct functionality of the divide function with valid inputs.
    :return:
    """
    assert divide(1, 1) == 1
    assert divide(1, 2) == 0.5
    assert divide(10, 4) == 2.5
