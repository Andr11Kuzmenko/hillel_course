import builtins

numbers = [1, 2, 3, 4, 5]
print(sum(numbers))


def sum() -> str:
    return "This is my custom sum function!"


print(sum())
print(builtins.sum(numbers))
