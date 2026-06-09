from django.urls import re_path
from . import consumers

# URLs WebSocket pour la messagerie en temps réel
websocket_urlpatterns = [
    re_path(
        r'ws/messagerie/(?P<conversation_id>\d+)/$',
        consumers.MessageConsumer.as_asgi()
    ),
]