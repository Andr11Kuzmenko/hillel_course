def is_palindrome(text: str) -> bool:
    alnum_text = ''.join(n for n in text if n.isalnum()).lower()
    return alnum_text == alnum_text[::-1]


assert is_palindrome('A man, a plan, a canal: Panama') == True, 'Test1'
assert is_palindrome('0P') == False, 'Test2'
assert is_palindrome('a.') == True, 'Test3'
assert is_palindrome('aurora') == False, 'Test4'
print("ОК")
