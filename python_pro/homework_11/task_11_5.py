"""
Asynchronous Web Server Example with aiohttp
"""

import asyncio

from aiohttp import web


routes = web.RouteTableDef()


@routes.post("/")
async def home(request: web.Request) -> web.Response:
    """
    Handle POST requests to the home route.
    :param request: The incoming HTTP request.
    :return: A response object with the greeting text.
    """
    return web.Response(text="Hello, world!")


@routes.post("/slow")
async def slow(request: web.Request) -> web.Response:
    """
    Handle POST requests to the slow route.
    :param request: The incoming HTTP request.
    :return: A response object indicating the operation's completion.
    """
    await asyncio.sleep(10)
    return web.Response(text="Operation completed.")


if __name__ == "__main__":
    app = web.Application()
    app.add_routes(routes)
    web.run_app(app)
