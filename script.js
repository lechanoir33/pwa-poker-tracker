document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('.hand-cell').forEach(cell => {
        const hand = cell.dataset.hand;
        const counterEl = cell.querySelector('.counter');

        // Lire la valeur du compteur depuis le localStorage
        let count = parseInt(localStorage.getItem(hand)) || 0;
        counterEl.textContent = count;

        // Mettre à jour la couleur dès le chargement
        updateBackgroundColor(cell, count);

        // Incrémentation au clic
        cell.addEventListener('click', () => {
            count++;
            counterEl.textContent = count;
            localStorage.setItem(hand, count);
            updateBackgroundColor(cell, count);
        });

        // Appui long pour réinitialiser (PC)
        let pressTimer;
        cell.addEventListener('mousedown', () => {
            pressTimer = setTimeout(() => {
                count = 0;
                counterEl.textContent = count;
                localStorage.setItem(hand, count);
                updateBackgroundColor(cell, count);
            }, 1000);
        });
        cell.addEventListener('mouseup', () => clearTimeout(pressTimer));
        cell.addEventListener('mouseleave', () => clearTimeout(pressTimer));

        // Appui long pour réinitialiser (mobile)
        cell.addEventListener('touchstart', () => {
            pressTimer = setTimeout(() => {
                count = 0;
                counterEl.textContent = count;
                localStorage.setItem(hand, count);
                updateBackgroundColor(cell, count);
            }, 1000);
        });
        cell.addEventListener('touchend', () => clearTimeout(pressTimer));
        cell.addEventListener('touchcancel', () => clearTimeout(pressTimer));
    });
});

// Fonction pour éclaircir le bleu selon le compteur
function updateBackgroundColor(cell, count) {
    const maxCount = 20;
    const ratio = Math.min(count / maxCount, 1);
    const blueLevel = 50 + Math.floor(ratio * 205); // bleu foncé à bleu clair
    cell.style.backgroundColor = `rgb(0, 0, ${blueLevel})`;
}
