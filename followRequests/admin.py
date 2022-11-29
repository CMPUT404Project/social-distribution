from django.contrib import admin

from .models import FollowRequest

class FollowRequestAdmin(admin.ModelAdmin):
    pass
admin.site.register(FollowRequest)

# Register your models here.
