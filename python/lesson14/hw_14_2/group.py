class Group:

    def __init__(self, number: str):
        self.number = number
        self.group = set()

    def add_student(self, student):
        self.group.add(student)

    def delete_student(self, last_name: str):
        student = self.find_student(last_name)

        if student:
            self.group.discard(student)

    def find_student(self, last_name: str):
        filtered_by_last_name = list(filter(lambda x: x.last_name == last_name, self.group))
        return filtered_by_last_name[0] if filtered_by_last_name else None

    def __str__(self) -> str:
        all_students = '\n\n'.join(str(student) for student in self.group)
        return f'Number:{self.number}\n{all_students} '
