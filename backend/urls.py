"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.views.generic import TemplateView
from django.urls import path, include, re_path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from .views import MyTokenObtainPairView
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from rest_framework import permissions

schema_view = get_schema_view(
   openapi.Info(
      title="Social Distribution API",
      default_version='v1',
      terms_of_service="https://www.google.com/policies/terms/",
      contact=openapi.Contact(email="contact@snippets.local"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes=[permissions.AllowAny],
)

urlpatterns = [
    path('admin', admin.site.urls),
    path('api/', include('users.urls')),
    path('api/auth/token', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/auth/token/refresh', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/swagger', schema_view.with_ui('swagger'), name='schema-swagger-ui'),
    path('api/redoc', schema_view.with_ui('redoc'), name='schema-redoc'),
    path('', include('authors.urls')),
    path('', include('nodes.urls')),
    path('', include('posts.urls')),
    path('authors/', include('comments.urls')),
    path('authors/', include('followers.urls')),
    path('authors/', include('likes.urls')),
    path('authors/', include('inbox.urls')),
    path('authors/', include('followRequests.urls')),
    path('authors/', include('image.urls')),
    re_path('', TemplateView.as_view(template_name='index.html')),
]
