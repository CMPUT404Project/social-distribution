from django.urls import path
from comment import views

urlpatterns = [
    path('administrator/comment/', views.CommentList.as_view()),
    path('administrator/comment/<str:pk>', views.CommentDetail.as_view()),
]