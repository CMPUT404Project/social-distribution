from django.db import models
from rest_framework import serializers
from authors.models import Author
from followers.models import Follower
from authors.serializers import AuthorSerializer

class FollowerSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = Follower
        fields = ['follower', 'followed', 'type']

    def get_type(self, obj):
        return 'follower'

    def get_follower(self, obj):
        return AuthorSerializer(Author.objects.get(pk= obj.follower)).data

    def get_followed(self, obj):
        return AuthorSerializer(Author.objects.get(pk= obj.followed)).data

class FollowersSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField(read_only=True)
    items = FollowerSerializer(many=True, read_only=True)
    
    class Meta:
        model = Follower
        fields = ['type', 'items']

    def get_type(self, obj):
        return 'followers'

    # def get_items(self, obj):
    #     return AuthorSerializer(obj.followed.all(), many=True).data
