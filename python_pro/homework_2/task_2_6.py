def create_calculator(operation: str):

    def calculate(operand1: float | int, operand2: float | int) -> float | int:
        return eval(f"{operand1}{operation}{operand2}")

    return calculate


add_operation = create_calculator("+")
sub_operation = create_calculator("-")
mul_operation = create_calculator("*")

assert add_operation(2, 3) == 5, "Test 1"
assert add_operation(-10, 3.3) == -6.7, "Test 2"
assert sub_operation(1, 0) == 1, "Test 3"
assert sub_operation(-1, -5) == 4, "Test 4"
assert mul_operation(1, 0) == 0, "Test 5"
assert mul_operation(10, 2) == 20, "Test 6"
print("OK")
