from django.contrib import admin

from .models import Like

class LikeAdmin(admin.ModelAdmin):
    exclude = ('id')
admin.site.register(Like)

# Register your models here.
