
from django.db import models
from django.forms import CharField, UUIDField
from rest_framework import serializers
from authors.models import Author
from posts.models import Post
from comments.models import Comment
from followers.models import Follower
from likes.models import Like
from authors.serializers import AuthorSerializer
from posts.serializers import PostSerializer
from comments.serializers import CommentSerializer
from followRequest.serializers import FollowerSerializer
from likes.serializers import LikeSerializer

class InboxSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField(read_only=True)
    author = UUIDField(required=True)
    postid = PostSerializer(required=False)
    commentid = CommentSerializer(required=False)
    followerid = FollowerSerializer(required=False)
    likeid = LikeSerializer(required=False)

    class Meta:
        model = Inbox
        fields = ['type', 'author', 'postid', 'commentid', 'followerid', 'likeid']

    def get_type(self, obj):
        return 'inbox'

    def create(self, validated_data):
        author_data = validated_data.pop('author')
        author = Author.objects.get(pk=author_data.id)
        if validated_data.get('postid'):
            postid_data = validated_data.get('postid')
            post = Post.objects.update_or_create(id=postid_data.id, defaults=postid_data)[0]
        if validated_data.get('commentid'):
            commentid_data = validated_data.get('commentid')
            comment = Comment.objects.update_or_create(id=postid_data.id, defaults=postid_data)[0]
        if validated_data.get('followerid'):
            followerid_data = validated_data.get('followerid')
            follower = Follower.objects.update_or_create(id=postid_data.id, defaults=postid_data)[0]
        followerid_data = validated_data.pop('followerid')
        followerid = Follower.objects.get(pk=followerid_data.id)
        likeid_data = validated_data.pop('likeid')
        likeid = Like.objects.get(pk=likeid_data.id)
        return Inbox.objects.create(author=author, postid=postid, commentid=commentid, followerid=followerid, likeid=likeid)
