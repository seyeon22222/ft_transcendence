from rest_framework import serializers
from django.db.models import Q
from .models import tournament, tournamentMatch, tournamentParticipant

class tournamentSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = tournament
        fields = '__all__'


class tournamentMatchSerializer(serializers.ModelSerializer):

    class Meta:
        model = tournamentMatch
        fields = '__all__'


class tournamentParticipantSerializer(serializers.ModelSerializer):

    class Meta:
        model = tournamentParticipant
        fields = '__all__'