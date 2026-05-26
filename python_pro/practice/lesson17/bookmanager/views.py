from PIL.ImageOps import cover
from django.contrib import messages

from django.shortcuts import render, redirect, get_object_or_404

from .models import Book, Author
from .forms import BookForm, BookFilterForm, AuthorForm, BookForm2


def book_list(request):
    form = BookFilterForm(request.GET)
    books = Book.objects.all()

    if form.is_valid():
        if form.cleaned_data['author']:
            books = books.filter(author=form.cleaned_data['author'])
        order = form.cleaned_data['order_by']

        if order == 'price_asc':
            books = books.order_by('price')
        elif order == 'price_desc':
            books = books.order_by('-price')
        elif order == 'date_asc':
            books = books.order_by('publication_date')
        elif order == 'date_desc':
            books = books.order_by('-publication_date')

    return render(request, 'bookmanager/book_list.html', {'books': books, 'form': form})


def add_book(request):
    if request.method == 'POST':
        form = BookForm(request.POST, request.FILES)

        if form.is_valid():
            form.save()
            messages.success(request, 'Книга успішно додана')

            return redirect('book_list')
    else:
        form = BookForm()

    return render(request, 'bookmanager/add_book.html', {'form': form, 'book': None})


def edit_book(request, book_id):
    book = get_object_or_404(Book, id=book_id)

    if request.method == 'POST':
        form = BookForm(request.POST, request.FILES, instance=book)

        if form.is_valid():
            form.save()
            messages.success(request, 'Інформація про книгу оновлена')

            return redirect('book_list')
    else:
        form = BookForm(instance=book)

    return render(request, 'bookmanager/add_book.html', {'form': form, 'book': book})


def add_author(request):
    if request.method == 'POST':
        form = AuthorForm(request.POST)

        if form.is_valid():
            form.save()
            messages.success(request, 'Автора успішно додано')

            return redirect('book_list')
    else:
        form = AuthorForm()

    return render(request, 'bookmanager/add_author.html', {'form': form})


def book_create_or_edit(request, pk=None):
    book = None

    if pk:
        book = Book.objects.get(pk=pk)

    if request.method == 'POST':
        form = BookForm2(request.POST, request.FILES)

        if form.is_valid():
            title = form.cleaned_data['title']
            author = form.cleaned_data['author']
            publication_date = form.cleaned_data['publication_date']
            price = form.cleaned_data['price']
            cover = form.cleaned_data['cover']

            if book:
                book.title = title
                book.author = author
                book.publication_date = publication_date
                book.price = price

                if cover:
                    book.cover = cover

                book.save()
                messages.success(request, 'The Book information has been update')
            else:
                Book.objects.create(title=title, author=author, publication_date=publication_date, price=price, cover=cover)
                messages.success(request, 'The Book has been added')

            return redirect('book_list')
    else:
        initial_data = {
            'title': book.title if book else '',
            'author': book.author if book else None,
            'publication_date': book.publication_date if book else '',
            'price': book.price if book else '',
            'cover': book.cover if book else None
        }
        form = BookForm2(initial=initial_data)

    return render(request, 'bookmanager/book_form.html', {'form': form, 'book': book})