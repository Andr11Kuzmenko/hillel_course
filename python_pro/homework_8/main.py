"""
This module serves as the main interface for a console-based movie database
application. It allows users to interact with a database of movies and actors.
"""

import logging
from datetime import datetime
from typing import Callable

import dao  # type: ignore
import settings  # type: ignore
from python_pro.homework_8.user_interface import UserInterface as ui

logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S",
    handlers=[logging.FileHandler("logs.log")],
)
logger = logging.getLogger(__name__)

NOT_SELECTED_ACTION_MSG = "Action has not been selected"


def __validate_year(year: str) -> bool:
    """
    Validate a given year.
    This function checks if the provided year is a numeric string,
    and ensures that it falls within a valid range (between 1900
    and the current year).
    :param year: A string representing the year to be validated.
    :return: True if the year is valid; False otherwise.
    """
    if not year or not year.isnumeric():
        return False
    year_int = int(year)
    if year_int < 1900 or year_int > int(datetime.now().year):
        return False
    return True


def show_movies_w_actors() -> None:
    """
    Display movies along with their associated actors.
    """
    movies = {}  # type: dict[str, list[str]]
    for movie_cast in dao.get_movies_w_actors():
        if movies.get(movie_cast[0]):
            movies[movie_cast[0]].append(movie_cast[1])
        else:
            movies[movie_cast[0]] = [movie_cast[1] if movie_cast[1] else ""]
    ui.show_movies_with_actors(movies)


def add_actor() -> int | None:
    """
    Add a new actor to the database based on user input.
    :return: The ID of the newly inserted actor record.
    """
    actor_name, birth_year = ui.ask_actor_name_and_birth_year()
    if not actor_name:
        raise ValueError("No actor name was entered.")
    if not __validate_year(birth_year):
        raise ValueError(f"Invalid birth year: {birth_year}")
    actor_id = dao.add_actor(actor_name, int(birth_year))
    return actor_id


def add_movie() -> None:
    """
    Add a new movie to the database and optionally associate actors with it.
    """
    name, year, genre = ui.ask_movie_info()
    if not name:
        raise ValueError("No movie name was entered.")
    if not genre:
        raise ValueError("No genre was entered.")
    if not __validate_year(year):
        raise ValueError(f"Invalid movie year: {year}")
    movie_id = dao.add_movie(name, int(year), genre)
    if not ui.ask_to_continue("Would you like to add actors (yes/no): "):
        print()
        return
    __add_movie_cast(movie_id)


def __get_existing_actor_id(existing_actors: list) -> int:
    """
    Retrieve the ID of an existing actor based on user input.
    :param existing_actors: A list of existing actors, where each actor
                            is represented as a tuple containing their ID,
                            name, and other details.
    :return: The ID of the selected actor as an integer.
    """
    ui.show_existing_actors(existing_actors)
    selected_actor = ui.get_user_input("Select an actor: ")
    if not selected_actor or not selected_actor.isnumeric():
        raise ValueError(f"Invalid actor id: {selected_actor}")
    actor_id = int(selected_actor)
    if actor_id not in [actor[0] for actor in existing_actors]:
        raise ValueError(f"The actor does not exist: {actor_id}")
    return int(actor_id)


def __add_movie_cast(movie_id: int | None) -> None:
    """
    Add actors to a movie by associating them with the given movie ID.
    The user can choose to create new actors and associate them with the movie.
    Once actors are created or selected, they are added to the `movie_cast` list as
    tuples of (movie_id, actor_id). The function continues asking for additional
    actors until the user opts to stop. Finally, the list of movie-actor relationships
    is committed to the database.
    :param movie_id: The ID of the movie to which actors will be associated.
    """
    movie_cast = []
    existing_actors = None
    while movie_id:
        if ui.ask_to_continue("Would you like to create an actor (yes/no): "):
            actor_id = add_actor()
            if not actor_id:
                raise ValueError("Something went wrong during an actor creation.")
            movie_cast.append((movie_id, actor_id))
        else:
            if not existing_actors:
                existing_actors = dao.get_all_actors()
            try:
                actor_id = __get_existing_actor_id(existing_actors)
                movie_cast.append((movie_id, actor_id))
            except ValueError as ve:
                ui.print_error(str(ve))
                logger.error(ve)
        if not ui.ask_to_continue("Would you like to add another actor (yes/no): "):
            print()
            break
    if movie_cast:
        dao.add_movie_cast(movie_cast)


