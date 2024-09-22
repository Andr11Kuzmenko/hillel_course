from typing import Callable
import time

def memoize(func: Callable):
    cache = {}

    def call_func(**kwargs):
        key = kwargs.get('num')

        if key in cache:
            return cache[key]

        func_res = func(**kwargs)
        cache.update({key: func_res})
        return func_res

    return call_func

def factorial(num: int):
    return 1 if num == 1 else num * factorial(num - 1)


memoized_factorial = memoize(factorial)
start_time = time.time()
memoized_factorial(num=800)
print(f'W/o cache: {time.time() - start_time}')

start_time = time.time()
memoized_factorial(num=800)
print(f'W/ cache: {time.time() - start_time}')
