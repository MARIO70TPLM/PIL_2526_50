// matching.js - Gestion des matchs et publication d'annonces
let currentMatchingData = null;

async function loadMatchingContent() {
    const container = document.getElementById('matchingContent');
    if (!container) return;

    const token = localStorage.getItem('access_token');
    if (!token) {
        showPage('login');
        return;
    }

    try {
        const [matchesRes, matieresRes, disponibilitesRes] = await Promise.all([
            fetch(`${API_BASE}/mentoring/matches/`, { headers: getAuthHeaders() }),
            fetch(`${API_BASE}/mentoring/matieres/`, { headers: getAuthHeaders() }),
            fetch(`${API_BASE}/mentoring/disponibilites/`, { headers: getAuthHeaders() })
        ]);
        const matches = await matchesRes.json();
        const matieres = await matieresRes.json();
        const disponibilites = await disponibilitesRes.json();

        currentMatchingData = { matieres, disponibilites };

        container.innerHTML = `
            <div class="page-header" style="text-align:left;">
                <h1>Matching</h1>
                <p>Résultats des correspondances basés sur ton profil</p>
            </div>

            <div class="filters-bar">
                <select class="filter-select" id="filterMatiereMatch"><option value="">Toutes matières</option>${matieres.map(m => `<option value="${m.id}">${m.nom}</option>`).join('')}</select>
                <select class="filter-select" id="filterNiveauMatch"><option value="">Tous niveaux</option></select>
                <select class="filter-select" id="filterDispoMatch"><option value="">Toutes dispo</option></select>
                <button class="btn btn-accent" onclick="filterMatches()">Filtrer</button>
            </div>

            <h3>🎯 Correspondances actives</h3>
            <div id="matchListActive">
                ${matches.map(m => {
                    const other = m.utilisateur2_detail || {};
                    const name = `${other.first_name || ''} ${other.last_name || ''}`;
                    const initials = (other.first_name?.charAt(0) || '') + (other.last_name?.charAt(0) || '');
                    return `
                        <div class="match-card">
                            <div class="avatar">${initials || '?'}</div>
                            <div class="match-info">
                                <div class="match-name">${name}</div>
                                <div class="match-meta">${other.niveau} · ${other.filiere}</div>
                                <div class="match-tags"><span class="match-tag">Score: ${Math.round(m.score)}%</span></div>
                            </div>
                            <button class="btn btn-accent" onclick="voirMatchDetail(${m.id})">Voir détail</button>
                        </div>
                    `;
                }).join('') || '<p>Aucune correspondance active.</p>'}
            </div>

            <h3>✏️ Publier une annonce</h3>
            <div class="publish-form" id="publishForm">
                <div class="form-group">
                    <select id="annonceType">
                        <option value="offer">Offre de mentorat (je veux aider)</option>
                        <option value="demand">Demande d'aide (je cherche un mentor)</option>
                    </select>
                </div>
                <div class="form-group">
                    <select id="annonceMatiere">
                        <option value="">Sélectionner matière</option>
                        ${matieres.map(m => `<option value="${m.id}">${m.nom}</option>`).join('')}
                    </select>
                </div>
                <div class="form-group">
                    <select id="annonceMode">
                        <option value="online">En ligne</option>
                        <option value="in_person">Présentiel</option>
                    </select>
                </div>
                <div class="form-group">
                    <select id="selectJour">
                        <option value="">Jour de disponibilité</option>
                        <option value="lundi">Lundi</option><option value="mardi">Mardi</option><option value="mercredi">Mercredi</option>
                        <option value="jeudi">Jeudi</option><option value="vendredi">Vendredi</option><option value="samedi">Samedi</option><option value="dimanche">Dimanche</option>
                    </select>
                </div>
                <div class="form-group" id="groupePlage" style="display:none;">
                    <select id="selectPlage">
                        <option value="">Plage horaire</option>
                        <option value="matin">Matin (08h–12h)</option>
                        <option value="soir">Soir (17h–21h)</option>
                    </select>
                </div>
                <button class="btn btn-accent" onclick="publierAnnonce()">Publier</button>
            </div>
        `;

        document.getElementById('selectJour').addEventListener('change', function() {
            const groupe = document.getElementById('groupePlage');
            groupe.style.display = this.value ? 'block' : 'none';
        });
    } catch (err) {
        console.error(err);
        container.innerHTML = '<p>Erreur de chargement de la page matching.</p>';
    }
}

window.publierAnnonce = async function() {
    const type = document.getElementById('annonceType').value;
    const matiereId = document.getElementById('annonceMatiere').value;
    const mode = document.getElementById('annonceMode').value;
    const jour = document.getElementById('selectJour').value;
    const plage = document.getElementById('selectPlage').value;

    if (!matiereId) {
        alert('Veuillez sélectionner une matière');
        return;
    }

    let disponibiliteId = null;
    if (jour && plage) {
        const dispoList = currentMatchingData.disponibilites;
        const found = dispoList.find(d => d.jour === jour && d.plage === plage);
        if (found) disponibiliteId = found.id;
    }

    const payload = {
        type_annonce: type,
        matiere: parseInt(matiereId),
        mode: mode,
        disponibilite: disponibiliteId,
        description: ''
    };

    try {
        const res = await fetch(`${API_BASE}/mentoring/annonces/`, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(payload)
        });
        if (res.ok) {
            alert('Annonce publiée avec succès !');
            loadMatchingContent();
        } else {
            const err = await res.json();
            alert('Erreur : ' + JSON.stringify(err));
        }
    } catch (err) {
        alert('Erreur réseau');
    }
};

window.voirMatchDetail = function(matchId) {
    alert(`Détail du match #${matchId}\nVous pouvez maintenant discuter.`);
    // Option : démarrer une conversation
    startConversationFromMatch(matchId);
};

async function startConversationFromMatch(matchId) {
    const res = await fetch(`${API_BASE}/mentoring/matches/`, { headers: getAuthHeaders() });
    const matches = await res.json();
    const match = matches.find(m => m.id === matchId);
    if (match) {
        startConversation(match.utilisateur2_detail.id);
    }
}

window.filterMatches = function() {
    alert('Filtrage en développement');
};