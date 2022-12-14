from django.urls import path
from .views import CommentView, CommentIDView

urlpatterns = [
    path('<str:aid>/posts/<str:pid>/comments', CommentView.as_view(), name="all_comments"),
    path('<str:aid>/posts/<str:pid>/comments/<str:cid>', CommentIDView.as_view(), name="specific_comment"),
]
