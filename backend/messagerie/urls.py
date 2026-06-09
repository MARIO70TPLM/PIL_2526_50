from django.urls import path
from . import views

# URLs de l'application messagerie
urlpatterns = [
    # Liste de toutes les conversations de l'utilisateur
    path('', views.liste_conversations, name='liste_conversations'),
    
    # Détail d'une conversation avec ses messages
    path('<int:conversation_id>/', views.detail_conversation, name='detail_conversation'),
    
    # Créer une conversation avec un autre utilisateur
    path('creer/<int:utilisateur_id>/', views.creer_conversation, name='creer_conversation'),
    
    # API pour récupérer les nouveaux messages (notifications)
    path('<int:conversation_id>/nouveaux/', views.nouveaux_messages, name='nouveaux_messages'),
]