from rest_framework.views import APIView
from rest_framework.response import Response
from ..model import tournamentMatch
from ..serializer import tournamentMatchSerializer

class tournamentMatchView(APIView):

    def get(self, request):
        tournament_matches = tournamentMatch.tournamentMatch.objects.all()
        serializer = tournamentMatchSerializer.tournamentMatchSerializer(tournament_matches, many=True)
        return Response(serializer.data)