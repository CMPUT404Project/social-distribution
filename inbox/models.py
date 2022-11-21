import uuid
from django.db import models
from authors.models import Author
from posts.models import Post
from comments.models import Comment
from likes.models import Like

# Create your models here.
class Inbox(models.Model):
    author = models.OneToOneField(Author, on_delete = models.CASCADE, null=False, blank=False, unique=True)
    posts = models.ManyToManyField(Post, blank=True, symmetrical=False)
    comments = models.ManyToManyField(Comment, blank=True, symmetrical=False)
    # followerid = models.ForeignKey(FollowRequest, on_delete = models.CASCADE, null=True)
    likes = models.ManyToManyField(Like, blank=True, symmetrical=False)
