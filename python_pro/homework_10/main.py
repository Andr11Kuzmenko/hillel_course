"""
This module handles some operations using concurrent and parallel
programming techniques such as threading and multiprocessing.
"""

import math
import multiprocessing
from concurrent.futures.thread import ThreadPoolExecutor
from pathlib import Path

import requests
from PIL import Image

import settings
from python_pro.homework_5.resources import pictures


def download_file(file_path: str) -> None:
    """
    Downloads a file from the provided URL and saves it to the current working directory.
    :param file_path: The URL of the file to be downloaded.
    """
    response = requests.get(file_path, timeout=120)
    if response.status_code == 200:
        file_name = file_path.split("/")[-1]
        with open(f"results/{file_name}", "wb") as f:
            f.write(response.content)


def download_files() -> None:
    """
    Downloads multiple files concurrently using threading.
    """
    with ThreadPoolExecutor(max_workers=3) as executor:
        futures = [
            executor.submit(download_file, file_path)
            for file_path in settings.FILES_PATH
        ]
        for f in futures:
            f.result()


def adjust_image(image_path: str) -> None:
    """
    Resizes an image to 500x500 pixels, rotates it 90 degrees clockwise, and saves the result.
    :param image_path: The path to the image file to adjust.
    """
    with Image.open(image_path) as image:
        image = image.resize((500, 500))
        image = image.rotate(90)
        image.save(f'results/{image_path.split("/")[-1]}')


def adjust_images() -> None:
    """
    Adjusts all images in the pictures directory concurrently by resizing and rotating them.
    Processes files using a ThreadPoolExecutor with up to 4 threads.
    """
    path = Path(
        f"{Path().parent.absolute().parent.absolute().parent.absolute()}"
        f"/{pictures.__name__.replace('.', '/')}"
    )
    with ThreadPoolExecutor(max_workers=4) as executor:
        futures = [executor.submit(adjust_image, str(p)) for p in path.iterdir()]
        for f in futures:
            f.result()


def summarize_array_part(
    array_: list, size_per_cpu: int, current_cpu_num: int, ret_dict: dict
) -> None:
    """
    Summarizes a part of the array based on the CPU chunk assigned and stores
    the result in the shared dictionary.
    :param array_: The full array to be processed.
    :param size_per_cpu: The size of the array to be processed.
    :param current_cpu_num: The index of the current CPU (used to calculate the chunk of the array).
    :param ret_dict: A shared dictionary to store the sum result for each CPU.
    """
    last_element = min(len(array_), (current_cpu_num + 1) * size_per_cpu)
    ret_dict[current_cpu_num] = sum(
        array_[size_per_cpu * current_cpu_num: last_element]
    )


def summarize_array() -> int:
    """
    Summarizes a large array by dividing the work across multiple CPUs using multiprocessing.
    :return: The total sum of all the elements in the array.
    """
    array_ = list(range(99999999))
    num_of_cpu_to_use = multiprocessing.cpu_count() // 2
    size_per_cpu = math.ceil(len(array_) / num_of_cpu_to_use)
    processes = []
    manager = multiprocessing.Manager()
    ret_dict = manager.dict()
    for current_cpu in range(num_of_cpu_to_use):
        process = multiprocessing.Process(
            target=summarize_array_part,
            args=(array_, size_per_cpu, current_cpu, ret_dict),
        )
        processes.append(process)
    for process in processes:
        process.start()
    for process in processes:
        process.join()
    return sum(ret_dict.values())


if __name__ == "__main__":
    # download_files()
    adjust_images()
    # print(summarize_array())
