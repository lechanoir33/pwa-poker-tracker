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
    const blue = Math.min(125, 31 + count * 8); // Éclaircissement progressif
    div.style.backgroundColor = `rgb(0, 0, ${blue})`;
  };

  const increment = () => {
    let count = parseInt(counter.textContent, 10);
    count++;
    counter.textContent = count.toString();
    updateBackground(div, count);
    checkbox.checked = count > 0;
    saveCounts();
  };

  const resetCounter = () => {
    counter.textContent = '0';
    checkbox.checked = false;
    div.style.backgroundColor = 'rgb(0, 0, 31)';
    saveCounts();
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
    if (counts[hand]) {
      counter.textContent = counts[hand];
      const checkbox = div.querySelector('input[type="checkbox"]');
      checkbox.checked = counts[hand] > 0;
      updateColor(div, counts[hand]);
    }
  });
}

function updateColor(div, count) {
  const blue = Math.min(125, 31 + count * 8);
  div.style.backgroundColor = `rgb(0, 0, ${blue})`;
}

// Sécurité et protection
document.addEventListener('contextmenu', e => e.preventDefault());  // Clic droit interdit
document.addEventListener('selectstart', e => e.preventDefault());  // Empêche sélection
document.addEventListener('dblclick', e => e.preventDefault());     // Empêche zoom ou sélection double clic

loadCounts();
