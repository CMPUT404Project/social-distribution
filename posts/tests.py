from rest_framework.test import APITestCase
from authors.models import Author
from posts.models import Post
from backend.test_utils import create_authors_with_no_user, create_posts_for_author
import json
import uuid
from unittest import skip
from rest_framework import status

class PostTests(APITestCase):
    def setUp(self):
        self.client.defaults['SERVER_NAME'] = "testserver.com"
        self.host = f'http://{self.client.defaults["SERVER_NAME"]}'
        self.authors = create_authors_with_no_user(self.host, 1)
        self.posts_url = self.authors[0].url + '/posts'
        self.posts = create_posts_for_author(self.authors[0], 3)

    # GET ALL TESTS
    @skip("Not implemented yet")
    def test_get_invalid_author_posts(self):
        pass
    
    @skip("Not implemented yet")
    def test_get_nonexistent_author_posts(self):
        pass
    
    @skip("Not implemented yet")
    def test_get_existing_author_posts(self):
        """
        Ensures a valid author's posts are returned
        """
        posts_get_response = self.client.get(self.posts_url)
        response_content = json.loads(posts_get_response.content)
        self.assertEqual(posts_get_response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response_content['items']), 3)
    
    @skip("Not implemented yet")
    def test_get_author_posts_ordering(self):
        pass

    # POST ALL TESTS
    @skip("Not implemented yet")
    def test_create_new_post_for_invalid_author(self):
        pass

    @skip("Not implemented yet")
    def test_create_new_post_for_nonexistent_author(self):
        pass

    def test_create_new_post_for_existing_author(self):
        """
        Ensures creating a new post for an existing author results in success
        """
        posts_data = {"title": "test", "content": "test"}
        posts_post_response = self.client.post(self.posts_url, posts_data)
        self.assertEqual(posts_post_response.status_code, status.HTTP_201_CREATED)

    # GET OBJECT TESTS
    @skip("Not implemented yet")
    def test_get_invalid_author_existing_post(self):
        pass

    @skip("Not implemented yet")
    def test_get_nonexistent_author_existing_post(self):
        pass

    def test_get_existing_author_existing_post(self):
        """
        Ensures getting an existing post for an existing author results in success
        """
        post_url = self.posts_url + '/' + str(self.posts[0].id)
        post_get_response = self.client.get(post_url)
        self.assertEqual(post_get_response.status_code, status.HTTP_200_OK)

    @skip("Not implemented yet")
    def test_get_existing_author_nonexistent_post(self):
        pass

    # POST OBJECT TESTS
    def test_create_new_post_for_existing_author_with_valid_id(self):
        """
        Ensures creating a new post with a valid provided id for an existing author results in success
        """
        post_url = self.authors[0].url + '/posts/' + str(uuid.uuid4())
        post_data = {"title": "test", "content": "test"}
        post_post_response = self.client.post(post_url, post_data)
        self.assertEqual(post_post_response.status_code, status.HTTP_201_CREATED)

    def test_create_new_post_for_existing_author_with_invalid_id(self):
        """
        Ensures creating a new post with an invalid provided id for an existing author results in failure
        """
        post_url = self.authors[0].url + '/posts/' + "invalidid"
        post_data = {"title": "test", "content": "test"}
        post_post_response = self.client.post(post_url, post_data)
        self.assertEqual(post_post_response.status_code, status.HTTP_400_BAD_REQUEST)

    # DELETE OBJECT TESTS
    def test_delete_existing_post_for_existing_author(self):
        """
        Ensures deleting a valid post for an existing author results in success
        """
        post_url = self.posts_url + '/' + str(self.posts[0].id)
        post_delete_response = self.client.delete(post_url)
        self.assertEqual(post_delete_response.status_code, status.HTTP_204_NO_CONTENT)

    # PUT OBJECTS TESTS
    def test_update_existing_author_existing_post(self):
        """
        Ensures updating an existing post for an existing author results in success
        """
        post_url = self.posts_url + '/' + str(self.posts[1].id)
        updated_data = {"title": "updatedtitle", "content": "updatedcontent"}
        post_put_response = self.client.put(post_url, updated_data)
        self.assertEqual(post_put_response.status_code, status.HTTP_200_OK)
        post_content = json.loads(post_put_response.content)
        self.assertEqual(post_content['title'], "updatedtitle")
        self.assertEqual(post_content['content'], "updatedcontent")

    def tearDown(self):
        Post.objects.all().delete()
        Author.objects.all().delete()

