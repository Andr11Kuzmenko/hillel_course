discount = 0.1
additional_discount = 0.02


def create_order(
    price: float | int, additional_discount_allowed: bool = False
) -> float | int:

    def apply_additional_discount():
        nonlocal price
        price *= 1 - additional_discount

    price *= 1 - discount
    if additional_discount_allowed:
        apply_additional_discount()
    return price


assert create_order(1000) == 900, "Test 1"
assert create_order(1000, True) == 882, "Test 2"
print("OK")
