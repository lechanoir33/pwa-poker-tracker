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
    selectedHands.push({ hand: normalizedHand, checked: true });
    localStorage.setItem('selectedHands', JSON.stringify(selectedHands));
    updateSelectedHandsDisplay();
    updateNoteBadge(); // ✅ Ajout ici : mise à jour de la note uniquement après clic dans le tableau
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
      selectedHands = selectedHands.map(h => ({ hand: h, played: false, folded: false }));
      localStorage.setItem('selectedHands', JSON.stringify(selectedHands));
    }
  } catch (e) {
    selectedHands = [];
  }

  container.innerHTML = '';

  selectedHands.forEach((entry, index) => {
    if (typeof entry.hand !== 'string') return;

    if (entry.played === undefined) entry.played = false;
    if (entry.folded === undefined) entry.folded = false;

    const wrapper = document.createElement('div');
    wrapper.style.margin = '4px';
    wrapper.style.display = 'flex';
    wrapper.style.gap = '0';  // <- ici, pas d’espace entre les cases

    const checkboxPlayed = document.createElement('input');
    checkboxPlayed.type = 'checkbox';
    checkboxPlayed.checked = entry.played;

    checkboxPlayed.addEventListener('change', () => {
      selectedHands[index].played = checkboxPlayed.checked;
      localStorage.setItem('selectedHands', JSON.stringify(selectedHands));
    });

    const checkboxFolded = document.createElement('input');
    checkboxFolded.type = 'checkbox';
    checkboxFolded.checked = entry.folded;

    checkboxFolded.addEventListener('change', () => {
      selectedHands[index].folded = checkboxFolded.checked;
      localStorage.setItem('selectedHands', JSON.stringify(selectedHands));
    });

    wrapper.appendChild(checkboxPlayed);
    wrapper.appendChild(checkboxFolded);

    container.appendChild(wrapper);
  });
}

    // Initialisation si propriétés absentes
    if (entry.played === undefined) entry.played = false;
    if (entry.folded === undefined) entry.folded = false;

    const wrapper = document.createElement('div');
    wrapper.style.margin = '4px';
    wrapper.style.display = 'flex';
    wrapper.style.alignItems = 'center';

    const checkboxPlayed = document.createElement('input');
    checkboxPlayed.type = 'checkbox';
    checkboxPlayed.checked = entry.played;
    checkboxPlayed.style.marginRight = '5px';

    checkboxPlayed.addEventListener('change', () => {
      selectedHands[index].played = checkboxPlayed.checked;
      localStorage.setItem('selectedHands', JSON.stringify(selectedHands));
      updateNoteBadge(); // Facultatif si tu veux adapter la note à l’une des deux cases
    });

    const checkboxFolded = document.createElement('input');
    checkboxFolded.type = 'checkbox';
    checkboxFolded.checked = entry.folded;
    checkboxFolded.style.marginRight = '5px';

    checkboxFolded.addEventListener('change', () => {
      selectedHands[index].folded = checkboxFolded.checked;
      localStorage.setItem('selectedHands', JSON.stringify(selectedHands));
      updateNoteBadge();
    });

    const label = document.createElement('span');
    label.textContent = entry.hand + ' /';
    label.style.color = 'white';

    wrapper.appendChild(checkboxPlayed);
    wrapper.appendChild(checkboxFolded);
    wrapper.appendChild(label);
    container.appendChild(wrapper);
  });

  updateNoteBadge();
}

  // ✅ MODIFICATION : liste complète des 169 mains
const handRanking = {
  // Paires
  "AA": 10, "KK": 10, "QQ": 10, "JJ": 9, "TT": 8, "99": 7, "88": 7, "77": 6, "66": 6, "55": 5, "44": 5, "33": 4, "22": 4,

  // As-x suited
  "AKs": 10, "AQs": 9, "AJs": 8, "ATs": 7, "A9s": 6, "A8s": 5, "A7s": 5, "A6s": 4, "A5s": 4, "A4s": 3, "A3s": 3, "A2s": 2,

  // As-x offsuit
  "AKo": 9, "AQo": 7, "AJo": 6, "ATo": 5, "A9o": 4, "A8o": 3, "A7o": 2, "A6o": 2, "A5o": 1, "A4o": 1, "A3o": 1, "A2o": 1,

  // Roi-x suited
  "KQs": 8, "KJs": 7, "KTs": 6, "K9s": 5, "K8s": 4, "K7s": 3, "K6s": 3, "K5s": 2, "K4s": 2, "K3s": 1, "K2s": 1,

  // Roi-x offsuit
  "KQo": 7, "KJo": 5, "KTo": 5, "K9o": 4, "K8o": 3, "K7o": 2, "K6o": 2, "K5o": 1, "K4o": 1, "K3o": 1, "K2o": 1,

  // Dame-x suited
  "QJs": 7, "QTs": 6, "Q9s": 5, "Q8s": 4, "Q7s": 3, "Q6s": 3, "Q5s": 2, "Q4s": 2, "Q3s": 1, "Q2s": 1,

  // Dame-x offsuit
  "QJo": 5, "QTo": 4, "Q9o": 3, "Q8o": 2, "Q7o": 2, "Q6o": 1, "Q5o": 1, "Q4o": 1, "Q3o": 1, "Q2o": 1,

  // Valet-x suited
  "JTs": 6, "J9s": 5, "J8s": 4, "J7s": 3, "J6s": 3, "J5s": 2, "J4s": 1, "J3s": 1, "J2s": 1,

  // Valet-x offsuit
  "JTo": 5, "J9o": 4, "J8o": 4, "J7o": 3, "J6o": 2, "J5o": 1, "J4o": 1, "J3o": 1, "J2o": 1,

  // Dix-x suited
  "T9s": 6, "T8s": 5, "T7s": 4, "T6s": 3, "T5s": 2, "T4s": 2, "T3s": 1, "T2s": 1,

  // Dix-x offsuit
  "T8o": 4, "T7o": 3, "T6o": 2, "T5o": 1, "T4o": 1, "T3o": 1, "T2o": 1,

  // 9-x suited
  "98s": 5, "97s": 4, "96s": 3, "95s": 2, "94s": 2, "93s": 1, "92s": 1,

  // 9-x offsuit
  "94o": 1, "93o": 1, "92o": 1,

  // 8-x suited
  "87s": 4, "86s": 3, "85s": 2, "84s": 2, "83s": 1, "82s": 1,

  // 7-x suited
  "76s": 4, "75s": 3, "74s": 2, "73s": 2, "72s": 1,

  // 7-x offsuit
  "72o": 1,

  // petites cartes hors suites et suited
  "65s": 3, "64s": 2, "63s": 1, "62s": 1,
  "54s": 2, "53s": 1, "52s": 1,
  "43s": 1, "42s": 1,
  "32s": 1,

  // Offsuited petites mains non listées
  "63o": 1, "62o": 1, "53o": 1, "52o": 1, "43o": 1, "42o": 1, "32o": 1
};


// Donne une note sur 10 selon la position dans la grille (0 = meilleure main)
function getHandScore(hand) {
  const normalized = normalizeHand(hand);
  const score = handRanking[normalized];
  if (score === undefined) return 1; // main inconnue, note faible
  return score;
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


