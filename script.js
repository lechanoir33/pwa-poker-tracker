const hands = [];

const ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];

for (let i = 0; i < ranks.length; i++) {
  for (let j = 0; j < ranks.length; j++) {
    if (i === j) {
      hands.push(ranks[i] + ranks[j]);
    } else if (i < j) {
      hands.push(ranks[i] + ranks[j] + 'o');
    } else {
      hands.push(ranks[i] + ranks[j] + 's');
    }
  }
}

const tableau = document.getElementById('tableau');

hands.forEach((hand) => {
  const div = document.createElement('div');
  div.className = 'mains';
  div.style.backgroundColor = 'rgb(0, 0, 31)'; // bleu foncé initial
  div.dataset.hand = hand;
  loadCounts();
  
  const label = document.createElement('label');
  label.textContent = hand;
  label.style.userSelect = 'none';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.style.pointerEvents = 'none'; // Empêche l'interaction directe

  const counter = document.createElement('div');
  counter.className = 'counter';
  counter.textContent = '0';
  counter.style.userSelect = 'none';

  div.appendChild(label);
  div.appendChild(checkbox);
  div.appendChild(counter);

  const updateBackground = (div, count) => {
    const blue = Math.min(200, 31 + count * 30); // Éclaircissement progressif
    div.style.backgroundColor = `rgb(0, 0, ${blue})`;
  };

  const increment = () => {
    let count = parseInt(counter.textContent, 10);
    count++;
    counter.textContent = count.toString();
    updateBackground(div, count);
    checkbox.checked = count > 0;
    saveCounts();
    ajouterMainSelectionnee(hand);
    let selectedHands = JSON.parse(localStorage.getItem('selectedHands')) || [];
selectedHands.push(hand);  // Ajoute la main même si elle est déjà présente
localStorage.setItem('selectedHands', JSON.stringify(selectedHands));
updateSelectedHandsDisplay();
}
  };

  const resetCounter = () => {
    counter.textContent = '0';
    checkbox.checked = false;
    div.style.backgroundColor = 'rgb(0, 0, 31)';
    saveCounts();
    let selectedHands = JSON.parse(localStorage.getItem('selectedHands')) || [];
selectedHands = selectedHands.filter(h => h !== hand);
localStorage.setItem('selectedHands', JSON.stringify(selectedHands));
updateSelectedHandsDisplay();
  };

  // Incrémentation au clic sur n'importe quelle partie de la ligne
  div.addEventListener('click', (e) => {
    e.preventDefault();
    increment();
  });

  // Appui long pour reset
  let pressTimer;
  const longPressTarget = [div, counter];

  longPressTarget.forEach(el => {
    el.addEventListener('mousedown', () => {
      pressTimer = setTimeout(() => resetCounter(), 1000);
    });
    el.addEventListener('mouseup', () => clearTimeout(pressTimer));
    el.addEventListener('mouseleave', () => clearTimeout(pressTimer));
    el.addEventListener('touchstart', () => {
      pressTimer = setTimeout(() => resetCounter(), 1000);
    });
    el.addEventListener('touchend', () => clearTimeout(pressTimer));
  });

  tableau.appendChild(div);
});

// Sauvegarde des compteurs dans localStorage
function saveCounts() {
  const counts = {};
  document.querySelectorAll('.mains').forEach(div => {
    const hand = div.dataset.hand;
    const counter = div.querySelector('.counter');
    counts[hand] = parseInt(counter.textContent) || 0;
  });
  localStorage.setItem('pokerHandCounts', JSON.stringify(counts));
}

// Chargement des compteurs au démarrage
function loadCounts() {
    const counts = JSON.parse(localStorage.getItem('pokerHandCounts')) || {};
  document.querySelectorAll('.mains').forEach(div => {
    const hand = div.dataset.hand;
    const counter = div.querySelector('.counter');
    const checkbox = div.querySelector('input[type="checkbox"]');
    if (counts.hasOwnProperty(hand)) {   // <-- ici
      const count = counts[hand];
      counter.textContent = count;
      checkbox.checked = count > 0;
      updateColor(div, count);
    } else {
      // Reset visuel si pas de compteur
      counter.textContent = '0';
      checkbox.checked = false;
      updateColor(div, 0);
    }
  });
}

function updateColor(div, count) {
  const blue = Math.min(125, 31 + count * 20);
  div.style.backgroundColor = `rgb(0, 0, ${blue})`;
}

function updateSelectedHandsDisplay() {
  const container = document.getElementById('mainsSelectionnees');
  container.innerHTML = ''; // Réinitialise l'affichage

  const selectedHands = JSON.parse(localStorage.getItem('selectedHands')) || [];

  selectedHands.forEach((hand, index) => {
    const handContainer = document.createElement('div');
    handContainer.className = 'main-selectionnee';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = true;
    checkbox.disabled = true;

    const label = document.createElement('span');
    label.textContent = hand;

    handContainer.appendChild(checkbox);
    handContainer.appendChild(label);

    // Ajouter un séparateur sauf pour le dernier
    if (index < selectedHands.length - 1) {
      const separator = document.createElement('span');
      separator.textContent = ' / ';
      handContainer.appendChild(separator);
    }

function ajouterMainSelectionnee(hand) {
  const container = document.getElementById('mainsSelectionnees');
  const wrapper = document.createElement('div');
  wrapper.style.margin = '4px';
  wrapper.style.display = 'flex';
  wrapper.style.alignItems = 'center';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.style.marginRight = '5px';

  const label = document.createElement('span');
  label.textContent = hand + ' /';
  label.style.color = 'white';

  wrapper.appendChild(checkbox);
  wrapper.appendChild(label);
  container.appendChild(wrapper);
}
    
    container.appendChild(handContainer);
  });
}

// Sécurité et protection
document.addEventListener('contextmenu', e => e.preventDefault());  // Clic droit interdit
document.addEventListener('selectstart', e => e.preventDefault());  // Empêche sélection
document.addEventListener('dblclick', e => e.preventDefault());     // Empêche zoom ou sélection double clic

loadCounts();
updateSelectedHandsDisplay();
