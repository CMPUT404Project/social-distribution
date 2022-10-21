from comments.models import Comments
from comments.serializers import CommentsSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import Http404
from rest_framework import generics

class CommentsList(generics.ListCreateAPIView):
    queryset = Comments.objects.all()
    serializer_class = CommentsSerializer

class CommentsDetail(APIView):
    def get_object(self, pk):
        try:
            return Comments.objects.get(post=pk)
        except Comments.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        comments = self.get_object(pk)
        serializer = CommentsSerializer(comments)
        return Response(serializer.data)