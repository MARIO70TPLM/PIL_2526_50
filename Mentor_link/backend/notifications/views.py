from rest_framework import generics, permissions
from .models import Notification
from .serializers import NotificationSerializer

class NotificationList(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(recipient=self.request.user).order_by('-timestamp')

class MarkReadView(generics.UpdateAPIView):
    queryset = Notification.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def perform_update(self, serializer):
        serializer.save(is_read=True)