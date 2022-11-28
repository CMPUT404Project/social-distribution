from rest_framework import serializers
from .models import Author

class AuthorDRFSerializer(serializers.ModelSerializer):
    displayName = serializers.CharField(required=True)
    class Meta:
        model = Author
        fields = ['displayName', 'github', 'profileImage']

class AuthorSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField()
    id = serializers.SerializerMethodField()
    host = serializers.UUIDField(read_only=True)
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
    displayName = serializers.CharField(required=True)
    class Meta:
        model = Author
        fields = ['host', 'user', 'displayName', 'github', 'profileImage']

class AuthorRemoteCreationSerializer(serializers.ModelSerializer):
    id = serializers.UUIDField()
    displayName = serializers.CharField(required=True)
    class Meta:
        model = Author
        fields = ['id', 'host', 'url',
                  'displayName', 'github', 'profileImage']

class AuthorSwaggerResponseSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField()
    id = serializers.URLField(required=False)
    host = serializers.URLField(required=False)
    url = serializers.URLField(required=False)
    
    class Meta:
        model = Author
        fields = [
            'type',
            'id',
            'host',
            'url',
            'displayName',
            'github',
            'profileImage'
        ]

class AuthorsSwaggerResponseSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField()
    items = AuthorSwaggerResponseSerializer(many=True, required=False)
    
    class Meta:
        model = Author
        fields = ['type', 'items']

class AuthorSwaggerRequestSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField()
    id = serializers.URLField(required=True)
    host = serializers.URLField(required=True)
    url = serializers.URLField(required=True)
    displayName = serializers.CharField(required=True)
    
    class Meta:
        model = Author
        fields = [
            'type',
            'id',
            'host',
            'url',
            'displayName',
            'github',
            'profileImage'
        ]