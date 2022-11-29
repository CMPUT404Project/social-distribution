from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from .models import Post
from authors.models import Author
from .serializers import PostSerializer, PostCreationSerializer, PostsSerializer, PostCreationWithIDSerializer, PostsViewSerializer, PostSwaggerResponseSerializer, PostsSwaggerResponseSerializer
from backend.pagination import CustomPagination
from backend.permissions import CustomDjangoModelPermissions
from drf_yasg.utils import swagger_auto_schema

class PostView(GenericAPIView):
    serializer_class = PostsViewSerializer
    queryset = Post.objects.all()
    permission_classes = [CustomDjangoModelPermissions]
    tag = "Posts"

    @swagger_auto_schema(tags=[tag], responses={200: PostsSwaggerResponseSerializer, 400: "Bad Request", 404: "Author cannot be found"})
    def get(self, request, aid):
        """
        get the recent posts from author aid (remote supported, paginated)
        """
        try:
            Author.objects.get(pk=aid)
        except Author.DoesNotExist as e:
            return Response(str(e), status=404)
        except Exception as e:
            return Response(str(e), status=400)
        posts = Author.objects.get(pk=aid).post_set.all()
        pagination = CustomPagination()
        paginated_posts = pagination.paginate(posts, page=request.GET.get('page'), size=request.GET.get('size'), order='published', ascending=False)
        serializer = PostsSerializer(paginated_posts)
        return Response(serializer.data, status=200)

    @swagger_auto_schema(tags=[tag], request_body=PostsViewSerializer, responses={201: PostSwaggerResponseSerializer, 400: "Bad Request", 404: "Author cannot be found"})
    def post(self, request, aid):
        """
        create a new post but generate a new id
        """
        try:
            Author.objects.get(pk=aid)
        except Author.DoesNotExist as e:
            return Response(str(e), status=404)
        except Exception as e:
            return Response(str(e), status=400)
        data = request.data.copy()
        data.update({"author": aid})
        serializer = PostCreationSerializer(data=data)
        if serializer.is_valid():
            post = serializer.save()
            return Response(PostSerializer(post).data, status=201)
        return Response(serializer.errors, status=400)

class PostIDView(GenericAPIView):
    serializer_class = PostsViewSerializer
    queryset = Post.objects.all()
    permission_classes = [CustomDjangoModelPermissions]
    tag = "Post"

    @swagger_auto_schema(tags=[tag], responses={200: PostSwaggerResponseSerializer, 400: "Bad Request", 404: "Author cannot be found/Post cannot be found"})
    def get(self, request, aid, pid):
        """
        get the public post whose id is pid (remote supported)
        """
        try:
            Author.objects.get(pk=aid)
            post = Post.objects.get(pk=pid)
        except (Author.DoesNotExist, Post.DoesNotExist) as e:
            return Response(str(e), status=404)
        except Exception as e:
            return Response(str(e), status=400)
        serializer = PostSerializer(post)
        return Response(serializer.data, status=200)

    @swagger_auto_schema(tags=[tag], request_body=PostsViewSerializer, responses={200: PostSwaggerResponseSerializer, 400: "Bad Request", 404: "Author cannot be found", 409: "A post with that id already exists"})
    def post(self, request, aid, pid):
        """
        create a post where its id is pid
        """
        try:
            Author.objects.get(pk=aid)
            post = Post.objects.filter(pk=pid).first()
        except (Author.DoesNotExist) as e:
            return Response(str(e), status=404)
        except Exception as e:
            return Response(str(e), status=400)
        if post is not None:
            return Response("A post with that id already exists", status=409)
        data = request.data.copy()
        data.update({"author": aid, "id": pid})
        serializer = PostCreationWithIDSerializer(data=data)
        if serializer.is_valid():
            post = serializer.save()
            return Response(PostSerializer(post).data, status=201)
        return Response(serializer.errors, status=400)
        
    @swagger_auto_schema(tags=[tag], request_body=PostsViewSerializer, responses={200: PostSwaggerResponseSerializer, 400: "Bad Request", 404: "Author cannot be found/Post cannot be found"})
    def put(self, request, aid, pid):
        """
        update the post whose id is pid
        """
        try:
            Author.objects.get(pk=aid)
            post = Post.objects.get(pk=pid)
        except (Author.DoesNotExist, Post.DoesNotExist) as e:
            return Response(str(e), status=404)
        except Exception as e:
            return Response(str(e), status=400)
        data = request.data.copy()
        data.update({"author": aid, "id": pid})
        serializer = PostCreationSerializer(post, data=data)
        if serializer.is_valid():
            post = serializer.save()
            return Response(PostSerializer(post).data, status=200)
        return Response(serializer.errors, status=400)

    @swagger_auto_schema(tags=[tag], responses={204: "", 400: "Bad Request", 404: "Author cannot be found/Post cannot be found"})    
    def delete(self, request, aid, pid):
        """
        remove the post whose id is pid
        """
        try:
            Author.objects.get(pk=aid)
            post = Post.objects.get(pk=pid)
        except (Author.DoesNotExist, Post.DoesNotExist) as e:
            return Response(str(e), status=404)
        except Exception as e:
            return Response(str(e), status=400)
        post.delete()
        return Response(status=204)
