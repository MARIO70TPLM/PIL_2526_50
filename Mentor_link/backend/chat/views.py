from rest_framework import generics, permissions
from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer

class ConversationList(generics.ListCreateAPIView):
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Conversation.objects.filter(participants=self.request.user)

    def perform_create(self, serializer):
        # créer une conversation avec l'autre participant (id passé en data)
        other_id = self.request.data.get('other_user_id')
        conv = serializer.save()
        conv.participants.add(self.request.user, other_id)
        return conv

class MessageList(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        conv_id = self.kwargs['conversation_id']
        return Message.objects.filter(conversation_id=conv_id)

    def perform_create(self, serializer):
        conv_id = self.kwargs['conversation_id']
        serializer.save(sender=self.request.user, conversation_id=conv_id)