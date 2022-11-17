import uuid
from django.db import models
from authors.models import Author
from posts.models import Post
from comments.models import Comment
from followRequest.models import FollowRequest
from likes.models import Like

# Create your models here.
class Inbox(models.Model):
    author = models.ForeignKey(Author, on_delete = models.CASCADE, null=False)
    object = models.URLField(max_length=200)
    postid = models.ForeignKey(Post, on_delete = models.SET_NULL, null=True)
    commentid = models.ForeignKey(Comment, on_delete = models.SET_NULL, null=True)
    followerid = models.ForeignKey(FollowRequest, on_delete = models.SET_NULL, null=True)
    likeid = models.ForeignKey(Like, on_delete = models.SET_NULL, null=True)
