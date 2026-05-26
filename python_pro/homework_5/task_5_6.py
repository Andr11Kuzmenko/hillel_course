from pathlib import Path


class FolderExplorer:

    def __init__(self, folder_path: str = "."):
        self._folder_path = folder_path

    def __iter__(self) -> "FolderExplorer":
        self._files = [f for f in Path(self._folder_path).iterdir() if f.is_file()]
        self._counter = 0
        self._dir_size = len(self._files)
        return self

    def __next__(self) -> Path:
        """
        :return: object of the Path class that represents the next file.
        """
        if self._counter < self._dir_size:
            self._counter += 1
            return self._files[self._counter - 1]

        raise StopIteration


explorer = iter(FolderExplorer())
while True:
    try:
        file = next(explorer)
        print(f"File Name: {file.name}; File Size: {file.stat().st_size}")
    except StopIteration:
        break
