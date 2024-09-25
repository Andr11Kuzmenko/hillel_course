class Vector:

    def __init__(self, *points):
        self.points = points

    def __add__(self, other: "Vector") -> "Vector":
        cpy_self = Vector(self.points)
        tmp_calc = zip(cpy_self.points, other.points)
        cpy_self.points = list(map(lambda x: sum(x), tmp_calc))
        return cpy_self

    def __sub__(self, other: "Vector") -> "Vector":
        cpy_self = Vector(self.points)
        tmp_calc = zip(cpy_self.points, other.points)
        cpy_self.points = list(map(lambda x: x[0] - x[1], tmp_calc))
        return cpy_self

    def __mul__(self, other: "Vector") -> float | int:
        return self.get_len() * other.get_len()

    def get_len(self) -> float | int:
        return pow(sum(list(map(lambda x: x**2, self.points))), 0.5)

    def __lt__(self, other: "Vector") -> bool:
        return self.get_len() < other.get_len()

    def __eq__(self, other: "Vector") -> bool:
        return self.get_len() == other.get_len()

    def __gt__(self, other: "Vector") -> bool:
        return self.get_len() > other.get_len()

    def __le__(self, other: "Vector") -> bool:
        return self.get_len() <= other.get_len()

    def __ge__(self, other: "Vector") -> bool:
        return self.get_len() >= other.get_len()
