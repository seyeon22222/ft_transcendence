from rest_framework import serializers
from .models import MyUser, GameStat, MatchInfo

class GameStatSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = GameStat
        fields = ['user', 'win_count', 'defeat_count', 'win_rate']

class MatchInfoSerializer(serializers.ModelSerializer):
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    class Meta:
        model = MatchInfo
        fields = ['user', 'match_date', 'match_result']

class UserSerializer(serializers.ModelSerializer):
    game_stat = GameStatSerializer(many=True, read_only=True)
    match_info = MatchInfoSerializer(many=True, read_only=True)
    
    class Meta:
        model = MyUser
        fields = ['user_id','username', 'password', 'email', 'profile_picture', 'game_stat', 'match_info', 'language']
