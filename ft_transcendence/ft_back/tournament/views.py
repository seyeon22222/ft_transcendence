from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import tournament, MyUser, tournamentParticipant, tournamentMatch, Match
from .serializers import tournamentSerializer, tournamentParticipantSerializer, tournamentMatchSerializer, matchSerializer
from ft_user.serializers import UserSerializer
from django.shortcuts import get_object_or_404
from ft_user.models import MyUser
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

class tournamentCreateView(APIView):

    def get(self, request):
        tournaments = tournament.objects.all()
        serializer = tournamentSerializer(tournaments, many=True)
        return Response(serializer.data)

    def post(self, request):
        tournament_name = request.data.get('tournament_name')
        start_date = request.data.get('start_date')
        end_date = request.data.get('end_date')
        username = request.data.get('username')

        if not tournament_name or not start_date or not end_date or not username:
            return Response({'error': 'All fields must be provided'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            apply_user = MyUser.objects.get(username=username)
        except MyUser.DoesNotExist:
            return Response({'error': 'Invalid username'}, status=status.HTTP_400_BAD_REQUEST)

        tournament_M = tournament.objects.create(
            name=tournament_name,
            start_date=start_date,
            end_date=end_date,
            is_active=True,
            operator = apply_user,
        )

        serializer = tournamentSerializer(tournament_M)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class addTournamentPlayer(APIView):
    def post(self, request, tournament_id):
        intournament = get_object_or_404(tournament, pk=tournament_id)
        username = request.data.get('username')

        # 사용자 검증
        try:
            user = MyUser.objects.get(username=username)
        except MyUser.DoesNotExist:
            return Response({'error': 'Invalid username'}, status=status.HTTP_400_BAD_REQUEST)

        # 중복 신청 방지
        if intournament.participant.filter(username=username).exists():
            return Response({'error': '중복 신청 할 수 없습니다.'}, status=status.HTTP_400_BAD_REQUEST)

        intournament.participant.add(user)

        # 웹소켓을 통해 업데이트 정보 전송
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f'tournament_{tournament_id}',
            {
                'type': 'tournament_message',
                'message': f'User {username} has joined the tournament {intournament.name}.'
            }
        )

        return Response({'message': '참가 신청 완료'}, status=status.HTTP_200_OK)

class matchListView(APIView):

    def get(self, request):
            matchs = Match.objects.all()
            serializer = matchSerializer(matchs, many=True)
            return Response(serializer.data)
    
class matchDetailView(APIView):

    def get(self, request, match_id):
        match = get_object_or_404(Match, id=match_id)
        serializer = matchSerializer(match)
        return Response(serializer.data, status=status.HTTP_200_OK)

class matchView(APIView):
    
    def get(self, request):
        user = request.user
        matches = Match.objects.filter(player1=user).union(Match.objects.filter(player2=user))
        serializer = matchSerializer(matches, many=True)
        return Response(serializer.data)


    # def post(self, request):
    #     apply_user_id = request.data.get('apply_user')
    #     accept_user_id = request.data.get('accept_user')
    #     start_date = request.data.get('start_date')
    #     end_date = request.data.get('end_date')

    #     try:
    #         apply_user = MyUser.objects.get(username=apply_user_id)
    #         accept_user = MyUser.objects.get(username=accept_user_id)
    #     except MyUser.DoesNotExist:
    #         return Response({'error': 'Invalid user IDs'}, status=status.HTTP_400_BAD_REQUEST)

    #     match_name = f"{apply_user.username} vs {accept_user.username}"

    #     if Match.objects.filter(player1=apply_user.user_id, player2=accept_user.user_id, is_active=True).exists() or \
    #        Match.objects.filter(player1=accept_user.user_id, player2=apply_user.user_id, is_active=True).exists():
    #         return Response({'error': '해당 매치는 이미 존재합니다.'}, status=status.HTTP_400_BAD_REQUEST)

    #     match = Match.objects.create(
    #         name = match_name,
    #         player1=apply_user,
    #         player2=accept_user,
    #         is_active = True
    #     )

    #     serializer = matchSerializer(match)
    #     return Response(serializer.data, status=status.HTTP_201_CREATED)


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

        if Match.objects.filter(player1=apply_user.user_id, player2=accept_user.user_id, is_active=True).exists() or \
           Match.objects.filter(player1=accept_user.user_id, player2=apply_user.user_id, is_active=True).exists():
            return Response({'error': '해당 매치는 이미 존재합니다.'}, status=status.HTTP_400_BAD_REQUEST)

        match = Match.objects.create(
            name=match_name,
            player1=apply_user,
            player2=accept_user,
            requester=apply_user,
            status='pending',
            is_active=True,
        )

        return Response({'message': 'Match request sent'}, status=status.HTTP_201_CREATED)

class MatchResponseView(APIView):
    def post(self, request, match_id):
        response = request.data.get('response')
        user_username = request.data.get('username')
        start_date = request.data.get('start_date')
        
        print(user_username)
        try:
            user = MyUser.objects.get(username=user_username)
        except MyUser.DoesNotExist:
            return Response({'error': 'Invalid username'}, status=status.HTTP_400_BAD_REQUEST)

        match = get_object_or_404(Match, id=match_id)

        if match.status != 'pending':
            return Response({'error': 'This match is not pending'}, status=status.HTTP_400_BAD_REQUEST)

        if match.player2 != user:
            return Response({'error': 'You are not authorized to respond to this match'}, status=status.HTTP_403_FORBIDDEN)

        if response == 'accept':
            match.status = 'accepted'
            match.match_date = start_date  # 또는 다른 매칭 날짜를 설정
            match.save()
            return Response({'message': 'Match accepted'}, status=status.HTTP_200_OK)
        elif response == 'reject':
            match.delete()
            return Response({'message': 'Match rejected and deleted'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid response'}, status=status.HTTP_400_BAD_REQUEST)