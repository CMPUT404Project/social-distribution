from django.urls import path
from . import views
from .views import AuthorDetail, AuthorView

urlpatterns = [
  path('', AuthorView.as_view()),
  path('<str:aid>', AuthorIDView.as_view()),
]
