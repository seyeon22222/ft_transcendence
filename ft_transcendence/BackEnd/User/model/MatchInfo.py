from django.db import models
from .MyUser import MyUser

class MatchInfo(models.Model):
    user = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name='match_info')
    match_date = models.DateTimeField()
    match_result = models.CharField(max_length=5)