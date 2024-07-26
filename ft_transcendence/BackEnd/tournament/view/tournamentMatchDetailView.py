from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..model import tournament, tournamentMatch
from ..serializer import tournamentMatchSerializer
from User.model.MyUser import MyUser

class tournamentMatchDetailView(APIView):
    
    def get(self, request, player1, player2, tournament_id):
        try:
            player1 = MyUser.objects.get(user_id=player1)
            player2 = MyUser.objects.get(user_id=player2)
        except MyUser.DoesNotExist:
            return Response({'error': 'Invalid user IDs'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            tournament_instance = tournament.tournament.objects.get(pk=tournament_id)
        except tournament.tournament.DoesNotExist:
            return Response({'error': 'Invalid tournament ID'}, status=status.HTTP_400_BAD_REQUEST)
        
        tournament_match = tournamentMatch.tournamentMatch.objects.get(tournament=tournament_instance, player1=player1, player2=player2)
        serializer = tournamentMatchSerializer.tournamentMatchSerializer(tournament_match)
        return Response(serializer.data)