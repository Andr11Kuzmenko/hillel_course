class Vector:

    def __init__(self, x: int, y: int):
        self.x = x
        self.y = y

    def __add__(self, other: "Vector") -> "Vector":
        cpy_self = Vector.create_vector_copy(self)
        cpy_self.x += other.x
        cpy_self.y += other.y
        return cpy_self

    def __sub__(self, other: "Vector") -> "Vector":
        cpy_self = Vector.create_vector_copy(self)
        cpy_self.x -= other.x
        cpy_self.y -= other.y
        return cpy_self

    def __mul__(self, num) -> "Vector":
        cpy_self = Vector.create_vector_copy(self)
        cpy_self.x *= num
        cpy_self.y *= num
        return cpy_self

    def __lt__(self, other: "Vector") -> bool:
        return self.get_len() < other.get_len()

    def __eq__(self, other: "Vector") -> bool:
        return self.get_len() == other.get_len()

    def __gt__(self, other: "Vector") -> bool:
        return self.get_len() > other.get_len()

    def __ge__(self, other: "Vector") -> bool:
        return self.get_len() >= other.get_len()

    def __le__(self, other: "Vector") -> bool:
        return self.get_len() <= other.get_len()

    def get_len(self) -> float | int:
        return pow(self.x**2 + self.y**2, 0.5)

    @staticmethod
    def create_vector_copy(vector_: "Vector") -> "Vector":
        return Vector(vector_.x, vector_.y)


vector1 = Vector(3, 4)
vector2 = Vector(1, 2)
vector3 = Vector(10, 10)
vector1_10 = vector1 * 10
assert vector1 + vector2 < Vector(5, 6), "Test1"
assert vector1_10.get_len() == 50, "Test2"
assert vector3 > vector2, "Test3"
print("OK")
