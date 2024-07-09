from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from .models import tournament, MyUser, tournamentParticipant, tournamentMatch, Match, matchmaking, MultiMatch, multimatchmaking, Custom
from .serializers import tournamentSerializer, tournamentMatchSerializer, MatchSerializer, MultiSerializer
from ft_user.models import MyUser, GameStat, MatchInfo
from django.shortcuts import get_object_or_404
from ft_user.utils import validate_input
from .utils import handle_tournamentMatch_result

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

        valid, message = validate_input(tournament_name)
        if not valid:
            return Response({'error': message}, status=status.HTTP_400_BAD_REQUEST)

        if not tournament_name or not start_date or not end_date or not username:
            return Response({'error': 'All fields must be provided'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            apply_user = MyUser.objects.get(username=username)
        except MyUser.DoesNotExist:
            return Response({'error': 'Invalid username'}, status=status.HTTP_400_BAD_REQUEST)

        if tournament.objects.filter(name=tournament_name).exists():
            return Response({'error': '중복된 방이 있습니다'}, status=status.HTTP_400_BAD_REQUEST)

        tournament_M = tournament.objects.create(
            name=tournament_name,
            start_date=start_date,
            end_date=end_date,
            is_active=True,
            operator = apply_user,
        )

        serializer = tournamentSerializer(tournament_M)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class tournamentGame(APIView):
    def get(self, request, tournament_id):
        specific_tournament = get_object_or_404(tournament, pk=tournament_id)
        serializer = tournamentSerializer(specific_tournament)
        return Response(serializer.data)
    
    def post(self, request, tournament_id):
        specific_tournament = get_object_or_404(tournament, pk=tournament_id)
        specific_tournament.is_active = request.data.get('is_active')
        specific_tournament.is_flag = request.data.get('is_flag')
        specific_tournament.save()
        serializer = tournamentSerializer(specific_tournament)
        return Response(serializer.data)

class addTournamentPlayer(APIView):
    def post(self, request, tournament_id):
        intournament = get_object_or_404(tournament, pk=tournament_id)
        user_id = request.data.get('user_id')
        nickname = request.data.get('nickname')
        index = request.data.get('index')
        level = request.data.get('level')

        try:
            user = MyUser.objects.get(user_id=user_id)
        except MyUser.DoesNotExist:
            return Response({'message': 'Invalid user_id'}, status=status.HTTP_400_BAD_REQUEST)

        if tournamentParticipant.objects.filter(tournament=intournament, player=user).exists():
            participant = tournamentParticipant.objects.get(tournament=intournament, player=user)
            if level:
                participant.level = level
                participant.save()
                return Response(status=status.HTTP_200_OK)
            return Response({'message': '중복 신청 할 수 없습니다.'}, status=status.HTTP_400_BAD_REQUEST)

        tournament_participant = tournamentParticipant(tournament=intournament, player=user, nickname=nickname, index=index)
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
    
class matchListView(APIView):

    def get(self, request):
        matchs = Match.objects.all()
        serializer = MatchSerializer(matchs, many=True)
        return Response(serializer.data)
        
    
class matchDetailView(APIView):

    def get(self, request, match_id):
        match = get_object_or_404(Match, id=match_id)
        serializer = MatchSerializer(match)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request, match_id):
        match = get_object_or_404(Match, id=match_id)
        flag = request.data.get("is_start")
        
        if match.is_start == flag:
            return Response(status=status.HTTP_200_OK)
        else:
            match.is_start = flag
            match.save()
        return Response(status=status.HTTP_200_OK)

class tournamentMatchView(APIView):

    def get(self, request):
        tournament_matches = tournamentMatch.objects.all()
        serializer = tournamentMatchSerializer(tournament_matches, many=True)
        return Response(serializer.data)
    
class tournamentMatchDetailView(APIView):
    
    def get(self, request, player1, player2, tournament_id):
        try:
            player1 = MyUser.objects.get(user_id=player1)
            player2 = MyUser.objects.get(user_id=player2)
        except MyUser.DoesNotExist:
            return Response({'error': 'Invalid user IDs'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            tournament_instance = tournament.objects.get(pk=tournament_id)
        except tournament.DoesNotExist:
            return Response({'error': 'Invalid tournament ID'}, status=status.HTTP_400_BAD_REQUEST)
        
        tournament_match = tournamentMatch.objects.get(tournament=tournament_instance, player1=player1, player2=player2)
        serializer = tournamentMatchSerializer(tournament_match)
        return Response(serializer.data)
    
    def post(self, request, player1, player2, tournament_id):
        try:
            player1 = MyUser.objects.get(user_id=player1)
            player2 = MyUser.objects.get(user_id=player2)
        except MyUser.DoesNotExist:
            return Response({'error': 'Invalid user IDs'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            tournament_instance = tournament.objects.get(pk=tournament_id)
        except tournament.DoesNotExist:
            return Response({'error': 'Invalid tournament ID'}, status=status.HTTP_400_BAD_REQUEST)

        tournament_match = tournamentMatch.objects.get(tournament=tournament_instance, player1=player1, player2=player2)
        flag = request.data.get("is_start")
        
        if tournament_match.is_start == flag:
            return Response(status=status.HTTP_200_OK)
        else:
            tournament_match.is_start = flag
            tournament_match.save()
        return Response(status=status.HTTP_200_OK)

class matchView(APIView):
    
    def get(self, request):
        user = request.user
        matches = Match.objects.filter(player1=user).union(Match.objects.filter(player2=user))
        serializer = MatchSerializer(matches, many=True)
        return Response(serializer.data)

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

class TournamentMatchRequestView(APIView):
    def post(self, request):
        apply_user_id = request.data.get('apply_user')
        accept_user_id = request.data.get('accept_user')
        tournament_id = request.data.get('tournament_id')

        try:
            apply_user = MyUser.objects.get(user_id=apply_user_id)
            accept_user = MyUser.objects.get(user_id=accept_user_id)
        except MyUser.DoesNotExist:
            return Response({'error': 'Invalid user IDs'}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            tournament_instance = tournament.objects.get(pk=tournament_id)
        except tournament.DoesNotExist:
            return Response({'error': 'Invalid tournament ID'}, status=status.HTTP_400_BAD_REQUEST)
        
        tournament_match = tournamentMatch.objects.create(
            tournament=tournament_instance,
            player1=apply_user,
            player2=accept_user,
        )

        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f'tournament_{tournament_id}',
            {
                'type': 'tournament_message',
                'message': f'tournament match created between {apply_user.username} and {accept_user.username}.'
            }
        )

        return Response({'message': 'Tournament match created'}, status=status.HTTP_201_CREATED)

class MatchResponseView(APIView):
    def post(self, request, match_id):
        response = request.data.get('response')
        user_username = request.data.get('username')
        start_date = request.data.get('start_date')
        
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
            match.match_date = start_date
            match.save()
            return Response({'message': 'Match accepted'}, status=status.HTTP_200_OK)
        elif response == 'reject':
            match.delete()
            return Response({'message': 'Match rejected and deleted'}, status=status.HTTP_200_OK)
        else:
            return Response({'error': 'Invalid response'}, status=status.HTTP_400_BAD_REQUEST)

class MatchmakingView(APIView):
    def post(self, request):
        current_username = request.data.get('username')
        startDate = request.data.get('startDate')
        user = get_object_or_404(MyUser, username=current_username)
        pending_matchmaking = matchmaking.objects.first()

        if pending_matchmaking:
            opponent_user = pending_matchmaking.pending_player
            opponent_username = opponent_user.username

            pending_matchmaking.delete()

            if opponent_username == current_username:
                return Response({'message': "cancel"}, status=status.HTTP_200_OK)
            else:
                match_name = f"{current_username} vs {opponent_username}"
                match = Match.objects.create(
                    name=match_name,
                    player1=user,
                    player2=opponent_user,
                    requester=user,
                    status='accepted',
                    is_active=True,
                    is_flag=False,
                    match_date=startDate,
                )
                self.matchmakingInvite(match.id, user, opponent_user)
                return Response({'message': "new match created!"}, status=301)
        else:
            new_matchmaking = matchmaking(pending_player = user)
            new_matchmaking.save()
            return Response({'message': "enroll"}, status=status.HTTP_200_OK)
    
    def matchmakingInvite(self, match_id, player1, player2):
        str_player1 = str(player1.user_id)
        str_player2 = str(player2.user_id)
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f'user_{str_player1}',
            {
                'type': 'message',
                'message': f'{player1.username} vs {player2.username}.',
                'player1' : str_player1,
                'player2' : str_player2,
                'g_type' : 'm',
                'g_id' : match_id,
            }
        )
        
        async_to_sync(channel_layer.group_send)(
            f'user_{str_player2}',
            {
                'type': 'message',
                'message': f'{player1.username} vs {player2.username}.',
                'player1' : str_player1,
                'player2' : str_player2,
                'g_type' : 'm',
                'g_id' : match_id,
            }
        )

class multiMatchmakingView(APIView):
    def post(self, request):
        current_username = request.data.get('username')
        startDate = request.data.get('startDate')
        user = get_object_or_404(MyUser, username=current_username)
        pending_matchmaking = multimatchmaking.objects.first()

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
                match = MultiMatch.objects.create(
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
            new_matchmaking = multimatchmaking(pending_player=user)
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

class tournamentInviteView(APIView):
    def post(self, request, tournament_id):
        intournament = get_object_or_404(tournament, pk=tournament_id)
        player1 = request.data.get("player1")
        player2 = request.data.get("player2")

        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f'user_{player1}',
            {
                'type': 'message',
                'message': f'{intournament.name}.',
                'player1' : player1,
                'player2' : player2,
                'g_type' : 't',
                'g_id' : tournament_id,
            }
        )

        async_to_sync(channel_layer.group_send)(
            f'user_{player2}',
            {
                'type': 'message',
                'message': f'{intournament.name}.',
                'player1' : player1,
                'player2' : player2,
                'g_type' : 't',
                'g_id' : tournament_id,
            }
        )

        return Response({'message': '초대 메시지 전송 완료'}, status=status.HTTP_200_OK)

class MatchInviteView(APIView):
    def post(self, request, match_id):
        match = get_object_or_404(Match, pk=match_id)
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

class matchGetHash(APIView):
    def get(self, request, match_id):
        try :
            match = get_object_or_404(Match, id=match_id)
            player1 = match.player1
            player2 = match.player2
            combined_string = f"{match.player1.user_id}_{match.player2.user_id}_{match_id}"

            return Response({'hash': combined_string}, status=status.HTTP_200_OK)
        except Match.DoesNotExist:
            return Response({'error':'Match not found'}, status=404)
        except Exception as e:
            return Response({'error':'Internal Server Error'}, status=500) 

class tournamentHash(APIView):
    def get(self, request, player1, player2, tournament_id):
        hash_url=''
        try :
            player1_id = player1
            player2_id = player2
            
            hash_url = f"{player1_id}_{player2_id}_{tournament_id}"
            return Response({'hash': hash_url}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error':'Internal Server Error'}, status=500)
        
class multiMatchHash(APIView):

    def get(self, request, player1, player2, player3, player4, match_id):
        hash_url=''
        try :
            player1_id = player1
            player2_id = player2
            player3_id = player3
            player4_id = player4
            
            hash_url = f"{player1_id}_{player2_id}_{player3_id}_{player4_id}_{match_id}"
            return Response({'hash': hash_url}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error':'Internal Server Error'}, status=500)

class matchResultView(APIView):

    def post(self, request, match_id):
        match = get_object_or_404(Match, id=match_id)
        match_date = request.data.get('match_date')
        match_result = request.data.get('match_result')
        is_active = request.data.get('is_active')

        if match.match_result != '':
            return Response(status=status.HTTP_200_OK)

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

class multimatchResultView(APIView):

    def post(self, request, multimatch_id):
        match = get_object_or_404(MultiMatch, id=multimatch_id)
        match_date = request.data.get('match_date')
        match_result = request.data.get('match_result')
        is_active = request.data.get('is_active')

        if match.match_result != '':
            return Response(status=status.HTTP_200_OK)

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
        
class MultiMatchListView(APIView):

    def get(self, request):
        multiMatch = MultiMatch.objects.all()
        serializer = MultiSerializer(multiMatch, many=True)
        return Response(serializer.data)

class MultiMatchDetailView(APIView):
    def get(self, request, multimatch_id):
        match = get_object_or_404(MultiMatch, id=multimatch_id)
        serializer = MultiSerializer(match)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, multimatch_id):
        match = get_object_or_404(MultiMatch, id=multimatch_id)
        flag = request.data.get("is_start")
        
        if match.is_start == flag:
            return Response(status=status.HTTP_200_OK)
        else:
            match.is_start = flag
            match.save()
        return Response(status=status.HTTP_200_OK)   

class tournamentDetailView(APIView):
    def get(self, request, tournament_id):
        match = get_object_or_404(tournamentMatch, id=tournament_id)
        serializer = tournamentMatchSerializer(match)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class tournamentMatchResultView(APIView):
    def post(self, request, tournament_id):
        tournament_instance = get_object_or_404(tournament, pk=tournament_id)
        match_date = request.data.get('match_date')
        match_result = request.data.get('match_result')
        player1_uuid = request.data.get('player1')
        player2_uuid = request.data.get('player2')

        try:
            player1 = MyUser.objects.get(user_id=player1_uuid)
            player2 = MyUser.objects.get(user_id=player2_uuid)
        except MyUser.DoesNotExist:
            return Response({'error': 'Invalid user IDs'}, status=status.HTTP_400_BAD_REQUEST)

        if match_result == 1:
            winner = tournamentParticipant.objects.get(tournament=tournament_instance, player=player1)
            loser = tournamentParticipant.objects.get(tournament=tournament_instance, player=player2)
        elif match_result == 2:
            winner = tournamentParticipant.objects.get(tournament=tournament_instance, player=player2)
            loser = tournamentParticipant.objects.get(tournament=tournament_instance, player=player1)
        else:
            return Response({'error': 'Invalid match result'}, status=status.HTTP_400_BAD_REQUEST)
        
        tournament_participants_count = tournament_instance.participants.count()
        tournament_completed_matches = tournament_instance.completed_matches

        result = handle_tournamentMatch_result(tournament_participants_count, tournament_completed_matches, tournament_instance, winner, loser, match_date)
        if result == -1:
            return Response({'error': 'Error while handling tournament result'}, status=status.HTTP_400_BAD_REQUEST)

        tournament_match = tournamentMatch.objects.get(tournament=tournament_instance, player1=player1, player2=player2)
        if tournament_match.match_result != '':
            return Response(status=status.HTTP_200_OK)
        
        tournament_match.match_date = match_date
        tournament_match.match_result = match_result
        tournament_match.save()

        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f'tournament_{tournament_id}',
            {
                'type': 'tournament_message',
                'message': f'Tournament match result updated between {player1.username} and {player2.username}.'
            }
        )

        return Response({'message': 'Tournament match result updated'}, status=status.HTTP_200_OK)

class updateMatchCustom(APIView):
    def get(self, request, match_id):
        match = get_object_or_404(Match, id=match_id)
        serializer = MatchSerializer(match)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def post(self, request, match_id):
        match = get_object_or_404(Match, id=match_id)
        
        r = request.data.get('r', 0)
        g = request.data.get('g', 0)
        b = request.data.get('b', 0)
        x = request.data.get('x', 0.0)
        y = request.data.get('y', 0.0)
        z = request.data.get('z', 0.0)
        w = request.data.get('w', 0.0)
        h = request.data.get('h', 0.0)
        
        new_custom = Custom.objects.create(r=r, g=g, b=b, x=x, y=y, z=z, w=w, h=h, match=match)
        
        return Response({'message': '장애물 추가 완료'}, status=status.HTTP_200_OK)

class updateTournamentCustom(APIView):
   def get(self, request, player1, player2, tournament_id):
        try:
            player1 = MyUser.objects.get(user_id=player1)
            player2 = MyUser.objects.get(user_id=player2)
        except MyUser.DoesNotExist:
            return Response({'error': 'Invalid user IDs'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            tournament_instance = tournament.objects.get(pk=tournament_id)
        except tournament.DoesNotExist:
            return Response({'error': 'Invalid tournament ID'}, status=status.HTTP_400_BAD_REQUEST)
        
        
        tournament_match = tournamentMatch.objects.get(tournament=tournament_instance, player1=player1, player2=player2)
        serializer = tournamentMatchSerializer(tournament_match)

        return Response(serializer.data, status=status.HTTP_200_OK)
   
   def post(self, request, player1, player2, tournament_id):
        try:
            player1 = MyUser.objects.get(user_id=player1)
            player2 = MyUser.objects.get(user_id=player2)
        except MyUser.DoesNotExist:
            return Response({'error': 'Invalid user IDs'}, status=status.HTTP_400_BAD_REQUEST)
        try:
            tournament_instance = tournament.objects.get(pk=tournament_id)
        except tournament.DoesNotExist:
            return Response({'error': 'Invalid tournament ID'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            tournament_match = tournamentMatch.objects.get(tournament=tournament_instance, player1=player1, player2=player2)
        except tournamentMatch.DoesNotExist:
            return Response({'error': 'Invalid tournament Match ID'}, status=status.HTTP_400_BAD_REQUEST)

        r = request.data.get('r', 0)
        g = request.data.get('g', 0)
        b = request.data.get('b', 0)
        x = request.data.get('x', 0.0)
        y = request.data.get('y', 0.0)
        z = request.data.get('z', 0.0)
        w = request.data.get('w', 0.0)
        h = request.data.get('h', 0.0)
        
        try:
            new_custom = Custom.objects.create(r=r, g=g, b=b, x=x, y=y, z=z, w=w, h=h, tournament=tournament_match)
        except :
            return Response({'error': 'Make Error'}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({'message': '장애물 추가 완료'}, status=status.HTTP_200_OK)


class updateMultiCustom(APIView):
    def get(self, request, multimatch_id):
        match = get_object_or_404(MultiMatch, id=multimatch_id)
        serializer = MultiSerializer(match)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, multimatch_id):
        match = get_object_or_404(MultiMatch, id=multimatch_id)
        r = request.data.get('r', 0)
        g = request.data.get('g', 0)
        b = request.data.get('b', 0)
        x = request.data.get('x', 0.0)
        y = request.data.get('y', 0.0)
        z = request.data.get('z', 0.0)
        w = request.data.get('w', 0.0)
        h = request.data.get('h', 0.0)
        
        new_custom = Custom.objects.create(r=r, g=g, b=b, x=x, y=y, z=z, w=w, h=h, multi_match=match)
        
        return Response({'message': '장애물 추가 완료'}, status=status.HTTP_200_OK)