import csv


def get_avg_students_mark(file_path: str = "files/task_6_3.csv") -> float:
    """
    Reads a CSV file containing student marks and calculates the average mark.
    :param file_path: The path to the CSV file containing student marks.
    :return: The average mark of the students, rounded to two decimal places.
    """
    with open(file_path) as csvfile:
        reader = csv.DictReader(csvfile)
        avg_mark = 0
        for row in reader:
            avg_mark += float(row["Mark"])
        return round(avg_mark / reader.line_num, 2)


def add_new_student(student_data_: dict, file_path: str = "files/task_6_3.csv") -> None:
    """
    Writes a new student's data to a CSV file.
    :param student_data_: A dictionary containing student data where keys
                        represent the column headers ('Name', 'Age', 'Mark')
    :param file_path: The path to the CSV file where the student data will be written.
    """
    with open(file_path, "a", newline="\n") as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=student_data_.keys())
        writer.writerow(student_data_)


if __name__ == "__main__":
    print(f"Avg students mark before adding a new student: {get_avg_students_mark()}")
    student_data = {"Name": "Pavlo", "Age": "20", "Mark": "90"}
    add_new_student(student_data)
    print(f"Avg students mark after adding a new student: {get_avg_students_mark()}")
