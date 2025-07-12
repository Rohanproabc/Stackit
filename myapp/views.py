from django.shortcuts import render
from django.http import HttpResponse
# Create your views here.
def home(request):
    return render(request, 'myapp/index.html')

def about(request):
    return render(request, 'myapp/about.html')

def privacy(request):
    return render(request, 'myapp/privacy.html')

def terms(request):
    return render(request, 'myapp/terms.html')

def cookies(request):
    return render(request, 'myapp/cookies.html')

def contact(request):
    return render(request, 'myapp/contact.html')