"""
This module interacts with a MongoDB database to manage products and orders.
"""

from datetime import timedelta, datetime

import certifi
from pymongo import MongoClient
from pymongo.synchronous.collection import Collection
from pymongo.synchronous.command_cursor import CommandCursor
from pymongo.synchronous.cursor import Cursor

import sample_data
import settings


def create_data(
    orders_collection_: Collection, products_collection_: Collection
) -> None:
    """
    Generates sample product and client order data and inserts it into
    the given MongoDB collections.
    :param orders_collection_: A MongoDB collection where the generated client orders
                                will be inserted.
    :param products_collection_: A MongoDB collection where the generated product data
                                will be inserted.
    """
    products_ = sample_data.generate_product_data()
    orders_ = sample_data.generate_client_order_data(products_)
    products_collection_.insert_many(products_)
    orders_collection_.insert_many(orders_)


def get_orders(orders_collection_: Collection) -> Cursor:
    """
    Retrieves all orders from the specified collection that were placed in the last 30 days.
    :param orders_collection_: The MongoDB collection containing order documents.
    :return: A MongoDB Cursor object containing the documents that match the query.
    """
    return orders_collection_.find(
        {"order_date": {"$gte": datetime.now() - timedelta(days=30)}}
    )


def update_product(products_collection_: Collection) -> None:
    """
    Updates the quantity of a product in the provided MongoDB collection.
    :param products_collection_: The MongoDB collection object containing
                                the product documents to be updated.
    """
    query_filter = {"_id": 2}
    update_operation = {"$set": {"quantity": 180}}
    products_collection_.update_one(query_filter, update_operation)


def delete_products(products_collection_: Collection) -> None:
    """
    Deletes all products from the provided MongoDB collection where the quantity is 0.
    :param products_collection_: The MongoDB collection object containing
                                the product documents to be deleted.
    """
    query_filter = {"quantity": 0}
    products_collection_.delete_many(query_filter)


def create_index(products_collection_: Collection) -> None:
    """
    Creates an index on the 'category' field of the given MongoDB collection.
    :param products_collection_: The MongoDB collection on which
                                the index should be created.
    """
    products_collection_.create_index("category")


def calculate_sold_products(orders_collection_: Collection) -> CommandCursor:
    """
    Calculates the total number of products sold in the past 30 days from
    the given orders collection.
    :param orders_collection_: The MongoDB collection containing order documents.
    :return: The result of the aggregation pipeline, which contains the total number
            of products sold.
    """
    pipeline = [
        {"$unwind": "$order_items"},
        {"$match": {"order_date": {"$gte": datetime.now() - timedelta(days=30)}}},
        {"$group": {"_id": None, "total_sold": {"$sum": "$order_items.quantity"}}},
        {"$unset": ["_id"]},
    ]
    return orders_collection_.aggregate(pipeline)  # type: ignore


def get_sum_per_client(orders_collection_: Collection) -> CommandCursor:
    """
    Calculates the total amount spent by each client on products from the orders collection.
    :param orders_collection_: The MongoDB collection containing the order documents.
    :return: The result of the aggregation pipeline, which contains the total amount
            spent by each client.
    """
    pipeline = [
        {"$unwind": "$order_items"},
        {
            "$lookup": {
                "from": "products",
                "localField": "order_items.product_id",
                "foreignField": "_id",
                "as": "products",
            }
        },
        {"$unwind": "$products"},
        {
            "$group": {
                "_id": {
                    "client_id": "$client_info.email",
                    "product_id": "$order_items.product_id",
                },
                "client_id": {"$first": "$client_info.email"},
                "product_price": {"$first": "$products.price"},
                "total_sold": {"$sum": "$order_items.quantity"},
            }
        },
        {
            "$project": {
                "client_id": 1,
                "total_sold": {"$multiply": ["$total_sold", "$product_price"]},
            }
        },
        {"$group": {"_id": "$client_id", "total_sold": {"$sum": "$total_sold"}}},
    ]
    return orders_collection_.aggregate(pipeline)  # type: ignore


if __name__ == "__main__":
    with MongoClient(
        settings.MONGO_HOST, tlsCAFile=certifi.where()
    ) as cluster:  # type: MongoClient
        shop_db = cluster["shop"]
        products_collection = shop_db["products"]
        orders_collection = shop_db["orders"]
        create_data(orders_collection, products_collection)
        for orders in get_orders(orders_collection):
            print(orders)
        update_product(products_collection)
        delete_products(products_collection)
        create_index(products_collection)
        for sold_product in calculate_sold_products(orders_collection):
            print(sold_product)
        for sum_of_products in get_sum_per_client(orders_collection):
            print(sum_of_products)
