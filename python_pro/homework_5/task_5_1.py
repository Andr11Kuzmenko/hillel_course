class FileReader:

    def __init__(self, file_path: str, direction: int = 1):
        self._file_path = file_path
        self._direction = direction
        self._current_point = 0

        with open(self._file_path, encoding="utf-8") as file:
            self._file_lines = file.readlines()[::-1] if direction else file.readlines()
            self._max_points = len(self._file_lines) - 1

    def __iter__(self) -> "FileReader":
        return self

    def __next__(self) -> str:
        """
        :return: line of a file
        """
        if self._current_point <= self._max_points:
            self._current_point += 1
            return self._file_lines[self._current_point - 1].strip()

        raise StopIteration


reader = iter(FileReader("resources/task_5_1.txt"))

while True:
    try:
        print(next(reader))
    except StopIteration:
        break
