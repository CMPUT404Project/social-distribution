from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from rest_framework.pagination import PageNumberPagination
from rest_framework.parsers import JSONParser
from rest_framework.generics import GenericAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from authors.models import Author 
from authors.serializers import AuthorSerializer
from authors.pagination import PaginationHandlerMixin

class AuthorView(GenericAPIView):
    pagination_class = PageNumberPagination

    def get(self, request):
        # PAGINATION WIP
        # authors = Author.objects.all()
        # print(authors)
        # result_page = PageNumberPagination.paginate_queryset(authors, request)
        # print(result_page)
        # if result_page is not None:
        #     serializer = AuthorSerializer(result_page, many=True)
        #     return Response(self.get_paginated_response(serializer.data))
        # return HttpResponse(status=404)

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
    def get(self, request, aid):
        """
        Retrieve, update or delete a code snippet.
        """
        try:
            author = Author.objects.get(pk=aid)
        except Author.DoesNotExist:
            return HttpResponse(status=404)
        serializer = AuthorSerializer(author)
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
