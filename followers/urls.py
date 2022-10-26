from django.urls import path
from . import views
from .views import FollowerView, FollowerIDView

urlpatterns = [
  path('authors/<str:aid>/followers/', FollowerView.as_view()),
  path('authors/<str:aid>/followers/<str:fid>', FollowerIDView.as_view()),
]
