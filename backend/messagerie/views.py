

from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from .models import Conversation, Message
import json

# ============================================================
# LISTE DES CONVERSATIONS
# Affiche toutes les conversations de l'utilisateur connecté
# ============================================================
@login_required
def liste_conversations(request):
    # Récupère toutes les conversations où l'utilisateur est participant
    conversations = Conversation.objects.filter(
        id_utilisateur_1=request.user
    ) | Conversation.objects.filter(
        id_utilisateur_2=request.user
    )
    return render(request, 'messagerie/liste.html', {'conversations': conversations})


# ============================================================
# DETAIL D'UNE CONVERSATION
# Affiche les messages d'une conversation et permet d'en envoyer
# ============================================================
@login_required
def detail_conversation(request, conversation_id):
    # Vérifie que la conversation existe et que l'utilisateur en fait partie
    conversation = get_object_or_404(
        Conversation,
        id=conversation_id
    )

    # Vérifie que l'utilisateur connecté est bien dans cette conversation
    if request.user != conversation.id_utilisateur_1 and request.user != conversation.id_utilisateur_2:
        return redirect('liste_conversations')

    # Récupère tous les messages de la conversation, du plus ancien au plus récent
    messages = Message.objects.filter(
        id_conversation=conversation
    ).order_by('date')

    # Si l'utilisateur envoie un nouveau message
    if request.method == 'POST':
        contenu = request.POST.get('contenu')
        if contenu:
            Message.objects.create(
                contenu=contenu,
                id_conversation=conversation,
                id_utilisateur=request.user
            )
        return redirect('detail_conversation', conversation_id=conversation.id)

    return render(request, 'messagerie/detail.html', {
        'conversation': conversation,
        'messages': messages
    })


# ============================================================
# CREER UNE CONVERSATION
# Crée une nouvelle conversation entre deux utilisateurs
# ============================================================
@login_required
def creer_conversation(request, utilisateur_id):
    from django.contrib.auth.models import User

    # Récupère l'autre utilisateur
    autre_utilisateur = get_object_or_404(User, id=utilisateur_id)

    # Vérifie si une conversation existe déjà entre ces deux utilisateurs
    conversation = Conversation.objects.filter(
        id_utilisateur_1=request.user,
        id_utilisateur_2=autre_utilisateur
    ).first() or Conversation.objects.filter(
        id_utilisateur_1=autre_utilisateur,
        id_utilisateur_2=request.user
    ).first()

    # Si aucune conversation n'existe, on en crée une nouvelle
    if not conversation:
        conversation = Conversation.objects.create(
            id_utilisateur_1=request.user,
            id_utilisateur_2=autre_utilisateur
        )

    return redirect('detail_conversation', conversation_id=conversation.id)


# ============================================================
# RECEVOIR LES NOUVEAUX MESSAGES (API)
# Retourne les nouveaux messages en JSON pour les notifications
# ============================================================
@login_required
def nouveaux_messages(request, conversation_id):
    # Récupère l'identifiant du dernier message déjà affiché
    dernier_id = request.GET.get('dernier_id', 0)

    # Récupère les messages plus récents que le dernier affiché
    messages = Message.objects.filter(
        id_conversation=conversation_id,
        id__gt=dernier_id
    ).order_by('date')

    # Formate les messages en JSON pour le frontend
    data = [{
        'id': msg.id,
        'contenu': msg.contenu,
        'date': msg.date.strftime('%H:%M'),
        'auteur': msg.id_utilisateur.username
    } for msg in messages]

    return JsonResponse({'messages': data})
