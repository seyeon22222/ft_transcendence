from User.model.MyUser import MyUser
from django.db import models
from .Room import Room

class Message(models.Model):
    room = models.ForeignKey(Room, related_name='messages_room', on_delete=models.CASCADE)
    user = models.ForeignKey(MyUser, related_name='messages_user', on_delete=models.CASCADE)
    content = models.TextField()
    date_added = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('date_added',)