from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TeamViewSet, PlayerViewSet, MatchViewSet, EventViewSet

router = DefaultRouter()
router.register(r"teams", TeamViewSet, basename="team")
router.register(r"players", PlayerViewSet, basename="player")
router.register(r"matches", MatchViewSet, basename="match")
router.register(r"events", EventViewSet, basename="event")

urlpatterns = [
    path("", include(router.urls)),
]
