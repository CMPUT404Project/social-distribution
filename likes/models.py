import uuid
from django.db import models
from authors.models import Author
from posts.models import Post
from comments.models import Comment

# Create your models here.
class Like(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    #do we want the url and host as a field?
    context = models.URLField(max_length=200)
    summary = models.CharField(max_length=200)
    author = models.ForeignKey(Author, on_delete = models.SET_NULL, null=True)
    object = models.URLField(max_length=200)
    postid = models.ForeignKey(Post, on_delete = models.SET_NULL, null=True)
    commentid = models.ForeignKey(Comment, on_delete = models.SET_NULL, null=True)