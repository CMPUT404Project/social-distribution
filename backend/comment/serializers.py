from rest_framework import serializers

from comment.models import Comment


class CommentSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField(read_only=True)
    #TODO: Author serializer sync
    # author = serializers.SerializerMethodField(read_only=True)

    # def get_author(self, obj):
    #     return AuthorSerializer()

    def get_type(self, obj):
        return 'comment'

    class Meta:
        model = Comment
        fields = ['type', 'comment', 'published', 'id']
