from rest_framework import serializers
from .models import Comment
from authors.serializers import AuthorSerializer, AuthorSwaggerResponseSerializer, AuthorSwaggerRequestSerializer

class CommentViewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['comment', 'contentType']
        
class CommentSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField()
    id = serializers.SerializerMethodField()
    author = serializers.SerializerMethodField()
    published = serializers.DateTimeField(format="%Y-%m-%dT%H:%M:%SZ", required=False)
    class Meta:
        model = Comment
        fields = ['type', 'author', 'comment', 'contentType', 'published', 'id']

    def get_type(self, obj):
        return 'comment'

    def get_author(self, obj):
        return AuthorSerializer(obj.author).data

    def get_id(self, obj):
        if obj.url:
            return obj.url
        return str(obj.author.url) + '/posts/' + str(obj.post.id) + '/comments/' + str(obj.id)

class CommentCreationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'author', 'comment', 'post', 'contentType', 'published']
class CommentRemoteCreationSerializer(serializers.ModelSerializer):
    url = serializers.URLField(required=True)
    class Meta:
        model = Comment
        fields = ['id', 'url', 'author', 'comment', 'post', 'contentType', 'published']
        
class CommentsSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField()
    comments = serializers.SerializerMethodField()
    post = serializers.SerializerMethodField()
    id = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['type', 'post', 'id', 'comments']

    def get_comments(self, obj): 
        return CommentSerializer(obj, many=True).data

    def get_type(self, obj):
        return 'comments'

    def get_id(self, obj):
        return self.get_post(obj) + '/comments'

    def get_post(self, obj):
        return str(self.context['author_url']) + '/posts/' + str(self.context['pid'])
    
class CommentSwaggerResponseSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField()
    id = serializers.URLField(required=False)
    author = AuthorSwaggerResponseSerializer(required=False)
    comment = serializers.SerializerMethodField()
    published = serializers.DateTimeField(format="%Y-%m-%dT%H:%M:%SZ", required=False)
    class Meta:
        model = Comment
        fields = ['type', 'author', 'comment', 'contentType', 'published', 'id']

class CommentsSwaggerResponseSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField()
    post = serializers.URLField(required=False)
    id = serializers.URLField(required=False)
    comments = CommentSwaggerResponseSerializer(many=True, required=False)

    class Meta:
        model = Comment
        fields = ['type', 'post', 'id', 'comments']

class CommentSwaggerRequestSerializer(serializers.ModelSerializer):
    author = AuthorSwaggerRequestSerializer(required=True)
    comment = serializers.CharField(required=True)
    post = serializers.UUIDField(required=True)
    type = serializers.SerializerMethodField()
    published = serializers.DateTimeField(format="%Y-%m-%dT%H:%M:%SZ", required=False)
    class Meta:
        model = Comment
        fields = ['type', 'author', 'comment', 'post', 'contentType', 'published']


