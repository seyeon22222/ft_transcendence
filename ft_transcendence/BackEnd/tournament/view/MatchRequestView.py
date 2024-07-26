from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..model import Match
from User.model.MyUser import MyUser

class MatchRequestView(APIView):
    def post(self, request):
        apply_user_id = request.data.get('apply_user')
        accept_user_id = request.data.get('accept_user')

        try:
            apply_user = MyUser.objects.get(username=apply_user_id)
            accept_user = MyUser.objects.get(username=accept_user_id)
        except MyUser.DoesNotExist:
            return Response({'error': 'Invalid user IDs'}, status=status.HTTP_400_BAD_REQUEST)

        match_name = f"{apply_user.username} vs {accept_user.username}"

        if Match.Match.objects.filter(player1=apply_user.user_id, player2=accept_user.user_id, is_active=True).exists() or \
           Match.Match.objects.filter(player1=accept_user.user_id, player2=apply_user.user_id, is_active=True).exists():
            return Response({'error': '해당 매치는 이미 존재합니다.'}, status=status.HTTP_400_BAD_REQUEST)

        match = Match.Match.objects.create(
            name=match_name,
            player1=apply_user,
            player2=accept_user,
            requester=apply_user,
            status='pending',
            is_active=True,
        )

        return Response({'message': 'Match request sent'}, status=status.HTTP_201_CREATED)