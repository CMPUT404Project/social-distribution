from django.urls import path
from .views import InboxView

urlpatterns = [
  path('<str:aid>/inbox', InboxView.as_view()),
]