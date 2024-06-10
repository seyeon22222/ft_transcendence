from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import tournament, MyUser, tournamentParticipant, tournamentMatch, Match, matchmaking, MultiMatch
from .serializers import tournamentSerializer, tournamentParticipantSerializer, tournamentMatchSerializer, matchSerializer, MultiSerializer
from ft_user.serializers import UserSerializer
from django.shortcuts import get_object_or_404
from ft_user.models import MyUser, GameStat, MatchInfo
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
import requests
from ft_user.utils import validate_input
from datetime import datetime
import hashlib

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
        specific_tournament.save()
        serializer = tournamentSerializer(specific_tournament)
        return Response(serializer.data)

class addTournamentPlayer(APIView):
    def post(self, request, tournament_id):
        intournament = get_object_or_404(tournament, pk=tournament_id)
        user_id = request.data.get('user_id')
        nickname = request.data.get('nickname')
        index = request.data.get('index')
        level = request.data.get('level')  # 추가된 level 필드

        # 사용자 검증
        try:
            user = MyUser.objects.get(user_id=user_id)
        except MyUser.DoesNotExist:
            return Response({'error': 'Invalid user_id'}, status=status.HTTP_400_BAD_REQUEST)

        # 중복 신청 방지
        if tournamentParticipant.objects.filter(tournament=intournament, player=user).exists():
            participant = tournamentParticipant.objects.get(tournament=intournament, player=user)
            if level:
                participant.level = level
                participant.save()
                return Response({'message': f'{nickname} is now at level {level} due to a bye.'}, status=status.HTTP_200_OK)
            return Response({'error': '중복 신청 할 수 없습니다.'}, status=status.HTTP_400_BAD_REQUEST)

        # 토너먼트 참가자 생성
        tournament_participant = tournamentParticipant(tournament=intournament, player=user, nickname=nickname, index=index)
        if level:
            tournament_participant.level = level
        tournament_participant.save()

        # 웹소켓을 통해 업데이트 정보 전송
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

