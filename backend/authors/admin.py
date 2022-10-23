from django.contrib import admin

from .models import Author

class AuthorAdmin(admin.ModelAdmin):
    exclude = ('id', 'url', 'host')
admin.site.register(Author)

# Register your models here.
