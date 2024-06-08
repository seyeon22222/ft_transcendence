from ft_user.models import MyUser
from django.db import models

# Create your models here.

class Room(models.Model):
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.name

class PrivateRoom(models.Model):
    name = models.CharField(max_length=255)
    user1 = models.ForeignKey(MyUser, related_name='privateroom_user1', on_delete=models.CASCADE)
    user2 = models.ForeignKey(MyUser, related_name='privateroom_user2', on_delete=models.CASCADE)
    slug = models.SlugField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.slug

class Message(models.Model):
    room = models.ForeignKey(Room, related_name='messages_room', on_delete=models.CASCADE)
    user = models.ForeignKey(MyUser, related_name='messages_user', on_delete=models.CASCADE)
    content = models.TextField()
    date_added = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('date_added',)

class PrivateMessage(models.Model):
    room = models.ForeignKey(PrivateRoom, related_name='privatemessage_room', on_delete=models.CASCADE)
    user = models.ForeignKey(MyUser, related_name='privatemessage_user', on_delete=models.CASCADE)
    content = models.TextField()
    date_added = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('date_added',)