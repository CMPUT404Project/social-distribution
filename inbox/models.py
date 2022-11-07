from django.db import models
from authors.models import Author

class Inbox(models.Model):
    id = models.UUIDField(primary_key=True, editable=True)
