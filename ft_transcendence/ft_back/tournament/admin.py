from django.contrib import admin
from .models import tournament, Match, matchmaking, tournamentMatch

# Register your models here.
admin.site.register(tournament)
admin.site.register(Match)
admin.site.register(matchmaking)
admin.site.register(tournamentMatch)
