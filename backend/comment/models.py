from django.db import models
import uuid
from comments.models import Comments

# Create your models here.
class Comment(models.Model):
    # TODO: need author object created
    # author = models.ForeignKey(Author, on_delete=models.SET_NULL, null=True)
    comment = models.CharField(max_length=500)
    #TODO: content-type left for future implementation
    #When reading the datetime field out to ISO-8601 follow https://docs.djangoproject.com/en/dev/ref/templates/builtins/#date
    comments = models.ForeignKey(Comments, on_delete=models.CASCADE, default="replacewithpost/c21f6084-2908-40fb-bfd9-d379c657e0bd")
    published = models.DateTimeField(auto_now_add=True, blank=True)
    id = models.CharField(max_length=250, primary_key=True, editable=True, default=str(comments)+'/'+str(uuid.uuid4()))