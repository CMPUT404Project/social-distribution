from django.shortcuts import render
from rest_framework.generics import GenericAPIView
from .serializers import NodeSerializer
from backend.permissions import CustomDjangoModelPermissions
from rest_framework.response import Response
from .models import Node

# Create your views here.
class NodeView(GenericAPIView):
    serializer_class = NodeSerializer
    queryset = Node.objects.all()
    permission_classes = [CustomDjangoModelPermissions]

    def get(self, request):
        """
        Get all nodes the server knows about
        """
        nodes = Node.objects.all()
        serializers = NodeSerializer(nodes, many=True)
        return Response(serializers.data, status=200)