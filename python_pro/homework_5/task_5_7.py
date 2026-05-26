import re
from typing import Generator

from task_5_4 import write_to_file

CODES_PATTERN = r"\b(4[0-9]{2}|5[0-9]{2})\b"


def read_file(file_path: str = "resources/task_5_7.log") -> Generator[str, None, None]:
    """
    function generator that finds lines with "bad" status codes (4XX, 5XX)
    :param file_path:
    :return: Generator
    """
    with open(file_path, "r", encoding="utf-8") as f:
        for line_ in f:
            clear_line = line_.strip()
            if re.findall(CODES_PATTERN, clear_line):
                yield clear_line


generator = read_file()
while True:
    try:
        line = next(generator)
        write_to_file(line, "results/result_task_5_7.txt")
    except StopIteration:
        break
