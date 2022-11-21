from rest_framework import status
from rest_framework.test import APITestCase
from authors.models import Author
from backend.test_utils import create_authors_with_no_user
import uuid
import json

class FollowerTests(APITestCase):
    def setUp(self):
        self.client.defaults['SERVER_NAME'] = "testserver.com"
        self.host = f'http://{self.client.defaults["SERVER_NAME"]}/'
        self.authors = create_authors_with_no_user(self.host, 4)
        self.authors[0].followers.add(self.authors[1])
        self.authors[0].followers.add(self.authors[2])
        self.authors[0].followers.add(self.authors[3])

    # PUT TESTS
    def test_add_valid_follower_for_invalid_author(self):
        """
        Ensure adding a valid follower to an nonexisting author results in failure
        """
        follower_put_response = self.client.put(f'{str(uuid.uuid4())}/followers/{str(self.authors[0].id)}')
        self.assertEqual(follower_put_response.status_code, status.HTTP_404_NOT_FOUND)

    def test_add_invalid_follower(self):
        """
        Ensures adding invalid authors as a follwer results in failure
        """
        follower_put_response = self.client.put(f'{str(self.authors[0].url)}/followers/invalidauthor')
        self.assertEqual(follower_put_response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_add_nonexisting_authors(self):
        """
        Ensures adding nonexisting authors as a follwer results in failure
        """
        follower_put_response = self.client.put(f'{str(self.authors[0].url)}/followers/{str(uuid.uuid4())}')
        self.assertEqual(follower_put_response.status_code, status.HTTP_404_NOT_FOUND)

    def test_add_author_itself_as_follower(self):
        """
        Ensures adding author as a follwer of author itself results in failure
        """
        follower_put_response = self.client.put(f'{str(self.authors[0].url)}/followers/{str(self.authors[0].id)}')
        self.assertEqual(follower_put_response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_add_existing_authors_as_followers(self):
        """
        Ensures adding existing authors as a follwer results in success
        """
        authors = create_authors_with_no_user(self.host, 4)
        follower1_put_response = self.client.put(f'{str(authors[0].url)}/followers/{str(authors[1].id)}')
        follower2_put_response = self.client.put(f'{str(authors[0].url)}/followers/{str(authors[2].id)}')
        follower3_put_response = self.client.put(f'{str(authors[0].url)}/followers/{str(authors[3].id)}') 
        self.assertEqual(follower1_put_response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(follower2_put_response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(follower3_put_response.status_code, status.HTTP_201_CREATED)

    def test_add_follower_as_follower(self):
        """
        Ensures adding the same follower results in failure
        """
        authors = create_authors_with_no_user(self.host, 2)
        follower_put_response1 = self.client.put(f'{str(authors[0].url)}/followers/{str(authors[1].id)}')
        self.assertEqual(follower_put_response1.status_code, status.HTTP_201_CREATED)

        follower_put_response2 = self.client.put(f'{str(authors[0].url)}/followers/{str(authors[1].id)}')
        self.assertEqual(follower_put_response2.status_code, status.HTTP_409_CONFLICT)
        
    # GET OBJECT TESTS
    def test_if_valid_follower_is_a_follower(self):
        """
        Ensures valid follower is a follower of author
        """
        follower1_get_response = self.client.get(f'{str(self.authors[0].url)}/followers/{str(self.authors[1].id)}')
        self.assertEqual(follower1_get_response.status_code, status.HTTP_200_OK)

        follower2_get_response = self.client.get(f'{str(self.authors[0].url)}/followers/{str(self.authors[2].id)}')
        self.assertEqual(follower2_get_response.status_code, status.HTTP_200_OK)

        follower3_get_response = self.client.get(f'{str(self.authors[0].url)}/followers/{str(self.authors[3].id)}')
        self.assertEqual(follower3_get_response.status_code, status.HTTP_200_OK)

    def test_if_author_itself_is_a_follower(self):
        """
        Ensures author itself is not a follower of author
        """
        follower_put_response = self.client.get(f'{str(self.authors[0].url)}/followers/{str(self.authors[0].id)}')
        self.assertEqual(follower_put_response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_if_nonexistent_follower_is_a_follower(self):
        """
        Ensure nonexistent follower is not a follower 
        """
        follower_put_response = self.client.get(f'{str(self.authors[0].url)}/followers/{str(uuid.uuid4())}')
        self.assertEqual(follower_put_response.status_code, status.HTTP_404_NOT_FOUND)

    # GET ALL TESTS
    def test_get_all_followers_of_author(self):
        """
        Ensures all followers of author is returned
        """
        followers_get_response = self.client.get(f'{str(self.authors[0].url)}/followers')
        self.assertEqual(followers_get_response.status_code, status.HTTP_200_OK)
        followers = json.loads(followers_get_response.content)['items']
        self.assertEqual(len(followers), 3)
        
    def test_get_all_invalid_author_followers(self):
        """
        Ensures an invalid author return an error
        """
        author_url = list(str(self.authors[0].url))
        author_url[-1] = "0" if author_url[-1] == "1" else "1"
        author_url = ''.join(author_url)
        followers_get_response = self.client.get(f'{author_url}/followers')
        self.assertEqual(followers_get_response.status_code, status.HTTP_404_NOT_FOUND)

    # DELETE OBJECT TESTS
    def test_remove_valid_follower(self):
        """
        Ensures a valid follower is removed
        """
        authors = create_authors_with_no_user(self.host, 4)
        authors[0].followers.add(authors[1])
        authors[0].followers.add(authors[2])
        authors[0].followers.add(authors[3])
        self.assertEqual(len(authors[0].followers.all()), 3)

        follower1_delete_response = self.client.delete(f'{authors[0].url}/followers/{authors[1].id}')
        self.assertEqual(follower1_delete_response.status_code, status.HTTP_204_NO_CONTENT)

        follower2_delete_response = self.client.delete(f'{authors[0].url}/followers/{authors[2].id}')
        self.assertEqual(follower2_delete_response.status_code, status.HTTP_204_NO_CONTENT)

        follower3_delete_response = self.client.delete(f'{authors[0].url}/followers/{authors[3].id}')
        self.assertEqual(follower3_delete_response.status_code, status.HTTP_204_NO_CONTENT)

        self.assertEqual(len(authors[0].followers.all()), 0)

    def test_remove_nonfollower(self):
        """
        Ensures removing a non follower returns an error
        """
        authors = create_authors_with_no_user(self.host, 4)
        authors[0].followers.add(authors[1])

        self.assertEqual(len(authors[0].followers.all()), 1)

        follower1_delete_response = self.client.delete(f'{authors[0].url}/followers/{authors[2].id}')
        self.assertEqual(follower1_delete_response.status_code, status.HTTP_404_NOT_FOUND)

        self.assertEqual(len(authors[0].followers.all()), 1)


    def tearDown(self):
        Author.objects.all().delete()
