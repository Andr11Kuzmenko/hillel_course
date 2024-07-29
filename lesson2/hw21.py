num = int(input())
arr = []

while num > 0:
    arr.append(num % 10)
    num //= 10

arr.reverse()

for i in arr:
    print(i)
