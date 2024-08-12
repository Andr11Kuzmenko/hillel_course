import string

init_str = input()

cpy_str = ''.join([n for n in init_str if n not in string.punctuation])
cpy_str = f'#{cpy_str.title().replace(' ', '')}'
cpy_str = cpy_str if len(cpy_str) <= 140 else cpy_str[:139]

print(cpy_str)
