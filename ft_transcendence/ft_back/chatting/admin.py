from django.contrib import admin
from .models import Room, Message, PrivateRoom, PrivateMessage
# Register your models here.

admin.site.register(Room)
admin.site.register(PrivateRoom)
admin.site.register(PrivateMessage)
admin.site.register(Message)