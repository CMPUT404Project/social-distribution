import uuid
from django.db import models
from authors.models import Author

class Post(models.Model):
    CONTENT_TYPES = [
        ("text/markdown", "text/markdown"),
        ("text/plain", "text/plain"),
        ("application/base64","application/base64"),
        ("image/png;base64","image/png;base64"),
        ("image/jpeg;base64","image/jpeg;base64")
    ]
    VISIBILITY_TYPES = [
        ("PUBLIC", "PUBLIC"),
        ("FRIEND", "FRIEND")
    ]
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    #do we want the url and host as a field?
    source = models.URLField(max_length=200)
    origin = models.URLField(max_length=200)
    description = models.CharField(max_length=200)
    contentType = models.CharField(max_length=200, choices = CONTENT_TYPES, default= "text/plain")
    author = models.ForeignKey(Author, on_delete = models.SET_NULL, null=True)
    published = models.DateTimeField(auto_now_add=True, blank=True)
    categories = models.CharField(max_length=200, blank=True)
    visibility = models.CharField(max_length=200, choices = VISIBILITY_TYPES, default= "PUBLIC")
    unlisted = models.BooleanField(default=False)

#currently not being saved, need to figure out how to save nested categories
class Category(models.Model):
    name = models.CharField(max_length=200)
    post = models.ForeignKey(Post, on_delete = models.CASCADE, null=True)

