# Generated by Django 4.1.2 on 2022-10-21 23:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('comment', '0009_alter_comment_id'),
    ]

    operations = [
        migrations.AlterField(
            model_name='comment',
            name='id',
            field=models.CharField(default='<django.db.models.fields.related.ForeignKey>/0d232a6f-1444-4173-a6b0-c74736d97e6c', max_length=250, primary_key=True, serialize=False),
        ),
    ]
