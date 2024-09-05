from inspect import isgenerator
from typing import Generator


def is_prime(num: int) -> bool:
    for i in range(2, num):
        if not num % i:
            return False
    return True


def prime_generator(end: int) -> Generator[int, None, None]:
    for i in range(2, end + 1):
        if is_prime(i):
            yield i


gen = prime_generator(1)

assert isgenerator(gen) == True, 'Test0'
assert list(prime_generator(10)) == [2, 3, 5, 7], 'Test1'
assert list(prime_generator(15)) == [2, 3, 5, 7, 11, 13], 'Test2'
assert list(prime_generator(29)) == [2, 3, 5, 7, 11, 13, 17, 19, 23, 29], 'Test3'
print('Ok')
