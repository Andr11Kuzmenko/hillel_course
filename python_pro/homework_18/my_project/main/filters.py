import django_filters

from .models import Book


class BookFilter(django_filters.FilterSet):
    title_contains = django_filters.CharFilter(
        field_name="title", lookup_expr="icontains"
    )

    class Meta:
        model = Book
        fields = ["genre", "author", "publication_year"]
