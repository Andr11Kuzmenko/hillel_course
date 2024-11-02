"""
This module provides an asynchronous solution for downloading images from specified URLs.
"""

import asyncio
import ssl

import aiofiles
import aiohttp
import certifi


async def download_image(url: str, file_name: str) -> None:
    """
    Asynchronously downloads an image from a specified URL and saves it to a local file.
    :param url: The URL of the image to download.
    :param file_name: The name of the file (including extension) to save the downloaded image as.
    """
    ssl_context = ssl.create_default_context(cafile=certifi.where())
    conn = aiohttp.TCPConnector(ssl=ssl_context)
    async with aiohttp.ClientSession(connector=conn) as session:
        response = await session.get(url)
        if response.status == 200:
            async with aiofiles.open(f"images/{file_name}", "wb") as f:
                await f.write(await response.read())


async def main(images_: list[dict]) -> None:
    """
    Orchestrates the downloading of multiple images concurrently.
    :param images_: A list of dictionaries where each dictionary contains:
                    - "url": The URL of the image to download.
                    - "file_name": The name of the file to save the downloaded image as.
    """
    tasks = []
    for image_description in images_:
        tasks.append(
            download_image(image_description["url"], image_description["file_name"])
        )
    await asyncio.gather(*tasks)


if __name__ == "__main__":
    images = [
        {
            "url": "https://cdn.pixabay.com/photo/2024/05/26/10/15/bird-8788491_1280.jpg",
            "file_name": "bird.jpg",
        },
        {
            "url": "https://gratisography.com/wp-content/uploads/2024/10/gratisography-cool-cat-800x525.jpg",
            "file_name": "cat.jpg",
        },
        {
            "url": "https://c02.purpledshub.com/uploads/sites/48/2024/03/ngc-604-webb-hero.jpg",
            "file_name": "space.jpg",
        },
    ]
    asyncio.run(main(images))
