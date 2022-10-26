from django.db import models
from rest_framework import serializers
from .models import Post, Category
from authors.models import Author
from authors.serializers import AuthorSerializer
from comments.serializers import CommentSerializer

class PostSerializer(serializers.ModelSerializer):
    categories = serializers.ListSerializer(child=serializers.CharField(), required=False)
    count = serializers.SerializerMethodField(read_only=True)
    comments = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = Post
        fields = ['id', 'source', 'origin', 'description', 'contentType', 'author', 'categories', 'count', 'comments', 'published', 'visibility', 'unlisted']
    
    def get_count(self, obj):
        return str(obj.comment_set.all().count())

    def get_comments(self, obj):
        return CommentSerializer(obj.comment_set.all(), many=True).data

    def get_author(self, obj):
        return AuthorSerializer(Author.objects.get(pk=obj.author.id)).data

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['name']
