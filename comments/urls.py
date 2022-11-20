from django.urls import path
from comments import views
from .views import CommentView, CommentIDView

urlpatterns = [
    path('<str:aid>/posts/<str:pid>/comments/', CommentView.as_view()),
    path('<str:aid>/posts/<str:pid>/comments/<str:cid>', CommentIDView.as_view()),
]
