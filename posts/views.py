from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from .models import Post
from authors.models import Author
from .serializers import PostSerializer, PostCreationSerializer, PostsSerializer, PostCreationWithIDSerializer
from backend.pagination import CustomPagination

class PostView(GenericAPIView):
    serializer_class = PostSerializer
    queryset = Post.objects.all()

    def get(self, request, aid):
        """
        List posts for a given author
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

    def post(self, request, aid):
        """
        Create a new post
        Fields from client payload are: displayName, github, profileImage
        Fields filled in by server: host, url, id
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
            serializer.save()
            post = Post.objects.get(pk=serializer.data['id'])
            view_serializer = PostSerializer(post)
            return Response(view_serializer.data, status=201)
        return Response(serializer.errors, status=400)

class PostIDView(GenericAPIView):
    serializer_class = PostSerializer
    queryset = Post.objects.all()

    def get(self, request, aid, pid):
        """
        Retrieve a post
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

    def post(self, request, aid, pid):
        """
        Create a post with a pid
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
            serializer.save()
            post = Post.objects.get(pk=pid)
            view_serializer = PostSerializer(post)
            return Response(view_serializer.data, status=201)
        return Response(serializer.errors, status=400)
        

    def put(self, request, aid, pid):
        """
        Update a post
        """
        try:
            Author.objects.get(pk=aid)
            post = Post.objects.get(pk=pid)
        except (Author.DoesNotExist, Post.DoesNotExist) as e:
            return Response(str(e), status=404)
        except Exception as e:
            return Response(str(e), status=400)
        serializer = PostCreationSerializer(post, data=request.data)
        if serializer.is_valid():
            serializer.save()
            post = Post.objects.get(pk=serializer.data['id'])
            view_serializer = PostSerializer(post)
            return Response(view_serializer.data, status=200)
        return Response(serializer.errors, status=400)

    def delete(self, request, aid, pid):
        """
        Delete a post
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
