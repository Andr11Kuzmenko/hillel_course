"""
This module asynchronously fetches content from multiple URLs using 'aiohttp' and handles
logging for potential errors. It includes functionality to validate SSL certificates and log
invalid URLs.
"""

import asyncio
import logging
import ssl

import aiohttp
import certifi
from aiohttp import InvalidUrlClientError

logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
    handlers=[logging.FileHandler("logs.log")],
)
logger = logging.getLogger(__name__)


async def fetch_content(url: str) -> str:
    """
    Asynchronously fetches the HTML content of a specified URL with SSL certificate validation.
    :param url: The URL of the web page to fetch.
    :return: The HTML content of the page if the request is successful; otherwise, an error message.
    """
    ssl_context = ssl.create_default_context(cafile=certifi.where())
    conn = aiohttp.TCPConnector(ssl=ssl_context)
    async with aiohttp.ClientSession(connector=conn) as session:
        try:
            response = await session.get(url)
            return await response.text()
        except InvalidUrlClientError:
            msg = f"Invalid URL: {url}"
            logger.error(msg)
            return msg


async def fetch_all(urls: list[str]) -> list[str]:
    """
    Asynchronously fetches the content of multiple URLs.
    :param urls: A list of URLs to fetch content from.
    :return: A list of strings, where each string is the HTML content of a URL or
            an error message if the URL is invalid.
    """
    tasks = []
    for url in urls:
        tasks.append(fetch_content(url))
    return await asyncio.gather(*tasks)


if __name__ == "__main__":
    res1, res2, res3 = asyncio.run(
        fetch_all(
            urls=["https://www.google.com", "https://www.yahoo.com", "tttttt.com"]
        )
    )
    print(res3)
