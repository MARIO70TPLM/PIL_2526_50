// profile.js - Profil public
async function loadPublicProfile(userId = null) {
    const container = document.getElementById('publicProfileContent');
    if (!container) return;

    let url = `${API_BASE}/accounts/profile/`;
    if (userId) url = `${API_BASE}/accounts/users/${userId}/`;

    try {
        const res = await fetch(url, { headers: getAuthHeaders() });
        const user = await res.json();

        container.innerHTML = `
            <div class="profile-header">
                <div class="avatar avatar-lg">${user.first_name?.charAt(0) || ''}${user.last_name?.charAt(0) || ''}</div>
                <div>
                    <h2>${user.first_name} ${user.last_name}</h2>
                    <p class="match-meta">${user.niveau_detail?.nom || user.niveau} ${user.filiere_detail?.nom || user.filiere} · IFRI</p>
                    <div class="match-tags">${(user.forces || []).map(f => `<span class="match-tag">${f}</span>`).join('')}</div>
                </div>
            </div>
            <div class="profile-section">
                <h3>👋 Bio</h3>
                <p>${user.bio || 'Aucune bio'}</p>
            </div>
            <div class="profile-section">
                <h3>📚 Matières où je cherche de l’aide</h3>
                <div class="tags-group">${(user.faiblesses || []).map(f => `<span class="tag selected-weakness">${f}</span>`).join('')}</div>
            </div>
            <button class="btn btn-accent" onclick="startConversation(${user.id})">Contacter</button>
        `;
    } catch (err) {
        container.innerHTML = '<p>Profil non trouvé</p>';
    }
}