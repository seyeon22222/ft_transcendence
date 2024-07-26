from rest_framework.views import APIView
from rest_framework.response import Response
from ..model import tournament
from ..serializer import tournamentSerializer
from django.shortcuts import get_object_or_404

class tournamentGame(APIView):
    def get(self, request, tournament_id):
        specific_tournament = get_object_or_404(tournament.tournament, pk=tournament_id)
        serializer = tournamentSerializer.tournamentSerializer(specific_tournament)
        return Response(serializer.data)
    
    def post(self, request, tournament_id):
        specific_tournament = get_object_or_404(tournament.tournament, pk=tournament_id)
        specific_tournament.is_active = request.data.get('is_active')
        specific_tournament.is_flag = request.data.get('is_flag')
        specific_tournament.save()
        serializer = tournamentSerializer.tournamentSerializer(specific_tournament)
        return Response(serializer.data)