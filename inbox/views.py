from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from rest_framework.parsers import JSONParser
from rest_framework.views import APIView
from rest_framework.response import Response
from followers.models import Follower
from followers.serializers import FollowerSerializer, FollowersSerializer
from authors.models import Author
import json

class FollowerView(APIView):
    serializer_class = FollowerSerializer
    queryset = Follower.objects.all()

    def get(self, request, aid):
        """
        List followers for a given author
        """
        #get all followers for author
        followers = Author.objects.get(id=aid).followed.all()
        serializer = FollowersSerializer(followers)
        return Response(serializer.data)

    def delete(self, request, aid):
        followers = Follower.objects.all()
        followers.delete()
        return Response(status=204)

class FollowerIDView(APIView):
    serializer_class = FollowerSerializer
    queryset = Follower.objects.all()

    def put(self, request, aid, fid):
        """
        Create a new follower
        """
        data = JSONParser().parse(request)
        data['follower'] = fid
        data['followed'] = aid
        serializer = FollowerSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

    def delete(self, request, aid, pid):
        """
        Delete a follower
        """
        try:
            follower = Follower.objects.get(followed=aid, follower=fid)
        except Follower.DoesNotExist:
            return Response(status=404)
        follower.delete()
        return Response(status=204)
