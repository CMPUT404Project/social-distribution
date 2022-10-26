from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.parsers import JSONParser
from rest_framework.generics import GenericAPIView
from followers.models import Follower
from followers.serializers import FollowerSerializer
from authors.models import Author
import json

class FollowerView(GenericAPIView):
    def get(self, request, aid):
        """
        List followers for a given author
        """
        #get all followers for author
        followers = Follower.objects.filter(followed=aid)
        serializer = FollowerSerializer(followers, many=True)
        return JsonResponse(serializer.data, safe=False)


    def delete(self, request, aid):
        followers = Follower.objects.all()
        followers.delete()
        return HttpResponse(status=204)

def createFollowerJSONPayload(request, aid, fid):
    """
    Create a JSON payload for a follower
    """
    jsonData = json.dumps({})
    jsonData['follower'] = fid
    jsonData['followed'] = aid
    return jsonData

class FollowerIDView(GenericAPIView):
    def get(self, request, aid, fid):
        """
        Retrieve a follower
        """
        try:
            follower = Follower.objects.get(followed=aid, follower=fid)
        except Follower.DoesNotExist:
            return HttpResponse(status=404)
        serializer = FollowerSerializer(follower)
        return JsonResponse(serializer.data)

    def post(self, request, aid, fid):
        """
        Create a new follower
        """
        data = createFollowerJSONPayload(request, aid, fid)
        serializer = FollowerSerializer(data=data)
        print(serializer)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=400)

    def delete(self, request, aid, pid):
        """
        Delete a follower
        """
        try:
            follower = Follower.objects.get(followed=aid, follower=fid)
        except Follower.DoesNotExist:
            return HttpResponse(status=404)
        follower.delete()
        return HttpResponse(status=204)
