from django.urls import path
from . import views
# from .views import LikesView, LikedView

urlpatterns = [
  path('authors/<str:aid>/liked/', LikedView.as_view()),
  path('authors/<str:aid>/followers/<str:fid>', FollowerIDView.as_view()),
]
