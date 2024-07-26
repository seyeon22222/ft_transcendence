from rest_framework import serializers
from ..model.tournamentMatch import tournamentMatch

class tournamentMatchSerializer(serializers.ModelSerializer):
    player1_username = serializers.SerializerMethodField()
    player2_username = serializers.SerializerMethodField()
    winner_username = serializers.SerializerMethodField()
    player1_uuid = serializers.SerializerMethodField()
    player2_uuid = serializers.SerializerMethodField()
    name = serializers.SerializerMethodField()

    class Meta:
        model = tournamentMatch
        fields = '__all__'
    
    def get_player1_username(self, obj):
        return obj.player1.username

    def get_player2_username(self, obj):
        return obj.player2.username
    
    def get_winner_username(self, obj):
        if obj.match_result == '1':
            return obj.player1.username
        elif obj.match_result == '2':
            return obj.player2.username
        else:
            return None
    def get_player1_uuid(self,obj):
        return obj.player1.user_id
    
    def get_player2_uuid(self,obj):
        return obj.player2.user_id
    
    def get_name(self, obj):
        return obj.tournament.name