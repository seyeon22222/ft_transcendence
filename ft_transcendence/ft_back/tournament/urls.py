from django.urls import path, re_path
from . import views
from .views import (
    tournamnetCreateView, addTournamentPlayer, matchView
)

app_name = "tournament"

urlpatterns = [
    path('list', tournamnetCreateView.as_view(), name='match_list'),
    path('apply', addTournamentPlayer.as_view(), name='match_apply'),
    path('view', matchView.as_view(), name='match_view'),
]