from django.shortcuts import render
from authors.serializers import AuthorCreationSerializer
from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from users.serializers import UserSerializer, UserCreationSerializer
from django.contrib.auth.models import User
from authors.models import Author
from inbox.serializers import InboxCreationSerializer
from backend.serializers import MyTokenObtainPairSerializer
from inbox.models import Inbox

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
    Create a new auth user and an author and an inbox, and returns an access token upon success
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer
    def post(self, request, format=None):
        #user creation
        user_serializer = UserCreationSerializer(data=request.data)
        if user_serializer.is_valid():
            self.user = user_serializer.save()
            #author creation
            new_author_data = {"host": request.scheme + "://" + request.get_host(), "user":self.user.id, }
            author_serializer = AuthorCreationSerializer(data=new_author_data)
            if author_serializer.is_valid():
                self.author = author_serializer.save()
                #inbox creation
                new_inbox_data = {"id": self.author.id}
                inbox_serializer = InboxCreationSerializer(data=new_inbox_data)
                if inbox_serializer.is_valid():
                    self.inbox = inbox_serializer.save()
                    return Response(get_tokens_for_user(self.user), status=200)
            #if fails delete all the successful previous steps
            self.inbox.delete()
            self.author.delete()
            self.user.delete()
            return Response(author_serializer.errors, status=400)
        return Response(user_serializer.errors, status=400)
