// dashboard.js - Tableau de bord (version DEBUG)

async function loadDashboardContent() {
    console.log('🚀 loadDashboardContent() démarré');

    const container = document.getElementById('dashboardContent');
    if (!container) {
        console.error('❌ #dashboardContent introuvable dans le DOM');
        return;
    }
    console.log('✅ container trouvé');

    const token = localStorage.getItem('access_token');
    console.log('🔑 Token JWT:', token ? token.substring(0, 30) + '...' : 'ABSENT');

    if (!token) {
        console.warn('⚠️ Pas de token → redirection login');
        showPage('login');
        return;
    }

    // Lecture sécurisée du user
    let user = {};
    try {
        const raw = localStorage.getItem('user');
        console.log('👤 localStorage user (brut):', raw);
        if (raw && raw !== 'undefined') {
            user = JSON.parse(raw);
            console.log('✅ user parsé:', user);
        } else {
            console.warn('⚠️ user absent ou undefined dans localStorage');
        }
    } catch (e) {
        console.error('❌ Erreur JSON.parse user:', e);
    }

    const prenom = user.first_name || 'Utilisateur';
    console.log('👋 Prénom:', prenom);

    try {
        console.log('📡 Lancement des 3 requêtes parallèles...');

        const [matchesRes, notifRes, annoncesRes] = await Promise.all([
            fetch(`${API_BASE}/mentoring/matches/`,             { headers: getAuthHeaders() }),
            fetch(`${API_BASE}/notifications/`,                 { headers: getAuthHeaders() }),
            fetch(`${API_BASE}/mentoring/annonces/?actif=true`, { headers: getAuthHeaders() })
        ]);

        console.log('📊 Status matches:', matchesRes.status);
        console.log('🔔 Status notifications:', notifRes.status);
        console.log('📋 Status annonces:', annoncesRes.status);

        // Lecture sécurisée de chaque réponse
        let matches = [], notifications = [], annonces = [];

        try {
            const txt = await matchesRes.text();
            console.log('📊 Matches brut:', txt.substring(0, 200));
            matches = JSON.parse(txt);
            console.log('✅ Matches parsés:', matches.length, 'éléments');
        } catch (e) {
            console.error('❌ Erreur parse matches:', e);
        }

        try {
            const txt = await notifRes.text();
            console.log('🔔 Notifications brut:', txt.substring(0, 200));
            notifications = JSON.parse(txt);
            console.log('✅ Notifications parsées:', notifications.length, 'éléments');
        } catch (e) {
            console.error('❌ Erreur parse notifications:', e);
        }

        try {
            const txt = await annoncesRes.text();
            console.log('📋 Annonces brut:', txt.substring(0, 200));
            annonces = JSON.parse(txt);
            console.log('✅ Annonces parsées:', annonces.length, 'éléments');
        } catch (e) {
            console.error('❌ Erreur parse annonces:', e);
        }

        const nbMatchs    = Array.isArray(matches)       ? matches.length : 0;
        const nbNonLus    = Array.isArray(notifications) ? notifications.filter(n => !n.is_read).length : 0;
        const mesAnnonces = Array.isArray(annonces)      ? annonces.filter(a => a.auteur === user.id).length : 0;

        console.log('📈 Stats → matchs:', nbMatchs, '| non lus:', nbNonLus, '| mes annonces:', mesAnnonces);

        const meilleursMatchs = Array.isArray(matches) ? matches.slice(0, 3) : [];
        console.log('🎯 Meilleurs matchs (3 max):', meilleursMatchs);

        container.innerHTML = `
            <div class="page-header" style="text-align:left; margin-bottom:1.5rem;">
                <h1>Bonjour, ${prenom} 👋</h1>
                <p>Bienvenue sur ton tableau de bord MentorLink</p>
            </div>

            <div class="dash-grid">
                <div class="dash-card"><div class="dash-card-label">Matchs suggérés</div><div class="dash-card-value green">${nbMatchs}</div></div>
                <div class="dash-card"><div class="dash-card-label">Messages non lus</div><div class="dash-card-value blue">${nbNonLus}</div></div>
                <div class="dash-card"><div class="dash-card-label">Mes annonces</div><div class="dash-card-value">${mesAnnonces}</div></div>
                <div class="dash-card"><div class="dash-card-label">Heures de mentorat</div><div class="dash-card-value">0h</div></div>
            </div>

            <div class="filters-bar">
                <select class="filter-select" id="filterMatiere"><option value="">Toutes matières</option></select>
                <select class="filter-select" id="filterNiveau"><option value="">Tous niveaux</option></select>
                <select class="filter-select" id="filterDispo"><option value="">Toutes dispo</option></select>
                <button class="btn btn-accent" onclick="applyFilters()">Filtrer</button>
            </div>

            <h3>🎯 Meilleurs matchs pour toi</h3>
            <div class="match-list">
                ${meilleursMatchs.length > 0 ? meilleursMatchs.map(m => {
                    const other    = m.utilisateur2_detail || {};
                    const name     = `${other.first_name || ''} ${other.last_name || ''}`.trim() || 'Inconnu';
                    const initials = (other.first_name?.charAt(0) || '') + (other.last_name?.charAt(0) || '');
                    const forces   = Array.isArray(other.forces) ? other.forces : [];
                    return `
                        <div class="match-card">
                            <div class="avatar">${initials || '?'}</div>
                            <div class="match-info">
                                <div class="match-name">${name} · ${other.niveau || ''} ${other.filiere || ''}</div>
                                <div class="match-meta">Score: ${Math.round(m.score)}%</div>
                                <div class="match-tags">${forces.map(f => `<span class="match-tag">${f}</span>`).join('')}</div>
                            </div>
                            <div>
                                <span class="score-badge">${Math.round(m.score)}% Match</span><br>
                                <button class="btn btn-accent" style="margin-top:8px;" onclick="startConversation(${other.id})">Contacter</button>
                            </div>
                        </div>
                    `;
                }).join('') : '<p>Aucun match pour le moment.</p>'}
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center;">
                <h3>📋 Mes annonces</h3>
                <button class="btn btn-accent" onclick="showDashboardPage('editprofile')">+ Créer une annonce</button>
            </div>
            <div id="mesAnnoncesList">
                ${Array.isArray(annonces) && annonces.filter(a => a.auteur === user.id).length > 0
                    ? annonces.filter(a => a.auteur === user.id).map(a => `
                        <div class="announce-card">
                            <div class="announce-header">
                                <div class="announce-title">${a.matiere_detail?.nom || 'Matière'} - ${a.type_annonce === 'demand' ? 'Demande' : 'Offre'}</div>
                                <span class="announce-type ${a.type_annonce === 'demand' ? 'type-demand' : 'type-offer'}">${a.type_annonce === 'demand' ? 'Demande' : 'Offre'}</span>
                            </div>
                            <p>${a.description || 'Aucune description'}</p>
                            <div class="match-meta">Publié le ${new Date(a.created_at).toLocaleDateString()}</div>
                            <div>
                                <button class="btn btn-outline btn-sm" onclick="modifierAnnonce(${a.id})">✏️ Modifier</button>
                                <button class="btn btn-outline btn-sm" style="border-color:#ff6b6b;color:#ff6b6b;" onclick="supprimerAnnonce(${a.id})">🗑 Supprimer</button>
                            </div>
                        </div>
                    `).join('')
                    : "<p>Vous n'avez pas encore d'annonce.</p>"
                }
            </div>
        `;

        console.log('✅ HTML du dashboard injecté');

        // Remplir le filtre matières
        try {
            console.log('📡 Chargement des matières pour le filtre...');
            const matieresRes  = await fetch(`${API_BASE}/mentoring/matieres/`, { headers: getAuthHeaders() });
            console.log('📚 Status matières:', matieresRes.status);
            const matieresText = await matieresRes.text();
            console.log('📚 Matières brut:', matieresText.substring(0, 200));
            const matieres     = JSON.parse(matieresText);
            const filterSelect = document.getElementById('filterMatiere');
            if (filterSelect && Array.isArray(matieres)) {
                filterSelect.innerHTML = '<option value="">Toutes matières</option>';
                matieres.forEach(m => {
                    const opt       = document.createElement('option');
                    opt.value       = m.id;
                    opt.textContent = m.nom;
                    filterSelect.appendChild(opt);
                });
                console.log('✅ Filtre matières rempli:', matieres.length, 'matières');
            }
        } catch (e) {
            console.warn('⚠️ Impossible de charger les matières:', e);
        }

    } catch (err) {
        console.error('❌ Erreur globale dashboard:', err);
        container.innerHTML = '<p>Erreur de chargement du tableau de bord.</p>';
    }
}

