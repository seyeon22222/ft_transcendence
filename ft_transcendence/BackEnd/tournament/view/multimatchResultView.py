from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from ..model import MultiMatch
from User.model.GameStat import GameStat
from User.model.MatchInfo import MatchInfo
from django.shortcuts import get_object_or_404

class multimatchResultView(APIView):

    def post(self, request, multimatch_id):
        match = get_object_or_404(MultiMatch.MultiMatch, id=multimatch_id)
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
            player3_stat = GameStat.objects.get(user=match.player3)
        except GameStat.DoesNotExist:
            player3_stat = GameStat.objects.create(user=match.player3)

        try:
            player4_stat = GameStat.objects.get(user=match.player4)
        except GameStat.DoesNotExist:
            player4_stat = GameStat.objects.create(user=match.player4)

        try:
            player1_matchInfo = MatchInfo.objects.get(user=match.player1)
        except MatchInfo.DoesNotExist:
            player1_matchInfo = MatchInfo.objects.create(user=match.player1, match_date=match_date, match_result='')

        try:
            player2_matchInfo = MatchInfo.objects.get(user=match.player2)
        except MatchInfo.DoesNotExist:
            player2_matchInfo = MatchInfo.objects.create(user=match.player2, match_date=match_date, match_result='')
        
        try:
            player3_matchInfo = MatchInfo.objects.get(user=match.player3)
        except MatchInfo.DoesNotExist:
            player3_matchInfo = MatchInfo.objects.create(user=match.player3, match_date=match_date, match_result='')

        try:
            player4_matchInfo = MatchInfo.objects.get(user=match.player4)
        except MatchInfo.DoesNotExist:
            player4_matchInfo = MatchInfo.objects.create(user=match.player4, match_date=match_date, match_result='')

        player1_matchInfo.match_date = match_date
        player2_matchInfo.match_date = match_date
        player3_matchInfo.match_date = match_date
        player4_matchInfo.match_date = match_date

        if match_result == 1:
            player1_stat.win_count += 1
            player3_stat.win_count += 1
            player2_stat.defeat_count += 1
            player4_stat.defeat_count += 1

            player1_matchInfo.match_result = "Win"
            player3_matchInfo.match_result = "Win"
            player2_matchInfo.match_result = "Lose"
            player4_matchInfo.match_result = "Lose"

        elif match_result == 2:
            player2_stat.win_count += 1
            player4_stat.win_count += 1
            player1_stat.defeat_count += 1
            player3_stat.defeat_count += 1
            player2_matchInfo.match_result = "Win"
            player4_matchInfo.match_result = "Win"
            player1_matchInfo.match_result = "Lose"
            player3_matchInfo.match_result = "Lose"

        player1_stat.win_rate = (player1_stat.win_count / (player1_stat.win_count + player1_stat.defeat_count)) * 100
        player2_stat.win_rate = (player2_stat.win_count / (player2_stat.win_count + player2_stat.defeat_count)) * 100
        player3_stat.win_rate = (player3_stat.win_count / (player3_stat.win_count + player3_stat.defeat_count)) * 100
        player4_stat.win_rate = (player4_stat.win_count / (player4_stat.win_count + player4_stat.defeat_count)) * 100

        player1_stat.save()
        player2_stat.save()
        player3_stat.save()
        player4_stat.save()
        player1_matchInfo.save()
        player2_matchInfo.save()
        player3_matchInfo.save()
        player4_matchInfo.save()

        return Response(status=status.HTTP_200_OK)