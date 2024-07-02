from django.urls import path
from .views import (
    tournamentCreateView, addTournamentPlayer, matchView,
    MatchRequestView, MatchResponseView, matchListView,
    matchDetailView, MatchmakingView, tournamentGame,
    tournamentInviteView, matchGetHash, tournamentHash,
    MatchInviteView, matchResultView,
    MultiMatchListView, TournamentMatchRequestView,
    tournamentMatchView, tournamentMatchDetailView, multiMatchmakingView, 
    multiMatchHash, multimatchResultView, MultiMatchDetailView,
    tournamentDetailView,tournamentMatchResultView, 
    updateMatchCustom, updateTournamentCustom, updateMultiCustom
)

app_name = "tournament"

urlpatterns = [
    path('list', tournamentCreateView.as_view(), name='match_list'),
    path('t_list/<int:tournament_id>', tournamentGame.as_view(), name='match_list_id'),
    path('multimatchList', MultiMatchListView.as_view(), name='multimatch_view'),
    
    path('matchapply/<int:tournament_id>', addTournamentPlayer.as_view(), name='match_add_player'),

    path('matchview', matchListView.as_view(), name='match_view'),
    path('matchview/<int:match_id>', matchDetailView.as_view(), name='match_view'),
    path('t_matchview', tournamentMatchView.as_view(), name='tournament_match_view'),
    path('t_matchview/<uuid:player1><uuid:player2><int:tournament_id>', tournamentMatchDetailView.as_view(), name='tournament_match_detail_view'),
    path('selfview', matchView.as_view(), name='match_selfview'),
    path('multimatchview/<int:multimatch_id>', MultiMatchDetailView.as_view(), name='multimatch_detail_view'),
    path('tournamentview/<int:tournament_id>', tournamentDetailView.as_view(), name="tournament_detail_view" ),
    
    path('m_request', MatchRequestView.as_view(), name='match_request'),
    path('t_request', TournamentMatchRequestView.as_view(), name='tournament_match_request'),

    path('response/<int:match_id>', MatchResponseView.as_view(), name='match_response'),

    path('matchmaking', MatchmakingView.as_view(), name='matchmaking_view'),
    path('mulmatchmaking', multiMatchmakingView.as_view(), name='mulmatchmaking_view'),

    path('invite_t/<int:tournament_id>', tournamentInviteView.as_view(), name='gamestart_view'),
    path('invite_m/<int:match_id>', MatchInviteView.as_view(), name='matchstart_view'),

    path('matchgethash/<int:match_id>', matchGetHash.as_view(), name='get_hash'),
    path('tournamenthash/<uuid:player1><uuid:player2><int:tournament_id>', tournamentHash.as_view(), name='t_get_hash'),
    path('multimatchhash/<uuid:player1><uuid:player2><uuid:player3><uuid:player4><int:match_id>', multiMatchHash.as_view(), name='mul_get_hash'),

    path('matchresult/<int:match_id>', matchResultView.as_view(), name='match_result'),
    path('multimatchresult/<int:multimatch_id>', multimatchResultView.as_view(), name='multimatch_result'),
    path('tournamentresult/<int:tournament_id>', tournamentMatchResultView.as_view(), name="tournament_result"),
    
    path('updatematchcustom/<int:match_id>',updateMatchCustom.as_view(), name="match_custom"),
    path('updatetournamentcustom/<uuid:player1><uuid:player2><int:tournament_id>', updateTournamentCustom.as_view(), name="tournament_custom"),
    path('updatemulticustom/<int:multimatch_id>',updateMultiCustom.as_view(),name='multi_custom')
]