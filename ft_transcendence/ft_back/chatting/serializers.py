from rest_framework import serializers
from .models import Room, Message, PrivateRoom, PrivateMessage
from ft_user.models import MyUser

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ['id', 'name', 'slug']

class PrivateRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrivateRoom
        fields = ['id', 'user1', 'user2', 'slug', 'name']

class MessageSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()

    def get_username(self, obj):
        return obj.user.username

    class Meta:
        model = Message
        fields = ['id', 'content', 'user', 'username', 'room']

class PrivateMessageSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()

    def get_username(self, obj):
        return obj.user.username

    class Meta:
        model = PrivateMessage
        fields = ['id', 'content', 'user', 'username', 'room']
