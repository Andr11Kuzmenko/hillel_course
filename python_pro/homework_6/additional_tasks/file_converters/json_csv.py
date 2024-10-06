import csv
import json


class CsvWriter:

    def write_to_csv_file(self, data: list[list[str]], file_path: str) -> None:
        """
        Writes a 2D list of strings to a CSV file.
        :param data: A 2D list where each inner list represents a row of data in the CSV file.
                    Each element of the inner list is a string representing the value for a cell in that row.
        :param file_path: The file path where the CSV data should be written.
        """
        with open(file_path, "w", newline="\n") as csv_file:
            csv_writer = csv.writer(csv_file)
            csv_writer.writerows(data)


class JsonWriter:

    def write_to_json_file(self, data: list[dict], file_path: str) -> None:
        """
        Writes a list of dictionaries to a JSON file.
        :param data:  A list of dictionaries where each dictionary represents a data record that will be saved
                        in the JSON file.
        :param file_path: The file path where the JSON data will be written.
        """
        with open(file_path, "w") as file:
            json.dump(data, file)


class JsonAdapter(CsvWriter, JsonWriter):

    def write_to_csv_file(
        self, data: list[list[str]], file_path: str = "files/json_csv_result.json"
    ) -> None:
        """
        Converts CSV-like data to JSON format and calls a method to write it to a JSON file.
        :param data:  A 2D list where:
                    - The first inner list (data[0]) represents the column headers.
                    - The subsequent inner lists (data[1:]) represent the rows of data,
                        with values corresponding to each header.
        :param file_path: The file path where the JSON data should be written.
        """
        json_data_ = [{key: val for key, val in zip(data[0], d)} for d in data[1:]]
        self.write_to_json_file(json_data_, file_path)


class CsvAdapter(JsonWriter, CsvWriter):

    def write_to_json_file(
        self, data: list[dict], file_path: str = "files/json_csv_result.csv"
    ) -> None:
        """
        Converts a list of dictionaries to a CSV format and writes it to a file.
        :param data: A list of dictionaries where each dictionary represents a data record. The keys of the
                    dictionaries will be used as the headers in the CSV file, and the values will be written
                    as rows.
        :param file_path: The file path where the CSV data will be written.
        """
        headers_ = [list(data[0].keys())]
        csv_data_ = [list(d.values()) for d in data]
        self.write_to_csv_file(headers_ + csv_data_, file_path)


def get_data_from_csv(file_path: str = "files/csv_resource.csv") -> list[list[str]]:
    """
     Reads data from a CSV file and returns it as a list of lists of strings.
    :param file_path:  The file path of the CSV file to be read.
    :return: A 2D list where:
            - Each inner list represents a row from the CSV file.
            - Each element in the inner list is a string representing a cell value.
    """
    with open(file_path) as file:
        reader = csv.reader(file)
        return list(reader)


def get_data_from_json(file_path: str = "files/json_resource.json") -> list[dict]:
    """
    Reads data from a JSON file and returns it as a list of dictionaries.
    :param file_path: The file path of the JSON file to be read.
    :return: A list of dictionaries, where each dictionary represents a data record parsed from the JSON file.
    """
    with open(file_path) as file:
        return json.load(file)


if __name__ == "__main__":
    csv_data = get_data_from_csv()
    json_adapter = JsonAdapter()
    json_adapter.write_to_csv_file(csv_data)
    json_data = get_data_from_json()
    csv_adapter = CsvAdapter()
    csv_adapter.write_to_json_file(json_data)
