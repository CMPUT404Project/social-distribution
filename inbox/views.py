from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from authors.models import Author
from .serializers import InboxSerializer, InboxSwaggerSerializer, InboxCommentsSerializer, InboxFollowsSerializer, InboxLikesSerializer, InboxPostsSerializer
from .models import Inbox
from .models import Post
from .models import Comment
from backend.permissions import CustomDjangoModelPermissions
from comments.serializers import CommentRemoteCreationSerializer, CommentSerializer, CommentSwaggerResponseSerializer, CommentSwaggerRequestSerializer
from likes.serializers import CommentLikeCreationSerializer, PostLikeCreationSerializer, LikeSerializer, LikeSwaggerRequestSerializer, LikeSwaggerResponseSerializer
from likes.models import Like
from authors.serializers import AuthorRemoteCreationSerializer
from posts.serializers import PostCreationWithIDSerializer, PostSerializer, PostSwaggerResponseSerializer, PostSwaggerRequestSerializer
import uuid
from drf_yasg.utils import swagger_auto_schema, no_body
from followRequests.models import FollowRequest
from followRequests.serializers import FollowRequestSerializer, FollowRequestCreationSerializer, FollowRequestSwaggerRequestSerializer, FollowRequestSwaggerResponseSerializer

def check_author_and_create_serialization(data):
    author = Author.objects.filter(url=data.get('author').get('url')).first()
    data['author']['id'] = data.get('author').get('id').split('/')[-1]
    if not author:
        return AuthorRemoteCreationSerializer(data=data.get('author'))
    return AuthorRemoteCreationSerializer(author, data=data.get('author'))

def handle_follow_type_inbox(data, author, inbox):
    follow_actor = Author.objects.filter(url=data['actor']['url']).first()
    data['actor']['id'] = data['actor']['id'].split('/')[-1]
    if not follow_actor:
        serializer = AuthorRemoteCreationSerializer(data=data['actor'])
    serializer = AuthorRemoteCreationSerializer(follow_actor, data=data['actor'])
    if not serializer.is_valid():
        return Response(serializer.errors, status=400)
    follow_actor = serializer.save()
    if author.followers.contains(follow_actor):
        return Response("You are already following this author", status=409)
    data['actor'] = str(follow_actor.id)
    follow_request = FollowRequest.objects.filter(actor=follow_actor, object=author).first()
    if follow_request:
        if inbox.followRequests.contains(follow_request):
            return Response("The target inbox already contains this item", status=409)
        inbox.followRequests.add(follow_request)
        inbox.save()
        return Response(FollowRequestSerializer(follow_request).data, status=201)
    data['object'] = author.id
    serializer = FollowRequestCreationSerializer(data=data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=400)
    new_follow_request = serializer.save()
    inbox.followRequests.add(new_follow_request)
    inbox.save()
    return Response(FollowRequestSerializer(new_follow_request).data, status=201)

def handle_post_type_inbox(data, inbox):
    serializer = check_author_and_create_serialization(data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=400)
    author = serializer.save()
    post_id = data.get('id').split('/')[-1]
    post = Post.objects.filter(id=post_id).first()
    if post:
        if inbox.posts.contains(post):
            return Response("The target inbox already contains this item", status=409)
        else:
            inbox.posts.add(post)
            inbox.save()
            return Response(PostSerializer(post).data, status=201)
    data['id'] = post_id
    data['author'] = str(author.id)
    serializer = PostCreationWithIDSerializer(data=data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=400)        
    new_post = serializer.save()
    inbox.posts.add(new_post)
    inbox.save()
    return Response(PostSerializer(new_post).data, status=201)

