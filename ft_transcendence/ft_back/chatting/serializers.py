from rest_framework import serializers
from .models import Room, Message
from ft_user.models import MyUser

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ['id', 'name', 'slug']

class MessageSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()

    def get_username(self, obj):
        return obj.user.username

    class Meta:
        model = Message
        fields = ['id', 'content', 'user', 'username', 'room']