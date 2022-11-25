from django.db import models

# Create your models here.
import uuid
from django.db import models
from authors.models import Author
from posts.models import Post

# Create your models here.
class FollowRequest(models.Model):
    summary = models.TextField()
    # actor is the person sending the follow
    actor = models.ForeignKey(Author, on_delete=models.CASCADE, null=False, related_name="actor")
    object = models.ForeignKey(Author, on_delete=models.CASCADE, null=False, related_name="object")
    published = models.DateTimeField(auto_now_add=True, blank=True)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=['actor', 'object'], name="actor and object pair should be unique")
        ]