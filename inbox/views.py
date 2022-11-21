from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from rest_framework.parsers import JSONParser
from rest_framework.views import APIView
from rest_framework.response import Response
from authors.models import Author
from .serializers import InboxSerializer
from .models import Inbox
from .models import Post
from .models import Comment
from likes.serializers import CommentLikeCreationSerializer, PostLikeCreationSerializer
from likes.models import Like
from authors.serializers import AuthorSerializer, AuthorRemoteCreationSerializer
from posts.serializers import PostCreationWithIDSerializer
import json

def check_author_and_create_serialization(data):
    author = Author.objects.filter(url=data['author']['url']).first()
    data['author']['id'] = data['author']['id'].split('/')[-1]
    if not author:
        return AuthorRemoteCreationSerializer(data=data['author'])
    return AuthorRemoteCreationSerializer(author, data=data['author'])

def handle_post_type_inbox(data, inbox):
    serializer = check_author_and_create_serialization(data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=400)
    author = serializer.save()
    post_id = data['id'].split('/')[-1]
    post = Post.objects.filter(id=post_id).first()
    if post:
        if inbox.posts.contains(post):
            return Response("Post already sent to author", status=400)
        else:
            inbox.posts.add(post)
            inbox.save()
            return Response(InboxSerializer(inbox).data, status=201)
    data['id'] = post_id
    data['author'] = str(author.id)
    data['categories'] = str(data['categories'])
    serializer = PostCreationWithIDSerializer(data=data)
    if not serializer.is_valid():
        author.delete()
        return Response(serializer.errors, status=400)        
    new_post = serializer.save()
    inbox.posts.add(new_post)
    inbox.save()
    return Response(InboxSerializer(inbox).data, status=201)

class InboxView(APIView):
    serializer_class = InboxSerializer
    queryset = Inbox.objects.all()

    def get(self, request, aid):
        """
        Get a list of posts sent to aid
        """
        try:
            Author.objects.get(pk=aid)
            inbox = Inbox.objects.get(author=aid)
        except Author.DoesNotExist as e:
            return Response(str(e), status=404)
        except Exception as e:
            return Response(str(e), status=400)
        serializer = InboxSerializer(inbox)
        return Response(serializer.data, status=200)

    def post(self, request, aid):
        """
        Post a post(post here refers to post, follow, like, and comment) to the author
        """
        try:
            Author.objects.get(pk=aid)
            inbox = Inbox.objects.get(author=aid)
        except Author.DoesNotExist as e:
            return Response(str(e), status=404)
        except Exception as e:
            return Response(str(e), status=400)
        data = request.data
        type = data['type']
        if type == "post":
            return handle_post_type_inbox(data, inbox)
        elif type == "like":
            serializer = check_author_and_create_serialization(data)
            if not serializer.is_valid():
                return Response(serializer.errors, status=400)
            author = serializer.save()
            object_url = data['object'].split('/')
            if "comments" in object_url:
                comment_id = object_url[-1]
                comment = Comment.objects.filter(id=comment_id).first()
                if not comment:
                    return Response("The comment you are trying to like cannot be found", status=404)
                data['context'] = data['@context']
                data['comment'] = str(comment.id)
                data['author'] = str(author.id)
                like = Like.objects.filter(object=data['object'], author=str(author.id)).first()
                if like:
                    return Response("Like already sent to author", status=409)
                serializer = CommentLikeCreationSerializer(data=data)
                if not serializer.is_valid():
                    return Response(serializer.errors, status=400)
                new_like = serializer.save()
                inbox.likes.add(new_like)
                inbox.save()
                return Response(inbox, status=201)
            elif "posts" in object_url:
                post_id = object_url[-1]
                post = Post.objects.filter(id=post_id).first()
                if not post:
                    return Response("The post you are trying to like cannot be found", status=404)
                data['context'] = data['@context']
                data['post'] = str(post.id)
                data['author'] = str(author.id)
                like = Like.objects.filter(object=data['object'], author=str(author.id)).first()
                if like:
                    return Response("Like already sent to author", status=409)
                serializer = PostLikeCreationSerializer(data=data)
                if not serializer.is_valid():
                    return Response(serializer.errors, status=400)
                new_like = serializer.save()
                inbox.likes.add(new_like)
                inbox.save()
                return Response(InboxSerializer(inbox).data, status=201)
                
            # post = Post.objects.filter(id=post_id).first()
            # if not post:






    # def delete(self, request, aid):
    #     followers = Follower.objects.all()
    #     followers.delete()
    #     return Response(status=204)

# class FollowerIDView(APIView):
#     serializer_class = FollowerSerializer
#     queryset = Follower.objects.all()

#     def put(self, request, aid, fid):
#         """
#         Create a new follower
#         """
#         data = JSONParser().parse(request)
#         data['follower'] = fid
#         data['followed'] = aid
#         serializer = FollowerSerializer(data=data)
#         if serializer.is_valid():
#             serializer.save()
#             return Response(serializer.data, status=201)
#         return Response(serializer.errors, status=400)

#     def delete(self, request, aid, pid):
#         """
#         Delete a follower
#         """
#         try:
#             follower = Follower.objects.get(followed=aid, follower=fid)
#         except Follower.DoesNotExist:
#             return Response(status=404)
#         follower.delete()
#         return Response(status=204)
