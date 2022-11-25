from rest_framework.generics import GenericAPIView
from .models import FollowRequest
from .serializers import FollowRequestSerializer
from rest_framework.response import Response
from backend.permissions import CustomDjangoModelPermissions
from drf_yasg.utils import swagger_auto_schema

# Create your views here.
class FollowRequestDetail(GenericAPIView):
    serializer_class = FollowRequestSerializer
    queryset = FollowRequest.objects.all()
    permission_classes = [CustomDjangoModelPermissions]
    tag = "FollowRequest" 

    @swagger_auto_schema(tags=[tag], responses={204: "", 404: "FollowRequest cannot be found", 400: "Bad Request"})
    def delete(self, request, aid, fid):
        """
        delete a follow request
        """
        try:
            follow_request = FollowRequest.objects.get(actor=fid, objects=aid)
        except FollowRequest.DoesNotExist as e:
            return Response(str(e), status=404)
        except Exception as e:
            return Response(str(e), status=400)
        follow_request.delete()
        return Response(status=204)
        