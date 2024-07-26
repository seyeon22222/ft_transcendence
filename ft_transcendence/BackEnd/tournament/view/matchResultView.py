from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..model import Match
from User.model.GameStat import GameStat
from User.model.MatchInfo import MatchInfo
from django.shortcuts import get_object_or_404

class matchResultView(APIView):

    def post(self, request, match_id):
        match = get_object_or_404(Match.Match, id=match_id)
        match_date = request.data.get('match_date')
        match_result = request.data.get('match_result')
        is_active = request.data.get('is_active')

        match.match_date = match_date
        match.match_result = match_result
        match.is_active = is_active
        match.save()

        try:
            player1_stat = GameStat.objects.get(user=match.player1)
        except GameStat.DoesNotExist:
            player1_stat = GameStat.objects.create(user=match.player1)

        try:
            player2_stat = GameStat.objects.get(user=match.player2)
        except GameStat.DoesNotExist:
            player2_stat = GameStat.objects.create(user=match.player2)

        try:
            player1_matchInfo = MatchInfo.objects.get(user=match.player1)
        except MatchInfo.DoesNotExist:
            player1_matchInfo = MatchInfo.objects.create(user=match.player1, match_date=match_date, match_result='')

        try:
            player2_matchInfo = MatchInfo.objects.get(user=match.player2)
        except MatchInfo.DoesNotExist:
            player2_matchInfo = MatchInfo.objects.create(user=match.player2, match_date=match_date, match_result='')

        player1_matchInfo.match_date = match_date
        player2_matchInfo.match_date = match_date

        if match_result == 1:
            player1_stat.win_count += 1
            player2_stat.defeat_count += 1
            player1_matchInfo.match_result = "Win"
            player2_matchInfo.match_result = "Lose"
        elif match_result == 2:
            player2_stat.win_count += 1
            player1_stat.defeat_count += 1
            player2_matchInfo.match_result = "Win"
            player1_matchInfo.match_result = "Lose"

        player1_stat.win_rate = (player1_stat.win_count / (player1_stat.win_count + player1_stat.defeat_count)) * 100
        player2_stat.win_rate = (player2_stat.win_count / (player2_stat.win_count + player2_stat.defeat_count)) * 100

        player1_stat.save()
        player2_stat.save()
        player1_matchInfo.save()
        player2_matchInfo.save()

        return Response(status=status.HTTP_200_OK)