from rest_framework import serializers
from ..model import PrivateRoom

class PrivateRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = PrivateRoom.PrivateRoom
        fields = ['id', 'user1', 'user2', 'slug', 'name']