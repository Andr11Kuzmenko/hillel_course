from django.shortcuts import render
from django.views import View

def home_page(request):
    return render(request, "lesson2/home.html", context={
        "greeting": "Hello World!"
    })


def about(request):
    about_text = [
        "Hello,",
        "this has been done"
    ]
    return render(request, "lesson2/about.html", context={"about_text": about_text})
