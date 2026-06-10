from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic import TemplateView  # Pour charger directement le HTML du frontend

urlpatterns = [
    # 1. L'administration Django
    path('admin/', admin.site.urls),

    # 2. La page d'accueil
    path('', TemplateView.as_view(template_name='index.html'), name='accueil'),

    # 3. L'application Accounts
    path('auth/', include(('accounts.urls', 'accounts'), namespace='accounts')),

    # 4. L'application Matching
    path('matching/', include(('matching.urls', 'matching'), namespace='matching')),

    # 5. L'application Messagerie
    path('messagerie/', include(('messagerie.urls', 'messagerie'), namespace='messagerie')),
]

# Gestion des fichiers médias (images téléversées)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)