import uuid
from django.db import models
from django.conf import settings

class Author(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    host = models.URLField(max_length=200, editable=True, blank=True)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, blank=True)
    url = models.URLField(max_length=200, editable=False)
    displayName = models.CharField(max_length=200, blank=True)
    github = models.URLField(max_length=200, blank=True)
    profileImage = models.URLField(max_length=200, blank=True)

    def save(self, *args, **kwargs):     
        self.url = str(self.host) + "/authors/" + str(self.id)
        super().save(*args, **kwargs)
