from rest_framework import serializers

from comments.models import Comments
from comment.models import Comment

class CommentsSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField(read_only=True)
    comments = serializers.SerializerMethodField(read_only=True)
    
    def get_comments(self, obj):
        return Comment.objects.filter(comments=obj.id).values()

    def get_type(self, obj):
        return 'comments'

    class Meta:
        model = Comments
        fields = '__all__'
