from typing import Generator


def read_file(
    filename: str = "resources/task_5_4.log", word_to_find: str = "Error"
) -> Generator[str, None, None]:
    """
    opens a log file and iterates through the lines of the log file
    :param filename:
    :param word_to_find:
    """
    with open(filename, "r", encoding="utf-8") as f:
        for line_ in f:
            if word_to_find in line_:
                yield line_.strip()


def write_to_file(line_to_write: str, filename: str = "results/result_task_5_4.txt"):
    """
    appends a line to the file
    :param line_to_write:
    :param filename:
    """
    with open(filename, "a", encoding="utf-8") as f:
        f.write(line_to_write + "\n")


file_reader = read_file()
while True:
    try:
        line = next(file_reader)
        write_to_file(line)
    except StopIteration:
        break
