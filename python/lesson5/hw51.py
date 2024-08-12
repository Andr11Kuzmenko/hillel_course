import keyword
import string

SPEC_SYMBOLS = [9, 32]

input_str = input()

first_symbol = input_str[0] if input_str else ''
negative_result = keyword.iskeyword(input_str)
negative_result = negative_result or input_str.count('_') == len(input_str) and len(input_str) != 1
negative_result = negative_result or not input_str.islower()
negative_result = negative_result or first_symbol.isdigit()

for i in string.punctuation:
    negative_result = negative_result or i in input_str and i != '_'

for i in SPEC_SYMBOLS:
    negative_result = negative_result or chr(i) in input_str

print(not negative_result)
