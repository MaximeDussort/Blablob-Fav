
// Fonction pour activer ou désactiver l'extension
document.addEventListener('DOMContentLoaded', function () {
    const toggle = document.getElementById('extension-toggle');
    const statusText = document.getElementById('status-text');

    // Charger l'état précédent s'il existe
    if (localStorage.getItem('extensionEnabled') === 'true') {
        toggle.checked = true;
        statusText.textContent = 'Activée';
        statusText.className = 'enabled';
    }

    // Gérer le changement d'état
    toggle.addEventListener('change', function () {
        if (this.checked) {
            statusText.textContent = 'Activée';
            statusText.className = 'enabled';
            localStorage.setItem('extensionEnabled', 'true');
            // Ici, vous pourriez ajouter du code pour activer réellement l'extension
        } else {
            statusText.textContent = 'Désactivée';
            statusText.className = 'disabled';
            localStorage.setItem('extensionEnabled', 'false');
            // Ici, vous pourriez ajouter du code pour désactiver l'extension
        }
    });
});