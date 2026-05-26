"""
This module defines the 'ParseEngine' class, which is responsible for parsing HTML content
using BeautifulSoup to extract specific components of news articles, such as titles, links,
descriptions, and dates.
"""

from bs4 import BeautifulSoup, Tag


class ParseEngine:
    """
    Parses HTML content to extract information about news articles.
    """

    def __init__(self, soup: BeautifulSoup) -> None:
        """
        Initializes a ParseEngine instance with a BeautifulSoup object.
        :param soup: Parsed HTML content from which to extract news items.
        """
        self.soup = soup

    def get_cards(self, class_: str) -> list:
        """
        Finds all news card elements in the HTML content with the specified class name.
        :param class_: The CSS class name of the news card containers.
        :return: A list of BeautifulSoup Tag objects representing news cards.
        """
        return self.soup.find_all("div", class_=class_)

    @staticmethod
    def get_info(card: Tag) -> tuple:
        """
        Extracts key details from a news card, including subject, link, date, and short description.
        :param card: A BeautifulSoup Tag object representing a single news card.
        :return: A tuple containing:
                - subject: The news title.
                - link: The URL to the full article.
                - date: The timestamp for the article.
                - short_description: A brief summary, if available.
        """
        tag_h3 = card.find("h3")
        link = tag_h3.find("a")["href"]  # type: ignore
        subject = tag_h3.find("span").text  # type: ignore
        description_tag = card.find("div", class_="PagePromo-description")
        short_description = None
        if description_tag:
            short_description = description_tag.find("span").text  # type: ignore
        date = card.find("div", class_="PagePromo-date").find("bsp-timestamp")[  # type: ignore
            "data-timestamp"  # type: ignore
        ]
        return subject, link, date, short_description