def handle_like_type_inbox(data, inbox):
    serializer = check_author_and_create_serialization(data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=400)
    author = serializer.save()
    object_url = data.get('object').split('/')
    id = object_url[-1]
    data['author'] = str(author.id)
    like = Like.objects.filter(object=data.get('object'), author=str(author.id)).first()
    if like:
        if inbox.likes.contains(like):
            return Response("The target inbox already contains this item", status=409)
        else:
            inbox.likes.add(like)
            inbox.save()
            return Response(LikeSerializer(like).data, status=201)
    if "comments" in object_url:
        post_author = object_url[-5]
        post = object_url[-3]
        comment = Comment.objects.filter(id=id, post=post, author=post_author).first()
        if not comment:
            return Response("The comment cannot be found", status=404)
        data['comment'] = str(comment.id)
        serializer = CommentLikeCreationSerializer(data=data)
    elif "posts" in object_url:
        post_author = object_url[-3]
        post = Post.objects.filter(id=id, author=post_author).first()
        if not post:
            return Response("The post cannot be found", status=404)
        data['post'] = str(post.id)
        serializer = PostLikeCreationSerializer(data=data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=400)
    new_like = serializer.save()
    inbox.likes.add(new_like)
    inbox.save()
    return Response(LikeSerializer(new_like).data, status=201)
    
def handle_comment_type_inbox(data, inbox):
    serializer = check_author_and_create_serialization(data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=400)
    author = serializer.save()
    post_id = data.get('post')
    post = Post.objects.filter(id=post_id).first()
    if not post:
        return Response("The post cannot be found", status=404)
    data['author'] = str(author.id)
    data['id'] = str(uuid.uuid4())
    data['url'] = post.author.url + '/posts/' + post_id + '/comments/' + data.get('id')
    serializer = CommentRemoteCreationSerializer(data=data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=400)
    new_comment = serializer.save()
    inbox.comments.add(new_comment)
    inbox.save()
    return Response(CommentSerializer(new_comment).data, status=201)

class InboxView(GenericAPIView):
    serializer_class = InboxSerializer
    queryset = Inbox.objects.all()
    permission_classes = [CustomDjangoModelPermissions]

    tag = "Inbox"
    @swagger_auto_schema(tags=[tag],responses={200: InboxSwaggerSerializer, 400: "Bad Request", 404: "Author cannot be found/Inbox cannot be found" })
    def get(self, request, aid):
        """
        get a list of posts sent to aid, query_parameters: type=["likes", "comments", "follows", "posts"]
        """
        try:
            Author.objects.get(pk=aid)
            inbox = Inbox.objects.get(author=aid)
        except (Author.DoesNotExist, Inbox.DoesNotExist) as e:
            return Response(str(e), status=404)
        except Exception as e:
            return Response(str(e), status=400)
        type = request.GET.get('type')
        if not type:
            serializer = InboxSerializer(inbox)
            return Response(serializer.data, status=200)
        if type.lower() == "likes":
            serializer = InboxLikesSerializer(inbox)
        elif type.lower() == "follows":
            serializer = InboxFollowsSerializer(inbox)
        elif type.lower() == "comments":
            serializer = InboxCommentsSerializer(inbox)
        elif type.lower() == "posts":
            serializer = InboxPostsSerializer(inbox)
        else:
            return Response("Please enter a valid query parameter", status=400)
        return Response(serializer.data, status=200)
        

    @swagger_auto_schema(tags=[tag], responses={204: "", 400: "Bad Request", 404: "Author cannot be found/Inbox cannot be found" })
    def delete(self, request, aid):
        """
        clear the inbox
        """
        try:
            Author.objects.get(pk=aid)
            inbox = Inbox.objects.get(author=aid)
        except Author.DoesNotExist as e:
            return Response(str(e), status=404)
        except Exception as e:
            return Response(str(e), status=400)
        inbox.comments.clear()
        inbox.likes.clear()
        inbox.posts.clear()
        inbox.followRequests.clear()
        return Response(status=204)
        
    @swagger_auto_schema(tags=[tag], request_body=no_body, responses={201: "*Look at the corresponding inbox create api method for exact response*", 400: "Bad Request", 404: "Author cannot be found/Inbox cannot be found" })
    def post(self, request, aid):
        """
        send a post to the author
        **type** must be present in request payload
        if the type is “post” then add that post to aid's inbox (follow authors_inbox_posts_create for exact request needed and response)
        if the type is “follow” then add that follow is added to aid's inbox to approve later (follow authors_inbox_follows_create for exact request needed and response)
        if the type is “like” then add that like to aid's inbox (follow authors_inbox_likes_create for exact request needed and response)
        if the type is “comment” then add that comment to aid's inbox (follow authors_inbox_comments_create for exact request needed and response)
        """
        try:
            author = Author.objects.get(pk=aid)
            inbox = Inbox.objects.get(author=aid)
        except Author.DoesNotExist as e:
            return Response(str(e), status=404)
        except Exception as e:
            return Response(str(e), status=400)
        data = request.data
        type = data.get('type')
        if type:
            if type.lower() == "post":
                return handle_post_type_inbox(data, inbox)
            elif type.lower() == "like":
                return handle_like_type_inbox(data, inbox)
            elif type.lower() == "follow":
                return handle_follow_type_inbox(data, author, inbox)
            elif type.lower() == "comment":
                return handle_comment_type_inbox(data, inbox)
        return Response("Please enter a valid type", status=400)
    
