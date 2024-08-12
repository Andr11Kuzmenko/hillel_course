import string

init_str = input()

cpy_str = ''.join([n for n in init_str if n not in string.punctuation])
cpy_str = f'#{cpy_str.title().replace(' ', '')}'[:139]

print(cpy_str)
