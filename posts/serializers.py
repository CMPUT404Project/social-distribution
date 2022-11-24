from rest_framework import serializers
from .models import Post
from authors.models import Author
from authors.serializers import AuthorSerializer, AuthorSwaggerResponseSerializer, AuthorSwaggerRequestSerializer
import ast
import json
from rest_framework.response import Response

class PostsViewSerializer(serializers.ModelSerializer):
    categories = serializers.CharField(required=True, allow_blank=False)
    class Meta:
        model = Post
        fields = [
        'title', 
        'source', 
        'origin', 
        'description', 
        'contentType',
        'content',
        'categories', 
        'visibility', 
        'unlisted'
        ]

class PostsInboxSerializer(serializers.ModelSerializer):
    id = serializers.URLField()
    categories = serializers.CharField(required=True, allow_blank=True)
    class Meta:
        model = Post
        fields = [
        'title', 
        'id', 
        'source', 
        'origin', 
        'description', 
        'contentType', 
        'content',
        'author', 
        'categories',
        'published', 
        'visibility', 
        'unlisted'
        ]

class PostsSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField()
    items = serializers.SerializerMethodField()
    class Meta:
        model = Post
        fields = ['type', 
        'items'
        ]

    def get_type(self, obj):
        return "posts"

    def get_items(self, obj):
        return PostSerializer(obj, many=True).data

class PostsSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField()
    items = serializers.SerializerMethodField()
    class Meta:
        model = Post
        fields = ['type', 
        'items'
        ]

    def get_type(self, obj):
        return "posts"

    def get_items(self, obj):
        return PostSerializer(obj, many=True).data

class PostSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField()
    count = serializers.SerializerMethodField()
    comments = serializers.SerializerMethodField()
    id = serializers.SerializerMethodField()
    # categories is not updatable
    author = serializers.SerializerMethodField()
    class Meta:
        model = Post
        fields = ['type', 
        'title', 
        'id', 
        'source', 
        'origin', 
        'description', 
        'contentType',
        'content', 
        'author', 
        'categories', 
        'count', 
        'comments', 
        'published', 
        'visibility', 
        'unlisted'
        ]

    def get_type(self, obj):
        return "post"

    def get_id(self, obj):
        return str(obj.author.url) + '/posts/' + str(obj.id)

    def get_count(self, obj):
        return int(obj.comment_set.all().count())

    def get_comments(self, obj):
        return self.get_id(obj) + '/comments'

    def get_author(self, obj):
        return AuthorSerializer(Author.objects.get(pk=obj.author.id)).data

    def to_representation(self, instance):
        ret = super().to_representation(instance)
        categories = ret['categories']
        try:
            ret['categories'] = ast.literal_eval(categories) if categories != "" else "[]"
        except Exception as e:
            raise Exception('Please ensure categories is entered as a list of strings e.g. "categories": "[\'test\', \'test\']"')
        return ret

class PostCreationSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField()
    id = serializers.UUIDField(read_only=True)
    categories = serializers.CharField(required=True, allow_blank=False)
    class Meta:
        model = Post
        fields = ['type', 
        'title', 
        'id', 
        'source', 
        'origin', 
        'description', 
        'contentType', 
        'content',
        'author', 
        'categories', 
        'published', 
        'visibility', 
        'unlisted'
        ]

    def validate_categories(self, value):
        if "[" not in value and "]" not in value:
            raise serializers.ValidationError("Please enter a list of values.")
        return value

    def get_type(self, obj):
        return "post"

class PostCreationWithIDSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField()
    id = serializers.UUIDField()
    categories = serializers.CharField(required=True, allow_blank=False)
    class Meta:
        model = Post
        fields = ['type', 
        'title', 
        'id', 
        'source', 
        'origin', 
        'description', 
        'contentType', 
        'content',
        'author', 
        'categories',
        'published', 
        'visibility', 
        'unlisted'
        ]

    def get_type(self, obj):
        return "post"

    def validate_categories(self, value):
        if "[" not in value and "]" not in value:
            raise serializers.ValidationError("Please enter a list of values.")
        return value

class PostSwaggerResponseSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField()
    title = serializers.SerializerMethodField()
    count = serializers.IntegerField(required=False)
    comments = serializers.URLField(required=False)
    id = serializers.URLField(required=False)
    source = serializers.URLField(required=False)
    origin = serializers.URLField(required=False)
    published = serializers.DateTimeField(format="%Y-%m-%dT%H:%M:%SZ", required=False)
    categories = serializers.SerializerMethodField()
    author = AuthorSwaggerResponseSerializer(many=True, required=False)
    content = serializers.SerializerMethodField()
    class Meta:
        model = Post
        fields = ['type', 
        'title', 
        'id', 
        'source', 
        'origin', 
        'description', 
        'contentType',
        'content', 
        'author', 
        'categories', 
        'count', 
        'comments', 
        'published', 
        'visibility', 
        'unlisted'
        ]

class PostsSwaggerResponseSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField()
    items = PostSwaggerResponseSerializer(many=True, required=False)

    class Meta:
        model = Post
        fields = ['type', 'items']

class PostSwaggerRequestSerializer(serializers.ModelSerializer):
    id = serializers.URLField(required=True)
    title = serializers.URLField(required=True)
    categories = serializers.CharField(required=True, allow_blank=True)
    author = AuthorSwaggerRequestSerializer(required=True)
    class Meta:
        model = Post
        fields = [
        'title', 
        'id', 
        'source', 
        'origin', 
        'description', 
        'contentType', 
        'content',
        'author', 
        'categories',
        'published', 
        'visibility', 
        'unlisted'
        ]