// ==================== FONCTIONS ANNEXES ====================

window.applyFilters = function() {
    console.log('🔍 applyFilters appelé');
    alert('Filtrage en cours de développement');
};

window.startConversation = async function(otherUserId) {
    console.log('💬 startConversation() avec userId:', otherUserId);
    try {
        const convRes = await fetch(`${API_BASE}/chat/conversations/`, { headers: getAuthHeaders() });
        console.log('💬 Status conversations:', convRes.status);

        const rawText = await convRes.text();
        console.log('💬 Conversations brut:', rawText.substring(0, 300));

        let convs = [];
        try {
            convs = JSON.parse(rawText);
        } catch (e) {
            console.error('❌ Conversations non-JSON:', rawText);
            alert('Erreur serveur conversations: ' + rawText.substring(0, 200));
            return;
        }

        let currentUser = {};
        try {
            currentUser = JSON.parse(localStorage.getItem('user') || '{}');
        } catch (e) {
            console.error('❌ Erreur parse currentUser:', e);
        }

        console.log('👤 currentUser.id:', currentUser.id, '| otherUserId:', otherUserId);

        const existing = Array.isArray(convs) ? convs.find(conv =>
            conv.participants_detail?.some(p => p.id === otherUserId) &&
            conv.participants_detail?.some(p => p.id === currentUser.id)
        ) : null;

        if (existing) {
            console.log('✅ Conversation existante trouvée:', existing.id);
            localStorage.setItem('currentConvId', existing.id);
            showPage('messenger');
            return;
        }

        console.log('📡 Création nouvelle conversation...');
        const res = await fetch(`${API_BASE}/chat/conversations/`, {
            method:  'POST',
            headers: getAuthHeaders(),
            body:    JSON.stringify({ other_user_id: otherUserId })
        });
        console.log('💬 Status création conversation:', res.status);

        const newConvText = await res.text();
        console.log('💬 Nouvelle conversation brut:', newConvText);

        const newConv = JSON.parse(newConvText);
        localStorage.setItem('currentConvId', newConv.id);
        showPage('messenger');

    } catch (err) {
        console.error('❌ Erreur startConversation:', err);
        alert('Erreur lors de la création de la conversation');
    }
};

