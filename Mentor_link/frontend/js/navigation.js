// navigation.js - version avec logs
function showPage(pageId) {
    console.log("showPage appelée avec :", pageId);
    // Cacher toutes les pages
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    // Afficher la page demandée
    const targetPage = document.getElementById('page-' + pageId);
    if (targetPage) {
        targetPage.classList.add('active');
        console.log("Page affichée :", 'page-' + pageId);
    } else {
        console.error("Page non trouvée :", 'page-' + pageId);
        const notFound = document.getElementById('page-404');
        if (notFound) notFound.classList.add('active');
    }
    window.scrollTo(0, 0);

    // Charger le contenu dynamique si nécessaire
    if (pageId === 'dashboard') {
        if (typeof loadDashboardContent === 'function') {
            loadDashboardContent();
        } else {
            console.error("loadDashboardContent non définie");
        }
    }
    if (pageId === 'matching') {
        if (typeof loadMatchingContent === 'function') loadMatchingContent();
        else console.error("loadMatchingContent non définie");
    }
    if (pageId === 'messenger') {
        if (typeof loadMessengerContent === 'function') loadMessengerContent();
        else console.error("loadMessengerContent non définie");
    }
    if (pageId === 'profile') {
        if (typeof loadPublicProfile === 'function') loadPublicProfile();
        else console.error("loadPublicProfile non définie");
    }
}

function toggleMobileMenu() {
    const nav = document.getElementById('navLinks');
    if (nav) nav.classList.toggle('active');
}

// S'assurer que la page d'accueil est active au démarrage
document.addEventListener('DOMContentLoaded', () => {
    if (!document.querySelector('.page.active')) {
        showPage('home');
    }
});