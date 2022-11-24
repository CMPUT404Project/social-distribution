from rest_framework.response import Response
from rest_framework import permissions
from .models import Author
from .serializers import AuthorSerializer, AuthorsSerializer, AuthorDRFSerializer, AuthorSwaggerResponseSerializer, AuthorsSwaggerResponseSerializer
from backend.pagination import CustomPagination
from rest_framework.generics import GenericAPIView
from drf_yasg.utils import swagger_auto_schema

class AuthorView(GenericAPIView):
    """
    retrieve all profiles on the server (remote supported, paginated)
    """
    queryset = Author.objects.all()
    serializer_class = AuthorsSerializer
    @swagger_auto_schema(responses={200: AuthorsSwaggerResponseSerializer})
    def get(self, request):
        authors = Author.objects.all()
        pagination = CustomPagination()
        paginated_authors = pagination.paginate(authors, page=request.GET.get('page'), size=request.GET.get('size'))
        serializer = AuthorsSerializer(paginated_authors)
        return Response(serializer.data, status=200)

class AuthorDetail(GenericAPIView):
    serializer_class = AuthorDRFSerializer
    queryset = Author.objects.all()
    # permission_classes = [permissions.IsAuthenticated]
    @swagger_auto_schema(responses={200: AuthorSwaggerResponseSerializer, 404: "Author cannot be found", 400: "Bad Request"})
    def get(self, request, aid):
        """
        retrieve aid's profile (remote supported)
        """
        try:
            author = Author.objects.get(pk=aid)
        except Author.DoesNotExist as e:
            return Response(str(e), status=404)
        except Exception as e:
            return Response(str(e), status=400)
        serializer = AuthorSerializer(author)
        return Response(serializer.data, status=200)

    @swagger_auto_schema(responses={200: AuthorSwaggerResponseSerializer, 404: "Author cannot be found", 400: "Bad Request"})
    def put(self, request, aid):
        """
        update aid's profile
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