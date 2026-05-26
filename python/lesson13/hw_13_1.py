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


st1 = Student('Male', 30, 'Steve', 'Jobs', 'AN142')
st2 = Student('Female', 25, 'Liza', 'Taylor', 'AN145')
print(st1, end='\n--------------------------\n')
gr = Group('PD1')
gr.add_student(st1)
gr.add_student(st2)
print(gr, end='\n--------------------------\n')
assert str(gr.find_student('Jobs')) == str(st1), 'Test1'
assert gr.find_student('Jobs2') is None, 'Test2'
assert isinstance(gr.find_student('Jobs'), Student) is True, 'Метод поиска должен возвращать экземпляр'

gr.delete_student('Taylor')
print(gr, end='\n--------------------------\n')  # Only one student

gr.delete_student('Taylor')  # No error!
