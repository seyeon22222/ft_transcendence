from django.db import models
from User.model.MyUser import MyUser

class MultiMatch(models.Model):
    name = models.CharField(max_length=100, default='')
    match_date = models.DateTimeField(null=True)
    player1 = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name='player1_matches', null=True, blank=True)
    player2 = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name='player2_matches', null=True, blank=True)
    player3 = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name='player3_matches', null=True, blank=True)
    player4 = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name='player4_matches', null=True, blank=True)
    match_result = models.CharField(default='', max_length=1)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.player1.username}, {self.player2.username}, {self.player3.username}, {self.player4.username} in {self.name}"
