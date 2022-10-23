from django.db import models
from rest_framework import serializers
from .models import Author

class AuthorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Author
        fields = "__all__"

    # transform the id field to be the url
    def to_representation(self, obj):
        representation = super().to_representation(obj)
        print(representation)
        uuidStr = str(representation['id'])
        representation['id'] = obj.url + str(uuidStr)
        #url stored in database will not have uuid appended to it
        #TODO will need to check if this will cause issues
        representation['url'] = obj.url + str(uuidStr)
        return representation
