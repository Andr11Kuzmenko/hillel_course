"""task 7 2"""

import unittest
from unittest.mock import patch, MagicMock

import requests


class WebService:
    """
    A utility class for interacting with web APIs.
    """

    @staticmethod
    def get_data(url: str) -> requests.Response:
        """
        Fetches JSON data from the specified URL.
        :param url: The URL from which to fetch the JSON data.
        :return: The JSON response converted to a dictionary.
        """
        response = requests.get(url, timeout=5)
        return response


class TestWebService(unittest.TestCase):
    """
    Unit tests for the WebService class using the unittest framework.
    """

    @patch("requests.get")
    def test_get_data_code_200(self, mock_get):
        """
        Tests the WebService.get_data method when a 200 HTTP status code is returned.
        :param mock_get: The mocked version of the 'requests.get' function, provided by the
                        'patch' decorator to simulate the HTTP request.
        """
        mock_response = MagicMock()
        mock_response.status_code = 200
        mock_response.json.return_value = {"status": "ok"}
        mock_get.return_value = mock_response

        response = WebService.get_data("https://www.google.com")
        self.assertEqual(response.json(), {"status": "ok"})
        self.assertEqual(response.status_code, 200)

    @patch("requests.get")
    def test_get_data_code_404(self, mock_get) -> None:
        """
        Tests the WebService.get_data method when a 404 HTTP status code is returned.
        :param mock_get: The mocked version of the 'requests.get' function, provided by the
                        'patch' decorator to simulate the HTTP request.
        """
        mock_response = MagicMock()
        mock_response.status_code = 404
        mock_get.return_value = mock_response

        response = WebService.get_data("https://www.google.com")
        self.assertEqual(response.status_code, 404)


if __name__ == "__main__":
    unittest.main()
