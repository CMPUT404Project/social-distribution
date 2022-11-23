from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from authors.models import Author
from django.contrib.auth.models import User

class CommentTests(APITestCase):
    def setUp(self):
        self.client.defaults['SERVER_NAME'] = "testserver.com"
