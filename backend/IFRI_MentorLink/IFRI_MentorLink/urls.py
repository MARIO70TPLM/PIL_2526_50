from django.contrib import admin
from django.urls import path, include
from django.contrib.auth import views as auth_views

urlpatterns = [
    # Interface d'administration Django
    path('admin/', admin.site.urls),
    
    # Login/Logout temporaire pour les tests
    path('accounts/login/', auth_views.LoginView.as_view(template_name='registration/login.html'), name='login'),
    path('accounts/logout/', auth_views.LogoutView.as_view(), name='logout'),
    
    # URLs de l'application offres
    path('offres/', include('offres.urls')),
    
    # URLs de l'application messagerie
    path('messagerie/', include('messagerie.urls')),
]