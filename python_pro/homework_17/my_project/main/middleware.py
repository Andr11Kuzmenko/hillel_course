import logging
from django.shortcuts import render


class AccessLogMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        if request.user.is_authenticated:
            logger = logging.getLogger('django')
            logger.info(f"User {request.user.username} accessed {request.path}")
        response = self.get_response(request)
        return response


class ErrorHandlingMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        try:
            response = self.get_response(request)
        except Exception as e:
            return render(request, 'errors/500.html', {'error': e})
        if response.status_code == 404:
            return render(request, 'errors/404.html')
        return response

