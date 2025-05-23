const hands = [];
const ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];

// ✅ MODIFICATION : ajout de la fonction normalisation
function normalizeHand(hand) {
  if (hand.length === 3) {
    const [c1, c2, type] = hand.split('');
    return ranks.indexOf(c1) > ranks.indexOf(c2) ? c2 + c1 + type : hand;
  }
  return hand;
}

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
  div.style.backgroundColor = 'rgb(0, 0, 31)';
  div.dataset.hand = hand;

  const label = document.createElement('label');
  label.textContent = hand;
  label.style.userSelect = 'none';

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.style.pointerEvents = 'none';

  const counter = document.createElement('div');
  counter.className = 'counter';
  counter.textContent = '0';
  counter.style.userSelect = 'none';

  div.appendChild(label);
  div.appendChild(checkbox);
  div.appendChild(counter);

  const updateBackground = (div, count) => {
    const blue = Math.min(200, 31 + count * 30);
    div.style.backgroundColor = `rgb(0, 0, ${blue})`;
  };

  const increment = () => {
    let count = parseInt(counter.textContent, 10);
    count++;
    counter.textContent = count.toString();
    updateBackground(div, count);
    checkbox.checked = count > 0;
    saveCounts();

    let selectedHands = JSON.parse(localStorage.getItem('selectedHands')) || [];

    if (typeof selectedHands[0] === 'string') {
      selectedHands = selectedHands.map(h => ({ hand: h, checked: true }));
    }

    // ✅ MODIFICATION : utilisation de la fonction normalizeHand
    const normalizedHand = normalizeHand(hand);
    selectedHands.push({ hand: normalizedHand, checked: false });
    localStorage.setItem('selectedHands', JSON.stringify(selectedHands));
    updateSelectedHandsDisplay();
  };

  const resetCounter = () => {
    counter.textContent = '0';
    checkbox.checked = false;
    div.style.backgroundColor = 'rgb(0, 0, 31)';
    saveCounts();

    let selectedHands = JSON.parse(localStorage.getItem('selectedHands')) || [];
    const normalizedHand = normalizeHand(hand);
selectedHands = selectedHands.filter(h => h.hand !== normalizedHand);
    localStorage.setItem('selectedHands', JSON.stringify(selectedHands));
    updateSelectedHandsDisplay();
  };

  div.addEventListener('click', (e) => {
    e.preventDefault();
    increment();
  });

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

// Sauvegarde des compteurs
function saveCounts() {
  const counts = {};
  document.querySelectorAll('.mains').forEach(div => {
    const hand = div.dataset.hand;
    const counter = div.querySelector('.counter');
    counts[hand] = parseInt(counter.textContent) || 0;
  });
  localStorage.setItem('pokerHandCounts', JSON.stringify(counts));
}

// Chargement des compteurs
function loadCounts() {
  const counts = JSON.parse(localStorage.getItem('pokerHandCounts')) || {};
  document.querySelectorAll('.mains').forEach(div => {
    const hand = div.dataset.hand;
    const counter = div.querySelector('.counter');
    const checkbox = div.querySelector('input[type="checkbox"]');
    if (counts.hasOwnProperty(hand)) {
      const count = counts[hand];
      counter.textContent = count;
      checkbox.checked = count > 0;
      updateColor(div, count);
    } else {
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

// Affichage bas de page
function updateSelectedHandsDisplay() {
  const container = document.getElementById('mainsSelectionnees');
  if (!container) return;

  let raw = localStorage.getItem('selectedHands');
  let selectedHands = [];

  try {
    selectedHands = JSON.parse(raw) || [];
    if (selectedHands.length > 0 && typeof selectedHands[0] === 'string') {
      selectedHands = selectedHands.map(h => ({ hand: h, checked: true }));
      localStorage.setItem('selectedHands', JSON.stringify(selectedHands));
    }
  } catch (e) {
    selectedHands = [];
  }

  container.innerHTML = '';

  selectedHands.forEach((entry, index) => {
    if (typeof entry.hand !== 'string') return;

    const wrapper = document.createElement('div');
    wrapper.style.margin = '4px';
    wrapper.style.display = 'flex';
    wrapper.style.alignItems = 'center';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = entry.checked;
    checkbox.style.marginRight = '5px';

    checkbox.addEventListener('change', () => {
      selectedHands[index].checked = checkbox.checked;
      localStorage.setItem('selectedHands', JSON.stringify(selectedHands));
      updateNoteBadge();  // 🔥 Ajout : mettre à jour la note quand on coche/décoche
    });

    const label = document.createElement('span');
    label.textContent = entry.hand + ' /';
    label.style.color = 'white';

    wrapper.appendChild(checkbox);
    wrapper.appendChild(label);
    container.appendChild(wrapper);
  });
  
  updateNoteBadge(); // 🔥 Ajout : mettre à jour la note après affichage
}

const handRanking = [
  "AA", "KK", "QQ", "JJ", "AKs", "TT", "AKo", "99", "AQs", "AQo",
  "AJs", "KQs", "55", "KQo", "K9s", "T9s", "J9s", "Q9s", "44", "A8s",
  "ATo", "33", "A7s", "A5s", "KJo", "98s", "22", "A6s", "A9o", "A4s",
  "KTs", "A2s", "A8o", "JTo", "A7o", "J8s", "A5o", "KTo", "87s", "A6o",
  "A4o", "K8s", "97s", "QTo", "A3o", "Q8s", "76s", "A2o", "T7s", "86s",
  "K7s", "K6s", "K5s", "K9o", "J7s", "65s", "T9o", "K4s", "54s", "Q7s",
  "96s", "85s", "T8o", "98o", "64s", "K3s", "75s", "Q6s", "J6s", "87o",
  "T6s", "74s", "95s", "K2s", "K7o", "Q9o", "T5s", "K6o", "K5o", "J9o",
  "Q5s", "Q4s", "Q3s", "J8o", "K4o", "Q2s", "K3o", "Q8o", "J7o", "J5s",
  "97o", "J4s", "T4s", "K2o", "J3s", "43s", "Q7o", "Q6o", "T7o"
];

// Donne une note sur 10 selon la position dans la grille (0 = meilleure main)
function getHandScore(hand) {
  const normalized = normalizeHand(hand); // utilise ta fonction existante
  const idx = handRanking.indexOf(normalized);
  if (idx === -1) return 1; // Main inconnue : note très faible
  const maxNote = 10;
  const rawNote = maxNote - (idx / handRanking.length) * maxNote;
  return Math.round(rawNote * 10) / 10; // arrondi à 1 décimale
}

// Calcule et affiche la note moyenne pondérée à partir des mains du bas
function updateNoteBadge() {
  const badge = document.getElementById('note-badge');
  const selectedHands = JSON.parse(localStorage.getItem('selectedHands')) || [];
  
  if (!selectedHands.length) {
    badge.textContent = '--';
    return;
  }

  let total = 0;
  let count = 0;

  selectedHands.forEach(({ hand, checked }) => {
    if (checked) {
      const score = getHandScore(hand);
      total += score;
      count++;
    }
  });

  const average = count ? (total / count).toFixed(1) : '--';
  badge.textContent = average;
}

// ✅ MODIFICATION MISE EN ÉVIDENCE : Regroupement des appels dans un seul chargement
window.onload = () => {
  loadCounts();
  updateSelectedHandsDisplay();
  updateNoteBadge(); // 🔥 Ajout ici pour que la note s’affiche au chargement
};

// Sécurité
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('selectstart', e => e.preventDefault());
document.addEventListener('dblclick', e => e.preventDefault());


