from django.urls import reverse
from rest_framework.test import APITestCase
from authors.models import Author
from backend.test_utils import create_authors_with_no_user
from backend.test_utils import create_author_with_user
from rest_framework import status
import json

class PaginationTest(APITestCase):
    authors_url = reverse('all_authors')        
    
    def setUp(self):
        self.client.defaults['SERVER_NAME'] = "testserver.com"
        self.host = f'http://{self.client.defaults["SERVER_NAME"]}'
        self.authors = create_authors_with_no_user(self.host, 10)

    def test_pagination_with_no_request_parameters_for_authors(self):
        """
        Ensure all data is returned with an accurate total count field
        """
        all_authors_response = self.client.get(self.authors_url)
        data = json.loads(all_authors_response.content)
        self.assertEqual(all_authors_response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(data['items']), 10)
    
    def test_pagination_with_request_parameters_for_authors(self):
        """
        Ensure correct amount of data is returned, and correct total count
        """
        all_authors_response = self.client.get(self.authors_url+'?page=1&size=5')
        data = json.loads(all_authors_response.content)
        self.assertEqual(all_authors_response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(data['items']), 5)

    def tearDown(self):
        Author.objects.all().delete()

class LoginTests(APITestCase):
    login_url = reverse('token_obtain_pair')
    
    username = 'testusername'
    password = 'testpassword'
    
    def setUp(self):
        self.client.defaults['SERVER_NAME'] = "testserver.com"
        self.host = f'http://{self.client.defaults["SERVER_NAME"]}/'
        self.user, self.author = create_author_with_user(self.username, self.password, self.host)

    def test_author_login_with_wrong_creds(self):
        """
        Wrong credentials should result in login failure.
        """
        invalid_user_data = {"username": "wrongusername", "password": "wrongpassword"}
        author_login_response = self.client.post(self.login_url, invalid_user_data, format='json')
        self.assertTrue(author_login_response.status_code, status.HTTP_400_BAD_REQUEST)
        content_details = json.loads(author_login_response.content)["detail"]
        self.assertEqual(content_details, "No active account found with the given credentials")
        

    def test_author_login_with_correct_creds(self):
        """
        Ensure JWT Token is returned as a response after successful author login.
        """
        user_data = {'username': self.username, 'password': self.password}
        author_login_response = self.client.post(self.login_url, user_data, format='json')
        self.assertTrue(author_login_response.status_code, status.HTTP_200_OK)
        token = author_login_response.data
        self.assertTrue("access" in token)
        self.assertTrue("refresh" in token)