"""
This module defines the 'RequestEngine' class, which is responsible for handling HTTP requests
with custom user-agent headers. It aims to fetch content from specified URLs while managing
potential network errors gracefully.
"""

import requests
from fake_useragent import UserAgent  # type: ignore
from requests import Response, ReadTimeout, ConnectTimeout, TooManyRedirects


class RequestEngine:
    """
    A request handler that sends GET requests with randomized user-agent headers and
    manages exceptions such as connection timeouts and redirects.
    """

    @staticmethod
    def get_response(url: str) -> Response | None:
        """
        Sends a GET request to the given URL with a random user-agent header and
        a timeout setting.
        :param url: The URL to send the GET request to.
        :return: The response object if the request is successful, or
                 None if an exception occurs.
        """
        try:
            user_agent = UserAgent(platforms="pc")
            response = requests.get(
                url, headers={"User-Agent": user_agent.random}, timeout=20
            )
            return response
        except (ConnectionError, ConnectTimeout, ReadTimeout, TooManyRedirects):
            return None
