from rest_framework import serializers
from django.forms import CharField

from comment.models import Comment


class CommentSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField(read_only=True)
    id = CharField(required=True)

    def get_type(self, obj):
        return 'comment'

    class Meta:
        model = Comment
        #TODO: add author
        fields = ['type', 'comment', 'published', 'id']
        depth = 1
        
