from django.db import models
from User.model.MyUser import MyUser
    
class tournament(models.Model):

    name = models.CharField(max_length=100)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    is_active = models.BooleanField(default=False)
    participant = models.ManyToManyField(MyUser, through='TournamentParticipant', related_name='tournaments')
    operator = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name='operator')
    completed_matches = models.IntegerField(default=0)
    is_flag = models.BooleanField(default=True)
    def __str__(self):
        return self.name
    
class tournamentParticipant(models.Model):

    level_choice = [
        (1, 'winner'),
        (2, 'semi_final'),
        (4, 'quarter_final'),
        (8, 'Round_8'),
    ]

    tournament = models.ForeignKey(tournament, on_delete=models.CASCADE, related_name='participants')
    player = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name='player')
    nickname = models.CharField(max_length=100)
    level = models.IntegerField(choices=level_choice, default=0)
    index = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.nickname} ({self.player.username}) in {self.tournament.name}"