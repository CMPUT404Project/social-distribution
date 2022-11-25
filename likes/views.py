from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from likes.models import Like
from likes.serializers import LikedSerializer, LikesSerializer, LikeSwaggerResponseSerializer, LikesSwaggerResponseSerializer
from authors.models import Author
from posts.models import Post
from comments.models import Comment
from backend.permissions import CustomDjangoModelPermissions
from drf_yasg.utils import swagger_auto_schema

class LikedView(GenericAPIView):
    serializer_class = LikesSerializer
    queryset = Like.objects.all()
    permission_classes = [CustomDjangoModelPermissions]
    tag = "Liked"

    @swagger_auto_schema(tags=[tag], responses={200: LikesSwaggerResponseSerializer, 400: "Bad Request", 404: "Author cannot be found" })
    def get(self, request, aid):
        """
        list what public things aid liked (remote supported)
        """
        try:
            liked = Author.objects.get(pk=aid).like_set.all().order_by('-published')
        except Author.DoesNotExist as e:
            return Response(str(e), status=404)
        except Exception as e:
            return Response(str(e), status=400)
        serializer = LikedSerializer(liked)
        return Response(serializer.data, status=200)

class PostLikesView(GenericAPIView):
    serializer_class = LikesSerializer
    queryset = Like.objects.all()
    permission_classes = [CustomDjangoModelPermissions]
    tag = "Likes"

    @swagger_auto_schema(tags=[tag], responses={200: LikesSwaggerResponseSerializer, 400: "Bad Request", 404: "Author cannot be found/Post cannot be found" })
    def get(self, request, aid, pid):
        """
        a list of likes from other authors on aid's post pid
        """
        try:
            Author.objects.get(pk=aid)
            post = Post.objects.get(pk=pid)
        except (Author.DoesNotExist, Post.DoesNotExist) as e:
            return Response(str(e), status=404)
        except Exception as e:
            return Response(str(e), status=400)
        like = post.like_set.all().order_by('-published')
        serializer = LikesSerializer(like)
        return Response(serializer.data, status=200)

class CommentLikesView(GenericAPIView):
    serializer_class = LikesSerializer
    queryset = Like.objects.all()
    permission_classes = [CustomDjangoModelPermissions]
    tag = "Likes"

    @swagger_auto_schema(tags=[tag], responses={200: LikesSwaggerResponseSerializer, 400: "Bad Request", 404: "Author cannot be found/Post cannot be found/Comment cannot be found" })
    def get(self, request, aid, pid, cid):
        """
        Retrieve likes for a given comment
        """
        try:
            Author.objects.get(pk=aid)
            Post.objects.get(pk=pid)
            comment = Comment.objects.get(pk=cid)
        except (Author.DoesNotExist, Post.DoesNotExist, Comment.DoesNotExist) as e:
            return Response(str(e), status=404)
        except Exception as e:
            return Response(str(e), status=400)
        likes = comment.like_set.all().order_by('-published')
        serializer = LikesSerializer(likes)
        return Response(serializer.data, status=200)
