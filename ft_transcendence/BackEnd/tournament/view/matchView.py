from rest_framework.views import APIView
from rest_framework.response import Response
from ..model import Match
from ..serializer import matchSerializer

class matchView(APIView):
    
    def get(self, request):
        user = request.user
        matches = Match.Match.objects.filter(player1=user).union(Match.Match.objects.filter(player2=user))
        serializer = matchSerializer.matchSerializer(matches, many=True)
        return Response(serializer.data)