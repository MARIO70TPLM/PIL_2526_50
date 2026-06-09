from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from .models import Offre, Matiere, Disponibilite, Format

# ============================================================
# LISTE DES OFFRES
# Affiche toutes les offres dans le template principal
# ============================================================
@login_required
def liste_offres(request):
    # Récupère toutes les offres de la base de données
    offres = Offre.objects.all()
    return render(request, 'index.html', {'offres': offres})

# ============================================================
# CRÉER UNE OFFRE
# Traite le formulaire de création d'une offre
# ============================================================
@login_required
def creer_offre(request):
    if request.method == 'POST':
        # Récupère les données du formulaire
        type_offre = request.POST.get('type')
        matieres_ids = request.POST.getlist('matieres')
        disponibilites_ids = request.POST.getlist('disponibilites')
        formats_ids = request.POST.getlist('formats')

        # Crée l'offre en base de données
        offre = Offre.objects.create(
            id_utilisateur=request.user,
            type=type_offre
        )
        offre.matieres.set(matieres_ids)
        offre.disponibilites.set(disponibilites_ids)
        offre.formats.set(formats_ids)

        return redirect('liste_offres')

    # Récupère les données pour remplir le formulaire
    matieres = Matiere.objects.all()
    disponibilites = Disponibilite.objects.all()
    formats = Format.objects.all()
    return render(request, 'index.html', {
        'matieres': matieres,
        'disponibilites': disponibilites,
        'formats': formats
    })

# ============================================================
# SUPPRIMER UNE OFFRE
# Supprime une offre appartenant à l'utilisateur connecté
# ============================================================
@login_required
def supprimer_offre(request, offre_id):
    # Vérifie que l'offre appartient bien à l'utilisateur connecté
    offre = get_object_or_404(Offre, id=offre_id, id_utilisateur=request.user)
    offre.delete()
    return redirect('liste_offres')

# ============================================================
# RECHERCHER DES OFFRES
# Filtre les offres par matière et/ou disponibilité
# ============================================================
@login_required
def rechercher_offres(request):
    matiere_id = request.GET.get('matiere')
    disponibilite_id = request.GET.get('disponibilite')
    offres = Offre.objects.all()

    # Applique les filtres si fournis
    if matiere_id:
        offres = offres.filter(matieres__id=matiere_id)
    if disponibilite_id:
        offres = offres.filter(disponibilites__id=disponibilite_id)

    matieres = Matiere.objects.all()
    disponibilites = Disponibilite.objects.all()
    return render(request, 'index.html', {
        'offres': offres,
        'matieres': matieres,
        'disponibilites': disponibilites
    })

# ============================================================
# RÉPONDRE À UNE OFFRE
# Crée une conversation avec le propriétaire de l'offre
# ============================================================
@login_required
def repondre_offre(request, offre_id):
    offre = get_object_or_404(Offre, id=offre_id)
    if request.method == 'POST':
        from messagerie.models import Conversation
        # Crée ou récupère une conversation existante
        conversation, created = Conversation.objects.get_or_create(
            id_utilisateur_1=request.user,
            id_utilisateur_2=offre.id_utilisateur
        )
        return redirect('detail_conversation', conversation_id=conversation.id)
    return render(request, 'index.html', {'offre': offre})