from django.urls import path
from . import views

urlpatterns = [
  path('', views.author),
  path('<str:id>', views.author_id),
]

