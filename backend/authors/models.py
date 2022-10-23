import uuid
from django.db import models

class Author(models.Model):
    type = models.CharField(max_length=200, default="author")
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    url = models.URLField(max_length=200)
    host = models.URLField(max_length=200)
    displayName = models.CharField(max_length=200)
    github = models.CharField(max_length=200)
    profileImage = models.URLField(max_length=200)
