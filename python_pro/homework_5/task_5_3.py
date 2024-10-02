from PIL import Image
from pathlib import Path


class PictureInfo:

    def __init__(self, folder_path: str = "resources/pictures"):
        self._folder_path = folder_path
        self._images = [p for p in Path(self._folder_path).glob("*.jpg")]
        self._current = 0
        self._images_count = len(self._images)

    def __iter__(self):
        return self

    def __next__(self):
        if self._current < self._images_count:
            self._current += 1

            with Image.open(self._images[self._current - 1]) as img:
                return (
                    "".join(img.filename.split("/")[-1:]),
                    img.size,
                )

        raise StopIteration


class CsvWriter:
    """
    writes data into a csv file.
    """

    def __init__(self, file_path: str = "results/result_task_5_3.csv"):
        self._file_path = file_path

    def write_to_file(self, data):
        """
        :param data: should be a collection of data (tuple, list)
        """
        with open(self._file_path, "a", newline="") as file:
            file.write(
                ", ".join(
                    map(lambda x: f'"{x}"' if x.count(",") else x, map(str, data))
                )
                + "\n"
            )


picture_info = iter(PictureInfo())
csv_writer = CsvWriter()
csv_writer.write_to_file(["Image Name", "Image Size"])

while True:
    try:
        file_data = next(picture_info)
        csv_writer.write_to_file(file_data)
    except StopIteration:
        break
