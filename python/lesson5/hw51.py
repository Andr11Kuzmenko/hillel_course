import keyword
import string

SPEC_SYMBOLS = [9, 32]

input_str = input()

first_symbol = input_str[0] if len(input_str) else ''
res = keyword.iskeyword(input_str)
res = res or input_str.count('_') == len(input_str) and len(input_str) != 1
res = res or not input_str.islower()
res = res or first_symbol.isdigit()

for i in string.punctuation:
    res = res or i in input_str and i != '_'

for i in SPEC_SYMBOLS:
    res = res or chr(i) in input_str

print(not res)
