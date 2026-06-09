import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack
import messagerie.routing

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'IFRI_MentorLink.IFRI_MentorLink.settings')

# Configuration ASGI pour gérer HTTP et WebSocket
application = ProtocolTypeRouter({
    # Gestion des requêtes HTTP classiques
    'http': get_asgi_application(),
    
    # Gestion des connexions WebSocket avec authentification
    'websocket': AuthMiddlewareStack(
        URLRouter(
            messagerie.routing.websocket_urlpatterns
        )
    ),
})