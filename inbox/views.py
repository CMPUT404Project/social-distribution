from django.http import HttpResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions
from inbox.models import Inbox
from django.http import HttpResponse
from inbox.serializers import InboxSerializer

class InboxDetail(APIView):
    serializer_class = InboxSerializer
    queryset = Inbox.objects.all()

    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, aid):
        """
        Retrieve a single inbox for the author.
        """
        try:
            inbox = Inbox.objects.get(pk=aid)
        except Inbox.DoesNotExist:
            return HttpResponse(status=404)
        serializer = InboxSerializer(inbox)
        return Response(serializer.data)
