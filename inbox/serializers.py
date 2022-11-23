from django.forms import UUIDField
from rest_framework import serializers
from posts.serializers import PostSerializer
from comments.serializers import CommentSerializer
from likes.serializers import LikeSerializer
from .models import Inbox
from followRequests.serializers import FollowRequestSerializer

class InboxSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField()
    items = serializers.SerializerMethodField()
    author = serializers.SerializerMethodField()

    class Meta:
        model = Inbox
        fields = ['type', 'author', 'items']

    def get_type(self, obj):
        return 'inbox'

    def get_author(self, obj):
        return obj.author.url

    def get_items(self, obj):
        result = []
        posts = obj.posts.all()
        comments = obj.comments.all()
        likes = obj.likes.all()
        follows = obj.followRequests.all()
        for post in posts:
            result.append(PostSerializer(post).data)
        for comment in comments:
            result.append(CommentSerializer(comment).data)
        for like in likes:
            result.append(LikeSerializer(like).data)
        for follow in follows:
            result.append(FollowRequestSerializer(follow).data)
        return result
    

class InboxCreationSerializer(serializers.ModelSerializer):
    author = UUIDField()

    class Meta:
        model = Inbox
        fields = ['author']

class InboxSwaggerSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField()
    items = serializers.SerializerMethodField()
    author = serializers.URLField(required=False)

    class Meta:
        model = Inbox
        fields = ['type', 'author', 'items']

