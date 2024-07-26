from rest_framework import serializers
from ..model import PrivateMessage

class PrivateMessageSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()

    def get_username(self, obj):
        return obj.user.username

    class Meta:
        model = PrivateMessage.PrivateMessage
        fields = ['id', 'content', 'user', 'username', 'room']