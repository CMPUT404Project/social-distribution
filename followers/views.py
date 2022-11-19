from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from followers.serializers import FollowersSerializer
from authors.models import Author
from django.core.exceptions import ValidationError

class FollowersView(ListAPIView):
    """
    List followers for a given author
    """
    queryset = Author.objects.all()
    serializer_class = FollowersSerializer

    def get(self, request, aid):
        try:
            author = Author.objects.get(id=aid)
            serializer = FollowersSerializer(author.followers)
            return Response(serializer.data, status=200)
        except Author.DoesNotExist:
            return Response(status=404)
        except:
            return Response(status=400)

class FollowerDetailView(APIView):
    serializer_class = FollowersSerializer
    queryset = Author.objects.all()

    def get(self, request, aid, fid):
        """
        Check if follower is a follower of author
        """
        try:
            author = Author.objects.get(id=aid)
            follower = Author.objects.get(id=fid)
            if follower not in author.followers.all():
                return Response(status=404)
            else:
                return Response(f'{fid} is a follower of {aid}.', status=200)
        except Author.DoesNotExist:
            return Response(status=404)
        except:
            return Response(status=400)

    def put(self, request, aid, fid):
        """
        Add follower to author
        """
        try:
            author = Author.objects.get(id=aid)
            follower = Author.objects.get(id=fid)
            if follower == author:
                raise ValidationError
            if follower not in author.followers.all():
                author.followers.add(follower.id)
            return Response("Successfully added follower", status=200)
        except Author.DoesNotExist:
            return Response(status=404)
        except:
            return Response(status=400)

    def delete(self, request, aid, fid):
        """
        Delete a follower
        """
        try:
            author = Author.objects.get(pk=aid)
            follower = Author.objects.get(pk=fid)
            if follower == author:
                raise ValidationError
            if follower in author.followers.all():
                author.followers.remove(follower.id)
            return Response(status=204)
        except Author.DoesNotExist:
            return Response(status=404)
        except:
            return Response(status=400)

