from rest_framework import serializers
from .models import Post
from authors.models import Author
from authors.serializers import AuthorSerializer
import ast

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
    categories = serializers.SerializerMethodField()
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
        return str(obj.comment_set.all().count())

    def get_comments(self, obj):
        return self.get_id(obj) + '/comments'

    def get_author(self, obj):
        return AuthorSerializer(Author.objects.get(pk=obj.author.id)).data
    
    def get_categories(self, obj):
        categories_list = ast.literal_eval(obj.categories)
        return categories_list

class PostCreationSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField()
    id = serializers.UUIDField(read_only=True)
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
