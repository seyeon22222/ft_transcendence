from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid

# 유저 정보
class MyUser(AbstractUser):
    user_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = models.CharField(unique=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    block_list = models.ManyToManyField('self', through='Block', symmetrical=False, related_name='blocked_by')

    def __str__(self):
        return str(self.username)

# 유저 블록 정보
class Block(models.Model):
    blocker = models.ForeignKey(MyUser, related_name='blocker', on_delete=models.CASCADE)
    blocked = models.ForeignKey(MyUser, related_name='blocked', on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('blocker', 'blocked')

    def __str__(self):
        return f'{self.blocker} blocks {self.blocked}'
    
# 게임 스탯
class GameStat(models.Model):
    user = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name='game_stat')
    win_count = models.IntegerField(default=0) 
    defeat_count = models.IntegerField(default=0) 
    win_rate = models.IntegerField(default=0)
    reflect_rate = models.IntegerField(default=0)

# 매치 정보  
class MatchInfo(models.Model):
    user = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name='match_info')
    match_date = models.DateTimeField()
    match_result = models.CharField(max_length=1)


# class Friends(models.Model):
#     from_user = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name='sent_friend')
#     to_user = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name='receive_friend')
#     created_at = models.DateField(auto_now_add=True)
#     status = models.CharField(max_length=20, choices=[('pending', '신청중'), ('accept', '수락'), ('reject', '거절')], default='신청중')