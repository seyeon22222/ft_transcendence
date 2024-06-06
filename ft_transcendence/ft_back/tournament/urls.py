from django.urls import path, re_path
from . import views
from .views import (
    tournamentCreateView, addTournamentPlayer, matchView,
    MatchRequestView, MatchResponseView, matchListView,
    matchDetailView, MatchmakingView, tournamentGame,
    tournamentInviteView, matchGetHash, tournamentHash,
    MatchInviteView,
)

app_name = "tournament"

urlpatterns = [
    path('list', tournamentCreateView.as_view(), name='match_list'),
    path('t_list/<int:tournament_id>', tournamentGame.as_view(), name='match_list_id'),
    path('matchapply/<int:tournament_id>', addTournamentPlayer.as_view(), name='match_add_player'),
    path('matchview', matchListView.as_view(), name='match_view'),
    path('matchview/<int:match_id>', matchDetailView.as_view(), name='match_view'),
    path('selfview', matchView.as_view(), name='match_selfview'),
    path('request', MatchRequestView.as_view(), name='match_request'),
    path('response/<int:match_id>', MatchResponseView.as_view(), name='match_response'),
    path('matchmaking', MatchmakingView.as_view(), name='matchmaking_view'),
    path('invite/<int:tournament_id>', tournamentInviteView.as_view(), name='gamestart_view'),
    path('invite_m/<int:match_id>', MatchInviteView.as_view(), name='matchstart_view'),
    path('matchgethash/<int:match_id>', matchGetHash.as_view(), name='get_hash'),
    path('tournamenthash/<uuid:player1><uuid:player2><int:tournament_id>', tournamentHash.as_view(), name='t_get_hash'),
]