import string

user_input = input()

start = string.ascii_letters.find(user_input[0])
end = string.ascii_letters.find(user_input[-1])

result = string.ascii_letters[start:end + 1]

print(result)
