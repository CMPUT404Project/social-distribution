from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from authors.models import Author 
from authors.serializers import AuthorSerializer

@csrf_exempt
def author(request):
    """
    List all authors, or create a new author
    """
    if request.method == 'GET':
        authors = Author.objects.all()
        serializer = AuthorSerializer(authors, many=True)
        return JsonResponse(serializer.data, safe=False)

    
    # POST request
    # Fields from client payload are: displayName, github, profileImage
    # Fields filled in by server: host, url, id
    elif request.method == 'POST':
        data = JSONParser().parse(request)
        data = fillAuthorJSONPayload(request, data)
        serializer = AuthorSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=400)

    elif request.method == 'DELETE':
        authors = Author.objects.all()
        authors.delete()
        return HttpResponse(status=204)


@csrf_exempt
def author_id(request, id):
    """
    Retrieve, update or delete a code snippet.
    """
    try:
        #we are using the request url as the id
        authorID = request.build_absolute_uri()
        author = Author.objects.get(pk=authorID)
        print(author)
    except Author.DoesNotExist:
        return HttpResponse(status=404)

    if request.method == 'GET':
        serializer = AuthorSerializer(author)
        return JsonResponse(serializer.data)

    #only for testing purposes/ should be removed
    elif request.method == 'DELETE':
        author.delete()
        return HttpResponse(status=204)

def fillAuthorJSONPayload(request, jsonPayload):
    """
    Fills in the JSON payload with the host and url from the request
    """
    jsonPayload['host'] = request.build_absolute_uri('/')
    jsonPayload['url'] = request.build_absolute_uri()
    return jsonPayload
