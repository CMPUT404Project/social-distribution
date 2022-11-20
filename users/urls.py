from django.urls import path
from .views import UserList, UserCreation

urlpatterns = [
    path('users/', UserList.as_view()),
    path('users/register/', UserCreation.as_view(), name="register_user"),
]