"""
This module demonstrates an asynchronous producer-consumer pattern using an 'asyncio.Queue'.
"""

import asyncio


async def producer(queue: asyncio.Queue) -> None:
    """
    Asynchronously produces items and places them into a queue.
    :param queue: The queue where items are placed for the consumer to retrieve.
    """
    for i in range(6):
        await asyncio.sleep(1)
        await queue.put(i)


async def consumer(queue: asyncio.Queue) -> None:
    """
    Asynchronously consumes items from a queue until a stopping condition is met.
    :param queue: The queue from which items are consumed.
    """
    while True:
        item = await queue.get()
        if item > 4:
            break
        print(f"Queue item: {item}")
        queue.task_done()


async def main() -> None:
    """
    Coordinates the producer and consumer coroutines using an asynchronous queue.
    """
    queue = asyncio.Queue()  # type: asyncio.Queue
    await asyncio.gather(producer(queue), consumer(queue))


if __name__ == "__main__":
    asyncio.run(main())
