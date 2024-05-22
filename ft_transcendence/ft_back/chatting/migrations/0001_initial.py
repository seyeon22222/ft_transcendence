# Generated by Django 5.0.6 on 2024-05-22 15:09

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Room',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('slug', models.SlugField(unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='PrivateRoom',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=255)),
                ('slug', models.SlugField(unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('user1', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='privateroom_user1', to=settings.AUTH_USER_MODEL)),
                ('user2', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='privateroom_user2', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='PrivateMessage',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.TextField()),
                ('date_added', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='privatemessage_user', to=settings.AUTH_USER_MODEL)),
                ('room', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='privatemessage_room', to='chatting.privateroom')),
            ],
            options={
                'ordering': ('date_added',),
            },
        ),
        migrations.CreateModel(
            name='Message',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.TextField()),
                ('date_added', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='messages_user', to=settings.AUTH_USER_MODEL)),
                ('room', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='messages_room', to='chatting.room')),
            ],
            options={
                'ordering': ('date_added',),
            },
        ),
    ]
