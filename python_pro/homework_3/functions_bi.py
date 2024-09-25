from functools import reduce


def len(object_) -> int:
    return object_.__len__()


def sum(iterable_, start_: int = 0) -> float | int:
    return reduce(lambda x, y: x + y, iterable_[start_:])


def min(*iterable_) -> int | float:
    to_process = iterable_[0] if iterable_.__len__() == 1 else iterable_
    return reduce(lambda x, y: x if x < y else y, to_process)


arr = [1, 2, 3, 4, 5, 6]
tpl = (2, 3, 1, 4)
assert len(arr) == 6, "Test 1"
assert sum(arr) == 21, "Test 2"
assert sum(arr, 3) == 15, "Test 3"
assert min(arr) == 1, "Test 4"
assert len(tpl) == 4, "Test 5"
assert sum(tpl) == 10, "Test 6"
assert sum(tpl, 2) == 5, "Test 7"
assert min(tpl) == 1, "Test 8"
assert min(1, 2, 3, 4, 5) == 1, "Test 8"
print("OK")
