from django.urls import include, path
from rest_framework import routers
from rest_framework.urlpatterns import format_suffix_patterns

from . import views
from .views import MyTokenObtainPairView

router = routers.DefaultRouter()
router.register(r'users/', views.UserViewSet)
router.register(r'posts/', views.PostViewSet)

urlpatterns = [
    path(r"", include(router.urls)),
    path(r"api/token/", MyTokenObtainPairView.as_view(), name="token_obtain_pair"),
]

