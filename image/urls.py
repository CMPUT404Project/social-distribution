from django.urls import path
from . import views
from .views import ImageView

urlpatterns = [
  path('<str:aid>/posts/<str:pid>/image', ImageView.as_view()),
]
