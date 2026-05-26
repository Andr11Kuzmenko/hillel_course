import xml.etree.ElementTree as ET


def print_product_info(file_path: str = "files/task_6_5.xml") -> None:
    """
    Finds all products in an XML file and prints their name and quantity.
    :param file_path: The file path of the XML file.
    """
    tree = ET.parse(file_path)
    root = tree.getroot()
    for product in root:
        print(f"{product.find('name').text}: {product.find('quantity').text}")


def change_product_quantity(
    product_info_: dict, file_path: str = "files/task_6_5.xml"
) -> None:
    """
    Finds a product in an XML file by its name and updates its quantity.
    :param product_info_: A dictionary containing the product's name and the new quantity to update.
                            The dictionary should have the following structure:
                            - "name" (str): The name of the product to update.
                            - "quantity" (str): The new quantity value to set for the product.
    :param file_path: The file path of the XML file containing product information.
    """
    tree = ET.parse(file_path)
    root = tree.getroot()
    for product in root:
        if product.find("name").text == product_info_["name"]:
            product.find("quantity").text = product_info_["quantity"]
    with open(file_path, "r+") as file:
        file.write(ET.tostring(root).decode())


if __name__ == "__main__":
    print_product_info()
    change_product_quantity({"name": "iPhone 16", "quantity": "100"})
    print()
    print_product_info()
