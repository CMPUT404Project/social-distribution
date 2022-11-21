from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from .models import Author
from .serializers import AuthorSerializer, AuthorsSerializer
from backend.pagination import CustomPagination

class AuthorView(ListAPIView):
    """
    Retrieve all authors on server.
    """
    queryset = Author.objects.all()
    serializer_class = AuthorsSerializer
    def get(self, request):
        authors = Author.objects.all()
        pagination = CustomPagination()
        paginated_authors = pagination.paginate(authors, page=request.GET.get('page'), size=request.GET.get('size'))
        serializer = AuthorsSerializer(paginated_authors)
        return Response(serializer.data, status=200)

class AuthorDetail(APIView):
    serializer_class = AuthorSerializer
    queryset = Author.objects.all()
    # permission_classes = [permissions.IsAuthenticated]
    def get(self, request, aid):
        """
        Retrieve a single author.
        """
        try:
            author = Author.objects.get(pk=aid)
        except Author.DoesNotExist as e:
            return Response(str(e), status=404)
        except Exception as e:
            return Response(str(e), status=400)
        serializer = AuthorSerializer(author)
        return Response(serializer.data, status=200)

    def put(self, request, aid):
        """
        Update a single author
        """
        try:
            author = Author.objects.get(pk=aid)
        except Author.DoesNotExist as e:
            return Response(str(e), status=404)
        except Exception as e:
            return Response(str(e), status=400)
        serializer = AuthorSerializer(author, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=200)
        return Response(serializer.errors, status=400)