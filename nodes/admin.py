from django.contrib import admin

from .models import Node

class NodeAdmin(admin.ModelAdmin):
    pass
admin.site.register(Node)

# Register your models here.
