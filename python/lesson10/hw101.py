from inspect import isgenerator
from typing import Callable, Generator

def pow(x: int | float) -> int | float:
    return x ** 2


def some_gen(begin: int | float, end: int, func: Callable) -> Generator[int | float, int, int | float]:
    for x in range(end):
        yield begin
        begin = func(begin)


gen = some_gen(2, 4, pow)

assert isgenerator(gen) == True, 'Test1'
assert list(gen) == [2, 4, 16, 256], 'Test2'
print('OK')
