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

    def __hash__(self) -> int:
        return hash(str(self))

    def __eq__(self, other) -> bool:
        return self.last_name == other.last_name and self.first_name == other.first_name and \
            self.gender == other.gender and self.age == other.age and self.record_book == self.record_book
