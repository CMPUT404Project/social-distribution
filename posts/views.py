from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from rest_framework.generics import GenericAPIView
from posts.models import Post
from authors.models import Author
from posts.serializers import PostSerializer

class PostView(GenericAPIView):

    serializer_class = PostSerializer
    queryset = Post.objects.all()

    def get(self, request, aid):
        """
        List posts for a given author
        """
        posts = Author.objects.get(pk=aid).post_set.all()
        serializer = PostSerializer(posts, many=True)
        return JsonResponse(serializer.data, safe=False)
    def post(self, request, aid):
        """
        Create a new post
        Fields from client payload are: displayName, github, profileImage
        Fields filled in by server: host, url, id
        """
        data = JSONParser().parse(request)
        serializer = PostSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=400)

    def delete(self, request, aid):
        posts = Post.objects.all()
        posts.delete()
        return HttpResponse(status=204)

class PostIDView(GenericAPIView):

    serializer_class = PostSerializer
    queryset = Post.objects.all()

    def get(self, request, aid, pid):
        """
        Retrieve a post
        """
        try:
            post = Post.objects.get(pk=pid)
        except Post.DoesNotExist:
            return HttpResponse(status=404)
        serializer = PostSerializer(post)
        return JsonResponse(serializer.data)

    def put(self, request, aid, pid):
        """
        Update a post
        """
        try:
            post = Post.objects.get(pk=pid)
        except Post.DoesNotExist:
            return HttpResponse(status=404)
        data = JSONParser().parse(request)
        serializer = PostSerializer(post, data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=400)

    def delete(self, request, aid, pid):
        """
        Delete a post
        """
        try:
            post = Post.objects.get(pk=pid)
        except Post.DoesNotExist:
            return HttpResponse(status=404)
        post.delete()
        return HttpResponse(status=204)
