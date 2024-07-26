from django.db import models
from User.model import MyUser

class matchmaking(models.Model):

    pending_player = models.ForeignKey(MyUser.MyUser, on_delete=models.CASCADE, related_name='pending_player')

    def __str__(self):
        return f"{self.pending_player.username} is waiting for matchmaking"