from rest_framework import serializers
from ..model.tournament import tournament
from .tournamentParticipantSerializer import tournamentParticipantSerializer

class tournamentSerializer(serializers.ModelSerializer):
    participants = tournamentParticipantSerializer(many=True, read_only=True)
    
    class Meta:
        model = tournament
        fields = '__all__'