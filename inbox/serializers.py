
from django.db import models
from django.forms import CharField, UUIDField
from rest_framework import serializers
from authors.models import Author
from posts.models import Post
from comments.models import Comment
from likes.models import Like
from posts.serializers import PostSerializer
from comments.serializers import CommentSerializer
from likes.serializers import LikeSerializer
from .models import Inbox

class InboxSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField()
    items = serializers.SerializerMethodField()
    author = serializers.SerializerMethodField()

    class Meta:
        model = Inbox
        fields = ['type', 'author', 'items']

    def get_type(self, obj):
        return 'inbox'

    def get_author(self, obj):
        return obj.author.url

    def get_items(self, obj):
        result = []
        posts = obj.posts.all()
        comments = obj.comments.all()
        likes = obj.likes.all()
        for post in posts:
            result.append(PostSerializer(post).data)
        for comment in comments:
            result.append(CommentSerializer(comment).data)
        for like in likes:
            result.append(LikeSerializer(like).data)
        return result
    

class InboxCreationSerializer(serializers.ModelSerializer):
    author = UUIDField()

    class Meta:
        model = Inbox
        fields = ['author']

# class InboxAddPostSerializer(serializers.ModelSerializer):
    
