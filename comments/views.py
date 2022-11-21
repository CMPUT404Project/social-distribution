from rest_framework.views import APIView
from rest_framework.response import Response
from authors.models import Author
from posts.models import Post
from comments.models import Comment
from comments.serializers import CommentSerializer, CommentsSerializer, CommentCreationSerializer
from backend.pagination import CustomPagination

class CommentView(APIView):
    serializer_class = CommentSerializer
    queryset = Comment.objects.all()

    def get(self, request, aid, pid):
        """
        List comments for a given post
        """
        try:
            author = Author.objects.get(pk=aid)
            post = Post.objects.get(pk=pid)
        except (Author.DoesNotExist, Post.DoesNotExist) as e:
            return Response(str(e), status=404)
        comments = post.comment_set.all()
        pagination = CustomPagination()
        paginated_comments = pagination.paginate(comments, page=request.GET.get('page'), size=request.GET.get('size'))
        serializer = CommentsSerializer(paginated_comments, context={"author_url": author.url,"pid":pid})
        return Response(serializer.data, status=200)

    def post(self, request, aid, pid):
        """
        Create a new comment
        """
        try:
            Author.objects.get(pk=aid)
            Post.objects.get(pk=pid)
        except (Author.DoesNotExist, Post.DoesNotExist) as e:
            return Response(str(e), status=404)
        data = request.data.copy()
        data.update({"post": pid, "author": aid})
        serializer = CommentCreationSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            comment = Comment.objects.get(pk=serializer.data['id'])
            view_serializer = CommentSerializer(comment)
            return Response(view_serializer.data, status=201)
        return Response(serializer.errors, status=400)

class CommentIDView(APIView):
    serializer_class = CommentsSerializer
    queryset = Comment.objects.all()

    def get(self, request, aid, pid, cid):
        """
        Retrieve a comment
        """
        try:
            Author.objects.get(pk=aid)
            Post.objects.get(pk=pid)
            comment = Comment.objects.get(pk=cid)
        except (Author.DoesNotExist, Post.DoesNotExist, Comment.DoesNotExist) as e:
            return Response(str(e), status=404)
        serializer = CommentSerializer(comment)
        return Response(serializer.data, status=200)
