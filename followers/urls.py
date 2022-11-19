from django.urls import path
from .views import FollowerDetailView, FollowersView

urlpatterns = [
  path('authors/<str:aid>/followers/', FollowersView.as_view()),
  path('authors/<str:aid>/followers/<str:fid>', FollowerDetailView.as_view()),
]
