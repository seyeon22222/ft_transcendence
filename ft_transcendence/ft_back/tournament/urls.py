from django.urls import path, re_path
from . import views
from .views import (
    tournamentCreateView, addTournamentPlayer, matchView,
    MatchRequestView, MatchResponseView, matchListView,
    matchDetailView, MatchmakingView, tournamentGame
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
]