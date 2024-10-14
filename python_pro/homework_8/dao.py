"""
This module provides functionality for managing a movie database using SQLite.
The database configuration is managed via the 'settings' module, which should define the
path to the SQLite database file ('settings.DATABASE_NAME').
"""

import sqlite3
from datetime import datetime

import settings  # type: ignore


def init_tables() -> None:
    """
    Initialize the database tables using the SQL script found in 'tables_init.sql'.
    """
    with open("tables_init.sql", "r", encoding="utf8") as f:
        sql_init_script = f.read()

    if not sql_init_script:
        return

    with sqlite3.connect(settings.DATABASE_NAME) as conn:
        cursor = conn.cursor()
        cursor.executescript(sql_init_script)


def __perform_query_w_fetchall(query: str, *args) -> list:
    """
    Execute a SQL query and return all results.
    This function connects to the SQLite database, executes the provided
    SQL query with the specified arguments, and fetches all resulting rows.
    It is intended for internal use within the module.
    :param query: The SQL query to be executed.
    :param args: The parameters to substitute into the query.
    :return: A list of tuples representing the rows returned by the query.
    """
    with sqlite3.connect(settings.DATABASE_NAME) as conn:
        cursor = conn.cursor()
        cursor.execute(query, *args)
        return cursor.fetchall()


def get_movies_w_actors() -> list[tuple]:
    """
    Retrieve a list of movies along with their respective actors from the database.
    :return: A list of tuples, where each tuple contains:
            - The title of the movie.
            - The name of the actor in the movie.
    """
    return __perform_query_w_fetchall(
        """
            SELECT m.title, a.name 
            FROM movies AS m
            LEFT JOIN movie_cast AS mc ON m.id = mc.movie_id
            LEFT JOIN actors AS a ON a.id = mc.actor_id
        """
    )


def add_actor(name: str, birth_year: int) -> int | None:
    """
    Add a new actor to the database.
    :param name: The name of the actor to be added.
    :param birth_year: The birth year of the actor to be added.
    :return: The ID of the newly inserted actor record.
    """
    with sqlite3.connect(settings.DATABASE_NAME) as conn:
        cursor = conn.cursor()
        cursor.execute(
            """
                INSERT INTO actors (name, birth_year)
                VALUES (?, ?)   
            """,
            (
                name,
                birth_year,
            ),
        )
        conn.commit()
        return cursor.lastrowid


def get_genres() -> list[tuple[str]]:
    """
    Retrieve a list of unique genres from the database.
    :return: A list of tuples containing unique genres from the movies table.
    """
    return __perform_query_w_fetchall(
        """
            SELECT DISTINCT genre
            FROM movies
        """
    )


def get_num_of_movies_grouped_by_genre() -> list[tuple[str, int]]:
    """
    Retrieve the number of movies categorized by genre from the database.
    :return: A list of tuples, where each tuple contains:
            - The genre name.
            - The number of movies in that genre.
    """
    return __perform_query_w_fetchall(
        """
            SELECT genre, COUNT(*)
            FROM movies
            GROUP BY genre 
            ORDER BY genre
        """
    )


def get_movies_by_name(name: str) -> list[tuple[str, int]]:
    """
    Retrieve a list of movies that match a specified name from the database.
    :param name: The name or partial name of the movie to search for.
    :return: A list of tuples, where each tuple contains:
            - The title of the movie.
            - The release year of the movie.
    """
    return __perform_query_w_fetchall(
        """
            SELECT title, release_year
            FROM movies
            WHERE title LIKE ?
            ORDER BY title
        """,
        (f"%{name}%",),
    )


def get_all_movies_and_all_actors() -> list[tuple[str, str, int]]:
    """
    Retrieve all movies and all actors from the database.
    :return: A list of tuples, where each tuple contains:
            - A string indicating the type ('Movie' or 'Actor').
            - The title of the movie or the name of the actor.
            - The release year of the movie or the birth year of the actor.
    """
    return __perform_query_w_fetchall(
        """
            SELECT 'Movie' as type, title, release_year
            FROM movies
            UNION 
            SELECT 'Actor', name, birth_year
            FROM actors
        """
    )


def add_movie(name: str, year: int, genre: str) -> int | None:
    """
    Insert a new movie record into the movies table in the SQLite database.
    :param name: The title of the movie to be added.
    :param year: The release year of the movie to be added.
    :param genre: The genre of the movie to be added.
    :return: The ID of the newly inserted movie record.
    """
    with sqlite3.connect(settings.DATABASE_NAME) as conn:
        cursor = conn.cursor()
        cursor.execute(
            """
                INSERT INTO movies (title, release_year, genre)
                VALUES (?, ?, ?)
            """,
            (name, year, genre),
        )
        conn.commit()
        return cursor.lastrowid


def get_all_movies_w_offset(offset: int) -> list[tuple[int, str, int, str]]:
    """
    Retrieve a single movie record from the database using an offset.
    :param offset: The number of rows to skip before starting to return records.
    :return: A list containing a single tuple representing the movie record.
    """
    return __perform_query_w_fetchall(
        """
            SELECT *
            FROM movies AS m 
            ORDER BY m.title
            LIMIT 1
            OFFSET ?
        """,
        (offset,),
    )


def add_movie_cast(movie_cast: list[tuple[int, int]]) -> None:
    """
    Add cast members (actors) to a movie in the database.
    :param movie_cast: A list of tuples, where each tuple contains:
                           - movie_id: The ID of the movie.
                           - actor_id: The ID of the actor.
    """
    with sqlite3.connect(settings.DATABASE_NAME) as conn:
        cursor = conn.cursor()
        cursor.executemany(
            """
                INSERT INTO movie_cast (movie_id, actor_id)
                VALUES (?, ?)
            """,
            movie_cast,
        )
        conn.commit()


def get_actors_avg_age_by_genre(genre: str) -> list[tuple[int]]:
    """
    Retrieve the average age of actors who acted in movies of a specific genre.
    :param genre: The genre of the movies to filter by.
    :return: A list of tuples containing the genre and the average age of actors.
    """
    return __perform_query_w_fetchall(
        """
            SELECT CAST(AVG(CAST(STRFTIME('%Y', 'now') AS INTEGER) - a.birth_year) AS INTEGER)
            FROM movie_cast
            LEFT JOIN actors AS a ON a.id = movie_cast.actor_id
            LEFT JOIN movies AS m ON m.id = movie_cast.movie_id
            WHERE m.genre = ?
        """,
        (genre,),
    )


def get_all_actors() -> list[tuple[int, str, int]]:
    """
    Retrieve all actors from the database.
    :return: A list of tuples, where each tuple contains
            the actor's information.
    """
    return __perform_query_w_fetchall(
        """
            SELECT *
            FROM actors
            ORDER BY name
        """
    )


def __get_age(year: int) -> int:
    """
    Calculate the age of a movie based on its release year.
    :param year: The release year of the movie.
    :return: The age of the movie in years.
    """
    return datetime.now().year - year


def get_movies_with_age() -> list[tuple[str, int]]:
    """
    Retrieve a list of movies along with their respective ages.
    :return: A list of tuples where each tuple contains
            the movie title and the age.
    """
    with sqlite3.connect(settings.DATABASE_NAME) as conn:
        conn.create_function("GET_AGE", 1, __get_age)
        cursor = conn.cursor()
        cursor.execute(
            """
                SELECT title, GET_AGE(release_year)
                FROM movies
            """
        )
        return cursor.fetchall()
