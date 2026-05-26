def factorial(n: int) -> int:
    """
    Calculates the factorial of a non-negative integer 'n' using recursion.
    :param n: A non-negative integer for which the factorial is to be calculated.
    :return: The factorial of 'n'.
    """
    return n * factorial(n - 1) if n > 1 else 1


def gcd(x: int, y: int) -> int:
    """
    Computes the Greatest Common Divisor of two integers 'x' and 'y'.
    :param x: The first integer.
    :param y: The second integer.
    :return: The greatest common divisor of 'x' and 'y'. If both are zero, the result is undefined.
    """
    while y != 0:
        x, y = y, x % y
    return x
