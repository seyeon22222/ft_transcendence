from django.db import models
from ft_user.models import MyUser

# Create your models here.
class tournament(models.Model):
    name = models.CharField(max_length=100)
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    is_active = models.BooleanField(default=False)
    participant = models.ManyToManyField(MyUser, through='TournamentParticipant', related_name='tournaments')
    operator = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name='operator')

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
    nickname = models.CharField(max_length=100)  # 별칭 필드 추가
    level = models.IntegerField(choices=level_choice, default=0)
    index = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.nickname} ({self.player.username}) in {self.tournament.name}"

class tournamentMatch(models.Model):
    tournament = models.ForeignKey(tournament, on_delete=models.CASCADE, related_name='matches')
    match_date = models.DateTimeField(null=True)
    player1 = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name='player1_a')
    player2 = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name='player2_a')
    match_result = models.CharField(default='', max_length=1) # ex) 1은 1의 승리, 2는 2의 승리

    def __str__(self):
        return f"{self.player1.username} vs {self.player2.username} in {self.tournament.name}"
    

class Match(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
    ]

    name = models.CharField(max_length=100)
    match_date = models.DateTimeField(null=True)
    player1 = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name='player1')
    player2 = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name='player2')
    match_result = models.CharField(default='', max_length=1) # ex) 1은 1의 승리, 2는 2의 승리
    is_active = models.BooleanField(default=True) # 게임을 진행하고 나면 false로 변경해줘야함(그래야 나중에 1:1매칭을 다시 할 수 있음)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    requester = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name='requester')

    def __str__(self):
        return f"{self.player1.username} vs {self.player2.username} in {self.name}"

class matchmaking(models.Model):
    pending_player = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name='pending_player')

    def __str__(self):
        return f"{self.pending_player.username} is waiting for matchmaking"