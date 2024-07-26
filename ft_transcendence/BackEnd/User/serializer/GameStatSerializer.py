from rest_framework import serializers
from ..model import GameStat

class GameStatSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = GameStat.GameStat
        fields = ['user', 'win_count', 'defeat_count', 'win_rate']