"""
This module defines constants used throughout the application, including
the database name, user menu options, and action mappings. These constants
help maintain consistency and readability in the code.
"""

DATABASE_NAME = "movie.db"
USER_MENU = [
    "Add a movie",
    "Add an actor",
    "Show all movies with actors",
    "Show unique genres",
    "Show number of movies by genres",
    "Search for a movie by name",
    "Show all movies and all actors",
    "Show movies (one-by-one)",
    "Show actors average age per genre"
]
ACTION_MAPPING = {
    "1": "add_movie",
    "2": "add_actor",
    "3": "show_movies_w_actors",
    "4": "show_unique_genres",
    "5": "show_number_of_movies_by_genres",
    "6": "show_movies_by_name",
    "7": "show_all_movies_and_all_actors",
    "8": "show_all_movies_1b1",
    "9": "show_actors_avg_age_per_genre"
}
