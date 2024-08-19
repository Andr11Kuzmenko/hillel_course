user_input = int(input())

result = user_input

while result > 9:
    tmp = result
    result = 1

    while tmp > 0 and result > 0:
        result *= tmp % 10
        tmp //= 10

print(result)
