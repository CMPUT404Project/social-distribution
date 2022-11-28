from rest_framework import serializers
from .models import Node

class NodeSerializer(serializers.ModelSerializer):
    host = serializers.URLField(required=False)

    class Meta:
        model = Node
        fields = ['host']
