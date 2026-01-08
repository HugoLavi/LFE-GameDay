from rest_framework import viewsets
from rest_framework.response import Response
from rest_framework.decorators import action

from django.db import models
from .models import Team, Player, Match
from .serializers import TeamSerializer, PlayerSerializer, MatchSerializer


class TeamViewSet(viewsets.ModelViewSet):
    """
    /api/teams/
    /api/teams/<id>/
    """
    serializer_class = TeamSerializer

    def get_queryset(self):
        # Ajout d'un annot pour compter les joueurs
        return Team.objects.all().annotate(
            players_count=models.Count("players")
        )


class PlayerViewSet(viewsets.ModelViewSet):
    serializer_class = PlayerSerializer

    def get_queryset(self):
        queryset = Player.objects.select_related("team").all()
        team_id = self.request.query_params.get("team")
        if team_id:
            queryset = queryset.filter(team_id=team_id)
        return queryset


class MatchViewSet(viewsets.ModelViewSet):
    serializer_class = MatchSerializer

    def get_queryset(self):
        queryset = Match.objects.select_related("team_a", "team_b").all()
        team_id = self.request.query_params.get("team")
        if team_id:
            queryset = queryset.filter(
                models.Q(team_a_id=team_id) | models.Q(team_b_id=team_id)
            )
        return queryset

    @action(detail=False, methods=["get"])
    def upcoming(self, request):
        from django.utils import timezone

        now = timezone.now()
        qs = self.get_queryset().filter(date__gte=now).order_by("date")
        serializer = self.get_serializer(qs, many=True)
        return Response(serializer.data)
