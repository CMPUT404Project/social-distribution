from django.urls import path
from .views import FollowerDetailView, FollowersView

urlpatterns = [
  path('<str:aid>/followers/', FollowersView.as_view()),
  path('<str:aid>/followers/<str:fid>', FollowerDetailView.as_view()),
]
