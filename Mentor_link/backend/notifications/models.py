from django.db import models
from accounts.models import User

class Notification(models.Model):
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    actor = models.ForeignKey(User, on_delete=models.CASCADE, related_name='actor_notifications')
    verb = models.CharField(max_length=50)  # "match", "message", "annonce"
    target_id = models.IntegerField(null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)