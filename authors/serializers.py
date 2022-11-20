from rest_framework import serializers
from .models import Author
from backend.pagination import CustomPagination

class AuthorSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField()
    id = serializers.SerializerMethodField()

    class Meta:
        model = Author
        fields = ['type', 'id', 'host', 'url',
                  'displayName', 'github', 'profileImage']

    def get_type(self, obj):
        return 'author'

    def get_id(self, obj):
        return obj.url


class AuthorsSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField()
    items = serializers.SerializerMethodField()
    total_count = serializers.SerializerMethodField()

    class Meta:
        model = Author
        fields = ['type', 'total_count', 'items']
    
    def get_total_count(self, obj):
        return obj.count()

    def get_items(self, obj): 
        self.pagination = CustomPagination(self.context)
        authors = self.pagination.paginate(obj)
        return AuthorSerializer(authors, many=True).data

    def get_type(self, obj):
        return 'authors'

class AuthorCreationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ['host', 'user']
