import uuid
from django.db import models
from authors.models import Author
from posts.models import Post
from comments.models import Comment
from django.core.exceptions import ValidationError
from django.db.models import Q

class Like(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    context = models.URLField(max_length=200)
    summary = models.CharField(max_length=200)
    author = models.ForeignKey(Author, on_delete = models.CASCADE)
    object = models.URLField(max_length=200)
    post = models.ForeignKey(Post, on_delete = models.CASCADE, null=True)
    comment = models.ForeignKey(Comment, on_delete = models.CASCADE, null=True)

    class Meta:
        constraints = [
            models.CheckConstraint(
                check=Q(post__isnull=False) | Q(comment__isnull=False),
                name='not_both_null'
            ),
            models.UniqueConstraint(fields=['id', 'object'], name="id and object should be unique")
        ]
