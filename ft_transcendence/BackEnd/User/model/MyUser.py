from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid

class MyUser(AbstractUser):
    user_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = models.CharField(unique=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', blank=True, null=True)
    block_list = models.ManyToManyField('self', through='Block', symmetrical=False, related_name='blocked_by')
    language = models.CharField(default="ko")

    def __str__(self):
        return str(self.username)
    
class Block(models.Model):
    blocker = models.ForeignKey(MyUser, related_name='blocker', on_delete=models.CASCADE)
    blocked = models.ForeignKey(MyUser, related_name='blocked', on_delete=models.CASCADE)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('blocker', 'blocked')

    def __str__(self):
        return f'{self.blocker} blocks {self.blocked}'