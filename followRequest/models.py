from django.db import models
from authors.models import Author

class FollowRequest(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    author = models.ForeignKey(Author, on_delete = models.SET_NULL, null=False)
    object = models.ForeignKey(Author, on_delete = models.SET_NULL, null=False)
    summary = models.CharField(max_length=300)
