from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from ..model import MultiMatch, multimatchmaking
from User.model.MyUser import MyUser
from django.shortcuts import get_object_or_404

class multiMatchmakingView(APIView):
    def post(self, request):
        current_username = request.data.get('username')
        startDate = request.data.get('startDate')
        user = get_object_or_404(MyUser, username=current_username)
        pending_matchmaking = multimatchmaking.multimatchmaking.objects.first()

        if pending_matchmaking:
            opponent_user = pending_matchmaking.pending_player

            if opponent_user == user:
                pending_matchmaking.delete()
                return Response({'message': "cancel"}, status=status.HTTP_200_OK)

            if self._remove_player_if_exists(pending_matchmaking, user):
                return Response({'message': "leave"}, status=status.HTTP_200_OK)

            if not pending_matchmaking.await_player1:
                pending_matchmaking.await_player1 = user
                pending_matchmaking.save()
                return Response({'message': 'player2'}, status=status.HTTP_200_OK)
            elif not pending_matchmaking.await_player2:
                pending_matchmaking.await_player2 = user
                pending_matchmaking.save()
                return Response({'message': 'player3'}, status=status.HTTP_200_OK)
            elif not pending_matchmaking.await_player3:
                pending_matchmaking.await_player3 = user
                pending_matchmaking.save()
                match = MultiMatch.MultiMatch.objects.create(
                    player1=pending_matchmaking.pending_player,
                    player2=pending_matchmaking.await_player1,
                    player3=pending_matchmaking.await_player2,
                    player4=pending_matchmaking.await_player3,
                    is_active=True,
                    match_date=startDate,
                )
                match.name = f'2:2 Match {match.id}'
                match.save()
                pending_matchmaking.delete()
                self.multimatchmakingInvite(match.name, match.id, match.player1, match.player2, match.player3, match.player4)
                return Response({'message': "new 2:2 match created!"}, status=301)

        else:
            new_matchmaking = multimatchmaking.multimatchmaking(pending_player=user)
            new_matchmaking.save()
            return Response({'message': "make"}, status=status.HTTP_200_OK)

    def _remove_player_if_exists(self, pending_matchmaking, user):
        if pending_matchmaking.await_player1 == user:
            pending_matchmaking.await_player1 = None
        elif pending_matchmaking.await_player2 == user:
            pending_matchmaking.await_player2 = None
        elif pending_matchmaking.await_player3 == user:
            pending_matchmaking.await_player3 = None
        else:
            return False
        pending_matchmaking.save()
        return True

    def multimatchmakingInvite(self, match_name, match_id, player1, player2, player3, player4):
        player_ids = [str(player.user_id) for player in [player1, player2, player3, player4]]

        channel_layer = get_channel_layer()
        for player_id in player_ids:
            async_to_sync(channel_layer.group_send)(
                f'user_{player_id}',
                {
                    'type': 'message',
                    'message': f'{match_name}.',
                    'player1': player_ids[0],
                    'player2': player_ids[1],
                    'player3': player_ids[2],
                    'player4': player_ids[3],
                    'g_type': 'mul',
                    'g_id': match_id,
                }
            )
