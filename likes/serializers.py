from django.db import models
from rest_framework import serializers
from django.forms import CharField, UUIDField
from authors.models import Author
from posts.models import Post
from comments.models import Comment
from authors.serializers import AuthorSerializer
from likes.models import Like

class LikeSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField(read_only=True)
    author = AuthorSerializer()
    postid = UUIDField(required=False)
    commentid = UUIDField(required=False)
    
    class Meta:
        model = Like
        fields = ['type', 'context', 'summary', 'author', 'object', 'postid', 'commentid']

    def get_type(self, obj):
        return 'like'

    def get_author(self, obj):
        return AuthorSerializer(Author.objects.get(pk=obj.author.id)).data

    def to_representation(self, instance):
        data = super().to_representation(instance)
        data.pop('postid')
        data.pop('commentid')
        return data

    def create(self, validated_data):
        author_data = validated_data.pop('author')
        author = Author.objects.update_or_create(id=author_data.get('id'), defaults=author_data)[0]
        return Like.objects.create(author=author, **validated_data)

class LikesSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField(read_only=True)
    items = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = Like
        fields = ['type', 'items']

    def get_type(self, obj):
        return 'likes'

    def get_items(self, obj):
        return LikeSerializer(obj, many=True).data

class LikedSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField(read_only=True)
    items = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = Like
        fields = ['type', 'items']

    def get_type(self, obj):
        return 'liked'

    def get_items(self, obj):
        return LikeSerializer(obj, many=True).data
