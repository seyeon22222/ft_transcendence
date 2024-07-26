from .model.tournamentMatch import tournamentMatch
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer

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

def check_how_to_handle(participant_count, completed_matches):
    if participant_count == 2:
        return {'operation': 2, 'winner_level': 1, 'loser_level': 2} 
    elif participant_count == 3:
        if completed_matches == 0:
            return {'operation': 1, 'winner_level': 2, 'loser_level': 3} 
        elif completed_matches == 1:
            return {'operation': 2, 'winner_level': 1, 'loser_level': 2} 
    elif participant_count == 4:
        if completed_matches == 0:
            return {'operation': 0, 'winner_level': 2, 'loser_level': 3} 
        elif completed_matches == 1:
            return {'operation': 1, 'winner_level': 2, 'loser_level': 3} 
        elif completed_matches == 2:
            return {'operation': 2, 'winner_level': 1, 'loser_level': 2} 
    elif participant_count == 5:
        if completed_matches == 0:
            return {'operation': 0, 'winner_level': 3, 'loser_level': 4} 
        elif completed_matches == 1:
            return {'operation': 1, 'winner_level': 3, 'loser_level': 4} 
        elif completed_matches == 2:
            return {'operation': 1, 'winner_level': 2, 'loser_level': 3} 
        elif completed_matches == 3:
            return {'operation': 2, 'winner_level': 1, 'loser_level': 2} 
    elif participant_count == 6:
        if completed_matches == 0:
            return {'operation': 0, 'winner_level': 3, 'loser_level': 4} 
        elif completed_matches == 1:
            return {'operation': 1, 'winner_level': 3, 'loser_level': 4} 
        elif completed_matches == 2:
            return {'operation': 0, 'winner_level': 2, 'loser_level': 3} 
        elif completed_matches == 3:
            return {'operation': 1, 'winner_level': 2, 'loser_level': 3} 
        elif completed_matches == 4:
            return {'operation': 2, 'winner_level': 1, 'loser_level': 2} 
    elif participant_count == 7:
        if completed_matches == 0 or completed_matches == 1:
            return {'operation': 0, 'winner_level': 3, 'loser_level': 4} 
        elif completed_matches == 2:
            return {'operation': 1, 'winner_level': 3, 'loser_level': 4} 
        elif completed_matches == 3:
            return {'operation': 0, 'winner_level': 2, 'loser_level': 3} 
        elif completed_matches == 4:
            return {'operation': 1, 'winner_level': 2, 'loser_level': 3} 
        elif completed_matches == 5:
            return {'operation': 2, 'winner_level': 1, 'loser_level': 2} 
    else: 
        if completed_matches == 0 or completed_matches == 1 or completed_matches == 2:
            return {'operation': 0, 'winner_level': 3, 'loser_level': 4} 
        elif completed_matches == 3:
            return {'operation': 1, 'winner_level': 3, 'loser_level': 4} 
        elif completed_matches == 4:
            return {'operation': 0, 'winner_level': 2, 'loser_level': 3} 
        elif completed_matches == 5:
            return {'operation': 1, 'winner_level': 2, 'loser_level': 3} 
        elif completed_matches == 6:
            return {'operation': 2, 'winner_level': 1, 'loser_level': 2} 
    
    return {'operation': -1, 'winner_level': -1, 'loser_level': -1}

def handle_winner_loser_level(winner, winner_level, loser, loser_level):
    winner.level = winner_level
    loser.level = loser_level
    winner.save()
    loser.save()

def handle_tournament_invite(tournament_instance, user_level):
    tournament_participants = tournament_instance.participants.all()

    
    filtered_participants = tournament_participants.filter(level=user_level)

    
    sorted_participants = filtered_participants.order_by('id')

    
    for i in range(0, len(sorted_participants), 2):
        player1 = sorted_participants[i].player
        player2 = sorted_participants[i + 1].player
        
        new_tournamentMatch = tournamentMatch.objects.create(
            tournament=tournament_instance,
            player1=player1,
            player2=player2,
        )
        new_tournamentMatch.save()

        player1_uuid = player1.user_id
        player2_uuid = player2.user_id

        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            f'user_{player1_uuid}',
            {
                'type': 'message',
                'message': f'{tournament_instance.name}.',
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
                'message': f'{tournament_instance.name}.',
                'player1' : str(player1_uuid),
                'player2' : str(player2_uuid),
                'g_type' : 't',
                'g_id' : tournament_instance.id,
            }
        )
