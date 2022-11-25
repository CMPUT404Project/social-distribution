from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from authors.models import Author
from django.contrib.auth.models import User
import json

class UserTests(APITestCase):
    user_url = reverse('register_user')

    username = 'testusername'
    password = 'testpassword'
    user_data = {'username': username, 'password': password}
    author_data = {'displayName': 'test', 'github': 'http://github.com/test', 'profileImage': 'https://test.png'}
    
    def setUp(self):
        self.client.defaults['SERVER_NAME'] = "testserver.com"

    def test_user_register_with_invalid_payload(self):
        """
        Ensures registration with invalid payload results in failure
        """
        invalid_user_data = {'username': 'valid_username_payload', 'pass': 'invalid_password_payload'}
        user_post_response = self.client.post(self.user_url, invalid_user_data, format='json')
        self.assertEqual(user_post_response.status_code, status.HTTP_400_BAD_REQUEST)
        content = json.loads(user_post_response.content)
        self.assertEqual(content["password"], ['This field is required.'])
        
        invalid_user_data = {'user': 'invalid_username_payload', 'password': 'valid_password_payload'}
        user_post_response = self.client.post(self.user_url, invalid_user_data, format='json')
        self.assertEqual(user_post_response.status_code, status.HTTP_400_BAD_REQUEST)
        content = json.loads(user_post_response.content)
        self.assertEqual(content["username"], ['This field is required.'])
        
        user_post_response = self.client.post(self.user_url, {}, format='json')
        self.assertEqual(user_post_response.status_code, status.HTTP_400_BAD_REQUEST)
        content = json.loads(user_post_response.content)
        self.assertEqual(content["password"], ['This field is required.'])
        self.assertEqual(content["username"], ['This field is required.'])
        
        self.assertEqual(User.objects.count(), 0)
    
    def test_user_registrations_with_existing_username(self):
        """
        Ensures registrating with an existing username returns a failure
        """
        user1_data = {'username': "TestUser1", 'password': "Password1"}
        user2_data = {'username': "TestUser1", 'password': "Password2"}
        
        user1_post_response = self.client.post(self.user_url, user1_data, format='json')
        self.assertEqual(user1_post_response.status_code, status.HTTP_201_CREATED)
        
        user2_post_response = self.client.post(self.user_url, user2_data, format='json')
        self.assertEqual(user2_post_response.status_code, status.HTTP_400_BAD_REQUEST)
        content = json.loads(user2_post_response.content)
        self.assertEqual(content["username"], ['A user with that username already exists.'])
        
        self.assertEqual(User.objects.count(), 1)
        
    def test_user_registrations_with_existing_password(self):
        """
        Ensures registrating with an existing password does not return a failure
        """
        user1_data = {'username': "TestUser1", 'password': "Password1"}
        user2_data = {'username': "TestUser2", 'password': "Password1"}
        
        user1_post_response = self.client.post(self.user_url, user1_data, format='json')
        self.assertEqual(user1_post_response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)
        
        user2_post_response = self.client.post(self.user_url, user2_data, format='json')
        self.assertEqual(user2_post_response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 2)

    def test_user_register_with_valid_payload(self):
        """
        Ensures registration with valid payload results in success, creates an author, and responds with JWT
        """
        user_post_response = self.client.post(self.user_url, self.user_data, format='json')
        self.assertEqual(user_post_response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(User.objects.count(), 1)

        self.assertEqual(Author.objects.count(), 1)
        token = user_post_response.data
        self.assertTrue("access" in token)
        self.assertTrue("refresh" in token)

    def tearDown(self):
        User.objects.all().delete()
        Author.objects.all().delete()
