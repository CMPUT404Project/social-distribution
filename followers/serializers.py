from django.db import models
from django.forms import CharField, UUIDField
from rest_framework import serializers
from authors.models import Author
from followers.models import Follower
from authors.serializers import AuthorSerializer, AuthorsSerializer

class FollowerSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField(read_only=True)
    follower = UUIDField(required=True)
    followed = UUIDField(required=True)
    
    class Meta:
        model = Follower
        fields = ['follower', 'followed', 'type']

    def get_type(self, obj):
        return 'follower'

    def get_follower(self, obj):
        return AuthorSerializer(Author.objects.get(pk= obj.follower)).data

    def get_followed(self, obj):
        return AuthorSerializer(Author.objects.get(pk= obj.followed)).data

    def create(self, validated_data):
        follower_data = validated_data.pop('follower')
        follower = Author.objects.get(pk=follower_data.id)
        followed_data = validated_data.pop('followed')
        followed = Author.objects.get(pk=followed_data.id)
        return Follower.objects.create(follower=follower, followed=followed)
        # return Follower.objects.update_or_create(follower=follower, followed=followed)

class FollowerOutputSerializer(serializers.ModelSerializer):
    follower = AuthorSerializer()
    
    class Meta:
        model = Author
        fields = ['follower']


class FollowersSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField(read_only=True)
    items = serializers.SerializerMethodField(read_only=True)
    
    class Meta:
        model = Author
        fields = ['type', 'items']

    def get_type(self, obj):
        return 'followers'

    def get_items(self, obj):
        return FollowerOutputSerializer(obj, many=True).data
