from django.shortcuts import render

# Create your views here.

#getting the index.html from templates
def index(request, *args, **kwargs):
    return render(request, 'frontend/index.html')
