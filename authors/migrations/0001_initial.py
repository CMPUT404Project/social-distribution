# Generated by Django 4.1.2 on 2022-11-21 22:57

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Author',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('host', models.URLField(blank=True)),
                ('url', models.URLField(editable=False)),
                ('displayName', models.CharField(blank=True, max_length=200)),
                ('github', models.URLField(blank=True)),
                ('profileImage', models.URLField(blank=True, max_length=500)),
                ('followers', models.ManyToManyField(blank=True, to='authors.author')),
                ('user', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
