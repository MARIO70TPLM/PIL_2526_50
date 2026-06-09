from django.db import models
from django.contrib.auth.models import User

class Conversation(models.Model):
    id_utilisateur_1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='conversations_1', db_column='id_utilisateur_1')
    id_utilisateur_2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name='conversations_2', db_column='id_utilisateur_2')
    date_creation = models.DateTimeField(auto_now_add=True)

    class Meta:
        db_table = 'Conversation'

    def __str__(self):
        return f"Conversation {self.id} entre {self.id_utilisateur_1} et {self.id_utilisateur_2}"

class Message(models.Model):
    contenu = models.TextField()
    date = models.DateTimeField(auto_now_add=True)
    id_conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, db_column='id_conversation')
    id_utilisateur = models.ForeignKey(User, on_delete=models.CASCADE, db_column='id_utilisateur')

    class Meta:
        db_table = 'Message'

    def __str__(self):
        return f"Message de {self.id_utilisateur} - {self.date}"

# Create your models here.
