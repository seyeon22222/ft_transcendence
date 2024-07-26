from django.db import models
from User.model.MyUser import MyUser

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
    
    def __str__(self):
        return f"{self.player1.username} vs {self.player2.username} in {self.name}"
