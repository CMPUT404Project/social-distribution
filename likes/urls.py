from django.urls import path
from . import views
from .views import LikedView, PostLikesView, CommentLikesView

urlpatterns = [
  path('<str:aid>/liked', LikedView.as_view()),
  path('<str:aid>/posts/<str:pid>/likes', PostLikesView.as_view()),
  path('<str:aid>/posts/<str:pid>/comments/<str:cid>/likes', CommentLikesView.as_view()),
]
