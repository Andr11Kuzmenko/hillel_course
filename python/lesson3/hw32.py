lst = [1, 2, 4, 5]
lst = lst[-1:] + lst[:len(lst) - 1]
print(lst)
