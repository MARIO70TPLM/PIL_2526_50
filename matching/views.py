from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.db.models import Q

# Importation depuis l'app matching
from matching.models import Offre, Matiere, Disponibilite, Format, ScoreMatching
from .forms import OffreForm


# ============================================================
# ALGORITHME DE MATCHING
# ============================================================

def calculer_score(offre_mentor, offre_mentore):
    """
    Calcule le score de compatibilité entre une offre de mentorat et une demande.
    """
    score = 0

    # 1. Matières en commun
    matieres_mentor = set(offre_mentor.matieres.values_list('id_matiere', flat=True))
    matieres_mentore = set(offre_mentore.matieres.values_list('id_matiere', flat=True))
    matieres_communes = matieres_mentor & matieres_mentore
    score += len(matieres_communes) * 50

    # 2. Disponibilités communes
    dispos_mentor = set(offre_mentor.disponibilites.values_list('id_disponibilite', flat=True))
    dispos_mentore = set(offre_mentore.disponibilites.values_list('id_disponibilite', flat=True))
    dispos_communes = dispos_mentor & dispos_mentore
    score += len(dispos_communes) * 20

    # 3. Proximité de filière (même filière = bonus)
    filiere_mentor = offre_mentor.id_utilisateur.filliere_utilisateur
    filiere_mentore = offre_mentore.id_utilisateur.filliere_utilisateur
    if filiere_mentor and filiere_mentore and filiere_mentor == filiere_mentore:
        score += 30

    # 4. Format compatible
    formats_mentor = set(offre_mentor.formats.values_list('id_format', flat=True))
    formats_mentore = set(offre_mentore.formats.values_list('id_format', flat=True))
    if formats_mentor & formats_mentore:
        score += 10

    return score, list(matieres_communes)


def trouver_matches(offre_cible):
    """
    Trouve les meilleures offres compatibles pour une offre donnée.
    """
    if offre_cible.type_offre == 'DEMANDE_MENTORAT':
        type_oppose = 'OFFRE_MENTORAT'
    else:
        type_oppose = 'DEMANDE_MENTORAT'

    offres_opposees = Offre.objects.filter(
        type_offre=type_oppose,
        est_active=True
    ).exclude(
        id_utilisateur=offre_cible.id_utilisateur
    ).select_related('id_utilisateur').prefetch_related(
        'matieres', 'disponibilites', 'formats'
    )

    resultats = []
    for offre in offres_opposees:
        if offre_cible.type_offre == 'DEMANDE_MENTORAT':
            score, matieres = calculer_score(offre, offre_cible)
        else:
            score, matieres = calculer_score(offre_cible, offre)

        if score > 0:
            if offre_cible.type_offre == 'DEMANDE_MENTORAT':
                ScoreMatching.objects.update_or_create(
                    id_offre_mentor=offre,
                    id_offre_mentore=offre_cible,
                    defaults={'score': score}
                )
            else:
                ScoreMatching.objects.update_or_create(
                    id_offre_mentor=offre_cible,
                    id_offre_mentore=offre,
                    defaults={'score': score}
                )

            noms_matieres = Matiere.objects.filter(id_matiere__in=matieres)

            resultats.append({
                'offre': offre,
                'utilisateur': offre.id_utilisateur,
                'score': score,
                'matieres_communes': noms_matieres,
                'score_pct': min(score, 100),
            })

    resultats.sort(key=lambda x: x['score'], reverse=True)
    return resultats


# ============================================================
# VIEWS
# ============================================================

@login_required
def dashboard(request):
    user = request.user
    mes_offres = Offre.objects.filter(
        id_utilisateur=user, est_active=True
    ).prefetch_related('matieres', 'disponibilites')

    return render(request, 'matching/dashboard.html', {
        'mes_offres': mes_offres,
        'user': user,
    })


@login_required
def creer_offre(request):
    if request.method == 'POST':
        form = OffreForm(request.POST)
        if form.is_valid():
            offre = form.save(commit=False)
            offre.id_utilisateur = request.user
            offre.save()
            form.save_m2m()
            messages.success(request, "Votre offre a été publiée avec succès !")
            return redirect('matching:mes_matches', offre_id=offre.pk)
        else:
            messages.error(request, "Veuillez corriger les erreurs.")
    else:
        form = OffreForm()

    return render(request, 'matching/creer_offre.html', {'form': form})


@login_required
def mes_matches(request, offre_id):
    offre = get_object_or_404(Offre, pk=offre_id, id_utilisateur=request.user)
    resultats = trouver_matches(offre)

    return render(request, 'matching/resultats_matching.html', {
        'offre': offre,
        'resultats': resultats,
        'nb_resultats': len(resultats),
    })


@login_required
def liste_offres(request):
    type_filtre = request.GET.get('type', '')
    matiere_filtre = request.GET.get('matiere', '')

    offres = Offre.objects.filter(est_active=True).exclude(
        id_utilisateur=request.user
    ).select_related('id_utilisateur').prefetch_related('matieres')

    if type_filtre:
        offres = offres.filter(type_offre=type_filtre)
    if matiere_filtre:
        offres = offres.filter(matieres__id_matiere=matiere_filtre)

    matieres = Matiere.objects.all()

    return render(request, 'matching/liste_offres.html', {
        'offres': offres,
        'matieres': matieres,
        'type_filtre': type_filtre,
        'matiere_filtre': matiere_filtre,
    })


@login_required
def supprimer_offre(request, offre_id):
    offre = get_object_or_404(Offre, pk=offre_id, id_utilisateur=request.user)
    
    if request.method == 'POST':
        offre.est_active = False
        offre.save()
        messages.success(request, "Offre supprimée avec succès.")
        return redirect('matching:dashboard')
    
    # Si l'utilisateur accède en GET, on lui demande confirmation
    return render(request, 'matching/confirmer_suppression.html', {'offre': offre})