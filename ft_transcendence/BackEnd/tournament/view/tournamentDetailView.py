from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..model import tournamentMatch
from ..serializer import tournamentMatchSerializer
from django.shortcuts import get_object_or_404

class tournamentDetailView(APIView):
    def get(self, request, tournament_id):
        match = get_object_or_404(tournamentMatch.tournamentMatch, id=tournament_id)
        serializer = tournamentMatchSerializer.tournamentMatchSerializer(match)
        return Response(serializer.data, status=status.HTTP_200_OK)