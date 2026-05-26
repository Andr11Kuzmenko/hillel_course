"""
This module implements a simple multithreaded HTTP server.
"""

import json
import threading
from http.server import HTTPServer, BaseHTTPRequestHandler


class WebRequestHandler(BaseHTTPRequestHandler):
    """
    A custom request handler for handling HTTP POST requests.
    """

    def do_POST(self) -> None:
        """
        Handle HTTP POST requests.
        """
        response_body = {"current_thread": threading.current_thread().name}
        self.send_response(200)
        self.send_header("Content-type", "application/json")
        self.end_headers()
        self.wfile.write(json.dumps(response_body).encode("utf-8"))


def run_server(port: int) -> None:
    """
    Starts an HTTP server on the specified port.
    :param port: The port number on which the server will listen for incoming requests.
    """
    server = HTTPServer(("0.0.0.0", port), WebRequestHandler)
    server.serve_forever()


def run_servers() -> None:
    """
    Starts multiple HTTP servers concurrently on ports 8000 to 8004.
    """
    threads = []
    for i in range(8000, 8005):
        thread = threading.Thread(target=run_server, args=(i,))
        threads.append(thread)
    for thread in threads:
        thread.start()


if __name__ == "__main__":
    run_servers()
