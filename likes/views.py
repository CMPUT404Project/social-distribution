from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from rest_framework.generics import GenericAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from likes.models import Like
from likes.serializers import LikeSerializer, LikedSerializer, LikesSerializer
from authors.models import Author
from posts.models import Post
from comments.models import Comment
import json

class LikedView(APIView):
    serializer_class = LikesSerializer
    queryset = Like.objects.all()
    def get(self, request, aid):
        """
        Get what public things given author has liked
        """
        liked = Author.objects.get(pk=aid).like_set.all()
        serializer = LikesSerializer(liked, many=True)
        return response(serializer.data, safe=False, status=200)

class PostLikesView(APIView):
    def get(self, request, aid, pid):
        """
        Retrieve likes for a given post
        """
        like = Post.objects.get(pk=pid).like_set.all()
        #for some reason the context argument allows us to skip data=data
        serializer = LikesSerializer(like)
        return Response(serializer.data, 200)

    def post(self, request, aid, pid):
        """
        Create a new comment
        """
        data = JSONParser().parse(request)
        data['postid'] = pid
        serializer = LikeSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, 200)
        return Response(serializer.errors, status=400)

    def delete(self, request, aid, pid):
        likes = Like.objects.all()
        likes.delete()
        return HttpResponse(status=204)

class CommentLikesView(APIView):
    def get(self, request, aid, pid, cid):
        """
        Retrieve likes for a given comment
        """
        likes = Comment.objects.get(pk=cid).like_set.all()
        serializer = LikesSerializer(likes)
        return Response(serializer.data, 200)

    def post(self, request, aid, pid, cid):
        """
        Create a new comment
        """
        data = JSONParser().parse(request)
        data['commentid'] = cid
        serializer = LikeSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, 200)
        return Response(serializer.errors, status=400)
