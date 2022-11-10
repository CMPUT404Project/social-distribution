import uuid
from django.db import models
<<<<<<< HEAD

class Author(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    host = models.URLField(max_length=200)
    url = models.URLField(max_length=200)
    displayName = models.CharField(max_length=200)
    github = models.CharField(max_length=200)
    profileImage = models.URLField(max_length=200)

    def save(self, *args, **kwargs):     
        self.url = str(self.host) + "/authors/" + str(self.id)
        super().save(*args, **kwargs)
