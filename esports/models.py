from django.db import models


class Team(models.Model):
    name = models.CharField(max_length=100)
    game = models.CharField(max_length=100, default="League of Legends")
    description = models.TextField(blank=True)
    
    rank = models.CharField(max_length=50, blank=True)
    wins = models.PositiveIntegerField(default=0)
    losses = models.PositiveIntegerField(default=0)
    color = models.CharField(max_length=7, default="#36d4ff")

    def __str__(self):
        return self.name


class Player(models.Model):
    CLUB_ROLE_CHOICES = [
        ("player", "Joueur"),
        ("coach", "Coach"),
        ("referee", "Arbitre"),
    ]

    GAME_ROLE_CHOICES = [
        ("top", "Top"),
        ("jungle", "Jungle"),
        ("mid", "Mid"),
        ("adc", "ADC"),
        ("support", "Support"),
    ]

    pseudo = models.CharField(max_length=50)
    full_name = models.CharField("Nom complet", max_length=100, blank=True)
    team = models.ForeignKey(Team, on_delete=models.CASCADE, related_name="players")
    club_role = models.CharField(max_length=20, choices=CLUB_ROLE_CHOICES, default="player")
    game_role = models.CharField(max_length=20, choices=GAME_ROLE_CHOICES, default="top")
    rank = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return self.pseudo


class Match(models.Model):
    team_a = models.ForeignKey(Team, on_delete=models.CASCADE, related_name="matches_as_team_a")
    team_b = models.ForeignKey(Team, on_delete=models.CASCADE, related_name="matches_as_team_b")
    date = models.DateTimeField()
    tournament = models.CharField(max_length=100, blank=True)

    RESULT_CHOICES = [
        ("A", "Victoire Team A"),
        ("B", "Victoire Team B"),
        ("D", "Match nul"),
        ("P", "Pas encore joué"),
    ]
    result = models.CharField(max_length=1, choices=RESULT_CHOICES, default="P")
    
    location = models.CharField(max_length=120, blank=True, default="En ligne")
    live_url = models.URLField(blank=True)
    replay_url = models.URLField(blank=True)

    def __str__(self):
        return f"{self.team_a} vs {self.team_b} - {self.date.strftime('%d/%m/%Y')}"


class Event(models.Model):
    title = models.CharField(max_length=160)
    description = models.TextField(blank=True)
    start = models.DateTimeField()
    participants = models.PositiveIntegerField(default=0)
    image_url = models.URLField(blank=True)
    replay_url = models.URLField("URL de la rediffusion", blank=True)
    location = models.CharField(max_length=120, blank=True, default="En ligne")

    class Meta:
        ordering = ["start"]

    def __str__(self):
        return self.title

    @property
    def status(self):
        from django.utils import timezone
        from datetime import timedelta

        now = timezone.now()
        if self.start > now:
            return "upcoming"
        if self.start <= now < self.start + timedelta(hours=4):
            return "live"
        return "finished"
