lst = [0, 0, 1, 2, 0, 3, 0]
lst = [n for n in lst if n != 0] + [0] * lst.count(0)
print(lst)
