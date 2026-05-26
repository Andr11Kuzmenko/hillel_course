"""task 7 4"""


def is_even(n: int) -> bool:
    """
    Determines if a given integer is even.
    :param n: The integer to check.
    :return: Returns True if 'n' is even, otherwise False.
    >>> is_even(5)
    False
    >>> is_even(10)
    True
    >>> is_even(0)
    True
    """
    return not n % 2


def factorial(n: int) -> int:
    """
    Calculates the factorial of a given non-negative integer 'n'.
    :param n: A non-negative integer for which the factorial is to be computed.
    :return: The factorial of the given number 'n'.
    >>> factorial(2)
    2
    >>> factorial(3)
    6
    >>> factorial(0)
    1
    """
    return n * factorial(n - 1) if n > 0 else 1


if __name__ == "__main__":
    import doctest

    doctest.testmod()
