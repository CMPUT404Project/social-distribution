from django.db import models
from rest_framework import serializers
from django.forms import CharField, UUIDField
from authors.models import Author
from posts.models import Post
from comments.models import Comment
from authors.serializers import AuthorSerializer
from likes.models import Like

class LikeSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField()
    author = AuthorSerializer()
    
    class Meta:
        model = Like
        fields = ['context', 'summary', 'type', 'author', 'object']

    def get_type(self, obj):
        return 'like'

    def get_author(self, obj):
        return AuthorSerializer(Author.objects.get(pk=obj.author.id)).data

class PostLikeCreationSerializer(serializers.ModelSerializer):    
    class Meta:
        model = Like
        fields = ['context', 'summary', 'author', 'object', 'post']

class CommentLikeCreationSerializer(serializers.ModelSerializer): 
    class Meta:
        model = Like
        fields = ['context', 'summary', 'author', 'object', 'comment']   

class LikesSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField()
    items = serializers.SerializerMethodField()
    
    class Meta:
        model = Like
        fields = ['type', 'items']

    def get_type(self, obj):
        return 'likes'

    def get_items(self, obj):
        return LikeSerializer(obj, many=True).data

class LikedSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField()
    items = serializers.SerializerMethodField()
    
    class Meta:
        model = Like
        fields = ['type', 'items']

    def get_type(self, obj):
        return 'liked'

    def get_items(self, obj):
        return LikeSerializer(obj, many=True).data