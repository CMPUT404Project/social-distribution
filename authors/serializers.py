from rest_framework import serializers
from .models import Author

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

    class Meta:
        model = Author
        fields = ['type', 'items']

    def get_items(self, obj): 
        return AuthorSerializer(obj, many=True).data

    def get_type(self, obj):
        return 'authors'

class AuthorCreationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = ['host', 'user']
