from django.urls import path, re_path
from . import views
from .views import (
    tournamentCreateView, addTournamentPlayer, matchView
)

app_name = "tournament"

urlpatterns = [
    path('list', tournamentCreateView.as_view(), name='match_list'),
    # path('apply', addTournamentPlayer.as_view(), name='match_apply'),
    # path('<str:name>', matchView.as_view(), name='match_view'),
    path('apply', matchView.as_view(), name='match_apply')
]