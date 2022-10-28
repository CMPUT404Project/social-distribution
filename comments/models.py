import uuid
from django.db import models
from authors.models import Author
from posts.models import Post
# Create your models here.
class Comment(models.Model):
    CONTENT_TYPES = [
        ("text/markdown", "text/markdown"),
        ("text/plain", "text/plain"),
        ("application/base64","application/base64"),
        ("image/png;base64","image/png;base64"),
        ("image/jpeg;base64","image/jpeg;base64")
    ]
    id = models.UUIDField(max_length=250, primary_key=True, editable=False, default=uuid.uuid4)
    url = models.URLField(max_length=500, editable=False)
    post = models.ForeignKey(Post, on_delete = models.CASCADE, null=True)
    author = models.ForeignKey(Author, on_delete = models.SET_NULL, null=True)
    contentType = models.CharField(max_length=30,choices = CONTENT_TYPES, default= "text/plain")
    comment = models.TextField()
    published = models.DateTimeField(auto_now_add=True, blank=True)
