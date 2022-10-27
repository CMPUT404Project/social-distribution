from django.db import models
from rest_framework import serializers
from .models import Author

class AuthorSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField(read_only=True)
    id = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Author
        fields = ['type', 'id', 'host', 'url', 'displayName', 'github', 'profileImage']

    def get_type(self, obj):
        return 'author'

    def get_id(self, obj):
        return obj.url + "/" + str(obj.id)

