from django.urls import path
from . import views
from .views import AuthorDetail, AuthorView

urlpatterns = [
    path('', AuthorView.as_view(), name='all_authors'),
    path('<str:aid>', AuthorDetail.as_view(), name='specific_author'),
]
