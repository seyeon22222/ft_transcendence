from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import tournament, MyUser, tournamentParticipant, tournamentMatch
from .serializers import tournamentSerializer, tournamentParticipantSerializer, tournamentMatchSerializer
from django.shortcuts import get_object_or_404
from ft_user.models import MyUser

class tournamnetCreateView(APIView):
    
    def get(self, request):
        tournaments = tournament.objects.all()
        serializer = tournamentSerializer(tournaments, many=True)

        return Response(serializer.data)
    
    def post(self, request):
        print("asdasdas")
        apply_user_id = request.data.get('apply_user')
        accept_user_id = request.data.get('accept_user')
        start_date = request.data.get('start_date')
        end_date = request.data.get('end_date')

        # 매치 가능한지 확인
        if tournamentMatch.objects.filter(player1_id=apply_user_id, player2_id=accept_user_id).exists() or \
           tournamentMatch.objects.filter(player1_id=accept_user_id, player2_id=apply_user_id).exists():
            print("qweqweqwe")
            return Response({'error': '해당 매치는 이미 존재합니다.'}, status=status.HTTP_400_BAD_REQUEST)

        # 매치 생성
        apply_user = MyUser.objects.get(id=apply_user_id)
        accept_user = MyUser.objects.get(id=accept_user_id)
        match_name = f"{apply_user.username} vs {accept_user.username}"

        match = tournamentMatch.objects.create(
            name=match_name,
            start_date=start_date,
            end_date=end_date,
            is_active=True,
            player1=apply_user,
            player2=accept_user
        )

        serializer = tournamentMatchSerializer(match)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class addTournamentPlayer(APIView):

    def post(self, request, tournament_id):
        intournament = get_object_or_404(tournament, pk=tournament_id)
        username = request.data.get('username')
        user = get_object_or_404(MyUser, pk=username)
        tournamentParticipant.objects.create(tournament=intournament, player=user)
        return Response(status=status.HTTP_200_OK)

class matchView(APIView):

    def post(self, request, tournament_id):
        intournament = get_object_or_404(tournament, pk=tournament_id)
        player1_id = request.data.get('player1_id')
        player2_id = request.data.get('player2_id')
        player1 = get_object_or_404(MyUser, pk=player1_id)
        player2 = get_object_or_404(MyUser, pk=player2_id)
        match_date = request.data.get('match_date')
        match = tournament.objects.create(tournament = intournament, player1 = player1, player2 = player2, match_date = match_date)
        return Response(status=status.HTTP_200_OK)


# class makeTournamentMatch(APIView):






