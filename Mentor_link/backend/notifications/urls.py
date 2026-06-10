from django.urls import path
from .views import NotificationList, MarkReadView

urlpatterns = [
    path('', NotificationList.as_view()),
    path('<int:pk>/read/', MarkReadView.as_view()),
]