import random

lst = [random.randint(0, 100) for _ in range(random.randint(3, 10))]
print('Initial list', lst.copy())
lst = [lst[0], lst[2], lst[-2]]
print('Result', lst)
