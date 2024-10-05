def to_uppercase(s: str) -> str:
    """
    Converts all characters in the input string `s` to uppercase.
    :param s: The input string to be converted to uppercase.
    :return: A new string with all alphabetic characters in uppercase.
    """
    return s.upper()


def trim_spaces(s: str) -> str:
    """
    Removes leading and trailing spaces from the input string `s`.
    :param s: The input string from which leading and trailing spaces will be removed.
    :return: A new string with leading and trailing spaces removed.
    """
    return s.strip()
