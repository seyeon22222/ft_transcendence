from User.model.MyUser import MyUser
from django.db import models

class PrivateRoom(models.Model):
    name = models.CharField(max_length=255)
    user1 = models.ForeignKey(MyUser, related_name='privateroom_user1', on_delete=models.CASCADE)
    user2 = models.ForeignKey(MyUser, related_name='privateroom_user2', on_delete=models.CASCADE)
    slug = models.SlugField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.slug