first_run = True

while first_run or input('Do you want to continue? ') == 'y':
    first_run = False

    num1 = float(input('Enter 1st number: '))
    operation = input('Enter an operation to perform: ')
    num2 = float(input('Enter 2nd number: '))

    if operation == '+':
        print(num1 + num2)
    elif operation == '-':
        print(num1 - num2)
    elif operation == '*':
        print(num1 * num2)
    elif operation == '/':
        if num2 == 0:
            print('Divider should not equal 0')
        else:
            print(num1 / num2)
    else:
        print('Invalid operation')
