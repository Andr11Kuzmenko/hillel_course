from django.urls import include, path
from rest_framework import routers
from rest_framework.authtoken.views import obtain_auth_token
from drf_yasg.views import get_schema_view
from drf_yasg import openapi

from . import views

schema_view = get_schema_view(
    openapi.Info(
        title="Book API",
        default_version="v1",
    ),
    public=True,
)

router = routers.DefaultRouter()
router.register(r"book", views.BookViewSet)

urlpatterns = [
    path("", include(router.urls)),
    path("api/token/", obtain_auth_token, name="obtain_auth_token"),
    path(
        "docs/",
        schema_view.with_ui("swagger", cache_timeout=0),
        name="schema-swagger-ui",
    ),
]
