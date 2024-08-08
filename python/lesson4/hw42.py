# realization 1
lst = []
res = sum(lst[::2]) * lst[-1] if len(lst) else 0
print(res)

# realization 2
lst2 = [2, 3, 4]
res = 0

for i in lst2[::2]:
    res += i

res *= lst2[-1] if len(lst2) else 0
print(res)

