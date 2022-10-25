import uuid
from django.db import models

class Author(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    host = models.URLField(max_length=200)
    url = models.URLField(max_length=200, default=str(host)+ str(id))
    displayName = models.CharField(max_length=200)
    github = models.CharField(max_length=200)
    profileImage = models.URLField(max_length=200)

