// ==================== MODULE MATCHING ====================
// Correspondances, historique, suggestions et publication d'annonces

function loadMatchingContent() {
    const container = document.getElementById('matchingContent');
    container.innerHTML = `
        <div class="page-header" style="text-align:left;">
            <h1>Matching</h1>
            <p>Résultats des correspondances basés sur ton profil</p>
        </div>

        <div class="filters-bar">
            <select class="filter-select"><option>Toutes matières</option></select>
            <select class="filter-select"><option>Tous niveaux</option></select>
            <select class="filter-select"><option>Toutes dispo</option></select>
            <button class="btn btn-accent">Filtrer</button>
        </div>

        <h3>🎯 Correspondances actives</h3>
        <div class="match-list">
            <div class="match-card">
                <div class="avatar">AK</div>
                <div class="match-info">
                    <div class="match-name">Aïcha Kpènou</div>
                    <div class="match-meta">L3 GL · Algo, Maths, C++</div>
                    <div class="match-tags">
                        <span class="match-tag">Mentor</span>
                        <span class="match-tag">Score: 92%</span>
                    </div>
                </div>
                <button class="btn btn-accent" onclick="showMatchDetail(1)">Voir détail</button>
            </div>
            <div class="match-card">
                <div class="avatar">MB</div>
                <div class="match-info">
                    <div class="match-name">Moussa Bello</div>
                    <div class="match-meta">Master1 · Python, Architecture</div>
                    <div class="match-tags">
                        <span class="match-tag">Mentor</span>
                        <span class="match-tag">Score: 78%</span>
                    </div>
                </div>
                <button class="btn btn-outline" onclick="showMatchDetail(2)">Voir détail</button>
            </div>
        </div>

        <h3>📊 Historique des correspondances</h3>
        <div class="match-list">
            <div class="match-card">
                <div class="match-info">
                    <div class="match-name">Jean K. (L2 SI)</div>
                    <div class="match-meta">Match du 15/05/2026 · Score: 68%</div>
                </div>
            </div>
        </div>

        <h3>💡 Suggestions automatiques</h3>
        <div class="announce-card">
            <p>Basé sur tes matières faibles, nous te suggérons de rejoindre le groupe d'étude "Algorithmique Avancée"</p>
            <button class="btn btn-outline">Rejoindre</button>
        </div>

        <h3>✏️ Publier une annonce</h3>
        <div class="publish-form">
            <div class="form-group">
                <select>
                    <option>Offre de mentorat (je veux aider)</option>
                    <option>Demande d'aide (je cherche un mentor)</option>
                </select>
            </div>
            <div class="form-group">
                <select>
                    <option>Sélectionner matière</option>
                    <option>Logique</option>
                    <option>Algèbre relationnel</option>
                    <option>Algorithmique</option>
                    <option>Programmation Python</option>
                    <option>Architecture et réseaux</option>
                    <option>Suites et séries numériques</option>
                    <option>Dévéloppement web </option>
                    <option>TEEO</option>
                    <option>Projet intégrateur</option>
                    <option>Analyse</option>
                    <option>statistiques inférentielles</option>
                    <option>Equations différentielles</option>
                    <option>Language C</option>
                    <option>Anglais technique</option>
                    <option>Outils de base en informatique</option>
                </select>
            </div>
            <div class="form-group disponibilites">
         <div class="form-group">
                <select>
                    <option>Mode de rencontre</option>
                    <option>En ligne</option>
                    <option>Présentiel</option>
                </select>
            </div>
             <div class="form-group">
            <select id="select-jour" onchange="afficherPlages()">
                <option value="">Jour de disponibilité</option>
                <option value="lundi">Lundi</option>
                <option value="mardi">Mardi</option>
                <option value="mercredi">Mercredi</option>
                <option value="jeudi">Jeudi</option>
                <option value="vendredi">Vendredi</option>
                <option value="samedi">Samedi</option>
                <option value="dimanche">Dimanche</option>
            </select>
            </div>

            <div class="form-group" id="groupe-plage" style="display:none;">
            <select id="select-plage">
                <option value="">Plage horaire</option>
                <option value="matin">Matin (08h – 12h)</option>
                <option value="soir">Soir (17h – 21h)</option>
            </select>
            </div>
                        <div class="form-group">
                            <textarea placeholder="Description..."></textarea>
                        </div>
                        <button class="btn btn-accent">Publier</button>
                    </div>
                `;
            }

function showMatchDetail(matchId) {
    alert(`Détail du match #${matchId}\nScore de compatibilité: ${matchId === 1 ? '92%' : '78%'}\nBasé sur vos matières, disponibilités et objectifs communs.`);
}
function afficherPlages() {
  const jour = document.getElementById('select-jour').value;
  const groupePlage = document.getElementById('groupe-plage');

  if (jour !== "") {
    groupePlage.style.display = "block";
  } else {
    groupePlage.style.display = "none";
    document.getElementById('select-plage').value = "";
  }
}