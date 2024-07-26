from rest_framework import serializers
from ..model.tournament import tournamentParticipant

class tournamentParticipantSerializer(serializers.ModelSerializer):

    class Meta:
        model = tournamentParticipant
        fields = '__all__'