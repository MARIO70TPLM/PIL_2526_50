import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from .models import Conversation, Message
from django.contrib.auth.models import User

class MessageConsumer(AsyncWebsocketConsumer):
    
    # ============================================================
    # CONNEXION AU WEBSOCKET
    # Appelé quand un utilisateur ouvre une conversation
    # ============================================================
    async def connect(self):
        # Récupère l'ID de la conversation depuis l'URL
        self.conversation_id = self.scope['url_route']['kwargs']['conversation_id']
        self.room_group_name = f'conversation_{self.conversation_id}'

        # Ajoute l'utilisateur au groupe de la conversation
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
        await self.accept()

    # ============================================================
    # DÉCONNEXION DU WEBSOCKET
    # Appelé quand l'utilisateur ferme la conversation
    # ============================================================
    async def disconnect(self, close_code):
        # Retire l'utilisateur du groupe
        await self.channel_layer.group_discard(
            self.room_group_name,
            self.channel_name
        )

    # ============================================================
    # RÉCEPTION D'UN MESSAGE
    # Appelé quand un utilisateur envoie un message
    # ============================================================
    async def receive(self, text_data):
        data = json.loads(text_data)
        contenu = data['contenu']
        utilisateur_id = data['utilisateur_id']

        # Sauvegarde le message en base de données
        message = await self.sauvegarder_message(
            self.conversation_id,
            utilisateur_id,
            contenu
        )

        # Envoie le message à tous les participants de la conversation
        await self.channel_layer.group_send(
            self.room_group_name,
            {
                'type': 'envoyer_message',
                'contenu': contenu,
                'auteur': message['auteur'],
                'date': message['date']
            }
        )

    # ============================================================
    # ENVOI D'UN MESSAGE AU FRONTEND
    # ============================================================
    async def envoyer_message(self, event):
        await self.send(text_data=json.dumps({
            'contenu': event['contenu'],
            'auteur': event['auteur'],
            'date': event['date']
        }))

    # ============================================================
    # SAUVEGARDE EN BASE DE DONNÉES (opération synchrone)
    # ============================================================
    @database_sync_to_async
    def sauvegarder_message(self, conversation_id, utilisateur_id, contenu):
        conversation = Conversation.objects.get(id=conversation_id)
        utilisateur = User.objects.get(id=utilisateur_id)
        message = Message.objects.create(
            contenu=contenu,
            id_conversation=conversation,
            id_utilisateur=utilisateur
        )
        return {
            'auteur': utilisateur.username,
            'date': message.date.strftime('%H:%M')
        }