import uuid
from django.db import models
from django.conf import settings

class Author(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    host = models.URLField(max_length=200, editable=True, blank=True)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, blank=True, null=True)
    url = models.URLField(max_length=200, editable=False)
    displayName = models.CharField(max_length=200, blank=True, null=False)
    github = models.URLField(max_length=200, blank=True)
    profileImage = models.URLField(max_length=500, blank=True)
    followers = models.ManyToManyField("self", blank=True, symmetrical=False)

    def save(self, *args, **kwargs):
        if self.host[-1] != '/':
            self.host += '/'
        self.url = str(self.host) + "authors/" + str(self.id)
        super().save(*args, **kwargs)
