class Rectangle:

    def __init__(self, width: int, height: int):
        self.width = width
        self.height = height

    def get_square(self) -> int:
        return self.width * self.height

    def __eq__(self, other: 'Rectangle') -> bool:
        return self.get_square() == other.get_square()

    def __add__(self, other: 'Rectangle') -> 'Rectangle':
        return Rectangle(1, self.get_square() + other.get_square())

    def __mul__(self, n: int) -> 'Rectangle':
        return Rectangle(self.width * n, self.height)

    def __str__(self) -> str:
        return f'Rectangle area: {self.get_square()}'


r1 = Rectangle(2, 4)
r2 = Rectangle(3, 6)
assert r1.get_square() == 8, 'Test1'
assert r2.get_square() == 18, 'Test2'

r3 = r1 + r2
assert r3.get_square() == 26, 'Test3'

r4 = r1 * 4
assert r4.get_square() == 32, 'Test4'

assert Rectangle(3, 6) == Rectangle(2, 9), 'Test5'
print('OK')
