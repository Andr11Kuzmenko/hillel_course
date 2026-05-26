"""
Module for simulating the evolution of creatures in a resource-limited environment.
This module simulates a population of creatures that reproduce and die based on available food.
Creatures consume food, and those who survive are the ones that manage their
food consumption efficiently.
"""

import itertools
import multiprocessing
import time
from random import randint


class Creature:
    """
    Class representing a creature in the simulation.
    """

    def __init__(self, sex: int) -> None:
        self.sex = sex
        self.food_consumption = randint(1, 10)
        self.age = 0

    def create_a_generation(self) -> list["Creature"]:
        """
        Creates a new generation of creatures if the creature is of reproductive
        age (age > 3).
        :return: List of new creatures if the conditions for reproduction are met,
                empty list otherwise.
        """
        self.age += 1
        if not self.sex and self.age > 3:
            return [Creature(randint(0, 1)) for _ in range(randint(1, 5))]
        return []

    def __repr__(self) -> str:
        """
        Provides a string representation of the creature for display.
        :return: A string showing the creature's sex, age, and food consumption.
        """
        return f"Sex: {self.sex}; Age: {self.age}; Food Consumption: {self.food_consumption}"


def seed_food_and_kill_creatures(creatures) -> list[Creature]:
    """
    Simulates the process of food consumption and killing off creatures that have not survived.
    :param creatures: List of creatures to be processed (food consumption and age considered).
    :return: A list of creatures that survived the food shortage and are under 25 years old.
    """
    available_food = len(creatures) * randint(0, 12)
    consumed_food = 0
    c_index = 0
    for creature in creatures:
        consumed_food += creature.food_consumption
        if consumed_food >= available_food:
            break
        c_index += 1
    return list(filter(lambda c: c.age < 25, creatures[:c_index]))


def print_statistic(born: int, died: int, total_left: int) -> None:
    """
    Prints the statistics of the simulation after each cycle.
    :param born: Number of creatures born in the current cycle.
    :param died: Number of creatures that died in the current cycle.
    :param total_left: Total number of creatures that survived and are left at the end of the cycle.
    """
    print(
        f"""
    In {multiprocessing.current_process()}
        Were born {born} creatures
        {died} died
        {total_left} left
    """
    )


def evolve(creatures=None, first_run: bool = True) -> None:
    """
    Simulates the evolution process of creatures, including their reproduction,
    food consumption, and survival.
    The process runs recursively, evolving generations of creatures until no creatures are left.
    :param creatures: List of creatures currently in existence.
    :param first_run: Indicates whether this is the first run (used for initialization).
    """
    died = 0
    born = 0
    if not creatures and first_run:
        creatures = [Creature(1), Creature(0)]
    else:
        new_creatures = list(
            itertools.chain(*[creature.create_a_generation() for creature in creatures])
        )
        born = len(new_creatures)
        creatures.extend(new_creatures)
        died = len(creatures)
        creatures = sorted(creatures, key=lambda creature: creature.food_consumption)
        creatures = seed_food_and_kill_creatures(creatures)
        died -= len(creatures)
    print_statistic(born, died, len(creatures))
    if creatures:
        time.sleep(12)
        evolve(creatures, False)


def start_evolution_game() -> None:
    """
    Starts the evolution game by launching multiple processes for parallel execution.
    Uses multiprocessing to simulate evolution on multiple CPU cores.
    """
    num_of_cpu_to_use = multiprocessing.cpu_count() // 2
    for _ in range(num_of_cpu_to_use):
        multiprocessing.Process(target=evolve).start()


if __name__ == "__main__":
    start_evolution_game()
