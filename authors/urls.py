from django.urls import path
from authors.views import AuthorView, AuthorDetail

urlpatterns = [
  path('', AuthorView.as_view()),
  path('<str:aid>', AuthorDetail.as_view()),
]
