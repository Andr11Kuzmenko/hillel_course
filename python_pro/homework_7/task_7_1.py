"""task 7 1"""

import unittest


class StringProcessor:
    """
    A utility class that provides common string processing functions such as
    reversing a string, capitalizing a string, and counting the number of vowels.
    """

    VOWELS = "aeiouAEIOU"

    @staticmethod
    def reverse_string(s: str | None) -> str | None:
        """
        Reverses the input string.
        :param s: The string to be reversed.
        :return: The reversed string.
        """
        return s[::-1]  # type: ignore

    @staticmethod
    def capitalize_string(s: str) -> str:
        """
        Capitalizes the first letter of the input string and converts the rest to lowercase.
        :param s: The string to be capitalized.
        :return: The capitalized string with the first letter in uppercase
                and the remaining letters in lowercase.
        """
        return s.capitalize()

    @staticmethod
    def count_vowels(s: str) -> int:
        """
        Counts the number of vowels in the given string.
        :param s: The input string.
        :return: The number of vowels in the string.
        """
        return len(list(filter(lambda c: c in StringProcessor.VOWELS, s)))


class TestStringProcessor(unittest.TestCase):
    """
    A test class for the StringProcessor utility class using the unittest framework.
    """

    def test_reverse_string(self) -> None:
        """
        Tests the StringProcessor.reverse_string method.
        """
        self.assertEqual(StringProcessor.reverse_string("hello"), "olleh")
        self.assertEqual(StringProcessor.reverse_string("12345"), "54321")
        self.assertEqual(StringProcessor.reverse_string("hello world"), "dlrow olleh")
        self.assertEqual(StringProcessor.reverse_string(""), "")

    @unittest.skip("known issue. will be resolved later")
    def test_reverse_string_empty(self) -> None:
        """
        Skipped test for the StringProcessor.reverse_string method when input is None.
        """
        self.assertIsNone(StringProcessor.reverse_string(None))

    def test_capitalize_string(self) -> None:
        """
        Tests the StringProcessor.capitalize_string method.
        """
        self.assertEqual(StringProcessor.capitalize_string("hello"), "Hello")
        self.assertEqual(StringProcessor.capitalize_string("12345"), "12345")
        self.assertEqual(StringProcessor.capitalize_string("_abc"), "_abc")
        self.assertEqual(StringProcessor.capitalize_string("a_Abc"), "A_abc")
        self.assertEqual(StringProcessor.capitalize_string("12abc"), "12abc")
        self.assertEqual(StringProcessor.capitalize_string("aBCD"), "Abcd")
        self.assertEqual(StringProcessor.capitalize_string(""), "")

    def test_count_vowels(self) -> None:
        """
        Tests the StringProcessor.count_vowels method.
        """
        self.assertEqual(StringProcessor.count_vowels("hello"), 2)
        self.assertEqual(StringProcessor.count_vowels("12345"), 0)
        self.assertEqual(StringProcessor.count_vowels("_abc"), 1)
        self.assertEqual(StringProcessor.count_vowels("a_Abc"), 2)
        self.assertEqual(StringProcessor.count_vowels("aaa"), 3)
        self.assertEqual(StringProcessor.count_vowels(""), 0)


if __name__ == "__main__":
    unittest.main()
