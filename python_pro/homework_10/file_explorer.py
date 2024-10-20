"""
This module provides functionality for searching a specific word or phrase in text files.
"""
import threading


def explore_file(file_path_: str, to_find: str) -> None:
    """
    Searches for a specific word or phrase in a file and prints a message if it is found.
    :param file_path_: The path to the file to be searched.
    :param to_find: The word or phrase to search for within the file.
    """
    with open(file_path_, encoding="utf-8") as file:
        file_contents = file.read()
        if to_find in file_contents:
            print(f"'{to_find}' word has been found in {file_path_}", end="\n")


def explore_files(files_path_: list[str], to_find: str) -> None:
    """
    Searches for a specific word or phrase in multiple files concurrently using threads.
    :param files_path_: A list of file paths to be searched.
    :param to_find: The word or phrase to search for within each file.
    :return:
    """
    threads = []
    for file in files_path_:
        threads.append(threading.Thread(target=explore_file, args=(file, to_find)))
    for thread in threads:
        thread.start()
    for thread in threads:
        thread.join()


if __name__ == "__main__":
    files_path = ["resources/test1.txt", "resources/text2.txt", "resources/text3.txt"]
    explore_files(files_path, "New O")
    explore_files(files_path, "city")
