from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import tournament, MyUser, tournamentParticipant, tournamentMatch
from .serializers import tournamentSerializer, tournamentParticipantSerializer, tournamentMatchSerializer
from ft_user.serializers import UserSerializer
from django.shortcuts import get_object_or_404
from ft_user.models import MyUser

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
        )

        tournament_M.participant.add(apply_user)
        serializer = tournamentSerializer(tournament_M)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class addTournamentPlayer(APIView):

    def post(self, request, tournament_id):
        intournament = get_object_or_404(tournament, pk=tournament_id)
        username = request.data.get('username')
        user = get_object_or_404(MyUser, pk=username)
        tournamentParticipant.objects.create(tournament=intournament, player=user)
        return Response(status=status.HTTP_200_OK)

class matchView(APIView):
    print("asdasds")
    def get(self, request, name):
        try:
            tournament = tournament.objects.get(name=name)
        except tournament.DoesNotExist:
            return Response({'error': '방을 찾을 수 없습니다.'}, status=status.HTTP_404_NOT_FOUND)
        tournament_serializer = tournamentSerializer(tournament)
        return Response({'tournament': tournament_serializer.data})


    def post(self, request):
        apply_user_id = request.data.get('apply_user')
        accept_user_id = request.data.get('accept_user')
        start_date = request.data.get('start_date')
        end_date = request.data.get('end_date')

        try:
            apply_user = MyUser.objects.get(username=apply_user_id)
            accept_user = MyUser.objects.get(username=accept_user_id)
        except MyUser.DoesNotExist:
            return Response({'error': 'Invalid user IDs'}, status=status.HTTP_400_BAD_REQUEST)

        if tournamentMatch.objects.filter(player1=apply_user.user_id, player2=accept_user.user_id).exists() or \
           tournamentMatch.objects.filter(player1=accept_user.user_id, player2=apply_user.user_id).exists():
            return Response({'error': '해당 매치는 이미 존재합니다.'}, status=status.HTTP_400_BAD_REQUEST)

        match_name = f"{apply_user.username} vs {accept_user.username}"

        tournament_M = tournament.objects.create(
            name = match_name,
            start_date = start_date,
            end_date = end_date,
            is_active = True,
        )

        tournament_M.participant.add(accept_user, apply_user)

        match = tournamentMatch.objects.create(
            tournament = tournament_M,
            player1=apply_user,
            player2=accept_user
        )

        serializer = tournamentMatchSerializer(match)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


# class makeTournamentMatch(APIView):






# 1:1 매칭
# 4명 토너먼트
#
#
#
#
#
#