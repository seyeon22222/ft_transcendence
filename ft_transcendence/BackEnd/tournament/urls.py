from django.urls import path
from .view import (
    tournamentCreateView, addTournamentPlayer, matchView,
    MatchRequestView, MatchResponseView, matchListView,
    matchDetailView, MatchmakingView, tournamentGame,
    tournamentInviteView, matchGetHash, tournamentHash,
    MatchInviteView, matchResultView,
    MultiMatchListView, TournamentMatchRequestView,
    tournamentMatchView, tournamentMatchDetailView, multiMatchmakingView, 
    multiMatchHash, multimatchResultView, MultiMatchDetailView,
    tournamentDetailView,tournamentMatchResultView, 
)

app_name = "tournament"

urlpatterns = [
    path('list', tournamentCreateView.tournamentCreateView.as_view(), name='match_list'),
    path('t_list/<int:tournament_id>', tournamentGame.tournamentGame.as_view(), name='match_list_id'),
    path('multimatchList', MultiMatchListView.MultiMatchListView.as_view(), name='multimatch_view'),
    
    path('matchapply/<int:tournament_id>', addTournamentPlayer.addTournamentPlayer.as_view(), name='match_add_player'),

    path('matchview', matchListView.matchListView.as_view(), name='match_view'),
    path('matchview/<int:match_id>', matchDetailView.matchDetailView.as_view(), name='match_view'),
    path('t_matchview', tournamentMatchView.tournamentMatchView.as_view(), name='tournament_match_view'),
    path('t_matchview/<uuid:player1><uuid:player2><int:tournament_id>', tournamentMatchDetailView.tournamentMatchDetailView.as_view(), name='tournament_match_detail_view'),
    path('selfview', matchView.matchView.as_view(), name='match_selfview'),
    path('multimatchview/<int:multimatch_id>', MultiMatchDetailView.MultiMatchDetailView.as_view(), name='multimatch_detail_view'),
    path('tournamentview/<int:tournament_id>', tournamentDetailView.tournamentDetailView.as_view(), name="tournament_detail_view" ),
    
    path('m_request', MatchRequestView.MatchRequestView.as_view(), name='match_request'),
    path('t_request', TournamentMatchRequestView.TournamentMatchRequestView.as_view(), name='tournament_match_request'),

    path('response/<int:match_id>', MatchResponseView.MatchResponseView.as_view(), name='match_response'),

    path('matchmaking', MatchmakingView.MatchmakingView.as_view(), name='matchmaking_view'),
    path('mulmatchmaking', multiMatchmakingView.multiMatchmakingView.as_view(), name='mulmatchmaking_view'),

    path('invite_t/<int:tournament_id>', tournamentInviteView.tournamentInviteView.as_view(), name='gamestart_view'),
    path('invite_m/<int:match_id>', MatchInviteView.MatchInviteView.as_view(), name='matchstart_view'),

    path('matchgethash/<int:match_id>', matchGetHash.matchGetHash.as_view(), name='get_hash'),
    path('tournamenthash/<uuid:player1><uuid:player2><int:tournament_id>', tournamentHash.tournamentHash.as_view(), name='t_get_hash'),
    path('multimatchhash/<uuid:player1><uuid:player2><uuid:player3><uuid:player4><int:match_id>', multiMatchHash.multiMatchHash.as_view(), name='mul_get_hash'),

    path('matchresult/<int:match_id>', matchResultView.matchResultView.as_view(), name='match_result'),
    path('multimatchresult/<int:multimatch_id>', multimatchResultView.multimatchResultView.as_view(), name='multimatch_result'),
    path('tournamentresult/<int:tournament_id>', tournamentMatchResultView.tournamentMatchResultView.as_view(), name="tournament_result"),

]