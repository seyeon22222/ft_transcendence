from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from ..model import Match
from django.shortcuts import get_object_or_404

class MatchInviteView(APIView):
    def post(self, request, match_id):
        match = get_object_or_404(Match.Match, pk=match_id)
        player1 = request.data.get("player1")
        player2 = request.data.get("player2")
        is_flag = request.data.get("is_flag")
        match.is_flag = is_flag
        match.save()
        
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f'user_{player1}',
            {
                'type': 'message',
                'message': f'{match.name}.',
                'player1' : player1,
                'player2' : player2,
                'g_type' : 'm',
                'g_id' : match_id,
            }
        )

        async_to_sync(channel_layer.group_send)(
            f'user_{player2}',
            {
                'type': 'message',
                'message': f'{match.name}.',
                'player1' : player1,
                'player2' : player2,
                'g_type' : 'm',
                'g_id' : match_id,
            }
        )
        
        return Response({'message': '초대 메시지 전송 완료'}, status=status.HTTP_200_OK)