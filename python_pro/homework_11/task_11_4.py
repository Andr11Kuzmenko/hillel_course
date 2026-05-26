"""
Asynchronous Timeout Example Module
"""

import asyncio


async def slow_task() -> None:
    """
    Simulates a long-running asynchronous task.
    """
    await asyncio.sleep(10)


async def main() -> None:
    """
    Main entry point for the asynchronous task execution.
    This function attempts to execute the slow_task function
    with a timeout of 5 seconds. If the slow_task does not
    complete within the specified timeout, an asyncio.TimeoutError
    is raised, which is caught and handled by printing a message
    to indicate the timeout occurrence.
    """
    try:
        await asyncio.wait_for(slow_task(), timeout=5)
    except TimeoutError:
        print("Timed out")


if __name__ == "__main__":
    asyncio.run(main())
