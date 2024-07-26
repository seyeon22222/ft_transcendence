from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..model import Match
from User.model.MyUser import MyUser
from django.shortcuts import get_object_or_404

class MatchResponseView(APIView):
    def post(self, request, match_id):
        response = request.data.get('response')
        user_username = request.data.get('username')
        start_date = request.data.get('start_date')
        
        try:
            user = MyUser.objects.get(username=user_username)
        except MyUser.DoesNotExist:
            return Response({'error': 'Invalid username'}, status=status.HTTP_400_BAD_REQUEST)

        match = get_object_or_404(Match.Match, id=match_id)

        if match.status != 'pending':
            return Response({'error': 'This match is not pending'}, status=status.HTTP_400_BAD_REQUEST)

        if match.player2 != user:
            return Response({'error': 'You are not authorized to respond to this match'}, status=status.HTTP_403_FORBIDDEN)

        if response == 'accept':
            match.status = 'accepted'
            match.match_date = start_date
            match.save()
            return Response({'message': 'Match accepted'}, status=status.HTTP_200_OK)
        elif response == 'reject':
            match.delete()
            return Response({'message': 'Match rejected and deleted'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid response'}, status=status.HTTP_400_BAD_REQUEST)
