from django.db import models
from User.model.MyUser import MyUser

class multimatchmaking(models.Model):
    pending_player = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name='multipending_player')
    await_player1 = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name='await_player1', null=True, blank=True)
    await_player2 = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name='await_player2', null=True, blank=True)
    await_player3 = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name='await_player3', null=True, blank=True)

    def __str__(self):
        return f"{self.pending_player.username} is waiting for matchmaking"
