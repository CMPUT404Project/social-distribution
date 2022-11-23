from rest_framework.generics import GenericAPIView
from .models import FollowRequest
from .serializers import FollowRequestSerializer
from rest_framework.response import Response

# Create your views here.
class FollowRequestDetail(GenericAPIView):
    serializer_class = FollowRequestSerializer
    queryset = FollowRequest.objects.all()

    def delete(self, request, aid, fid):
        try:
            follow_request = FollowRequest.objects.get(actor=fid, objects=aid)
        except FollowRequest.DoesNotExist as e:
            return Response(str(e), status=404)
        follow_request.delete()
        return Response(status=204)
        