from rest_framework import serializers
from ..model import MyUser
from . import GameStatSerializer, MatchInfoSerializer

class UserSerializer(serializers.ModelSerializer):
    game_stat = GameStatSerializer.GameStatSerializer(many=True, read_only=True)
    match_info = MatchInfoSerializer.MatchInfoSerializer(many=True, read_only=True)
    
    class Meta:
        model = MyUser.MyUser
        fields = ['user_id','username', 'password', 'email', 'profile_picture', 'game_stat', 'match_info', 'language']