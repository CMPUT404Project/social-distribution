from django.shortcuts import render
from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from users.serializers import UserSerializer
from django.contrib.auth.models import User
from authors.models import Author
from backend.serializers import MyTokenObtainPairSerializer

def get_tokens_for_user(user):
    refresh = MyTokenObtainPairSerializer().get_token(user)
    
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class UserList(ListAPIView):
    """
    Returns a list of all users in the system.
    """
    permission_classes = [permissions.IsAuthenticated&permissions.IsAdminUser]
    queryset = User.objects.all()
    serializer_class = UserSerializer

class UserCreation(APIView):
    """
    Create a new auth user and an author, and returns an access token upon success
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    def post(self, request, format=None):
        try:
            user = User(username=request.data['username'])
            user.set_password(request.data['password'])
            author = Author(user=user, host=request.scheme + "://" + request.get_host())
            user.save()
            author.save()
        except Exception as e:
            return Response(str(e), status=status.HTTP_400_BAD_REQUEST)
        return Response(get_tokens_for_user(user), status=status.HTTP_201_CREATED)
