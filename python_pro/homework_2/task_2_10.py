def create_product(product_name: str, product_price: float | int, product_quantity: int):

    def change_product_price(product_price_to_set: float | int = None):
        nonlocal product_price
        if product_price_to_set:
            product_price = product_price_to_set
        else:
            return product_name, product_price, product_quantity

        return None

    return change_product_price


product_monitor = create_product('Monitor', 100, 5)
product_monitor(210)

assert product_monitor() == ('Monitor', 210, 5), 'Test 1'
print('OK')
