from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from likes.models import Like
from likes.serializers import LikedSerializer, LikesSerializer
from authors.models import Author
from posts.models import Post
from comments.models import Comment
import json

class LikedView(GenericAPIView):
    serializer_class = LikesSerializer
    queryset = Like.objects.all()
    def get(self, request, aid):
        """
        Get what public things given author has liked
        """
        try:
            liked = Author.objects.get(pk=aid).like_set.all()
        except Author.DoesNotExist as e:
            return Response(str(e), status=404)
        except Exception as e:
            return Response(str(e), status=400)
        serializer = LikedSerializer(liked)
        return Response(serializer.data, status=200)

class PostLikesView(GenericAPIView):
    serializer_class = LikesSerializer
    queryset = Like.objects.all()
    def get(self, request, aid, pid):
        """
        Retrieve likes for a given post
        """
        try:
            Author.objects.get(pk=aid)
            post = Post.objects.get(pk=pid)
        except (Author.DoesNotExist, Post.DoesNotExist) as e:
            return Response(str(e), status=404)
        except Exception as e:
            return Response(str(e), status=400)
        like = post.like_set.all()
        serializer = LikesSerializer(like)
        return Response(serializer.data, status=200)

class CommentLikesView(GenericAPIView):
    serializer_class = LikesSerializer
    queryset = Like.objects.all()
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
        likes = comment.like_set.all()
        serializer = LikesSerializer(likes)
        return Response(serializer.data, status=200)
