"""
Management command : crée les événements Game Day by LFE
(calendrier Avril-Mai 2026)

Usage :
    python manage.py create_game_day_events
"""
from django.core.management.base import BaseCommand
from django.utils import timezone
from esports.models import Event
import datetime


EVENTS = [
    {
        "title": "Soirée Street Fighter",
        "description": "Viens te battre au classique Street Fighter ! Tous niveaux bienvenus.",
        "start": datetime.datetime(2026, 4, 15, 19, 0, tzinfo=datetime.timezone.utc),
        "location": "Ynov Campus Lille - Studio 02",
        "participants": 0,
    },
    {
        "title": "Soirée Mario Party",
        "description": "Mini-jeux, trahisons et fous rires garantis — c'est Mario Party !",
        "start": datetime.datetime(2026, 4, 29, 19, 0, tzinfo=datetime.timezone.utc),
        "location": "Ynov Campus Lille - Studio 02",
        "participants": 0,
    },
    {
        "title": "C'est vous qui décidez !",
        "description": "Le jeu de la soirée est choisi par la communauté — vote en cours !",
        "start": datetime.datetime(2026, 5, 6, 19, 0, tzinfo=datetime.timezone.utc),
        "location": "Ynov Campus Lille - Studio 02",
        "participants": 0,
    },
]


class Command(BaseCommand):
    help = "Crée les événements Game Day by LFE (Avril-Mai 2026)"

    def handle(self, *args, **options):
        created = 0
        skipped = 0

        for data in EVENTS:
            obj, was_created = Event.objects.get_or_create(
                title=data["title"],
                defaults={
                    "description": data["description"],
                    "start": data["start"],
                    "location": data["location"],
                    "participants": data["participants"],
                },
            )
            if was_created:
                created += 1
                self.stdout.write(self.style.SUCCESS(f"  ✓ Créé : {obj.title} ({obj.start.strftime('%d/%m/%Y')})"))
            else:
                skipped += 1
                self.stdout.write(f"  — Déjà existant : {obj.title}")

        self.stdout.write(
            self.style.SUCCESS(f"\n{created} événement(s) créé(s), {skipped} ignoré(s).")
        )
