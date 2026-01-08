from django.contrib import admin
from .models import Team, Player, Match

@admin.register(Team)
class TeamAdmin(admin.ModelAdmin):
    list_display = ('name', 'game', 'rank', 'wins', 'losses', 'color')
    search_fields = ('name', 'game')
    list_filter = ('game',)
    

@admin.register(Player)
class PlayerAdmin(admin.ModelAdmin):
    list_display = ('pseudo', 'team', 'club_role', 'game_role', 'rank')
    list_filter = ('club_role', 'game_role', 'team')
    search_fields = ('pseudo', 'full_name')


@admin.register(Match)
class MatchAdmin(admin.ModelAdmin):
    list_display = ("team_a", "team_b", "date", "tournament", "result", "location")
    list_filter = ("tournament", "result", "date")
    search_fields = ("team_a__name", "team_b__name")
    date_hierarchy = "date"
    