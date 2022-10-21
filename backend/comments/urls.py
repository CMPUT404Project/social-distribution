from django.urls import path
from comments import views

urlpatterns = [
    path('<str:pk>/comments/', views.CommentsDetail.as_view()),
    path('comments/', views.CommentsList.as_view()),
]