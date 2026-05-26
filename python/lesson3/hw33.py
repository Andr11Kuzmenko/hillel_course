import math

lst = [1, 2, 3]
mid = math.ceil(len(lst)/2)
lst = [lst[:mid], lst[mid:]]
print(lst)
