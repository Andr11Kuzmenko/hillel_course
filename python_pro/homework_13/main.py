"""
This module scrapes news data from a website, processes the content,
and saves the results to a CSV file.
"""

import csv
from bs4 import BeautifulSoup

import settings  # type: ignore
from news_parser.request import RequestEngine  # type: ignore
from news_parser.parser import ParseEngine  # type: ignore
from news_parser.dto import News  # type: ignore


def save_to_csv(news: list[dict]) -> None:
    """
    Saves a list of news data dictionaries to a CSV file.
    :param news: A list of dictionaries where each dictionary represents
                a news item with keys as column headers.
    """
    with open("result/news.csv", "w", encoding="utf-8", newline="\n") as f:
        csv_writer = csv.DictWriter(f, news[0].keys())
        csv_writer.writeheader()
        for row in news:
            csv_writer.writerow(row)


def main() -> None:
    """
    Executes the main workflow for fetching, parsing, and saving news data to a CSV file.
    """
    page = f"{settings.HOST}{settings.ROOT_PATH}"
    result = []
    response = RequestEngine.get_response(page)
    if not response:
        return
    parse_engine = ParseEngine(BeautifulSoup(response.text, "html.parser"))
    cards = parse_engine.get_cards("PageList-items-item")
    if not cards:
        return
    for card in cards:
        result.append(News(*ParseEngine.get_info(card)))
    save_to_csv([news.to_dict() for news in result])


if __name__ == "__main__":
    main()
