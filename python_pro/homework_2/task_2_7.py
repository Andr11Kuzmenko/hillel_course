total_expense = 0

class InvalidUserInputError(Exception):
    pass


def add_expense(current_expense: float | int):
    global total_expense
    total_expense += current_expense

def get_expense() -> float | int:
    return total_expense

def print_menu():
    print('Please choose your next action:')
    print('\t1. Add new expense')
    print('\t2. Show total expense')
    print('\t3. Exit', end='\n\n')


while True:
    print_menu()
    try:
        user_input = int(input('Enter your next action: '))

        if user_input < 1 or user_input > 3:
            raise InvalidUserInputError('Action not found')
        elif user_input == 1:
            expense = float(input('Enter your expense: '))
            add_expense(expense)
        elif user_input == 2:
            print(f'Total expense: {total_expense}')
        else:
            break
    except (TypeError, ValueError) as errors:
        print(errors)
        break
