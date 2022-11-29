from django.contrib import admin

from .models import Inbox

class InboxAdmin(admin.ModelAdmin):
    pass
admin.site.register(Inbox)

# Register your models here.
