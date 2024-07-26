from User.model.MyUser import MyUser
from django.db import models
from .PrivateRoom import PrivateRoom

class PrivateMessage(models.Model):
    room = models.ForeignKey(PrivateRoom, related_name='privatemessage_room', on_delete=models.CASCADE)
    user = models.ForeignKey(MyUser, related_name='privatemessage_user', on_delete=models.CASCADE)
    content = models.TextField()
    date_added = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ('date_added',)