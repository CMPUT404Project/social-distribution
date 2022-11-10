<<<<<<< HEAD
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from rest_framework.pagination import PageNumberPagination
from rest_framework.parsers import JSONParser
from rest_framework.generics import GenericAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from authors.models import Author 
from authors.serializers import AuthorSerializer

class AuthorView(GenericAPIView):
    pagination_class = PageNumberPagination
    serializer_class = AuthorSerializer
    queryset = Author.objects.all()

    def get(self, request):

        authors = Author.objects.all()
        serializer = AuthorSerializer(authors, many=True)
        return Response(serializer.data)
    # POST request
    # Fields from client payload are: displayName, github, profileImage
    # Fields filled in by server: host, url, id
    def post(self, request):
        data = JSONParser().parse(request)
        data = fillAuthorJSONPayload(request, data)
        serializer = AuthorSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=400)
    
    def delete(self, request):
        authors = Author.objects.all()
        authors.delete()
        return HttpResponse(status=204)


class AuthorIDView(APIView):
    serializer_class = AuthorSerializer
    queryset = Author.objects.all()

    def get(self, request, aid):
        """
        Retrieve, update or delete a code snippet.
=======
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
        return Response(serializer.data, status=200)
    

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
>>>>>>> main
        """
        try:
            author = Author.objects.get(pk=aid)
        except Author.DoesNotExist:
            return HttpResponse(status=404)
        serializer = AuthorSerializer(author)
<<<<<<< HEAD
        return Response(serializer.data)

    def delete(self, request, aid):
        author.delete()
        return HttpResponse(status=204)


def fillAuthorJSONPayload(request, jsonPayload):
    """
    Fills in the JSON payload with the host and url from the request
    """
    jsonPayload['host'] = request.build_absolute_uri('/')
    jsonPayload['url'] = request.build_absolute_uri()
    return jsonPayload
=======
        return Response(serializer.data, status=200)

    def put(self, request, aid):
        """
        Update a single author
        """
        author = self.get_object(aid)
        serializer = AuthorSerializer(author, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=204)
        return Response(serializer.errors, status=400)
>>>>>>> main
