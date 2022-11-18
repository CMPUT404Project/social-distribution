from authors.models import Author
from django.contrib.auth.models import User

def create_authors_with_no_user(host, num):
    authors = []
    for i in range(num):
        author = Author(host=host)
        author.save()
        authors.append(author)
    return authors

def create_author_with_user(username, password, host):
    user = User(username=username)
    user.set_password(password)
    user.save()
    author = Author(host=host, user=user)
    author.save()
    return user, author


        

        