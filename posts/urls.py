from django.urls import path
from .views import PostView, PostIDView, PostsAllPublicView

urlpatterns = [
  path('posts', PostsAllPublicView.as_view()),
  path('authors/<str:aid>/posts', PostView.as_view()),
  path('authors/<str:aid>/posts/<str:pid>', PostIDView.as_view()),
]

