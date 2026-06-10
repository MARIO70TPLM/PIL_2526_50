"""
Django settings for IFRI_MentorLink
"""

from pathlib import Path
import os

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = 'django-insecure-mentorlink-ifri-change-this-in-production'

DEBUG = True

ALLOWED_HOSTS = ['*']

INSTALLED_APPS = [
    'daphne',  # ⚠️ DOIT ÊTRE TOUT EN HAUT
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    
    # Apps du projet
    'accounts.apps.AccountsConfig',
    'matching',
    'messagerie',
    
    # Channels pour websocket
    'channels',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'ifrimentorlink_back.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        # On dit à Django de chercher le HTML dans tes deux dossiers réels
        'DIRS': [
            BASE_DIR / 'templates',
           
        ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]
WSGI_APPLICATION = 'ifrimentorlink_back.wsgi.application'
ASGI_APPLICATION = 'ifrimentorlink_back.asgi.application'

# ============================================================
# BASE DE DONNÉES MySQL
# ⚠️ Remplace les valeurs par tes vraies infos de connexion
# ============================================================
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'mentorlink',
        'USER': 'root',
        'PASSWORD': '',
        'HOST': 'localhost',
        'PORT': '3306',
        'OPTIONS': {
            'charset': 'utf8mb4',
        },
    }
}

# Authentification personnalisée
AUTH_USER_MODEL = 'accounts.Utilisateur'
# ============================================================
# CONFIGURATION DES FICHIERS STATIQUES (Corrigée)
# ============================================================
STATIC_URL = '/static/'

# C'est ici que tu mets tes sources (CSS, JS, Images)
# Django cherchera dans 'frontend' à la racine de ton projet
# C'est ici que tu mets tes sources (CSS, JS, Images)
# Ton dossier s'appelle 'assets' dans ton projet
# C'est ici que tu mets tes sources (CSS, JS, Images)
# Ton dossier s'appelle 'assets' dans ton projet
STATICFILES_DIRS = [
    BASE_DIR / 'assets', 
]

# C'est ici que Django va copier TOUS les fichiers lors du 'collectstatic'
# ⚠️ ATTENTION : Ne nomme pas ce dossier 'static' s'il est à la racine, 
# car Django va créer un conflit entre ton dossier source et ce dossier.
# Je te conseille de le nommer 'staticfiles'.
# Ne garde que cette ligne et supprime l'autre pour éviter le conflit
STATIC_ROOT = BASE_DIR / 'staticfiles'

# Fichiers médias (photos de profil)
MEDIA_URL = '/media/'
MEDIA_ROOT = BASE_DIR / 'media'

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

# Django Channels (WebSocket pour messagerie)
CHANNEL_LAYERS = {
    'default': {
        'BACKEND': 'channels.layers.InMemoryChannelLayer',
        # En production, utiliser Redis :
        # 'BACKEND': 'channels_redis.core.RedisChannelLayer',
        # 'CONFIG': {"hosts": [('127.0.0.1', 6379)]},
    },
}