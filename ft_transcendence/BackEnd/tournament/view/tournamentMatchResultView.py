from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from ..model import tournament, tournamentMatch
from User.model.MyUser import MyUser
from django.shortcuts import get_object_or_404
from ..utils import handle_tournamentMatch_result
        
class tournamentMatchResultView(APIView):
    def post(self, request, tournament_id):
        tournament_instance = get_object_or_404(tournament.tournament, pk=tournament_id)
        match_date = request.data.get('match_date')
        match_result = request.data.get('match_result')
        player1_uuid = request.data.get('player1')
        player2_uuid = request.data.get('player2')

        try:
            player1 = MyUser.objects.get(user_id=player1_uuid)
            player2 = MyUser.objects.get(user_id=player2_uuid)
        except MyUser.DoesNotExist:
            return Response({'error': 'Invalid user IDs'}, status=status.HTTP_400_BAD_REQUEST)

        if match_result == 1:
            winner = tournament.tournamentParticipant.objects.get(tournament=tournament_instance, player=player1)
            loser = tournament.tournamentParticipant.objects.get(tournament=tournament_instance, player=player2)
        elif match_result == 2:
            winner = tournament.tournamentParticipant.objects.get(tournament=tournament_instance, player=player2)
            loser = tournament.tournamentParticipant.objects.get(tournament=tournament_instance, player=player1)
        else:
            return Response({'error': 'Invalid match result'}, status=status.HTTP_400_BAD_REQUEST)
        
        tournament_participants_count = tournament_instance.participants.count()
        tournament_completed_matches = tournament_instance.completed_matches

        result = handle_tournamentMatch_result(tournament_participants_count, tournament_completed_matches, tournament_instance, winner, loser, match_date)
        if result == -1:
            return Response({'error': 'Error while handling tournament result'}, status=status.HTTP_400_BAD_REQUEST)

        tournament_match = tournamentMatch.tournamentMatch.objects.get(tournament=tournament_instance, player1=player1, player2=player2)
        tournament_match.match_date = match_date
        tournament_match.match_result = match_result
        tournament_match.save()

        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f'tournament_{tournament_id}',
            {
                'type': 'tournament_message',
                'message': f'Tournament match result updated between {player1.username} and {player2.username}.'
            }
        )

        return Response({'message': 'Tournament match result updated'}, status=status.HTTP_200_OK)