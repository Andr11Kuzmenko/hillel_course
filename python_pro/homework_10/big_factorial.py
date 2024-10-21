"""
Module to calculate the factorial of a number using multiprocessing.
"""

import math
import multiprocessing


def calculate_factorial_part(start: int, end: int, shared_memory: dict) -> None:
    """
    Computes the factorial of a range of numbers and stores the result in shared memory.
    :param start: The starting number for the factorial calculation.
    :param end: The ending number for the factorial calculation.
    :param shared_memory: A shared dictionary to store the partial factorial results.
    """
    res = 1
    for i in range(start, end + 1):
        res *= i
    shared_memory[start] = res


def calculate_factorial(factorial_to: int) -> int:
    """
    Calculates the factorial of a number by distributing the work across
    multiple CPU cores using multiprocessing.
    :param factorial_to: The number for which the factorial is to be calculated.
    :return: The calculated factorial of the given number.
    """
    num_of_cpus = multiprocessing.cpu_count() // 2
    per_cpu = math.ceil(factorial_to / num_of_cpus)
    manager = multiprocessing.Manager()
    shared_memory = manager.dict()
    processes = []
    for i in range(num_of_cpus):
        start = i * per_cpu + 1
        end = min(start + per_cpu - 1, factorial_to)
        processes.append(
            multiprocessing.Process(
                target=calculate_factorial_part,
                args=(start, end, shared_memory),
            )
        )
    for process in processes:
        process.start()
    for process in processes:
        process.join()
    res = 1
    for i in shared_memory.values():
        res *= i
    return res


if __name__ == "__main__":
    print(calculate_factorial(999))
