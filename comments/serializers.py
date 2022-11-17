from rest_framework import serializers
from django.forms import CharField, UUIDField
from comments.models import Comment
from authors.models import Author
from authors.serializers import AuthorSerializer


class CommentSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField(read_only=True)
    id = UUIDField(required=True)
    author = AuthorSerializer()
    published = serializers.DateTimeField(format="%Y-%m-%dT%H:%M:%SZ", required=False)
    post = UUIDField(required=True)

    def get_type(self, obj):
        return 'comment'

    def get_author(self, obj):
        return AuthorSerializer(Author.objects.get(pk=obj.author.id)).data
    class Meta:
        model = Comment
        fields = ['type', 'comment', 'published', 'id', 'author', 'post']

    def create(self, validated_data):
        author_data = validated_data.pop('author')
        #update_or_create returns a tuple of (object, created)
        author = Author.objects.update_or_create(id=author_data.get('id'), defaults=author_data)[0]
        print(validated_data)
        comment = Comment.objects.create(author=author, **validated_data)
        return comment

class CommentsSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField(read_only=True)
    comments = serializers.SerializerMethodField(read_only=True)
    post = serializers.SerializerMethodField('_post')
    page = serializers.SerializerMethodField(read_only=True)
    size = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Comment
        fields = ['type', 'page', 'size', 'post', 'id', 'comments']

    def get_comments(self, obj): 
        return CommentSerializer(obj, many=True).data

    def get_type(self, obj):
        return 'comments'

    def get_page(self, obj):
        #TODO: get pagination working
        return 1

    def get_size(self, obj):
        #TODO: get pagination working
        return 5

    def _post(self, obj):
        pid = self.context.get('pid')
        if pid:
            return pid
        return None
