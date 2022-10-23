from comment.models import Comment
from comment.serializers import CommentSerializer
from rest_framework import generics
from rest_framework.views import APIView

class CommentList(generics.ListCreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

class CommentDetail(APIView):
    def get(self, request, aid, pid, format=None):
        # get author via aid
        # get post via pid
        return Response(CommentsSerializer(comments, many=True).data)

    #This is not an endpoint to create comments, as misleading as it is, this is actually used to create a comment
    #A comments object is created along with a posts object
    def post(self, request, aid, pid, format=None):
        serializer = CommentSerializer(data=request.data)
        print(serializer)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
