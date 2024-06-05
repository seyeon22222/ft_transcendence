from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import tournament, MyUser, tournamentParticipant, tournamentMatch, Match, matchmaking
from .serializers import tournamentSerializer, tournamentParticipantSerializer, tournamentMatchSerializer, matchSerializer
from ft_user.serializers import UserSerializer
from django.shortcuts import get_object_or_404
from ft_user.models import MyUser
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

# class addTournamentPlayer(APIView):
#     def post(self, request, tournament_id):
#         intournament = get_object_or_404(tournament, pk=tournament_id)
#         username = request.data.get('username')
#         nickname = request.data.get('nickname')  # 별칭 추가
#         index = request.data.get('index') # 해당 플레이어의 토너먼트에서의 위치
#         # 사용자 검증
#         try:
#             user = MyUser.objects.get(username=username)
#         except MyUser.DoesNotExist:
#             return Response({'error': 'Invalid username'}, status=status.HTTP_400_BAD_REQUEST)

#         print(intournament.participant)

#         # 중복 신청 방지
#         if intournament.participant.filter(username=username).exists():
#             return Response({'error': '중복 신청 할 수 없습니다.'}, status=status.HTTP_400_BAD_REQUEST)

#         # 토너먼트 참가자 생성
#         tournament_participant = tournamentParticipant(tournament=intournament, player=user, nickname=nickname, index=index)
#         tournament_participant.save()

#         # 웹소켓을 통해 업데이트 정보 전송
#         channel_layer = get_channel_layer()
#         async_to_sync(channel_layer.group_send)(
#             f'tournament_{tournament_id}',
#             {
#                 'type': 'tournament_message',
#                 'message': f'User {username} with nickname {nickname} has joined the tournament {intournament.name}.'
#             }
#         )
#         return Response({'message': '참가 신청 완료'}, status=status.HTTP_200_OK)

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
                return Response({'message': "new match created!"}, status=201)
        else: # 현재 유저를 매치메이킹에 등록
            new_matchmaking = matchmaking(pending_player = user)
            new_matchmaking.save()
            return Response({'message': "successfully enrolled in matchmaking"}, status=status.HTTP_200_OK)



# 초대 메세지를 받는 API
# 웹 소켓을 통해서 해당 매칭되는 플레이어들에게 전송해야함
class tournamentInviteView(APIView):
    def post(self, request, tournament_id):
        intournament = get_object_or_404(tournament, pk=tournament_id)
        player1 = request.data.get("player1")
        player2 = request.data.get("player2")

        # 게임서버 URL로 지정해서 post를 보내줘야함
        # gameserverURL = "http://gameserver.example.com/api/invite"
        # data = {
        #     "player1": player1,
        #     "player2": player2,
        #     "tournament_id": tournament_id,
        # }
        # response = requests.post(gameserverURL, data=data)

        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f'user_{player1}',
            {
                'type': 'message',
                'message': f'Invite to tournament {intournament.name}.',
            }
        )

        async_to_sync(channel_layer.group_send)(
            f'user_{player2}',
            {
                'type': 'message',
                'message': f'Invite to tournament {intournament.name}.',
            }
        )

        return Response({'message': '초대 메시지 전송 완료'}, status=status.HTTP_200_OK)
    

class matchGetHash(APIView):
    def get(self, request, match_id):
        try :
            match = get_object_or_404(Match, id=match_id)
            if (len(match.slug) == 0):
                player1 = match.player1
                player2 = match.player2
            
                timestamp = datetime.now().strftime('%Y%m%d%H%M%S%f')
                combined_string = f"{match.player1.user_id}_{match.player2.user_id}_{timestamp}"
                slug = hashlib.sha256(combined_string.encode()).hexdigest()[:10]  # Use the first 10 characters of the hash
                match.slug = slug
                match.save()

            else:
                slug = match.slug
            return Response({'hash': slug}, status=status.HTTP_200_OK)
        except Match.DoesNotExist:
            return Response({'error':'Match not found'}, status=404)
        except Exception as e:
            print(f"Error in matchGetHash: {e}")
            return Response({'error':'Internal Server Error'}, status=500)