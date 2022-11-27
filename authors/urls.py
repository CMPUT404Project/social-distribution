from django.urls import path
from .views import AuthorView, AuthorDetail

urlpatterns = [
  path('authors', AuthorView.as_view(), name='all_authors'),
  path('authors/<str:aid>', AuthorDetail.as_view(), name='specific_author'),
]
