from django.db import models
from User.model.MyUser import MyUser
from tournament.model.tournament import tournament

class tournamentMatch(models.Model):

    tournament = models.ForeignKey(tournament, on_delete=models.CASCADE, related_name='matches')
    match_date = models.DateTimeField(null=True)
    player1 = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name='player1_a')
    player2 = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name='player2_a')
    match_result = models.CharField(default='', max_length=1)

    def __str__(self):
        return f"{self.player1.username} vs {self.player2.username} in {self.tournament.name}"
