from django.urls import path
from .views import MatiereList, DisponibiliteList, AnnonceListCreate, AnnonceDetail, MatchList, ComputeMatchesView

urlpatterns = [
    path('matieres/', MatiereList.as_view()),
    path('disponibilites/', DisponibiliteList.as_view()),
    path('annonces/', AnnonceListCreate.as_view()),
    path('annonces/<int:pk>/', AnnonceDetail.as_view()),
    path('matches/', MatchList.as_view()),
    path('compute-matches/', ComputeMatchesView.as_view()),
]