def show_unique_genres() -> None:
    """
    Display the list of unique genres in the database.
    """
    genres = dao.get_genres()
    ui.show_unique_genres([genre[0] for genre in genres])


def show_number_of_movies_by_genres() -> None:
    """
    Display the number of movies available in each genre.
    """
    movies = dao.get_num_of_movies_grouped_by_genre()
    ui.show_num_of_movies_by_genres(dict(movies))


def show_movies_by_name() -> None:
    """
    Display movies that match a specified name.
    """
    movie_name = ui.ask_movie_name()
    if not movie_name:
        raise ValueError("No movie name was entered.")
    movies = dao.get_movies_by_name(movie_name)
    ui.show_movies_info(movie_name, dict(movies))


def show_all_movies_and_all_actors() -> None:
    """
    Retrieve and display all movies and all actors from the database.
    """
    movies_and_actors = dao.get_all_movies_and_all_actors()
    structured_movies_and_actors = {}  # type: dict[str, list[tuple[str, int]]]
    for item in movies_and_actors:
        if item[0] in structured_movies_and_actors:
            structured_movies_and_actors[item[0]].append((item[1], item[2]))
        else:
            structured_movies_and_actors[item[0]] = [(item[1], item[2])]
    ui.show_all_movies_and_all_users(structured_movies_and_actors)


def show_all_movies_1b1() -> None:
    """
    Display all movies one by one, prompting the user to continue or stop after each movie.
    This function retrieves movies from the database one by one using an offset.
    After displaying the details of each movie, the user is asked whether they would
    like to continue viewing the next movie or stop.
    """
    movies_count = 0
    while True:
        movie_info = dao.get_all_movies_w_offset(movies_count)
        if movie_info:
            movies_count += 1
            ui.show_detailed_movie_info(movie_info[0])
        else:
            break
        if not ui.ask_to_continue("Would you like to continue (yes/no): "):
            break


def show_actors_avg_age_per_genre() -> None:
    """
    Calculate and display the average age of actors in a specified genre.
    """
    selected_genre = ui.get_user_input("Please provide a genre: ")
    if not selected_genre:
        raise ValueError("No genre was entered.")
    selected_genre = selected_genre.title()
    available_genres = [genre[0] for genre in dao.get_genres()]
    if selected_genre not in available_genres:
        raise ValueError(f"Genre is not available: {selected_genre}")
    avg_age = dao.get_actors_avg_age_by_genre(selected_genre)[0][0]
    ui.show_avg_age_per_genre(selected_genre, avg_age)


def show_movies_age() -> None:
    """
    Fetch and display a list of movies along with their respective ages.
    """
    movies = dao.get_movies_with_age()
    ui.show_movies_with_age(movies)


def execute(func: Callable) -> None:
    """
    Execute a given function and handle potential errors.
    :param func: A function to be executed.
    """
    try:
        func()
    except ValueError as ve:
        ui.print_error(str(ve))
        logger.error(ve)


if __name__ == "__main__":
    dao.init_tables()

    while True:
        ui.render_menu(settings.USER_MENU)
        user_input = ui.get_user_input("Choose an action: ")
        if not user_input:
            print(NOT_SELECTED_ACTION_MSG, end="\n\n")
            logger.info(NOT_SELECTED_ACTION_MSG)
            continue
        if user_input == "0":
            break
        if (
            user_input in settings.ACTION_MAPPING
            and settings.ACTION_MAPPING[user_input] in locals()
        ):
            execute(locals()[settings.ACTION_MAPPING[user_input]])
        else:
            ui.print_error("Wrong operation!")
            logger.warning(
                "User attempted to access a non-existent operation: %s", user_input
            )
