from django.urls import path
from .views import FollowRequestDetail

urlpatterns = [
  path('<str:aid>/followRequest/<str:fid>', FollowRequestDetail.as_view())
]