from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from authors.models import Author
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from backend.test_utils import create_author_with_user
from unittest import skip
import json

class AuthorTests(APITestCase):
    username = 'testusername'
    password = 'testpassword'
    author_data = {'displayName': 'test', 'github': 'http://github.com/test', 'profileImage': 'https://test.png'}
    
    def setUp(self):
        self.client.defaults['SERVER_NAME'] = "testserver.com"
        self.host = f'http://{self.client.defaults["SERVER_NAME"]}/'
        self.user, self.author = create_author_with_user(self.username, self.password, self.host)
        
        self.refresh = RefreshToken.for_user(self.user)
        self.refresh2 = RefreshToken.for_user(self.user2)

    def test_author_url_set_when_saved(self):
        """
        Ensure the created author object set the correct url.
        """
        author = Author(host=self.host)
        self.assertEqual(author.url, "")
        author.save()
        self.assertEqual(author.url, f'{self.host}authors/{author.id}')

    @skip("Authentication currently disabled")
    def test_update_author_when_unauthenticated(self): 
        """
        Ensure unauthenticated requests get 401 unauthorized error (Bad Auth Token)
        """
        self.client.credentials()
        author_put_response = self.client.put(self.author.url, self.author_data, format='json')
        content = json.loads(author_put_response.content)
        self.assertEqual(author_put_response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_update_author_when_authenticated(self):
        """
        Ensure authenticated requests get response with 204 status code.
        """
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.refresh.access_token}')
        author_put_response = self.client.put(self.author.url, self.author_data, format='json')
        self.assertEqual(author_put_response.status_code, status.HTTP_200_OK)

    @skip("Authentication currently disabled")
    def test_get_author_when_unauthenticated(self):
        """
        Ensure unauthenticated requests get 401 unauthorized error (Bad Auth Token)
        """
        self.client.credentials()
        author_get_reponse = self.client.get(self.author.url)
        self.assertEqual(author_get_reponse.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_get_author_when_authenticated(self):
        """
        Ensure authenticated requests get response with 200 status code.
        """
        self.client.credentials(HTTP_AUTHORIZATION=f'Bearer {self.refresh.access_token}')
        author_get_reponse = self.client.get(self.author.url)
        self.assertEqual(author_get_reponse.status_code, status.HTTP_200_OK)

    def tearDown(self):
        User.objects.all().delete()
        Author.objects.all().delete()

