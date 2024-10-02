from typing import Generator


def generate_even() -> Generator[int, None, None]:
    """
    generates even numbers
    :return: generator of even numbers
    """
    n = 0

    while True:
        yield n
        n += 2


class LimitedNumbers:

    def __init__(
        self, limit: int = 100, file_path: str = "results/result_task_5_5.txt"
    ):
        self._limit = limit
        self._file_path = file_path
        self._file = None

    def __enter__(self):
        self._file = open(self._file_path, "w")
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self._file.close()

    def write_lines(self, generator: Generator[int, None, None]):
        """
        writes lines to a file
        :param generator:
        """
        for _ in range(self._limit):
            line_ = str(next(generator))
            self._file.write(line_ + "\n")


with LimitedNumbers() as c_manager:
    even_generator = generate_even()
    c_manager.write_lines(even_generator)
