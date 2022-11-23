from rest_framework import serializers
from .models import FollowRequest
from authors.serializers import AuthorSerializer

class FollowRequestSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField()
    actor = serializers.SerializerMethodField()
    object = serializers.SerializerMethodField()

    class Meta:
        model = FollowRequest
        fields = ['type', 'summary', 'actor', 'object']

    def get_type (self, obj):
        return "Follow"

    def get_actor(self, obj):
        return AuthorSerializer(obj.actor).data

    def get_object(self, obj):
        return AuthorSerializer(obj.object).data

class FollowRequestCreationSerializer(serializers.ModelSerializer):
    class Meta:
        model = FollowRequest
        fields = ['actor', 'object', 'summary']