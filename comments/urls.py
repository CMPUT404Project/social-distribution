from django.urls import path
from comments import views
from .views import CommentView, CommentIDView

urlpatterns = [
    path('authors/<str:aid>/posts/<str:pid>/comments/', CommentView.as_view()),
    # path('authors/<str:aid>/posts/<str:pid>/comments/<str:cid>/', views.comment_id),
]
