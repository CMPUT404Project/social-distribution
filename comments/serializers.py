from rest_framework import serializers
from django.forms import CharField, UUIDField

from comments.models import Comment
from authors.models import Author
from authors.serializers import AuthorSerializer


class CommentSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField(read_only=True)
    id = CharField(required=True)
    post = UUIDField(required=True)
    author = UUIDField(required=True)

    def get_type(self, obj):
        return 'comment'

    def get_author(self, obj):
        return AuthorSerializer(Author.objects.get(pk=obj.author.id)).data

    class Meta:
        model = Comment
        fields = ['type', 'comment', 'published', 'id', 'author']
