from django.db import models
from authors.models import Author

class Follower(models.Model):
    follower = models.ForeignKey(Author, on_delete=models.CASCADE, related_name='follower')
    followed = models.ForeignKey(Author, on_delete=models.CASCADE, related_name='followed')

