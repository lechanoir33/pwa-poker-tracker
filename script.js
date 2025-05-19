const allHands = ['AA', 'AKs', 'AQs', ..., '72o']; // toutes les 169 mains
allHands.forEach(hand => {
  // crée les cases + compteurs
});

const container = document.getElementById('hands-table');
// puis tu ajoutes dynamiquement du contenu à ce container

document.addEventListener("DOMContentLoaded", () => {
  const counters = {};

  document.querySelectorAll(".hand-cell").forEach((cell) => {
    const hand = cell.dataset.hand;
    const counterDisplay = cell.querySelector(".counter");
      
      // Charger le compteur depuis le localStorage
    let count = parseInt(localStorage.getItem(`counter_${hand}`)) || 0;
    counterDisplay.textContent = count;
    counters[hand] = count;  
        
      // Lire la valeur du compteur depuis le localStorage
        let count = parseInt(localStorage.getItem(hand)) || 0;
        counterEl.textContent = count;

        // Mettre à jour la couleur dès le chargement
        updateBackgroundColor(cell, count);

        / Clic pour incrémenter
    cell.addEventListener("click", () => {
      counters[hand]++;
      localStorage.setItem(`counter_${hand}`, counters[hand]);
      counterDisplay.textContent = counters[hand];
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
    const blueLevel = 25 + Math.floor(ratio * 205); // bleu foncé à bleu clair
    cell.style.backgroundColor = `rgb(0, 0, ${blueLevel})`;
}
