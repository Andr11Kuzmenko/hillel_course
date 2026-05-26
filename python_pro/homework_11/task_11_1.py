"""
This module demonstrates asynchronous downloading of multiple web pages using
Python's asyncio library.
"""

import asyncio
from random import randint


async def download_page(url: str) -> None:
    """
    Simulates the asynchronous downloading of a web page by introducing a random delay.
    :param url: The URL of the web page to "download".
    """
    delay = randint(1, 5)
    await asyncio.sleep(delay)
    print(f"Downloading {url} took {delay} seconds")


async def main(urls: list[str]) -> None:
    """
    Manages the asynchronous downloading of multiple URLs.
    :param urls: A list of URLs (as strings) to be "downloaded".
    """
    tasks = []
    for url in urls:
        tasks.append(download_page(url))
    await asyncio.gather(*tasks)


if __name__ == "__main__":
    asyncio.run(main(urls=["https://www.google.com", "https://www.yahoo.com"]))
