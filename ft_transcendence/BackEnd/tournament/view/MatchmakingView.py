from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from ..model import Match, matchmaking
from User.model.MyUser import MyUser
from django.shortcuts import get_object_or_404

class MatchmakingView(APIView):
    def post(self, request):
        current_username = request.data.get('username')
        startDate = request.data.get('startDate')
        user = get_object_or_404(MyUser, username=current_username)
        pending_matchmaking = matchmaking.matchmaking.objects.first()

        if pending_matchmaking:
            opponent_user = pending_matchmaking.pending_player
            opponent_username = opponent_user.username

            pending_matchmaking.delete()

            if opponent_username == current_username:
                return Response({'message': "cancel"}, status=status.HTTP_200_OK)
            else:
                match_name = f"{current_username} vs {opponent_username}"
                match = Match.Match.objects.create(
                    name=match_name,
                    player1=user,
                    player2=opponent_user,
                    requester=user,
                    status='accepted',
                    is_active=True,
                    is_flag=False,
                    match_date=startDate,
                )
                self.matchmakingInvite(match.id, user, opponent_user)
                return Response({'message': "new match created!"}, status=301)
        else:
            new_matchmaking = matchmaking.matchmaking(pending_player = user)
            new_matchmaking.save()
            return Response({'message': "enroll"}, status=status.HTTP_200_OK)
    
    def matchmakingInvite(self, match_id, player1, player2):
        str_player1 = str(player1.user_id)
        str_player2 = str(player2.user_id)
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f'user_{str_player1}',
            {
                'type': 'message',
                'message': f'{player1.username} vs {player2.username}.',
                'player1' : str_player1,
                'player2' : str_player2,
                'g_type' : 'm',
                'g_id' : match_id,
            }
        )
        
        async_to_sync(channel_layer.group_send)(
            f'user_{str_player2}',
            {
                'type': 'message',
                'message': f'{player1.username} vs {player2.username}.',
                'player1' : str_player1,
                'player2' : str_player2,
                'g_type' : 'm',
                'g_id' : match_id,
            }
        )