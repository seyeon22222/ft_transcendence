from .models import tournament, tournamentParticipant, tournamentMatch
from ft_user.models import MyUser, GameStat, MatchInfo
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from datetime import datetime

# winner와 user의 level update
# tournamentMatch의 completed_matches + 1
# completed_matches가 일정 수준에 도달했는지 체크하고, 도달했다면 다음 level의 경기를 생성 및 초대
# 우승자가 나왔다면 is_active, end_date 설정
# 정상 작동시 0, 오류시 -1 return

def handle_tournamentMatch_result(participant_count, completed_matches, tournament_instance, winner, loser, match_date):
    result = check_how_to_handle(participant_count, completed_matches)
    operation = result['operation']
    winner_level = result['winner_level']
    loser_level = result['loser_level']

    if operation < 0:
        return -1

    handle_winner_loser_level(winner, winner_level, loser, loser_level)
    tournament_instance.completed_matches += 1

    if operation == 1:
        handle_tournament_invite(tournament_instance, winner_level)
    elif operation == 2:
        tournament_instance.is_active = False
        tournament_instance.end_date = match_date

    tournament_instance.save()
    return 0

# return {operation, winner_level, loser_level}
# operation : 0(match complete), 1(next_level_match), 2(tournament_complete)
# next_level_match의 경우 winner_level participants끼리
def check_how_to_handle(participant_count, completed_matches):
    if participant_count == 2:
        return {'operation': 2, 'winner_level': 1, 'loser_level': 2} # 1,2 결승
    elif participant_count == 3:
        if completed_matches == 0:
            return {'operation': 1, 'winner_level': 2, 'loser_level': 3} # 1,2 4강
        elif completed_matches == 1:
            return {'operation': 2, 'winner_level': 1, 'loser_level': 2} # 1,3 결승
    elif participant_count == 4:
        if completed_matches == 0:
            return {'operation': 0, 'winner_level': 2, 'loser_level': 3} # 1,2 4강
        elif completed_matches == 1:
            return {'operation': 1, 'winner_level': 2, 'loser_level': 3} # 3,4 4강
        elif completed_matches == 2:
            return {'operation': 2, 'winner_level': 1, 'loser_level': 2} # 1,3 결승
    elif participant_count == 5:
        if completed_matches == 0:
            return {'operation': 0, 'winner_level': 3, 'loser_level': 4} # 1,2 8강
        elif completed_matches == 1:
            return {'operation': 1, 'winner_level': 3, 'loser_level': 4} # 3,4 8강
        elif completed_matches == 2:
            return {'operation': 1, 'winner_level': 2, 'loser_level': 3} # 1,3 4강
        elif completed_matches == 3:
            return {'operation': 2, 'winner_level': 1, 'loser_level': 2} # 1,5 결승
    elif participant_count == 6:
        if completed_matches == 0:
            return {'operation': 0, 'winner_level': 3, 'loser_level': 4} # 1,2 8강
        elif completed_matches == 1:
            return {'operation': 1, 'winner_level': 3, 'loser_level': 4} # 3,4 8강
        elif completed_matches == 2:
            return {'operation': 0, 'winner_level': 2, 'loser_level': 3} # 1,3 4강
        elif completed_matches == 3:
            return {'operation': 1, 'winner_level': 2, 'loser_level': 3} # 5,6 4강
        elif completed_matches == 4:
            return {'operation': 2, 'winner_level': 1, 'loser_level': 2} # 1,5 결승
    elif participant_count == 7:
        if completed_matches == 0 or completed_matches == 1:
            return {'operation': 0, 'winner_level': 3, 'loser_level': 4} # 1,2 8강, 3,4 8강
        elif completed_matches == 2:
            return {'operation': 1, 'winner_level': 3, 'loser_level': 4} # 5,6 8강
        elif completed_matches == 3:
            return {'operation': 0, 'winner_level': 2, 'loser_level': 3} # 1,3 4강
        elif completed_matches == 4:
            return {'operation': 1, 'winner_level': 2, 'loser_level': 3} # 5,7 4강
        elif completed_matches == 5:
            return {'operation': 2, 'winner_level': 2, 'loser_level': 3} # 1,5 결승
    else: # participant_count == 8
        if completed_matches == 0 or completed_matches == 1 or completed_matches == 2:
            return {'operation': 0, 'winner_level': 3, 'loser_level': 4} # 1,2 3,4 5,6 8강
        elif completed_matches == 3:
            return {'operation': 1, 'winner_level': 3, 'loser_level': 4} # 7,8 8강
        elif completed_matches == 4:
            return {'operation': 0, 'winner_level': 2, 'loser_level': 3} # 1,3 4강
        elif completed_matches == 5:
            return {'operation': 1, 'winner_level': 2, 'loser_level': 3} # 5,7 4강
        elif completed_matches == 6:
            return {'operation': 2, 'winner_level': 1, 'loser_level': 2} # 1,5 결승
    
    return {'operation': -1, 'winner_level': -1, 'loser_level': -1}

def handle_winner_loser_level(winner, winner_level, loser, loser_level):
    winner.level = winner_level
    loser.level = loser_level
    winner.save()
    loser.save()

def handle_tournament_invite(tournament_instance, user_level):
    tournament_participants = tournament_instance.participants.all()

    # level이 user_level 인 모든 participants filter
    filtered_participants = tournament_participants.filter(level=user_level)

    # filter된 participants를 index 순으로 오름차순 정렬
    sorted_participants = filtered_participants.order_by('index')

    # sorted_participants를 2명씩 묶어서 새로운 tournamentMatch 생성
    for i in range(0, len(sorted_participants), 2):
        player1 = sorted_participants[i].player
        player2 = sorted_participants[i + 1].player
        
        new_tournamentMatch = tournamentMatch.objects.create(
            tournament=tournament_instance,
            player1=player1,
            player2=player2,
        )
        new_tournamentMatch.save()

        # player1과 player2에게 match_invite 전송
        player1_uuid = player1.user_id
        player2_uuid = player2.user_id

        # debug
        print(f'player1: {player1_uuid}, player2: {player2_uuid}')

        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f'user_{player1_uuid}',
            {
                'type': 'message',
                'message': f'Invite to tournament {tournament_instance.name}.',
                'player1' : str(player1_uuid),
                'player2' : str(player2_uuid),
                'g_type' : 't',
                'g_id' : tournament_instance.id,
            }
        )

        async_to_sync(channel_layer.group_send)(
            f'user_{player2_uuid}',
            {
                'type': 'message',
                'message': f'Invite to tournament {tournament_instance.name}.',
                'player1' : str(player1_uuid),
                'player2' : str(player2_uuid),
                'g_type' : 't',
                'g_id' : tournament_instance.id,
            }
        )
