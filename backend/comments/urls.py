from django.urls import path
from comments import views

urlpatterns = [
    path('administrator/comments/', views.CommentsList.as_view()),
    path('administrator/comments/<str:pk>/', views.CommentsDetail.as_view()),
    path('authors/<str:aid>/posts/<str:pid>/comments/', views.CommentsDetail.as_view()),
]