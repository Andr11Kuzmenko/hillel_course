"""
This module provides the UserInterface class, which contains static methods to handle
user interactions in a console-based application for managing movies and actors.
"""


class UserInterface:
    """
    A class that provides methods for rendering user interfaces in a console application.
    """

    @staticmethod
    def render_menu(user_menu: list[str]) -> None:
        """
        Render and display a menu to the user.
        :param user_menu: A list of strings representing the menu items
                            to be displayed.
        """
        for idx, item in enumerate(user_menu):
            print(f"{idx + 1}. {item}")
        print("0. Exit")
        print()

    @staticmethod
    def get_user_input(msg: str) -> str:
        """
        Prompt the user for input and return the response.
        :return: The input provided by the user as a string.
        """
        return input(msg)

    @staticmethod
    def show_movies_with_actors(movies_w_actors: dict[str, list[str]]) -> None:
        """
        Display a list of movies along with their associated actors.
        :param movies_w_actors: A dictionary where the keys are movie titles (str) and the values
                                are lists of actor names (str) associated with each movie.3
        """
        for movie_name, actors in movies_w_actors.items():
            print(f"Movie: {movie_name}; Actors: {', '.join(actors) if actors else ''}")
        print()

    @staticmethod
    def print_error(msg: str) -> None:
        """
        Print an error message.
        """
        print(msg, end="\n\n")

    @staticmethod
    def ask_actor_name_and_birth_year() -> tuple[str, str]:
        """
        Prompt the user to enter an actor's name and birth year.
        :return: A tuple containing:
                - The actor's name.
                - The actor's birth year.
        """
        name = input("Enter actor name: ")
        birth_year = input("Enter actor birth year: ")
        return name, birth_year

    @staticmethod
    def ask_movie_name() -> str:
        """
        Prompt the user to enter a movie name.
        :return: The name of the movie entered by the user.
        """
        return input("Enter movie's name: ")

    @staticmethod
    def show_unique_genres(genres: list[str]) -> None:
        """
        Display a list of unique genres to the user.
        :param genres: A list of strings representing the unique genres to be displayed.
        """
        print(f"Genres:\n{', '.join(genres)}", end="\n\n")

    @staticmethod
    def show_num_of_movies_by_genres(movies: dict[str, int]) -> None:
        """
        Display the number of movies categorized by genre.
        :param movies: A dictionary where the keys are genre names and the values are
                        the corresponding number of movies associated with each genre.
        :return:
        """
        print("Genres and number of related movies:")
        for idx, (genre, num_of_movies) in enumerate(movies.items()):
            print(f"{idx + 1}. {genre}: {num_of_movies}")
        print()

    @staticmethod
    def show_movies_info(user_input: str, movies: dict[str, int]) -> None:
        """
        Display information about movies that match user input.
        :param user_input: The input string provided by the user.
        :param movies: A dictionary where the keys are movie titles and the values are
                        their respective release years.
        """
        if not movies:
            print("No movies found.", end="\n\n")
            return
        print(f"The following movies were found by input: {user_input}")
        for idx, (title, release_year) in enumerate(movies.items()):
            print(f"{idx + 1}. {title} ({release_year})")
        print()

    @staticmethod
    def show_all_movies_and_all_users(
        movies_and_actors: dict[str, list[tuple[str, int]]]
    ) -> None:
        """
        Display all movies and actors to the user.
        :param movies_and_actors: A dictionary where:
                    - The keys are strings that indicate the type ('Movie' or 'Actor').
                    - The values are lists of tuples, each containing:
                        - A string representing the name (title for movies, name for actors).
                        - An integer representing the release year for movies or the birth year
                            for actors.
        """
        if "Movie" in movies_and_actors:
            print("Movies")
            for idx, (movie_name, year) in enumerate(movies_and_actors["Movie"]):
                print(f"{idx + 1}. {movie_name} ({year})")
        else:
            print("No movies found.")
        if "Actor" in movies_and_actors:
            print("Actors")
            for idx, (actor_name, year) in enumerate(movies_and_actors["Actor"]):
                print(f"{idx + 1}. {actor_name} ({year})")
        else:
            print("No actors found.")
        print()

    @staticmethod
    def ask_movie_info() -> tuple[str, str, str]:
        """
        Prompt the user for information about a movie.
        :return: A tuple containing:
                - The name of the movie.
                - The release year of the movie.
                - The genre of the movie.
        """
        name = UserInterface.ask_movie_name()
        year = input("Enter movie's release year: ")
        genre = input("Enter movie's genre: ")
        return name, year, genre

    @staticmethod
    def show_detailed_movie_info(movie_info: tuple[int, str, int, str]) -> None:
        """
        Display detailed information about a movie.
        This method prints the movie's title, release year, and genre. It expects a tuple containing
        the following details in order:
            - The movie's ID (not displayed).
            - The movie's title.
            - The movie's release year.
            - The movie's genre.
        :param movie_info: A tuple containing the movie's ID, title, release year, and genre.
        """
        print("Title:", movie_info[1])
        print("Release year:", movie_info[2])
        print("Genre:", movie_info[3], end="\n\n")

    @staticmethod
    def ask_to_continue(msg: str) -> bool:
        """
        Prompt the user to decide whether to continue.
        """
        user_input = input(msg)
        return user_input.lower() == "yes"

    @staticmethod
    def show_avg_age_per_genre(genre: str, avg_age: int) -> None:
        """
        Display the average age of actors in a specific genre.
        :param genre: The genre for which the average age of actors is being displayed.
        :param avg_age: The average age of actors who play in the specified genre.
        """
        print(f"Average age of actors who play in {genre}: {avg_age}", end="\n\n")

    @staticmethod
    def show_existing_actors(actors: list[tuple[int, str, int]]) -> None:
        """
        Display a list of existing actors along with their details.
        :param actors: A list of tuples, each containing details of an actor.
        """
        print("Existing actors:")
        for idx, actor in enumerate(actors):
            print(f"{idx + 1} - {actor[0]}, {actor[1]}")

    @staticmethod
    def show_movies_with_age(movies: list[tuple[str, int]]) -> None:
        """
        Display a list of movies along with their respective ages.
        :param movies: A list of tuples where each tuple contains
                        the movie title and the age.
        """
        print("Movies with their age:")
        for idx, (movie_name, age) in enumerate(movies):
            print(f'{idx + 1}. Movie: "{movie_name}" - {age} years')
        print()
