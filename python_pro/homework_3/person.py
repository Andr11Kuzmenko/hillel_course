class Person:

    def __init__(self, name: str, age: int):
        self.name = name
        self.age = age

    def __eq__(self, other: "Person") -> bool:
        return self.age == other.age

    def __gt__(self, other: "Person") -> bool:
        return self.age > other.age

    def __lt__(self, other: "Person") -> bool:
        return self.age < other.age

    def __le__(self, other: "Person") -> bool:
        return self.age <= other.age

    def __ge__(self, other: "Person") -> bool:
        return self.age >= other.age

    def __repr__(self) -> str:
        return f"Name: {self.name}, Age: {self.age}"


def sort_people(people_: list[Person]) -> list:
    return sorted(people_, key=lambda person: person.age)


people = [
    Person("James Bill", 20),
    Person("Jason Lacoste", 40),
    Person("William Willson", 30),
    Person("Math Moonlight", 50),
    Person("Gaby Daby", 18),
]
print("Before sort", people)
people = sort_people(people)
print("After sort", people)
