from rest_framework import serializers
from .models import Author
from django.core.paginator import Paginator 
from backend.pagination import CustomPagination

class AuthorSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField(read_only=True)
    id = serializers.SerializerMethodField(read_only=True)

    class Meta:
        ordering = 'id'
        model = Author
        fields = ['type', 'id', 'host', 'url',
                  'displayName', 'github', 'profileImage']

    def get_type(self, obj):
        return 'author'

    def get_id(self, obj):
        return obj.url


class AuthorsSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField(read_only=True)
    items = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Author
        fields = ['type', 'items']

    def get_items(self, obj): 
        pagination = CustomPagination(self.context)
        author = pagination.paginate(obj)
        return AuthorSerializer(author, many=True).data

    def get_type(self, obj):
        return 'authors'


class AuthorCreationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ['host', 'user']
