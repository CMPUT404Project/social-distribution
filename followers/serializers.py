from rest_framework import serializers
from authors.models import Author
from authors.serializers import AuthorSerializer, AuthorSwaggerResponseSerializer

class FollowersSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField()
    items = serializers.SerializerMethodField()
    class Meta:
        model = Author
        fields = ['type', 'items']

    def get_type (self, obj):
        return "followers"

    def get_items(self, obj):
        return AuthorSerializer(obj, many=True).data

class FollowersSwaggerSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField()
    items = AuthorSwaggerResponseSerializer(many=True, required=False)
    class Meta:
        model = Author
        fields = ['type', 'items']
