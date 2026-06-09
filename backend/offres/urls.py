from django.urls import path
from . import views

# URLs de l'application offres
urlpatterns = [
    # Liste de toutes les offres
    path('', views.liste_offres, name='liste_offres'),
    
    # Créer une nouvelle offre
    path('creer/', views.creer_offre, name='creer_offre'),
    
    # Supprimer une offre (identifiée par son ID)
    path('supprimer/<int:offre_id>/', views.supprimer_offre, name='supprimer_offre'),
    
    # Rechercher des offres par matière ou disponibilité
    path('rechercher/', views.rechercher_offres, name='rechercher_offres'),
    
    # Répondre à une offre
    path('repondre/<int:offre_id>/', views.repondre_offre, name='repondre_offre'),
]