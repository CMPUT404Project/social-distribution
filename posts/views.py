from rest_framework.response import Response
from rest_framework.generics import GenericAPIView
from posts.models import Post
from authors.models import Author
from posts.serializers import PostSerializer, PostCreationSerializer
from backend.pagination import CustomPagination

class PostView(GenericAPIView):
    serializer_class = PostSerializer
    queryset = Post.objects.all()

    def get(self, request, aid):
        """
        List posts for a given author
        """
        posts = Author.objects.get(pk=aid).post_set.all()
        context={"request":request}
        pagination = CustomPagination(context)
        paginated_posts = pagination.paginate(posts)
        serializer = PostSerializer(paginated_posts, many=True)
        return Response(serializer.data, status=200)

    def post(self, request, aid):
        """
        Create a new post
        Fields from client payload are: displayName, github, profileImage
        Fields filled in by server: host, url, id
        """
        serializer = PostCreationSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            post = Post.objects.get(pk=serializer.data['id'])
            view_serializer = PostSerializer(post)
            return Response(view_serializer.data, status=201)
        return Response(serializer.errors, status=400)

    def delete(self, request, aid):
        posts = Post.objects.all()
        posts.delete()
        return Response(status=204)

class PostIDView(GenericAPIView):
    serializer_class = PostSerializer
    queryset = Post.objects.all()

    def get(self, request, aid, pid):
        """
        Retrieve a post
        """
        try:
            post = Post.objects.get(pk=pid)
        except Post.DoesNotExist:
            return Response(status=404)
        serializer = PostSerializer(post)
        return Response(serializer.data, status=200)

    def put(self, request, aid, pid):
        """
        Update a post
        """
        try:
            post = Post.objects.get(pk=pid)
        except Post.DoesNotExist:
            return Response(status=404)
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
            post = Post.objects.get(pk=pid)
        except Post.DoesNotExist:
            return Response(status=404)
        post.delete()
        return Response(status=204)
