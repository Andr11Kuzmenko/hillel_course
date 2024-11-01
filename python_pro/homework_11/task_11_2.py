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


async def fetch_content(url: str) -> str | None:
    ssl_context = ssl.create_default_context(cafile=certifi.where())
    conn = aiohttp.TCPConnector(ssl=ssl_context)
    async with aiohttp.ClientSession(connector=conn) as session:
        response = await session.get(url)
        # try:
        #     response = await session.get(url)
        # except InvalidUrlClientError as err:
        #     logger.error(err)
        #     print(err)
        # else:
        #     return await response.text()
        return None


async def fetch_all(urls: list[str]) -> list[str | None]:
    tasks = []
    for url in urls:
        tasks.append(fetch_content(url))
    return await asyncio.gather(*tasks)

if __name__ == '__main__':
    # asyncio.run(fetch_all(urls=["https://www.google.com", "https://www.yahoo.com"]))
    print(asyncio.run(fetch_all(urls=[""])))