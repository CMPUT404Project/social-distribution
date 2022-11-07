from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase
from authors.models import Author
from django.contrib.auth.models import User

class UserTests(APITestCase):
    user_url = reverse('register_user')

    username = 'testusername'
    password = 'testpassword'
    user_data = {'username': username, 'password': password}
    author_data = {'displayName': 'test', 'github': 'http://github.com/test', 'profileImage': 'https://test.png'}
    
    def setUp(self):
        self.client.defaults['SERVER_NAME'] = "testserver.com"

    def test_user_register_failure(self):
        """
        Ensures registration with invalid payload results in failure
        """
        false_user_data = {'username': 'testfailre', 'pass': 'invalidpasswordfield'}
        user_post_response = self.client.post(self.user_url, false_user_data, format='json')
        self.assertEqual(user_post_response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_register_success(self):
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
