from rest_framework.response import Response
from .serializers import FollowersSerializer, FollowersSwaggerSerializer
from authors.models import Author
from rest_framework.generics import GenericAPIView
from django.core.exceptions import ValidationError
from drf_yasg.utils import swagger_auto_schema, no_body

class FollowersView(GenericAPIView):
    """
    get a list of authors who are aid's followers (remote supported)
    """
    queryset = Author.objects.all()
    serializer_class = FollowersSerializer
    
    @swagger_auto_schema(responses={200: FollowersSwaggerSerializer, 404: "Author cannot be found", 400: "Bad Request"})
    def get(self, request, aid):
        try:
            author = Author.objects.get(id=aid)
            serializer = FollowersSerializer(author.followers)
        except Author.DoesNotExist as e:
            return Response(str(e), status=404)
        except Exception as e:
            return Response(str(e), status=400)
        return Response(serializer.data, status=200)

class FollowerDetailView(GenericAPIView):
    serializer_class = FollowersSerializer
    queryset = Author.objects.all()

    @swagger_auto_schema(responses={200: "true/false", 404: "Author cannot be found", 400: "Bad Request"})
    def get(self, request, aid, fid):
        """
        check if fid is a follower of aid (remote supported)
        """
        try:
            author = Author.objects.get(id=aid)
            follower = Author.objects.get(id=fid)
            if follower == author:
                raise ValidationError("Follower is the same as the followee")
        except Author.DoesNotExist as e:
            return Response(str(e), status=404)
        except Exception as e:
            return Response(str(e), status=400)
        if follower in author.followers.all():
            return Response(True, status=200)
        return Response(False, status=200)

    @swagger_auto_schema(request_body=no_body, responses={201: "Successfully added follower", 409: "Follower already exists", 404: "Author cannot be found/Follower cannot be found", 400: "Bad Request"})
    def put(self, request, aid, fid):
        """
        Add fid as a follower of aid (remote supported)
        """
        try:
            author = Author.objects.get(id=aid)
            follower = Author.objects.get(id=fid)
            if follower == author:
                raise ValidationError("Follower is the same as the followee")
        except Author.DoesNotExist as e:
            return Response(str(e), status=404)
        except Exception as e:
            return Response(str(e), status=400)
        if follower not in author.followers.all():
            author.followers.add(follower.id)
            return Response("Successfully added follower", status=201)
        return Response("Follower already exists", status=409)

    @swagger_auto_schema(responses={204: "", 409: "Follower already exists", 404: "Author cannot be found/Follower cannot be found", 400: "Bad Request"})
    def delete(self, request, aid, fid):
        """
        remove fid as a follower of aid (remote supported)
        """
        try:
            author = Author.objects.get(pk=aid)
            follower = Author.objects.get(pk=fid)
            if follower == author:
                raise ValidationError("Follower is the same as the followee")
        except Author.DoesNotExist as e:
            return Response(str(e), status=404)
        except Exception as e:
            return Response(str(e), status=400)
        if follower in author.followers.all():
            author.followers.remove(follower.id)
            return Response(status=204)
        return Response("Follower cannot be found", status=404)

