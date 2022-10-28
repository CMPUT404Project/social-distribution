from django.contrib.auth.models import User
from rest_framework import serializers
from authors.serializers import AuthorSerializer

class UserSerializer(serializers.ModelSerializer):
    author = serializers.SerializerMethodField(read_only=True)

    def get_author(self, obj):
        return AuthorSerializer(obj.author).data

    class Meta:
        model = User
        fields = ('id', 'username', 'author', 'password')

class UserCreationSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('username', 'password')

    def create(self, validated_data):
        if self.is_valid():
            return User.objects.create_user(username=validated_data.get("username"), password=validated_data.get("password"))