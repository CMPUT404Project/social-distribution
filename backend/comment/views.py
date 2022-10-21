from comment.models import Comment
from comment.serializers import CommentSerializer
from rest_framework import generics
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import Http404

class CommentList(generics.ListCreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

# class CommentDetail(generics.RetrieveUpdateDestroyAPIView):
#     queryset = Comment.objects.all()
#     serializer_class = CommentSerializer

class CommentDetail(APIView):
    def get_object(self, pk):
        try:
            return Comment.objects.get(comments=pk)
        except Comment.DoesNotExist:
            raise Http404

    def get(self, request, pk, format=None):
        comment = self.get_object(pk)
        serializer = CommentSerializer(comment)
        return Response(serializer.data)   