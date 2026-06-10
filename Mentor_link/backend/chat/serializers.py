from rest_framework import serializers
from .models import Conversation, Message
from accounts.serializers import UserSerializer

class MessageSerializer(serializers.ModelSerializer):
    sender_detail = UserSerializer(source='sender', read_only=True)
    class Meta: model = Message; fields = '__all__'
    read_only_fields = ['id', 'timestamp', 'sender']

class ConversationSerializer(serializers.ModelSerializer):
    participants_detail = UserSerializer(source='participants', many=True, read_only=True)
    last_message = serializers.SerializerMethodField()

    class Meta: model = Conversation; fields = '__all__'

    def get_last_message(self, obj):
        msg = obj.messages.last()
        return MessageSerializer(msg).data if msg else None