from django.urls import path
from comment import views

urlpatterns = [
    path('comments/<str:pk>/', views.CommentDetail.as_view()),
    path('comment/', views.CommentList.as_view()),
]