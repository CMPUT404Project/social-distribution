from django.db import models
import uuid

# Create your models here.
class Comments(models.Model):
    page = models.IntegerField()
    size = models.IntegerField()
    #TODO: Update post and also update id generation
    # post = models.OneToOneField(Post, on_delete=models.CASCADE)
    id = models.CharField(max_length=250, primary_key=True)