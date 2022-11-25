from rest_framework import serializers
from authors.models import Author
from authors.serializers import AuthorSerializer, AuthorSwaggerResponseSerializer, AuthorSwaggerRequestSerializer
from likes.models import Like

class LikeSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField()
    author = serializers.SerializerMethodField()
    
    class Meta:
        model = Like
        fields = ['context', 'summary', 'type', 'author', 'object', 'published']

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

class LikeSwaggerRequestSerializer(serializers.ModelSerializer):
    author = AuthorSwaggerRequestSerializer(required=True)
    type = serializers.SerializerMethodField()
    class Meta:
        model = Like
        fields = ['context', 'summary', 'type', 'author', 'object']

class LikeSwaggerResponseSerializer(serializers.ModelSerializer):
    context = serializers.URLField(required=False)
    type = serializers.SerializerMethodField()
    summary = serializers.SerializerMethodField()
    author = AuthorSwaggerResponseSerializer(many=True, required=False)
    object = serializers.URLField(required=False)
    
    class Meta:
        model = Like
        fields = ['context', 'summary', 'type', 'author', 'object']

class LikesSwaggerResponseSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField()
    items = LikeSwaggerResponseSerializer(many=True, required=False)

    class Meta:
        model = Like
        fields = ['type', 'items']