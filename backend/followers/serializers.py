from django.db import models
from rest_framework import serializers
from authors.models import Author
from followers.models import Follower
from authors.serializers import AuthorSerializer

class FollowerSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = Follower
        fields = ['type', 'items']

    def get_type(self, obj):
        return 'followers'

    def get_items(self, obj):
        return AuthorSerializer(Author.objects.followed_set.all(), many=True).data
