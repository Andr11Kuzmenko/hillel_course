"""
This module generates sample data for products and client orders,
designed to simulate product inventory and order information.
"""

import random
from datetime import datetime, timedelta

products_by_categories = {
    "phone": [
        "iPhone 15 Pro Max",
        "iPhone 15 Plus",
        "iPhone 16 Pro Max",
        "iPhone 16 Pro",
        "iPhone 16 Plus",
    ],
    "laptop": [
        'MacBook 14" M1 Pro',
        'MacBook 16" M1 Max',
        "MacBook Air M2",
        'MacBook 16" M3 Max',
    ],
    "watch": [
        "Apple Watch Ultra",
        "Apple Watch Series 9",
    ],
}

first_names = ["john", "jane", "alex", "maria", "chris", "laura", "mike", "sarah"]
last_names = ["smith", "doe", "johnson", "brown", "williams", "jones", "miller"]
domains = ["gmail.com", "yahoo.com", "hotmail.com", "outlook.com", "example.com"]
phone_numbers = [
    "33333333333",
    "44444444444",
    "55555555555",
    "66666666666",
    "77777777777",
]


def generate_product_data(num_products: int = 11) -> list[dict]:
    """
    Generates a list of mock product data.
    :param num_products: The number of products to generate.
    :return: A list of dictionaries, each representing a product.
    """
    product_data = []
    for _id in range(1, num_products + 1):
        category_ = random.choice(list(products_by_categories.keys()))
        product_name_ = random.choice(list(products_by_categories[category_]))
        product = {
            "_id": _id,
            "name": product_name_,
            "price": random.randint(800, 3000),
            "quantity": random.randint(50, 500),
            "category": category_,
        }
        product_data.append(product)
    return product_data


def _generate_order_items(products: dict) -> list[dict]:
    """
    Generates a list of order items from the provided products.
    :param products: A dictionary of products where keys represent product IDs
                      and values are product details. The function randomly selects
                      product IDs from this dictionary to generate order items.
    :return: A list of dictionaries, each representing an order item.
    """
    order_items = []
    for _ in range(random.randint(3, 6)):
        product = {
            "product_id": random.choice(list(products.keys())),
            "quantity": random.randint(1, 5),
        }
        order_items.append(product)
    return order_items


def _generate_client_info() -> tuple[str, str]:
    """
    Generates random client information including a full name and an email address.
    :return: A tuple containing two strings:
            - The generated full name.
            - The generated email address.
    """
    first_name = random.choice(first_names)
    last_name = random.choice(last_names)
    full_name = f"{first_name} {last_name}"
    domain = random.choice(domains)
    email_address = f"{first_name}.{last_name}.{random.randint(1, 100)}@{domain}"
    return full_name, email_address


def generate_client_order_data(products: list, num_orders: int = 10) -> list[dict]:
    """
    Generates a list of mock client order data.
    :param products: A list of product dictionaries, each containing product details.
    :param num_orders: The number of client orders to generate.
    :return: A list of dictionaries, each representing an order.
    """
    products_by_id = {item["_id"]: item for item in products}
    order_data = []
    current_date = datetime.now()
    for _id in range(233200, 233200 + num_orders):
        client_name, client_email = _generate_client_info()
        client_info = {
            "name": client_name,
            "phone": random.choice(phone_numbers),
            "email": client_email,
        }
        order_items = _generate_order_items(products_by_id)
        total = sum(
            products_by_id[item["product_id"]]["price"] * item["quantity"]
            for item in order_items
        )
        days_ago = random.randint(0, 120)
        order_date = current_date - timedelta(days=days_ago)
        order = {
            "_id": _id,
            "client_info": client_info,
            "order_items": order_items,
            "total": total,
            "order_date": datetime(
                order_date.year, order_date.month, order_date.day, 0, 0, 0
            ),
        }
        order_data.append(order)
    return order_data
