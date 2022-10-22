from cgi import test
import uuid
from comments.models import Comments
from comment.serializers import CommentSerializer
from comments.serializers import CommentsSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import Http404
from rest_framework import generics, status

class CommentsList(generics.ListCreateAPIView):
    queryset = Comments.objects.all()
    serializer_class = CommentsSerializer

class CommentsDetail(APIView):
    serializer_class = CommentsSerializer
    queryset = Comments.objects.all()
    def get(self, request, aid, pid, format=None):
        comments_pk = request.scheme+'://'+request.get_host()+request.path
        comments = Comments.objects.filter(id=comments_pk)
        return Response(CommentsSerializer(comments, many=True).data)

    #This is not an endpoint to create comments, as misleading as it is, this is actually used to create a comment
    #A comments object is created along with a posts object
    def post(self, request, aid, pid, format=None):
        comments_pk = request.scheme+'://'+request.get_host()+request.path
        new_comment_pk = comments_pk + str(uuid.uuid4())
        comment_data = request.data
        comment_data['comments'] = comments_pk
        comment_data['id'] = new_comment_pk
        serializer = CommentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

    def put(self, request, aid, pid, format=None):
        comments_pk = request.scheme+'://'+request.get_host()+request.path
        comments = Comments.objects.filter(id=comments_pk).first()
        serializer = CommentsSerializer(comments, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

