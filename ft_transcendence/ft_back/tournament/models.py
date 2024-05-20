from django.db import models
from ft_user.models import MyUser

# Create your models here.
class tournament(models.Model):
    name = models.CharField(max_length=100)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    is_active = models.BooleanField(default=False)
    participant = models.ManyToManyField(MyUser, through='TournamentParticipant', related_name='tournaments')

    def __str__(self):
        return self.name

class tournamentParticipant(models.Model):
    tournament = models.ForeignKey(tournament, on_delete=models.CASCADE, related_name='participants')
    player = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name='player')

    def __str__(self):
        return f"{self.player.username} in {self.tournament.name}"

class tournamentMatch(models.Model):
    tournament = models.ForeignKey(tournament, on_delete=models.CASCADE, related_name='matches')
    match_date = models.DateTimeField(null=True)
    player1 = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name='player1')
    player2 = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name='player2')
    match_result = models.CharField(default='', max_length=1) # ex) 1은 1의 승리, 2는 2의 승리

    def __str__(self):
        return f"{self.player1.username} vs {self.player2.username} in {self.tournament.name}"