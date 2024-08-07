DIVIDER = 10

num = int(input())
res = 0

res = res * DIVIDER + num % DIVIDER
num //= DIVIDER

res = res * DIVIDER + num % DIVIDER
num //= DIVIDER

res = res * DIVIDER + num % DIVIDER
num //= DIVIDER

res = res * DIVIDER + num % DIVIDER
num //= DIVIDER

res = res * DIVIDER + num % DIVIDER
num //= DIVIDER

print(res)