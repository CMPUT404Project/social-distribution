from django.urls import path
from .views import PostView, PostIDView

urlpatterns = [
  path('<str:aid>/posts', PostView.as_view()),
  path('<str:aid>/posts/<str:pid>', PostIDView.as_view()),
]

