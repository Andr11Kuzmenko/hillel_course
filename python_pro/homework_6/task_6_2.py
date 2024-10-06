import logging
import requests
from requests.exceptions import InvalidURL, MissingSchema, ConnectionError, Timeout

URL = "https://www.google.com"

logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
    handlers=[logging.FileHandler("files/task_6_2.log"), logging.StreamHandler()],
)
logger = logging.getLogger(__name__)


def get_page_content(url: str) -> str | None:
    """
    Sends an HTTP GET request to the specified URL and returns the content of the page as a string.
    :param url: The URL of the web page to be fetched.
    :return: The content of the page in string format.
    """
    try:
        response = requests.get(url)
        return response.content.decode()
    except MissingSchema as missing_url_schema_error:
        logger.error(missing_url_schema_error)
    except InvalidURL as invalid_url_error:
        logger.error(invalid_url_error)
    except ConnectionError as connection_error:
        logger.error(connection_error)
    except Timeout as timeout_error:
        logger.error(timeout_error)
    return None


def save_data_to_xml_file(data: str, file_path: str = "files/task_6_2.xml") -> None:
    """
    Saves the given data to an XML file at the specified file path.
    :param data: The data to be saved.
    :param file_path: The file path where the XML content will be saved.
    """
    with open(file_path, "w", encoding="utf-8") as file:
        file.write(data)


if __name__ == "__main__":
    page_content = get_page_content(URL)

    if page_content:
        save_data_to_xml_file(page_content)
