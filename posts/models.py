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
    source = models.URLField(max_length=200, blank=True)
    origin = models.URLField(max_length=200, blank=True)
    title = models.CharField(max_length=200)
    content = models.TextField(null=False)
    description = models.CharField(max_length=200, null=True, blank=True)
    contentType = models.CharField(max_length=200, choices = CONTENT_TYPES, default= "text/plain")
    author = models.ForeignKey(Author, on_delete = models.CASCADE, blank=True)
    published = models.DateTimeField(auto_now_add=True)
    categories = models.CharField(max_length=200, default='[]')
    visibility = models.CharField(max_length=200, choices = VISIBILITY_TYPES, default= "PUBLIC")
    unlisted = models.BooleanField(default=False)

    def save(self, *args, **kwargs):
        if self.source == "":
            self.source = str(self.author.url) + '/posts/' + str(self.id)
        if self.origin == "":
            self.origin = str(self.author.url) + '/posts/' + str(self.id)
        super().save(*args, **kwargs)
