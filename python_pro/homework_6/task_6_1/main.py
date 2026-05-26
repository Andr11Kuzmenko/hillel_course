import math_utils
import string_utils

assert math_utils.factorial(3) == 6, "Test 1"
assert math_utils.factorial(0) == 1, "Test 2"
assert math_utils.gcd(2, 1) == 1, "Test 3"
assert math_utils.gcd(20, 16) == 4, "Test 4"
assert string_utils.trim_spaces(" ABC some text ") == "ABC some text", "Test 5"
assert string_utils.to_uppercase("ABC some text") == "ABC SOME TEXT", "Test 6"
