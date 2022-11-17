from django.db import models
from rest_framework import serializers
from authors.models import Author
from followers.models import Follower
from authors.serializers import AuthorSerializer

class FollowRequestSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField(read_only=True)
    summary = TextField()
    actor = AuthorSerializer()
    object = AuthorSerializer()
    
    class Meta:
        model = Follower
        fields = ['actor', 'summary', 'object', 'type']

    def get_type(self, obj):
        return 'follow'

    def create(self, validated_data):
        actor_data = validated_data.pop('actor')
        actor = Author.objects.update_or_create(id=actor_data['id'], defaults=actor_data)[0]
        object_data = validated_data.pop('object')
        object = Author.objects.get(pk=object_data['id'])
        summary = validated_data['summary']
        return Follower.objects.create(actor=actor, object=object, summary=summary)

