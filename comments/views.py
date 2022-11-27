from rest_framework.response import Response
from authors.models import Author
from posts.models import Post
from comments.models import Comment
from comments.serializers import CommentSerializer, CommentsSerializer, CommentCreationSerializer, CommentViewSerializer, CommentsSwaggerResponseSerializer, CommentSwaggerResponseSerializer
from backend.pagination import CustomPagination
from backend.permissions import CustomDjangoModelPermissions
from rest_framework.generics import GenericAPIView
from drf_yasg.utils import swagger_auto_schema

class CommentView(GenericAPIView):
    serializer_class = CommentViewSerializer
    queryset = Comment.objects.all()
    permission_classes = [CustomDjangoModelPermissions]
    
    tag = "Comments"

    @swagger_auto_schema(tags=[tag], responses={200: CommentsSwaggerResponseSerializer, 400: "Bad Request", 404: "Author cannot be found/Post cannot be found"})  
    def get(self, request, aid, pid):
        """
        get the list of comments of the post whose id is pid (remote supported, paginated)
        """
        try:
            author = Author.objects.get(pk=aid)
            post = Post.objects.get(pk=pid)
        except (Author.DoesNotExist, Post.DoesNotExist) as e:
            return Response(str(e), status=404)
        except Exception as e:
            return Response(str(e), status=400)
        comments = post.comment_set.all()
        pagination = CustomPagination()
        paginated_comments = pagination.paginate(comments, page=request.GET.get('page'), size=request.GET.get('size'), order="published", ascending=False)
        serializer = CommentsSerializer(paginated_comments, context={"author_url": author.url,"pid":pid})
        return Response(serializer.data, status=200)

    @swagger_auto_schema(tags=[tag], responses={201: CommentSwaggerResponseSerializer, 400: "Bad Request", 404: "Author cannot be found/Post cannot be found"})  
    def post(self, request, aid, pid):
        """
        if you post an object of “type”:”comment”, it will add your comment to the post whose id is pid
        """
        try:
            Author.objects.get(pk=aid)
            Post.objects.get(pk=pid)
        except (Author.DoesNotExist, Post.DoesNotExist) as e:
            return Response(str(e), status=404)
        except Exception as e:
            return Response(str(e), status=400)
        data = request.data.copy()
        data.update({"post": pid, "author": aid})
        serializer = CommentCreationSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            comment = Comment.objects.get(pk=serializer.data.get('id'))
            view_serializer = CommentSerializer(comment)
            return Response(view_serializer.data, status=201)
        return Response(serializer.errors, status=400)

class CommentIDView(GenericAPIView):
    serializer_class = CommentsSerializer
    queryset = Comment.objects.all()
    permission_classes = [CustomDjangoModelPermissions]

    tag = "Comment"

    @swagger_auto_schema(tags=[tag], responses={200: CommentSwaggerResponseSerializer, 400: "Bad Request", 404: "Author cannot be found/Post cannot be found/Comment cannot be found"})  
    def get(self, request, aid, pid, cid):
        """
        Retrieve a comment cid
        """
        try:
            Author.objects.get(pk=aid)
            Post.objects.get(pk=pid)
            comment = Comment.objects.get(pk=cid)
        except (Author.DoesNotExist, Post.DoesNotExist, Comment.DoesNotExist) as e:
            return Response(str(e), status=404)
        except Exception as e:
            return Response(str(e), status=400)
        serializer = CommentSerializer(comment)
        return Response(serializer.data, status=200)
