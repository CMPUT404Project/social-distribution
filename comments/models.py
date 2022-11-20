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
    post = models.ForeignKey(Post, on_delete = models.CASCADE)
    author = models.ForeignKey(Author, on_delete = models.CASCADE)
    contentType = models.CharField(max_length=30,choices = CONTENT_TYPES, default= "text/plain")
    published = models.DateTimeField(auto_now_add=True, blank=True)
    comment = models.TextField()
