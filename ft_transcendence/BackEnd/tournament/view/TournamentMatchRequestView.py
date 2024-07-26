from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from ..model import tournament, tournamentMatch
from User.model.MyUser import MyUser

class TournamentMatchRequestView(APIView):
    def post(self, request):
        apply_user_id = request.data.get('apply_user')
        accept_user_id = request.data.get('accept_user')
        tournament_id = request.data.get('tournament_id')

        try:
            apply_user = MyUser.objects.get(user_id=apply_user_id)
            accept_user = MyUser.objects.get(user_id=accept_user_id)
        except MyUser.DoesNotExist:
            return Response({'error': 'Invalid user IDs'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            tournament_instance = tournament.tournament.objects.get(pk=tournament_id)
        except tournament.tournament.DoesNotExist:
            return Response({'error': 'Invalid tournament ID'}, status=status.HTTP_400_BAD_REQUEST)
        
        tournament_match = tournamentMatch.tournamentMatch.objects.create(
            tournament=tournament_instance,
            player1=apply_user,
            player2=accept_user,
        )

        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f'tournament_{tournament_id}',
            {
                'type': 'tournament_message',
                'message': f'tournament match created between {apply_user.username} and {accept_user.username}.'
            }
        )

        return Response({'message': 'Tournament match created'}, status=status.HTTP_201_CREATED)