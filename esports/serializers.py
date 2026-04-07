from rest_framework import serializers
from .models import Team, Player, Match, Event
from django.utils import timezone


class EventSerializer(serializers.ModelSerializer):
    date = serializers.DateTimeField(source="start")
    time = serializers.SerializerMethodField()
    status = serializers.CharField(read_only=True)

    class Meta:
        model = Event
        fields = [
            "id",
            "title",
            "description",
            "date",
            "time",
            "location",
            "participants",
            "image_url",
            "replay_url",
            "status",
        ]

    def get_time(self, obj):
        return obj.start.strftime("%H:%M")


class TeamSerializer(serializers.ModelSerializer):
    players_count = serializers.IntegerField(read_only=True)
    winrate = serializers.SerializerMethodField()

    class Meta:
        model = Team
        fields = [
            "id", "name", "game", "description",
            "rank", "wins", "losses", "winrate", "color",
            "players_count",
        ]

    def get_winrate(self, obj):
        total = (obj.wins or 0) + (obj.losses or 0)
        if total == 0:
            return 0
        return round((obj.wins / total) * 100)


class PlayerSerializer(serializers.ModelSerializer):
    team_name = serializers.CharField(source="team.name", read_only=True)

    class Meta:
        model = Player
        fields = [
            "id", "pseudo", "full_name",
            "team", "team_name",
            "club_role", "game_role",
            "rank",
        ]


class MatchSerializer(serializers.ModelSerializer):
    team_a_name = serializers.CharField(source="team_a.name", read_only=True)
    team_b_name = serializers.CharField(source="team_b.name", read_only=True)
    status = serializers.SerializerMethodField()

    class Meta:
        model = Match
        fields = [
            "id",
            "team_a", "team_a_name",
            "team_b", "team_b_name",
            "date", "tournament", "result",
            "location", "live_url", "replay_url",
            "status",
        ]

    def get_status(self, obj):
        now = timezone.now()
        if obj.result != "P":
            return "finished"
        if obj.date > now:
            return "upcoming"
        return "live"
