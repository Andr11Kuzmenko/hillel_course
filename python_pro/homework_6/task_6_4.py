import json


def get_all_available_books(file_path: str = "task_6_4.json") -> list[dict]:
    """
    Finds and returns all available books from a given JSON file.
    :param file_path: The file path of the JSON file containing the book collection.
    :return: A list of dictionaries, each representing a book that is marked as available.
    """
    with open(file_path) as file:
        json_data = [book for book in json.load(file) if book["InStock"] is True]
        return json_data


def add_book_to_collection(book_info_: dict, file_path: str = "task_6_4.json") -> None:
    """
    Adds a new book's information to an existing JSON file.
    :param book_info_: A dictionary containing the book's information.
    :param file_path: The file path of the JSON file where the book information will be added.
    """
    with open(file_path, "r+") as file:
        json_data = json.load(file)
        json_data.append(book_info_)
        file.seek(0)
        json.dump(json_data, file)


if __name__ == "__main__":
    print(get_all_available_books())
    book_info = {
        "Name": "The Sign of the Four",
        "Author": "Arthur Conan Doyle",
        "Year": 1890,
        "InStock": True,
    }
    add_book_to_collection(book_info)
    print(get_all_available_books())
