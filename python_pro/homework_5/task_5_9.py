import os
import shutil


class BackupManager:

    def __init__(self, file_path: str = "resources/task_5_9.txt"):
        self._file_path = file_path
        self._backup_path = file_path + ".bak"

    def __enter__(self) -> "BackupManager":
        """
        creates a backup for a file
        :return: self
        """
        shutil.copyfile(self._file_path, self._backup_path)
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        """
        if exception is raised, replaces the original file content with the backup file
        :param exc_type:
        :param exc_val:
        :param exc_tb:
        """
        if exc_type is not None:
            if os.path.exists(self._backup_path):
                shutil.copyfile(self._backup_path, self._file_path)

        if os.path.exists(self._backup_path):
            os.remove(self._backup_path)


file_to_use = "resources/task_5_9.txt"
with BackupManager(file_to_use) as backup:
    with open(file_to_use, "w") as file:
        file.write("here is a new text")
    raise ValueError("Something went wrong")