window.modifierAnnonce = function(id) {
    console.log('✏️ modifierAnnonce:', id);
    alert(`Modification de l'annonce ${id} (à implémenter)`);
};

window.supprimerAnnonce = async function(id) {
    console.log('🗑 supprimerAnnonce:', id);
    if (!confirm('Supprimer cette annonce ?')) return;
    try {
        const res = await fetch(`${API_BASE}/mentoring/annonces/${id}/`, {
            method:  'DELETE',
            headers: getAuthHeaders()
        });
        console.log('🗑 Status suppression:', res.status);
        loadDashboardContent();
    } catch (err) {
        console.error('❌ Erreur suppression:', err);
        alert('Erreur lors de la suppression');
    }
};

// ==================== PAGES DU DASHBOARD ====================

function showDashboardPage(page) {
    console.log('📄 showDashboardPage:', page);

    const container = document.getElementById('dashboardContent');
    if (!container) {
        console.error('❌ #dashboardContent introuvable');
        return;
    }

    // Mettre à jour le menu actif
    document.querySelectorAll('.sidebar-menu a').forEach(a => a.classList.remove('active'));
    const activeLink = document.querySelector(`.sidebar-menu a[data-dash="${page}"]`);
    if (activeLink) activeLink.classList.add('active');

    if (page === 'dashboard') {
        loadDashboardContent();
        return;
    }

    if (page === 'profile') {
        let user = {};
        try { user = JSON.parse(localStorage.getItem('user') || '{}'); } catch (e) {}
        console.log('👤 Affichage profil:', user);
        container.innerHTML = `
            <div class="profile-header">
                <div class="avatar avatar-lg">${user.first_name?.charAt(0) || ''}${user.last_name?.charAt(0) || ''}</div>
                <div>
                    <h2>${user.first_name || ''} ${user.last_name || ''}</h2>
                    <p class="match-meta">${user.niveau || ''} ${user.filiere || ''} · IFRI</p>
                    <p>${user.bio || 'Aucune bio'}</p>
                </div>
            </div>
            <button class="btn btn-outline" onclick="showDashboardPage('editprofile')">Modifier le profil</button>
        `;

    } else if (page === 'editprofile') {
        let user = {};
        try { user = JSON.parse(localStorage.getItem('user') || '{}'); } catch (e) {}
        console.log('✏️ Affichage editprofile:', user);
        container.innerHTML = `
            <h3>Modifier mon profil</h3>
            <form id="editProfileForm" class="profile-section">
                <div class="form-row">
                    <div class="form-group"><label>Nom</label><input name="last_name" value="${user.last_name || ''}"></div>
                    <div class="form-group"><label>Prénom</label><input name="first_name" value="${user.first_name || ''}"></div>
                </div>
                <div class="form-group"><label>Email</label><input name="email" value="${user.email || ''}"></div>
                <div class="form-group"><label>Téléphone</label><input name="telephone" value="${user.telephone || ''}"></div>
                <div class="form-group"><label>Bio</label><textarea name="bio">${user.bio || ''}</textarea></div>
                <button class="btn btn-accent" type="submit">Enregistrer</button>
            </form>
        `;
        document.getElementById('editProfileForm').addEventListener('submit', async (e) => {
            e.preventDefault();
            const data = Object.fromEntries(new FormData(e.target));
            console.log('📡 Envoi mise à jour profil:', data);
            try {
                const res = await fetch(`${API_BASE}/accounts/profile/`, {
                    method:  'PUT',
                    headers: getAuthHeaders(),
                    body:    JSON.stringify(data)
                });
                console.log('✏️ Status update profil:', res.status);
                if (res.ok) {
                    const updatedUser = await res.json();
                    console.log('✅ Profil mis à jour:', updatedUser);
                    localStorage.setItem('user', JSON.stringify(updatedUser));
                    alert('✅ Profil mis à jour');
                    showDashboardPage('profile');
                } else {
                    const err = await res.json();
                    console.error('❌ Erreur update profil:', err);
                    alert(`❌ Erreur : ${JSON.stringify(err)}`);
                }
            } catch (err) {
                console.error('❌ Erreur réseau update profil:', err);
                alert('Erreur réseau');
            }
        });

    } else {
        console.log('🚧 Page non implémentée:', page);
        container.innerHTML = '<p>Section en construction 🚧</p>';
    }
}