from django.db import models
from rest_framework import serializers
from authors.models import Author
from likes.models import Like

class LikeSerizializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = Like
        fields = ['type', 'context', 'summary' 'author', 'object']

    def get_type(self, obj):
        return 'like'

    def get_author(self, obj):
        return AuthorSerializer(Author.objects.get(pk=obj.author.id)).data
