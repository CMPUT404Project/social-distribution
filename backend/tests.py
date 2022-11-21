from django.urls import reverse
from rest_framework.test import APITestCase
from authors.models import Author
from backend.test_utils import create_authors_with_no_user
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

