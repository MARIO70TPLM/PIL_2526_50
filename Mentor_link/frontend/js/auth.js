// js/auth.js

const jsonHeaders = () => ({ 'Content-Type': 'application/json' });

document.addEventListener('DOMContentLoaded', async () => {

    // --- 1. CHARGER FILIÈRES & NIVEAUX ---
    let filieresMap = new Map();
    let niveauxMap = new Map();

    try {
        const [filieresRes, niveauxRes] = await Promise.all([
            fetch(`${API_BASE}/accounts/filieres/`),
            fetch(`${API_BASE}/accounts/niveaux/`)
        ]);
        const filieres = await filieresRes.json();
        const niveaux = await niveauxRes.json();
        filieres.forEach(f => filieresMap.set(f.nom, f.id));
        niveaux.forEach(n => niveauxMap.set(n.nom, n.id));
    } catch (err) {
        console.warn("Impossible de charger filières/niveaux:", err);
    }

    // --- 2. INSCRIPTION ---
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const nom       = document.getElementById('regNom').value.trim();
            const prenom    = document.getElementById('regPrenom').value.trim();
            const email     = document.getElementById('regEmail').value.trim();
            const telephone = document.getElementById('regTel').value.trim();
            const filiereNom = document.getElementById('regFiliere').value;
            const niveauNom  = document.getElementById('regNiveau').value;
            const password  = document.getElementById('regPassword').value;
            const confirm   = document.getElementById('confirm-password').value;

            if (password !== confirm) {
                alert('Les mots de passe ne correspondent pas');
                return;
            }

            const filiereId = filieresMap.get(filiereNom);
            const niveauId  = niveauxMap.get(niveauNom);

            if (!filiereId) {
                alert(`Filière "${filiereNom}" non trouvée. Contactez l'admin.`);
                return;
            }
            if (!niveauId) {
                alert(`Niveau "${niveauNom}" non trouvé.`);
                return;
            }

            const payload = {
                username:         email,
                email:            email,
                first_name:       prenom,
                last_name:        nom,
                telephone:        telephone,
                filiere:          filiereId,
                niveau:           niveauId,
                password:         password,
                confirm_password: confirm
            };

            try {
                const res  = await fetch(`${API_BASE}/accounts/register/`, {
                    method:  'POST',
                    headers: jsonHeaders(),
                    body:    JSON.stringify(payload)
                });
                const data = await res.json();

                if (res.ok) {
                    alert('✅ Inscription réussie ! Connectez-vous.');
                    showPage('login');
                } else {
                    alert(`❌ Erreur d'inscription :\n${JSON.stringify(data, null, 2)}`);
                }
            } catch (err) {
                console.error(err);
                alert('Erreur réseau. Vérifiez que le backend est lancé.');
            }
        });
    }

    // --- 3. CONNEXION ---
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // ✅ Correction : utiliser les id ajoutés dans le HTML
            const username = document.getElementById('loginUsername').value.trim();
            const password = document.getElementById('loginPassword').value;

            try {
                const res  = await fetch(`${API_BASE}/accounts/login/`, {
                    method:  'POST',
                    headers: jsonHeaders(),
                    body:    JSON.stringify({ username, password })
                });
                const data = await res.json();

                if (data.access) {
                    localStorage.setItem('access_token', data.access);
                    localStorage.setItem('refresh_token', data.refresh);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    showPage('dashboard');
                } else {
                    console.error('Réponse backend:', data);
                    alert(`❌ Échec de connexion :\n${JSON.stringify(data)}`);
                }
            } catch (err) {
                console.error(err);
                alert('Erreur réseau. Backend indisponible ?');
            }
        });
    }

    // --- 4. MOT DE PASSE OUBLIÉ ---
    const forgotForm = document.getElementById('forgotForm');
    if (forgotForm) {
        forgotForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = forgotForm.querySelector('input[type="email"]').value;

            try {
                await fetch(`${API_BASE}/accounts/forgot-password/`, {
                    method:  'POST',
                    headers: jsonHeaders(),
                    body:    JSON.stringify({ email })
                });
                alert('Un email de réinitialisation a été envoyé.');
                showPage('login');
            } catch (err) {
                alert('Service temporairement indisponible.');
            }
        });
    }

    // --- 5. RÉINITIALISATION (simulation) ---
    const resetForm = document.getElementById('resetForm');
    if (resetForm) {
        resetForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Mot de passe réinitialisé (démo). Connectez-vous.');
            showPage('login');
        });
    }

    // --- 6. CONTACT ---
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Message envoyé !');
            contactForm.reset();
        });
    }

    // --- 7. FAQ ACCORDÉON ---
    document.querySelectorAll('.faq-question').forEach(q => {
        q.addEventListener('click', () => q.parentElement.classList.toggle('open'));
    });
});