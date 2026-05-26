from django.test import TestCase

from .forms import BookForm


class BookManagerTestCase(TestCase):
    def test_price_validation(self):
        form = BookForm(data={"title": "test book", "price": -10})
        self.assertFalse(form.is_valid())
        self.assertIn('price', form.errors)

