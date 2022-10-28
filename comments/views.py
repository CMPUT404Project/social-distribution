from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from rest_framework.generics import GenericAPIView
from rest_framework import generics
from posts.models import Post
from comments.models import Comment
from comments.serializers import CommentSerializer

class CommentView(GenericAPIView):
    serializer_class = CommentSerializer
    queryset = Comment.objects.all()

    def get(self, request, aid, pid):
        """
        List comments for a given post
        """
        comments = Post.objects.get(pk=pid).comment_set.all()
        serializer = CommentSerializer(comments, many=True)
        return JsonResponse(serializer.data, safe=False)

    def post(self, request, aid):
        """
        Create a new comment
        """
        data = JSONParser().parse(request)
        serializer = CommentSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=400)

    def delete(self, request, aid, pid):
        comments = Comment.objects.all()
        comments.delete()
        return HttpResponse(status=204)

#used for testing purposes, not set in url.py
class CommentIDView(GenericAPIView):
    serializer_class = CommentSerializer
    queryset = Comment.objects.all()

    def get(self, request, aid, pid, cid):
        """
        Retrieve a comment
        """
        try:
            comment = Comment.objects.get(pk=cid)
        except Comment.DoesNotExist:
            return HttpResponse(status=404)
        serializer = self.serializer_class(comment)
        return JsonResponse(serializer.data)

    def put(self, request, aid, pid, cid):
        """
        Update a comment
        """
        try:
            comment = Comment.objects.get(pk=cid)
        except Comment.DoesNotExist:
            return HttpResponse(status=404)
        data = JSONParser().parse(request)
        serializer = CommentSerializer(comment, data=data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=400)

    def delete(self, request, aid, pid, cid):
        try:
            comment = Comment.objects.get(pk=cid)
        except Comment.DoesNotExist:
            return HttpResponse(status=404)
        comment.delete()
        return HttpResponse(status=204)
@csrf_exempt
def comment_id(request, aid, pid, cid):
    """
    Retrieve, update or delete a code snippet.
    """
    try:
        comment = Comment.objects.get(pk=cid)
    except Comment.DoesNotExist:
        return HttpResponse(status=404)

    #only for testing purposes/ should be removed
    if request.method == 'DELETE':
        comment.delete()
        return HttpResponse(status=204)

