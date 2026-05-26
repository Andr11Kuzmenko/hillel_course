class Price:

    def __init__(self, price: int | float):
        self.price = price

    def __add__(self, other) -> "Price":
        cpy_self = Price(self.price)
        cpy_self.price += Price.get_price_value(other)
        return cpy_self

    def __sub__(self, other) -> "Price":
        cpy_self = Price(self.price)
        cpy_self.price -= Price.get_price_value(other)
        return cpy_self

    def __eq__(self, other) -> bool:
        return self.price == Price.get_price_value(other)

    def __lt__(self, other) -> bool:
        return self.price < Price.get_price_value(other)

    def __gt__(self, other) -> bool:
        return self.price > Price.get_price_value(other)

    def __ge__(self, other) -> bool:
        return self.price >= Price.get_price_value(other)

    def __le__(self, other) -> bool:
        return self.price <= Price.get_price_value(other)

    def to_precision_2(self):
        self.price = round(self.price, 2)

    @staticmethod
    def get_price_value(other_) -> int | float:
        return other_.price if isinstance(other_, Price) else other_


price1 = Price(10)
price2 = price1 + 20
price3 = price1 + price2
assert price2 > price1, "Test 1"
assert price3 == price1 + price2, "Test 2"
print("OK")