# chanwopa
class TournamentMatchRequestView(APIView):
    def post(self, request):
        apply_user_id = request.data.get('apply_user')
        accept_user_id = request.data.get('accept_user')
        tournament_id = request.data.get('tournament_id')

        try:
            apply_user = MyUser.objects.get(username=apply_user_id)
            accept_user = MyUser.objects.get(username=accept_user_id)
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
            match.match_date = start_date  # 또는 다른 매칭 날짜를 설정
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

        # 이미 matchmaking 중인 user가 존재
        if pending_matchmaking:
            opponent_user = pending_matchmaking.pending_player
            opponent_username = opponent_user.username

            pending_matchmaking.delete()

            # matchmaking 중인 유저가 현재 유저와 동일할경우, matchmaking 취소
            if opponent_username == current_username:
                return Response({'message': "canceled matchmaking"}, status=status.HTTP_200_OK)
            else: # 서로 다를경우, 새로운 매치 생성 (status = active, 나중에 is_active를 false로 바꿔줘야함)
                match_name = f"{current_username} vs {opponent_username}"
                match = Match.objects.create(
                    name=match_name,
                    player1=user,
                    player2=opponent_user,
                    requester=user,
                    status='active',
                    is_active=True,
                    match_date=startDate, # 또는 다른 매칭 날짜 설정
                )
                # 매차 모델생성이 되어서 등록되어있는 플레이어에게 웹소켓으로 시작 날려주면 됨
                return Response({'message': "new match created!"}, status=201)
        else: # 현재 유저를 매치메이킹에 등록
            new_matchmaking = matchmaking(pending_player = user)
            new_matchmaking.save()
            return Response({'message': "successfully enrolled in matchmaking"}, status=status.HTTP_200_OK)


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
                'message': f'Invite to tournament {intournament.name}.',
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
                'message': f'Invite to tournament {intournament.name}.',
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
        print(match_id)
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f'user_{player1}',
            {
                'type': 'message',
                'message': f'Invite to match {match.name}.',
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
                'message': f'Invite to match {match.name}.',
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
            combined_string = f"m_{match.player1.user_id}_{match.player2.user_id}_{match_id}"

            return Response({'hash': combined_string}, status=status.HTTP_200_OK)
        except Match.DoesNotExist:
            return Response({'error':'Match not found'}, status=404)
        except Exception as e:
            print(f"Error in matchGetHash: {e}")
            return Response({'error':'Internal Server Error'}, status=500)
        

class tournamentHash(APIView):
    def get(self, request, player1, player2, tournament_id):
        hash_url=''
        try :
            player1_id = player1
            player2_id = player2
            
            hash_url = f"t_{player1_id}_{player2_id}_{tournament_id}"
            # TODO 토너먼트 안에다가 hash값이 어떤 인덱스인지 저장하는 로직
            return Response({'hash': hash_url}, status=status.HTTP_200_OK)
        except Exception as e:
            print(f"Error in matchGetHash: {e}")
            return Response({'error':'Internal Server Error'}, status=500)
        

class matchResultView(APIView):

    def post(self, request, match_id):
        match = get_object_or_404(Match, id=match_id)
        match_date = request.data.get('match_date')
        match_result = request.data.get('match_result')
        is_active = request.data.get('is_active')

        match.match_date = match_date
        match.match_result = match_result
        match.is_active = is_active
        match.save()

        # 플레이어1과 플레이어2의 GameStat 가져오기 또는 생성하기
        try:
            player1_stat = GameStat.objects.get(user=match.player1)
        except GameStat.DoesNotExist:
            player1_stat = GameStat.objects.create(user=match.player1)

        try:
            player2_stat = GameStat.objects.get(user=match.player2)
        except GameStat.DoesNotExist:
            player2_stat = GameStat.objects.create(user=match.player2)

        # 플레이어1과 플레이어2의 MatchInfo 가져오기 또는 생성하기
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

        # 승률 업데이트
        player1_stat.win_rate = (player1_stat.win_count / (player1_stat.win_count + player1_stat.defeat_count)) * 100
        player2_stat.win_rate = (player2_stat.win_count / (player2_stat.win_count + player2_stat.defeat_count)) * 100

        # 반영된 정보 저장
        player1_stat.save()
        player2_stat.save()
        player1_matchInfo.save()
        player2_matchInfo.save()

        return Response(status=status.HTTP_200_OK)
    

class MultiMatchApplyView(APIView):

    def post(self, request, multimatch_id):
        match = get_object_or_404(MultiMatch, pk=multimatch_id)
        user_id = request.data.get('user_id')
        nickname = request.data.get('nickname')

        # 사용자 검증
        try:
            user = MyUser.objects.get(user_id=user_id)
        except MyUser.DoesNotExist:
            return Response({'error': 'Invalid user_id'}, status=status.HTTP_400_BAD_REQUEST)

        # 중복 신청 확인
        if match.player1 == user or match.player2 == user or match.player3 == user or match.player4 == user:
            return Response({'message': '중복 신청이 불가능합니다.'}, status=status.HTTP_400_BAD_REQUEST)

        # 인원 꽉 찼는지 확인
        if all([match.player1, match.player2, match.player3, match.player4]):
            return Response({'message': '인원이 꽉 찼습니다.'}, status=status.HTTP_400_BAD_REQUEST)

        # 첫 번째 빈 슬롯에 사용자 추가
        if match.player1 is None:
            match.player1 = user
        elif match.player2 is None:
            match.player2 = user
        elif match.player3 is None:
            match.player3 = user
        elif match.player4 is None:
            match.player4 = user

        # 변경사항 저장
        match.save()

        return Response({'message': '참가 신청 완료'}, status=status.HTTP_200_OK)
    

class MultiMatchListView(APIView):

    def get(self, request):
        multiMatch = MultiMatch.objects.all()
        serializer = MultiSerializer(multiMatch, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        multiMatch = request.data.get('multiMatch')
        username = request.data.get('username')
        # apply_user = request.data.get('apply_user')
        print(request.data)
        print(username)
        if not multiMatch or not username:
            return Response({'error': 'All fields must be provided'}, status=status.HTTP_400_BAD_REQUEST)

        valid, message = validate_input(multiMatch)
        if not valid:
            return Response({'error': message}, status=status.HTTP_400_BAD_REQUEST)

        try:
            apply_user = MyUser.objects.get(user_id=username)
        except MyUser.DoesNotExist:
            return Response({'error': 'Invalid username'}, status=status.HTTP_400_BAD_REQUEST)

        if MultiMatch.objects.filter(name=multiMatch).exists():
            return Response({'error': '중복된 방이 있습니다'}, status=status.HTTP_400_BAD_REQUEST)

        match = MultiMatch.objects.create(
            name=multiMatch,
            requester = apply_user,
            player1 = None,
            player2 = None,
            player3 = None,
            player4 = None,
        )

        serializer = MultiSerializer(match)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


# class MultiMatchListView(APIView):

#     def get(self, request):
#         multiMatch = MultiMatch.objects.all()
#         serializer = MultiSerializer(multiMatch, many=True)
#         return Response(serializer.data)
    
#     def post(self, request):
#         multimatch_name = request.data.get('multimatch_name')
#         player1_id = request.data.get('player1_id')
#         player2_id = request.data.get('player2_id')
#         player3_id = request.data.get('player3_id')
#         player4_id = request.data.get('player4_id')
#         requester_id = request.data.get('requester_id')

#         # check if all fields are provided
#         if not multimatch_name or not player1_id or not player2_id or not player3_id or not player4_id or not requester_id:
#             return Response({'error': 'All fields must be provided'}, status=status.HTTP_400_BAD_REQUEST)

#         # input validation for multimatch_name
#         valid, message = validate_input(multimatch_name)
#         if not valid:
#             return Response({'error': message}, status=status.HTTP_400_BAD_REQUEST)

#         # get user objects from user_id
#         try:
#             player1 = MyUser.objects.get(username=player1_id)
#             player2 = MyUser.objects.get(username=player2_id)
#             player3 = MyUser.objects.get(username=player3_id)
#             player4 = MyUser.objects.get(username=player4_id)
#             requester = MyUser.objects.get(username=requester_id)
#         except MyUser.DoesNotExist:
#             return Response({'error': 'Invalid username'}, status=status.HTTP_400_BAD_REQUEST)

#         if MultiMatch.objects.filter(player1 = player1, player2 = player2, player3 = player3, player4 = player4, name = multimatch_name, is_active=True).exists():
#             return Response({'error': '해당 매치는 이미 존재합니다.'}, status=status.HTTP_400_BAD_REQUEST)

#         # create multimatch
#         try:
#             created_match = MultiMatch.objects.create(
#                 name=multimatch_name,
#                 player1 = player1,
#                 player2 = player2,
#                 player3 = player3,
#                 player4 = player4,
#                 requester = requester,
#                 is_active = True,
#             )
#         except Exception as e:
#             return Response({'error': f'MultiMatch 생성 중 오류 발생 :  {e}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#         serializer = MultiSerializer(created_match)
#         return Response(serializer.data, status=status.HTTP_201_CREATED)
