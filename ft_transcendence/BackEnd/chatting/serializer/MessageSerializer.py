from rest_framework import serializers
from ..model.Message import Message

class MessageSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()

    def get_username(self, obj):
        return obj.user.username

    class Meta:
        model = Message
        fields = ['id', 'content', 'user', 'username', 'room']