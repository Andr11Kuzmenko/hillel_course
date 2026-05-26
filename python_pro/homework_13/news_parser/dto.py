"""
This module defines the 'News' class, representing a structured news article.
"""

from datetime import datetime


class News:
    """
    Represents a news article with key details such as subject, link, date, and a short description.
    """

    def __init__(self, subject, link, news_date, short_description) -> None:
        """
        Initializes a News object with subject, link, date, and description.
        :param subject: The title or headline of the news article.
        :param link: The URL link to the full news article.
        :param news_date: The date of the news article as a timestamp (in milliseconds).
        :param short_description: A brief summary of the news article.
        """
        self.subject = subject
        self.link = link
        self.news_date = news_date
        self.short_description = short_description

    def to_dict(self) -> dict:
        """
        Converts the News instance to a dictionary with formatted date and key information.
        :return: A dictionary representation of the news item.
        """
        return {
            "title": self.subject,
            "link": self.link,
            "date": datetime.fromtimestamp(int(self.news_date) / 1000).strftime(
                "%Y-%m-%d %H:%M:%S"
            ),
            "summary": self.short_description,
        }
