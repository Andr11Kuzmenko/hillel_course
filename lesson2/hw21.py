DIVIDER = 10

num = int(input())

d, m3 = divmod(num, DIVIDER)
d, m2 = divmod(d, DIVIDER)
d, m1 = divmod(d, DIVIDER)
d, m0 = divmod(d, DIVIDER)

print(m0)
print(m1)
print(m2)
print(m3)