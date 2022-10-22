from django.forms import CharField
from rest_framework import serializers

from comments.models import Comments
from comment.serializers import CommentSerializer

class CommentsSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField(read_only=True)
    comments = serializers.SerializerMethodField(read_only=True)
    id = CharField(required=True)
    # post = serializers.SerializerMethodField(read_only=True)
    
    def get_comments(self, obj):
        return CommentSerializer(obj.comment_set.all(), many=True).data

    # def get_post(self, obj):
    #     return obj.post.id

    def get_type(self, obj):
        return 'comments'

    class Meta:
        model = Comments
        fields = '__all__'
