# Generated by Django 4.1.2 on 2022-10-22 02:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('comments', '0008_alter_comments_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='comments',
            name='id',
            field=models.CharField(default='replacewithpost/633c8c95-4cd3-4784-adaf-8180f3315f76', max_length=250, primary_key=True, serialize=False),
        ),
    ]
