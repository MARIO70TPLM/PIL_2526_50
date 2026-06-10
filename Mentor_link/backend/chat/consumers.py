# chat/consumers.py
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from urllib.parse import parse_qs
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth.models import AnonymousUser
from .models import Conversation, Message
from accounts.models import User

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.conversation_id = self.scope['url_route']['kwargs']['conversation_id']
        self.room_group_name = f'chat_{self.conversation_id}'

        # Récupérer le token depuis l'URL
        query_string = self.scope['query_string'].decode()
        params = parse_qs(query_string)
        token = params.get('token', [None])[0]

        if token:
            try:
                access_token = AccessToken(token)
                user_id = access_token['user_id']
                self.user = await database_sync_to_async(User.objects.get)(id=user_id)
            except Exception:
                self.user = AnonymousUser()
        else:
            self.user = AnonymousUser()

        if self.user.is_authenticated:
            # Vérifier que l'utilisateur participe à la conversation
            conv_exists = await database_sync_to_async(
                lambda: Conversation.objects.filter(id=self.conversation_id, participants=self.user).exists()
            )()
            if conv_exists:
                await self.channel_layer.group_add(self.room_group_name, self.channel_name)
                await self.accept()
            else:
                await self.close()
        else:
            await self.close()

    # ... le reste (disconnect, receive, etc.)