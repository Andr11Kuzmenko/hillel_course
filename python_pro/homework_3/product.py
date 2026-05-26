class PriceDescriptor:

    def __set__(self, instance, value):
        if value < 0:
            raise ValueError('Price cannot be negative')
        self.value = value

    def __get__(self, instance, owner):
        return self.value


class CurrencyDescriptor:

    def __set__(self, instance, value):
        if value not in ['USD', 'EUR']:
            raise ValueError('Currency must be either USD or EUR')
        self.value = value

    def __get__(self, instance, owner):
        return self.value


class Product:

    def __init__(self, name: str, price):
        self._name = name
        self._price = price


class ProductWithGetSet(Product):

    def get_price(self) -> float:
        return self._price

    def set_price(self, price: float):
        if price < 0:
            raise ValueError('Price cannot be negative')
        self._price = price


class ProductWithProperty(Product):

    @property
    def price(self) -> float:
        return self._price

    @price.setter
    def price(self, price: float):
        if price < 0:
            raise ValueError('Price cannot be negative')
        self._price = price


class ProductWithDescriptor:
    currency = CurrencyDescriptor()
    price = PriceDescriptor()

    def __init__(self, name: str, price, currency: str):
        self._name = name
        self.price = price
        self.currency = currency


product1 = ProductWithGetSet('Product1', 10.50)
product2 = ProductWithProperty('Product2', 89.20)
product3 = ProductWithDescriptor('Product3', 20, 'USD')

product1.set_price(2)
product2.price = 3
product3.price = 4
try:
    product1.set_price(-1)
except ValueError as ve:
    print('Product1', ve)
try:
    product2.price = -1
except ValueError as ve:
    print('Product2', ve)
try:
    product3.price = -1
except ValueError as ve:
    print('Product3', ve)
try:
    product3.currency = 'GBP'
except ValueError as ve:
    print('Product3', ve)
