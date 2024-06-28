from rest_framework import serializers
from .models import tournament, tournamentMatch, tournamentParticipant, Match, MultiMatch, Custom, MultiMatchCustom, TournamentMatchCustom


class CustomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Custom
        fields = '__all__'

class tournamentParticipantSerializer(serializers.ModelSerializer):

    class Meta:
        model = tournamentParticipant
        fields = '__all__'

class tournamentSerializer(serializers.ModelSerializer):
    participants = tournamentParticipantSerializer(many=True, read_only=True)
    
    class Meta:
        model = tournament
        fields = '__all__'

class tournamnetMatchCustomSerializer(serializers.ModelSerializer):
    custom = CustomSerializer()  # CustomSerializer를 사용하여 custom 필드 직렬화

    class Meta:
        model = TournamentMatchCustom
        fields = ['custom']

class tournamentMatchSerializer(serializers.ModelSerializer):
    player1_username = serializers.SerializerMethodField()
    player2_username = serializers.SerializerMethodField()
    winner_username = serializers.SerializerMethodField()
    player1_uuid = serializers.SerializerMethodField()
    player2_uuid = serializers.SerializerMethodField()
    name = serializers.SerializerMethodField()
    customs = CustomSerializer(many=True, read_only=True)
    # custom = serializers.SerializerMethodField()

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
    
    # def get_custom(self, obj):
    #     # Match에 연결된 모든 Custom 객체들을 가져와서 MatchCustomSerializer를 통해 직렬화
    #     all = tournamentMatch.objects.all()
    #     print("tournament all : ", all )
    #     tournament_match_customs = TournamentMatchCustom.objects.filter(match=obj)
    #     #print("match_customs : ", match_customs)
    #     return tournamnetMatchCustomSerializer(tournament_match_customs, many=True).data

# class MatchCustomSerializer(serializers.ModelSerializer):
#     custom = CustomSerializer()  # CustomSerializer를 사용하여 custom 필드 직렬화

#     class Meta:
#         model = MatchCustom
#         fields = ['custom']
    
class MatchSerializer(serializers.ModelSerializer):
    player1_username = serializers.SerializerMethodField()
    player2_username = serializers.SerializerMethodField()
    winner_username = serializers.SerializerMethodField()
    player1_uuid = serializers.SerializerMethodField()
    player2_uuid = serializers.SerializerMethodField()
    match_result = serializers.SerializerMethodField()
    customs = CustomSerializer(many=True, read_only=True)

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
    
    def get_player1_uuid(self, obj):
        return obj.player1.user_id
    
    def get_player2_uuid(self, obj):
        return obj.player2.user_id
    
    def get_match_result(self, obj):
        return obj.match_result
    
    # def get_custom(self, obj):
    #     # Match에 연결된 모든 Custom 객체들을 가져와서 MatchCustomSerializer를 통해 직렬화
    #     all = MatchCustom.objects.all()
    #     print("Match all : ", all )
    #     match_customs = MatchCustom.objects.filter(match=obj)
    #     #print("match_customs : ", match_customs)
    #     return MatchCustomSerializer(match_customs, many=True).data


class MultiMatchCustomSerializer(serializers.ModelSerializer):
    custom = CustomSerializer()  # CustomSerializer를 사용하여 custom 필드 직렬화

    class Meta:
        model = MultiMatchCustom
        fields = ['custom']


class MultiSerializer(serializers.ModelSerializer):
    player1_username = serializers.SerializerMethodField()
    player2_username = serializers.SerializerMethodField()
    player3_username = serializers.SerializerMethodField()
    player4_username = serializers.SerializerMethodField()
    
    player1_uuid  = serializers.SerializerMethodField()
    player2_uuid  = serializers.SerializerMethodField()
    player3_uuid  = serializers.SerializerMethodField()
    player4_uuid  = serializers.SerializerMethodField()

    match_result = serializers.SerializerMethodField()
    customs = CustomSerializer(many=True, read_only=True)
    # custom = serializers.SerializerMethodField()

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
    
    def get_match_result(self, obj):
        if obj.match_result:
            return obj.match_result
        else:
            return None
        
    # def get_custom(self, obj):
    # # Match에 연결된 모든 Custom 객체들을 가져와서 MatchCustomSerializer를 통해 직렬화
    #     all = MultiMatch.objects.all()
    #     print("all : ", all )
    #     multimatch_customs = MultiMatchCustom.objects.filter(match=obj)
    #     #print("match_customs : ", match_customs)
    #     return MultiMatchCustomSerializer(multimatch_customs, many=True).data

