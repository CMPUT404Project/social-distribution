from django.db import models
from rest_framework import serializers
from .models import Author

class AuthorSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Author
        fields = ['type', 'id', 'host', 'url', 'displayName', 'github', 'profileImage']

    def get_type(self, obj):
        return 'author'

    # transform the id field to be the url
    def to_representation(self, obj):
        representation = super().to_representation(obj)
        print(representation)
        uuidStr = str(representation['id'])
        representation['id'] = obj.url + "/" + str(uuidStr)
        return representation

    def to_internal_value(self, data):
        return super().to_internal_value(data)
