from django.db import models
from .MyUser import MyUser

class GameStat(models.Model):
    user = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name='game_stat')
    win_count = models.IntegerField(default=0) 
    defeat_count = models.IntegerField(default=0) 
    win_rate = models.IntegerField(default=0)