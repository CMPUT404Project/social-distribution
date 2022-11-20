from django.urls import path
from .views import AuthorView, AuthorDetail

urlpatterns = [
  path('', AuthorView.as_view(), name='all_authors'),
  path('<str:aid>', AuthorDetail.as_view(), name='specific_author'),
]
