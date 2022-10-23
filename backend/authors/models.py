from django.db import models

class Author(models.Model):
    type = models.CharField(max_length=200)
    id = models.CharField(primary_key=True, max_length=200, unique=True)
    url = models.CharField(max_length=200)
    host = models.CharField(max_length=200)
    displayName = models.CharField(max_length=200)
    github = models.CharField(max_length=200)
    profileImage = models.CharField(max_length=200)
