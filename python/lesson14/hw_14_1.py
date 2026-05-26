class GroupException(Exception):
    pass


class Human:

    def __init__(self, gender: str, age: int, first_name: str, last_name: str):
        self.gender = gender
        self.age = age
        self.first_name = first_name
        self.last_name = last_name

    def __str__(self) -> str:
        return f'First Name: {self.first_name}\nLast Name: {self.last_name}\nAge: {self.age}\nGender: {self.gender}'


class Student(Human):

    def __init__(self, gender: str, age: int, first_name: str, last_name: str, record_book: str):
        super().__init__(gender, age, first_name, last_name)
        self.record_book = record_book

    def __str__(self) -> str:
        return f'{super().__str__()}\nCode: {self.record_book}'


class Group:

    def __init__(self, number: str):
        self.number = number
        self.group = set()

    def add_student(self, student: Student):
        if len(self.group) == 10:
            raise GroupException('Too many students in the group')
        self.group.add(student)

    def delete_student(self, last_name: str):
        student = self.find_student(last_name)

        if student:
            self.group.discard(student)

    def find_student(self, last_name: str) -> Student | None:
        filtered_by_last_name = list(filter(lambda x: x.last_name == last_name, self.group))
        return filtered_by_last_name[0] if filtered_by_last_name else None

    def __str__(self) -> str:
        all_students = '\n\n'.join(str(student) for student in self.group)
        return f'Number:{self.number}\n{all_students} '


group = Group('KI12')

try:
    for i in range(11):
        group.add_student(Student('Male', 18, 'Ivan', 'Ivanov', f'KI12-{i}'))
except GroupException as ge:
    print(ge)
except:
    print('Other issues')
finally:
    print(group)
