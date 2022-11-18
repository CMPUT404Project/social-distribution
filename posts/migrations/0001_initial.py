# Generated by Django 4.1.2 on 2022-11-18 03:55

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('authors', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Post',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('source', models.URLField(blank=True, null=True)),
                ('origin', models.URLField(blank=True, null=True)),
                ('title', models.CharField(max_length=200)),
                ('content', models.CharField(max_length=500)),
                ('description', models.CharField(blank=True, max_length=200, null=True)),
                ('contentType', models.CharField(choices=[('text/markdown', 'text/markdown'), ('text/plain', 'text/plain'), ('application/base64', 'application/base64'), ('image/png;base64', 'image/png;base64'), ('image/jpeg;base64', 'image/jpeg;base64')], default='text/plain', max_length=200)),
                ('published', models.DateTimeField(auto_now_add=True)),
                ('categories', models.CharField(blank=True, default='[]', max_length=200)),
                ('visibility', models.CharField(choices=[('PUBLIC', 'PUBLIC'), ('FRIEND', 'FRIEND')], default='PUBLIC', max_length=200)),
                ('unlisted', models.BooleanField(default=False)),
                ('author', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, to='authors.author')),
            ],
        ),
        migrations.CreateModel(
            name='Category',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('post', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='posts.post')),
            ],
        ),
    ]
