from django.db import models
from ft_user.models import MyUser
    
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

class tournamentMatch(models.Model):

    tournament = models.ForeignKey(tournament, on_delete=models.CASCADE, related_name='matches')
    match_date = models.DateTimeField(null=True)
    player1 = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name='player1_a')
    player2 = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name='player2_a')
    match_result = models.CharField(default='', max_length=1)
    is_start = models.BooleanField(default=False)

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
    match_result = models.CharField(default='', max_length=1)
    is_active = models.BooleanField(default=True)
    is_flag = models.BooleanField(default=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')
    requester = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name='requester')
    is_start = models.BooleanField(default=False)
    
    def __str__(self):
        return f"{self.player1.username} vs {self.player2.username} in {self.name}"
    
class matchmaking(models.Model):

    pending_player = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name='pending_player')

    def __str__(self):
        return f"{self.pending_player.username} is waiting for matchmaking"

class multimatchmaking(models.Model):
    pending_player = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name='multipending_player')
    await_player1 = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name='await_player1', null=True, blank=True)
    await_player2 = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name='await_player2', null=True, blank=True)
    await_player3 = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name='await_player3', null=True, blank=True)

    def __str__(self):
        return f"{self.pending_player.username} is waiting for matchmaking"

class MultiMatch(models.Model):
    name = models.CharField(max_length=100, default='')
    match_date = models.DateTimeField(null=True)
    player1 = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name='player1_matches', null=True, blank=True)
    player2 = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name='player2_matches', null=True, blank=True)
    player3 = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name='player3_matches', null=True, blank=True)
    player4 = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name='player4_matches', null=True, blank=True)
    match_result = models.CharField(default='', max_length=1)
    is_active = models.BooleanField(default=True)
    is_start = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.player1.username}, {self.player2.username}, {self.player3.username}, {self.player4.username} in {self.name}"

class Custom(models.Model):
    r = models.IntegerField(default=0)
    g = models.IntegerField(default=0)
    b = models.IntegerField(default=0)
    x = models.FloatField(default=0.0)
    y = models.FloatField(default=0.0)
    z = models.FloatField(default=0.0)
    w = models.FloatField(default=0.0)
    h = models.FloatField(default=0.0)
    match = models.ForeignKey(Match, on_delete=models.CASCADE, related_name='customs', null=True, blank=True)
    tournament = models.ForeignKey(tournamentMatch, on_delete=models.CASCADE, related_name='customs', null=True, blank=True)
    multi_match = models.ForeignKey(MultiMatch, on_delete=models.CASCADE, related_name='customs', null=True, blank=True)

    def __str__(self):
        return f"게임 내의 장애물이 생성되었습니다"