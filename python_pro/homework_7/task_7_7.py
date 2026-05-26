"""task 7 7"""

import pytest


class FileProcessor:
    """
    A class for processing file input and output operations.
    """

    @staticmethod
    def write_to_file(file_path: str, data: str) -> None:
        """
        Writes the specified data to a file at the given path.
        :param file_path: The path to the file where data should be written.
        :param data: The string data to be written to the file.
        """
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(data)

    @staticmethod
    def read_from_file(file_path: str) -> str:
        """
        Reads the contents of a specified file and returns it as a string.
        :param file_path: The path to the file to be read.
        :return: The contents of the file as a string.
        """
        with open(file_path, "r", encoding="utf-8") as f:
            return f.read()


def test_not_existing_file_read() -> None:
    """
    Test case for attempting to read from a non-existing file.
    """
    with pytest.raises(FileNotFoundError):
        FileProcessor.read_from_file("not_existing_file.txt")


def test_write_to_file(tmp_path) -> None:
    """
    Test case for writing data to a file and then reading it back.
    :param tmp_path: A built-in pytest fixture that provides a temporary directory unique
                    to the test invocation. It is used to create a temporary file
                    without affecting the actual filesystem.
    """
    file = tmp_path / "test.txt"
    file_path = file.as_posix()
    FileProcessor.write_to_file(file_path, "some text to be written")
    content = FileProcessor.read_from_file(file_path)
    assert content == "some text to be written"


def test_write_big_data(tmp_path) -> None:
    """
    Test case for writing a large amount of data to a file and verifying the count of
    lines read back.
    :param tmp_path: A built-in pytest fixture that provides a temporary directory unique
                    to the test invocation. It is used to create a temporary file
                    without affecting the actual filesystem.
    """
    file = tmp_path / "test.txt"
    file_path = file.as_posix()
    with open(file_path, "w", encoding="utf-8") as f:
        for i in range(100000000):
            f.write(f"{str(i)}\n")
    with open(file_path, "r", encoding="utf-8") as f:
        assert len(f.readlines()) == 100000000
