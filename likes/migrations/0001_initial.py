# Generated by Django 4.1.2 on 2022-11-21 22:57

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('comments', '0001_initial'),
        ('authors', '0001_initial'),
        ('posts', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Like',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('context', models.URLField()),
                ('summary', models.CharField(max_length=200)),
                ('object', models.URLField()),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='authors.author')),
                ('comment', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='comments.comment')),
                ('post', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='posts.post')),
            ],
        ),
        migrations.AddConstraint(
            model_name='like',
            constraint=models.CheckConstraint(check=models.Q(('post__isnull', False), ('comment__isnull', False), _connector='OR'), name='not_both_null'),
        ),
        migrations.AddConstraint(
            model_name='like',
            constraint=models.UniqueConstraint(fields=('author', 'object'), name='id and object should be unique'),
        ),
    ]
