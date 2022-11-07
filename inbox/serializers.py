from rest_framework import serializers
from inbox.models import Inbox
from authors.models import Author

class InboxSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField(read_only=True)
    author = serializers.SerializerMethodField(read_only=True)
    items = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Inbox
        fields = ['type', 'author', 'items']

    def get_type(self, obj):
        return 'inbox'

    def get_author(self, obj):
        author = Author.objects.get(pk=obj.id)
        return author.url

    def get_items(self, obj):
        return []

class InboxCreationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Inbox
        fields = ['id']

        
