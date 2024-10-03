import os
from zipfile import ZipFile


class Archiver:

    def __init__(
        self,
        to_archive: str = "resources/",
        archive_path: str = "results/result_task_5_10.zip",
    ):
        self._archive_path = archive_path
        self._to_archive = to_archive

    def __enter__(self) -> "Archiver":
        self._zip = ZipFile(self._archive_path, "w")
        for file in self._get_all_file_paths():
            self._zip.write(file)
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        self._zip.close()

    def _get_all_file_paths(self) -> list[str]:
        """
        finds and returns file paths in a directory
        :return:
        """
        file_paths = []
        for root, dirs, files in os.walk(self._to_archive):
            for file in files:
                file_paths.append(os.path.join(root, file))
        return file_paths


with Archiver() as archive:
    print("Archive has been created.")
