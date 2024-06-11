from rest_framework import serializers
from django.db.models import Q
from .models import tournament, tournamentMatch, tournamentParticipant, Match, MultiMatch
from ft_user.models import MyUser

class tournamentParticipantSerializer(serializers.ModelSerializer):

    class Meta:
        model = tournamentParticipant
        fields = '__all__'

class tournamentSerializer(serializers.ModelSerializer):
    participants = tournamentParticipantSerializer(many=True, read_only=True)
    
    class Meta:
        model = tournament
        fields = '__all__'

class tournamentMatchSerializer(serializers.ModelSerializer):
    player1_username = serializers.SerializerMethodField()
    player2_username = serializers.SerializerMethodField()
    winner_username = serializers.SerializerMethodField()
    player1_uuid = serializers.SerializerMethodField()
    player2_uuid = serializers.SerializerMethodField()

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

class matchSerializer(serializers.ModelSerializer):
    player1_username = serializers.SerializerMethodField()
    player2_username = serializers.SerializerMethodField()
    winner_username = serializers.SerializerMethodField()
    player1_uuid = serializers.SerializerMethodField()
    player2_uuid = serializers.SerializerMethodField()

    class Meta:
        model = Match
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
        

class MultiSerializer(serializers.ModelSerializer):
    player1_username = serializers.SerializerMethodField()
    player2_username = serializers.SerializerMethodField()
    player3_username = serializers.SerializerMethodField()
    player4_username = serializers.SerializerMethodField()
    player1_uuid  = serializers.SerializerMethodField()
    player2_uuid  = serializers.SerializerMethodField()
    player3_uuid  = serializers.SerializerMethodField()
    player4_uuid  = serializers.SerializerMethodField()

    class Meta:
            model = MultiMatch
            fields = '__all__'
    
    def get_player1_username(self, obj):
        if obj.player1:
            return obj.player1.username
        else:
            return None

    def get_player2_username(self, obj):
        if obj.player2:
            return obj.player2.username
        else:
            return None
    
    def get_player3_username(self, obj):
        if obj.player3:
            return obj.player3.username
        else:
            return None

    def get_player4_username(self, obj):
        if obj.player4:
            return obj.player4.username
        else:
            return None

    def get_player1_uuid(self, obj):
        if obj.player1:
            return obj.player1.user_id
        else:
            return None
        
    def get_player2_uuid(self, obj):
        if obj.player2:
            return obj.player2.user_id
        else:
            return None
    
    def get_player3_uuid(self, obj):
        if obj.player3:
            return obj.player3.user_id
        else:
            return None
    
    def get_player4_uuid(self, obj):
        if obj.player4:
            return obj.player4.user_id
        else:
            return None