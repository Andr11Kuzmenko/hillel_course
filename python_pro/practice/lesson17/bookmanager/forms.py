from cProfile import label

from django import forms
from django.core.exceptions import ValidationError
from django.utils import timezone

from .models import Book, Author


class BookForm(forms.ModelForm):
    publication_date = forms.DateField(widget=forms.DateInput(attrs={'type': 'date'}), label='Publication Date', help_text='Format: YYYY-MM-DD')

    class Meta:
        model = Book
        fields = '__all__'

    def clean_price(self):
        price = self.cleaned_data.get('price')

        if price <= 0:
            raise ValidationError('Price should be greater than 0.')

        return price

    def clean_title(self):
        title = self.cleaned_data.get('title')

        if "заборонено" in title.lower():
            raise ValidationError('В назві є заборонені слова')

        return title

    def clean_pub_date(self):
        publication_date = self.cleaned_data.get('publication_date')

        if publication_date > timezone.now().date():
            raise ValidationError('Дата публікації не може бути у майбутньому')

        return publication_date


class AuthorForm(forms.ModelForm):
    class Meta:
        model = Author
        fields = '__all__'

    def clean(self):
        cleaned_data = super().clean()
        first_name = self.cleaned_data.get('first_name')
        last_name = self.cleaned_data.get('last_name')

        if Author.objects.filter(first_name=first_name, last_name=last_name).exists():
            raise ValidationError('Автор уже існує')

        return cleaned_data


class BookFilterForm(forms.Form):
    author = forms.ModelChoiceField(queryset=Author.objects.all(), required=False, label="author")
    order_by = forms.ChoiceField(choices=[
        ("price_asc", "Ціна за зростанням"),
        ("price_desc", "Ціна за спаданням"),
        ("date_asc", "Дата за зростанням"),
        ("date_desc", "Дата за спаданням"),
    ], required=False, label="order")


class BookForm2(forms.Form):
    title = forms.CharField(label='Book name', max_length=100, widget=forms.TextInput(attrs={'class': 'form-control'}), help_text='Input the book name')
    author = forms.ModelChoiceField(queryset=Author.objects.all(), required=False, label="author", widget=forms.Select(attrs={'class': 'form-select'}), help_text="Select the author")
    publication_date = forms.DateField(label='Publication date', widget=forms.DateInput(attrs={'type': 'date', 'class': 'form-control'}), help_text='Select publication date according to the format: YYYY-MM-DD')
    price = forms.DecimalField(label='Price', max_digits=5, decimal_places=2, widget=forms.NumberInput(attrs={'class': 'form-control'}), help_text='Select price (e.g. 50.51)')
    cover = forms.ImageField(label='Cover', required=False, widget=forms.FileInput(attrs={'class': 'form-control'}), help_text="Select cover image (optional)")

    def clean_price(self):
        price = self.cleaned_data.get('price')

        if price and price <= 0:
            forms.ValidationError('Price should be greater than 0.')

        return price
