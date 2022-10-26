from django.contrib import admin

from .models import Post

# class PostAdmin(admin.ModelAdmin):
#     exclude = ('id', 'url', 'host')

admin.site.register(Post)

# Register your models here.