class InboxPostView(GenericAPIView):
    serializer_class = PostSwaggerRequestSerializer
    queryset = Inbox.objects.all()
    permission_classes = [CustomDjangoModelPermissions]

    tag = "Inbox"
    @swagger_auto_schema(tags=[tag], request_body=PostSwaggerRequestSerializer, responses={201: PostSwaggerResponseSerializer, 400: "Bad Request", 404: "Author cannot be found/Inbox cannot be found" })
    def post(self, request, aid):
        """
        send a post to the author (remote supported)
        """
        try:
            Author.objects.get(pk=aid)
            inbox = Inbox.objects.get(author=aid)
        except (Author.DoesNotExist, Inbox.DoesNotExist) as e:
            return Response(str(e), status=404)
        except Exception as e:
            return Response(str(e), status=400)
        data = request.data
        return handle_post_type_inbox(data, inbox)
    
class InboxLikeView(GenericAPIView):
    serializer_class = LikeSwaggerRequestSerializer
    queryset = Inbox.objects.all()
    permission_classes = [CustomDjangoModelPermissions]

    tag = "Inbox"
    @swagger_auto_schema(tags=[tag], request_body=LikeSwaggerRequestSerializer, responses={201: LikeSwaggerResponseSerializer, 400: "Bad Request", 404: "Author cannot be found/Inbox cannot be found" })
    def post(self, request, aid):
        """
        send a like to the author (remote supported)
        """
        try:
            Author.objects.get(pk=aid)
            inbox = Inbox.objects.get(author=aid)
        except (Author.DoesNotExist, Inbox.DoesNotExist) as e:
            return Response(str(e), status=404)
        except Exception as e:
            return Response(str(e), status=400)
        data = request.data
        return handle_like_type_inbox(data, inbox)
    
class InboxCommentView(GenericAPIView):
    serializer_class = CommentSwaggerRequestSerializer
    queryset = Inbox.objects.all()
    permission_classes = [CustomDjangoModelPermissions]

    tag="Inbox"
    @swagger_auto_schema(tags=[tag], request_body=CommentSwaggerRequestSerializer, responses={201: CommentSwaggerResponseSerializer, 400: "Bad Request", 404: "Author cannot be found/Inbox cannot be found" })
    def post(self, request, aid):
        """
        send a comment to the author (remote supported)
        """
        try:
            Author.objects.get(pk=aid)
            inbox = Inbox.objects.get(author=aid)
        except (Author.DoesNotExist, Inbox.DoesNotExist) as e:
            return Response(str(e), status=404)
        except Exception as e:
            return Response(str(e), status=400)
        data = request.data
        return handle_comment_type_inbox(data, inbox)
    
class InboxFollowView(GenericAPIView):
    serializer_class = FollowRequestSwaggerRequestSerializer
    queryset = Inbox.objects.all()

    tag = "Inbox"
    @swagger_auto_schema(tags=[tag], request_body=FollowRequestSwaggerRequestSerializer, responses={201: FollowRequestSwaggerResponseSerializer, 400: "Bad Request", 404: "Author cannot be found/Inbox cannot be found" })
    def post(self, request, aid):
        """
        add that follow is added to aid's inbox to approve later
        """
        try:
            author = Author.objects.get(pk=aid)
            inbox = Inbox.objects.get(author=aid)
        except (Author.DoesNotExist, Inbox.DoesNotExist) as e:
            return Response(str(e), status=404)
        except Exception as e:
            return Response(str(e), status=400)
        data = request.data
        return handle_follow_type_inbox(data, author, inbox)
