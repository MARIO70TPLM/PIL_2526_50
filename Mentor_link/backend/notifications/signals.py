from django.db.models.signals import post_save
from django.dispatch import receiver
from .models import Notification
from chat.models import Message
from mentoring.models import Match

@receiver(post_save, sender=Match)
def create_match_notification(sender, instance, created, **kwargs):
    if created:
        Notification.objects.create(recipient=instance.utilisateur2, actor=instance.utilisateur1, verb='match', target_id=instance.id)

@receiver(post_save, sender=Message)
def create_message_notification(sender, instance, created, **kwargs):
    if created:
        for participant in instance.conversation.participants.exclude(id=instance.sender.id):
            Notification.objects.create(recipient=participant, actor=instance.sender, verb='message', target_id=instance.conversation.id)