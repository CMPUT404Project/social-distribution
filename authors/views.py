from django.http import HttpResponse
from rest_framework.pagination import PageNumberPagination
from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from authors.models import Author
from django.http import HttpResponse
from authors.serializers import AuthorSerializer, AuthorsSerializer

class AuthorView(ListAPIView):
    """
    Retrieve all authors on server.
    """
    serializer_class = AuthorsSerializer
    queryset = Author.objects.all()
    def get(self, request):
        author = Author.objects.all()
        serializer = AuthorsSerializer(author)
        return Response(serializer.data)
    

class AuthorDetail(APIView):
    serializer_class = AuthorSerializer
    queryset = Author.objects.all()

    permission_classes = [permissions.IsAuthenticated]

    def get_object(self, pk):
        try:
            return Author.objects.get(pk=pk)
        except Author.DoesNotExist:
            raise HttpResponse.Http404

    def get(self, request, aid):
        """
        Retrieve a single author.
        """
        try:
            author = Author.objects.get(pk=aid)
        except Author.DoesNotExist:
            return HttpResponse(status=404)
        serializer = AuthorSerializer(author)
        return Response(serializer.data)

    def put(self, request, aid):
        """
        Update a single author
        """
        author = self.get_object(aid)
        serializer = AuthorSerializer(author, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
