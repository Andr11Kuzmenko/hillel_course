num = int(input())
res = 0

while num > 0:
    res += num % 10 * pow(10, len(str(num)) - 1)
    num //= 10

print(res)
