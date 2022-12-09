from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from likes.models import Like
from posts.serializers import PostSerializer
from authors.models import Author
from posts.models import Post
from comments.models import Comment
from backend.permissions import CustomDjangoModelPermissions
from drf_yasg.utils import swagger_auto_schema
from django.http import HttpResponse
from django.core.files.base import ContentFile
import base64 

class ImageView(GenericAPIView):
    serializer_class = PostSerializer
    queryset = Post.objects.all()
    tag = "Image"

    def get(self, request, aid, pid):
        """
        get image as base64
        """
        try:
            Author.objects.get(pk=aid)
            post = Post.objects.get(pk=pid)
            if (post.contentType != "image/png;base64" and post.contentType != "image/jpeg;base64"):
                return Response({"message": "Post is not an image"}, status=400)
        except (Author.DoesNotExist, Post.DoesNotExist) as e:
            return Response(str(e), status=404)
        except Exception as e:
            return Response(str(e), status=400)
        serializer = PostSerializer(post)
        print(serializer.data["contentType"])
        decodedjpeg = base64.b64decode(serializer.data["content"].split(";base64,")[1])
        # decodedjpeg = base64.b64decode(serializer.data["content"])
        response = HttpResponse(decodedjpeg, serializer.data["contentType"], status=200)
        # image_result = open('filename.png', 'wb') # create a writable image and write the decoding result
        # image_result.write(image_64_decode)
        # return response
        return response
