from django.urls import path
from users.views import UserDetail, UserList

urlpatterns = [
    path('user/', UserDetail.as_view(), name='user'),
    path('users/', UserList.as_view())
]