from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from ..model import tournament
from User.model.MyUser import MyUser
from django.shortcuts import get_object_or_404

class addTournamentPlayer(APIView):
    def post(self, request, tournament_id):
        intournament = get_object_or_404(tournament.tournament, pk=tournament_id)
        user_id = request.data.get('user_id')
        nickname = request.data.get('nickname')
        index = request.data.get('index')
        level = request.data.get('level')

        try:
            user = MyUser.objects.get(user_id=user_id)
        except MyUser.DoesNotExist:
            return Response({'message': 'Invalid user_id'}, status=status.HTTP_400_BAD_REQUEST)

        if tournament.tournamentParticipant.objects.filter(tournament=intournament, player=user).exists():
            participant = tournament.tournamentParticipant.objects.get(tournament=intournament, player=user)
            if level:
                participant.level = level
                participant.save()
                return Response(status=status.HTTP_200_OK)
            return Response({'message': '중복 신청 할 수 없습니다.'}, status=301)

        tournament_participant = tournament.tournamentParticipant(tournament=intournament, player=user, nickname=nickname, index=index)
        if level:
            tournament_participant.level = level
        tournament_participant.save()

        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f'tournament_{tournament_id}',
            {
                'type': 'tournament_message',
                'message': f'User {user_id} with nickname {nickname} has joined the tournament {intournament.name}.'
            }
        )

        return Response({'message': '참가 신청 완료'}, status=status.HTTP_200_OK)