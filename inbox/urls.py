from django.urls import path
from . import views
from .views import InboxDetail

urlpatterns = [
    path('', InboxDetail.as_view()),
]
