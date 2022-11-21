from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from authors.models import Author
from .serializers import InboxSerializer
from .models import Inbox
from .models import Post
from .models import Comment
from comments.serializers import CommentRemoteCreationSerializer
from likes.serializers import CommentLikeCreationSerializer
from likes.models import Like
from authors.serializers import AuthorRemoteCreationSerializer
from posts.serializers import PostCreationWithIDSerializer

def check_author_and_create_serialization(data):
    author = Author.objects.filter(url=data['author']['url']).first()
    data['author']['id'] = data['author']['id'].split('/')[-1]
    if not author:
        return AuthorRemoteCreationSerializer(data=data['author'])
    return AuthorRemoteCreationSerializer(author, data=data['author'])

def handle_post_type_inbox(data, inbox):
    serializer = check_author_and_create_serialization(data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=400)
    author = serializer.save()
    post_id = data['id'].split('/')[-1]
    post = Post.objects.filter(id=post_id).first()
    if post:
        if inbox.posts.contains(post):
            return Response("The target inbox already contains this item", status=400)
        else:
            inbox.posts.add(post)
            inbox.save()
            return Response(InboxSerializer(inbox).data, status=201)
    data['id'] = post_id
    data['author'] = str(author.id)
    serializer = PostCreationWithIDSerializer(data=data)
    if not serializer.is_valid():
        author.delete()
        return Response(serializer.errors, status=400)        
    new_post = serializer.save()
    inbox.posts.add(new_post)
    inbox.save()
    return Response(InboxSerializer(inbox).data, status=201)

def handle_like_type_inbox(data, inbox):
    serializer = check_author_and_create_serialization(data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=400)
    author = serializer.save()
    object_url = data['object'].split('/')
    id = object_url[-1]
    if "comments" in object_url:
        comment = Comment.objects.filter(id=id).first()
        if not comment:
            return Response("The comment cannot be found", status=404)
        data['comment'] = str(comment.id)
    elif "posts" in object_url:
        post = Post.objects.filter(id=id).first()
        if not post:
            return Response("The post cannot be found", status=404)
        data['post'] = str(post.id)
    data['context'] = data['@context']
    data['author'] = str(author.id)
    like = Like.objects.filter(object=data['object'], author=str(author.id)).first()
    if like:
        if inbox.likes.contains(like):
            return Response("The target inbox already contains this item", status=400)
        else:
            inbox.likes.add(like)
            inbox.save()
            return Response(InboxSerializer(inbox).data, status=201)
    serializer = CommentLikeCreationSerializer(data=data)
    if not serializer.is_valid():
        author.delete()
        return Response(serializer.errors, status=400)
    new_like = serializer.save()
    inbox.likes.add(new_like)
    inbox.save()
    return Response(InboxSerializer(inbox).data, status=201)
    
def handle_comment_type_inbox(data, inbox):
    serializer = check_author_and_create_serialization(data)
    if not serializer.is_valid():
        return Response(serializer.errors, status=400)
    author = serializer.save()
    post_id = data['id'].split('/')[-3]
    post = Post.objects.filter(id=post_id).first()
    if not post:
        return Response("The post cannot be found", status=404)
    comment_id = data['id'].split('/')[-1]
    comment = Comment.objects.filter(id=comment_id).first()
    if comment:
        if inbox.comments.contains(comment):
            return Response("The target inbox already contains this item", status=400)
        else:
            inbox.comments.add(comment)
            inbox.save()
            return Response(InboxSerializer(inbox).data, status=201)
    data['id'] = comment_id
    data['author'] = str(author.id)
    data['post'] = post_id
    serializer = CommentRemoteCreationSerializer(data=data)
    if not serializer.is_valid():
        author.delete()
        return Response(serializer.errors, status=400)
    new_comment = serializer.save()
    inbox.comments.add(new_comment)
    inbox.save()
    return Response(InboxSerializer(inbox).data, status=201)

class InboxView(GenericAPIView):
    serializer_class = InboxSerializer
    queryset = Inbox.objects.all()

    def get(self, request, aid):
        """
        Get a list of posts sent to aid
        """
        try:
            Author.objects.get(pk=aid)
            inbox = Inbox.objects.get(author=aid)
        except Author.DoesNotExist as e:
            return Response(str(e), status=404)
        except Exception as e:
            return Response(str(e), status=400)
        serializer = InboxSerializer(inbox)
        return Response(serializer.data, status=200)

    def post(self, request, aid):
        """
        Post a post(post here refers to post, follow, like, and comment) to the author
        """
        try:
            Author.objects.get(pk=aid)
            inbox = Inbox.objects.get(author=aid)
        except Author.DoesNotExist as e:
            return Response(str(e), status=404)
        except Exception as e:
            return Response(str(e), status=400)
        data = request.data
        type = data['type']
        if type == "post":
            return handle_post_type_inbox(data, inbox)
        elif type == "like":
            return handle_like_type_inbox(data, inbox)
        elif type == "comment":
            return handle_comment_type_inbox(data, inbox)

    def delete(self, request, aid):
        """
        Delete all inbox connections, a.k.a. empty inbox
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
        return Response(status=204)
