"""
This module demonstrates various methods for making HTTP requests in Python, including
synchronous and asynchronous approaches, as well as threading and multiprocessing.
"""

import asyncio
import time
from concurrent.futures.process import ProcessPoolExecutor
from concurrent.futures.thread import ThreadPoolExecutor
from typing import Callable

import aiohttp
import requests
from fake_useragent import UserAgent  # type: ignore


def time_checker(func: Callable):
    """
    A decorator that measures the execution time of a function.
    :param func: The function to be decorated.
    :return: A wrapper function that executes the original function and prints
            its execution time.
    """

    def wrapper():
        start = time.time()
        func()
        end = time.time()
        print(f"Function: {func.__name__}")
        print(f"Execution time: {end - start}")

    return wrapper


def make_request() -> None:
    """
    Makes a synchronous HTTP GET request to 'http://www.google.com'.
    """
    requests.get(
        "http://www.google.com", timeout=10, headers={"User-Agent": UserAgent().random}
    )


@time_checker
def main_threading() -> None:
    """
    Executes 500 HTTP GET requests to 'http://www.google.com' using a thread pool.
    """
    with ThreadPoolExecutor(max_workers=10) as executor:
        futures = [executor.submit(make_request) for _ in range(500)]
        for future in futures:
            future.result()


@time_checker
def main_multiprocessing() -> None:
    """
    Executes 500 HTTP GET requests to 'http://www.google.com' using multiple processes.
    """
    with ProcessPoolExecutor() as executor:
        futures = [executor.submit(make_request) for _ in range(500)]
        for future in futures:
            future.result()


@time_checker
def mail_sync() -> None:
    """
    Executes 50 synchronous HTTP GET requests to 'http://www.google.com'.
    """
    for _ in range(50):
        make_request()


async def make_async_request(session: aiohttp.ClientSession) -> None:
    """
    Asynchronously executes an HTTP GET request to 'http://www.google.com'.
    :param session: An active session instance to manage and
                    perform the HTTP request.
    """
    await session.get(
        "http://www.google.com", headers={"User-Agent": UserAgent().random}
    )


async def main_async() -> None:
    """
    Executes 500 asynchronous HTTP GET requests to 'http://www.google.com'.
    """
    async with aiohttp.ClientSession() as session:
        tasks = [make_async_request(session) for _ in range(500)]
        await asyncio.gather(*tasks)


if __name__ == "__main__":
    main_threading()
    main_multiprocessing()
    mail_sync()
    start_time = time.time()
    asyncio.run(main_async())
    print("Function: main_async")
    print(f"Execution time: {time.time() - start_time}")
