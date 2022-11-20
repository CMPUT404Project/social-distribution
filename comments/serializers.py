from rest_framework import serializers
from comments.models import Comment
from authors.serializers import AuthorSerializer
from backend.pagination import CustomPagination
from collections import OrderedDict

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
        return str(obj.author.url) + '/posts/' + str(obj.post.id) + '/comments/' + str(obj.id)

class CommentCreationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ['id', 'author', 'comment', 'post', 'contentType', 'published']

class CommentsSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField()
    comments = serializers.SerializerMethodField()
    post = serializers.SerializerMethodField()
    id = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ['type', 'post', 'id', 'comments']

    def get_comments(self, obj): 
        self.pagination = CustomPagination(self.context)
        comments = self.pagination.paginate(obj)
        return CommentSerializer(comments, many=True).data

    def get_type(self, obj):
        return 'comments'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if self.context['request'].query_params.get('page') is None or self.context['request'].query_params.get('size') is None:
            return representation
        representation["page"] = int(self.context['request'].query_params.get('page'))
        representation["size"] = int(self.context['request'].query_params.get('size'))
        key_order = ('type', 'page', 'size', 'post', 'id', 'comments')
        new_representation = OrderedDict()
        for key in key_order:
            new_representation[key] = representation[key]
        return new_representation

    def get_id(self, obj):
        return self.context['post_url'] + '/comments/'

    def get_post(self, obj):
        return self.context['post_url']
