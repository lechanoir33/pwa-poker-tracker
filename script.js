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
      updateNoteBadge(); // 🔥 Ajout : mettre à jour la note quand on coche/décoche
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

// ✅ MODIFICATION : liste complète des 169 mains
const handRanking = [
  'AA','KK','QQ','JJ','TT','99','88','77','66','55','44','33','22',
  'AKs','AQs','AJs','ATs','A9s','A8s','A7s','A6s','A5s','A4s','A3s','A2s',
  'KQs','KJs','KTs','K9s','K8s','K7s','K6s','K5s','K4s','K3s','K2s',
  'QJs','QTs','Q9s','Q8s','Q7s','Q6s','Q5s','Q4s','Q3s','Q2s',
  'JTs','J9s','J8s','J7s','J6s','J5s','J4s','J3s','J2s',
  'T9s','T8s','T7s','T6s','T5s','T4s','T3s','T2s',
  '98s','97s','96s','95s','94s','93s','92s',
  '87s','86s','85s','84s','83s','82s',
  '76s','75s','74s','73s','72s',
  '65s','64s','63s','62s',
  '54s','53s','52s',
  '43s','42s',
  '32s',
  'AKo','AQo','AJo','ATo','A9o','A8o','A7o','A6o','A5o','A4o','A3o','A2o',
  'KQo','KJo','KTo','K9o','K8o','K7o','K6o','K5o','K4o','K3o','K2o',
  'QJo','QTo','Q9o','Q8o','Q7o','Q6o','Q5o','Q4o','Q3o','Q2o',
  'JTo','J9o','J8o','J7o','J6o','J5o','J4o','J3o','J2o',
  'T9o','T8o','T7o','T6o','T5o','T4o','T3o','T2o',
  '98o','97o','96o','95o','94o','93o','92o',
  '87o','86o','85o','84o','83o','82o',
  '76o','75o','74o','73o','72o',
  '65o','64o','63o','62o',
  '54o','53o','52o',
  '43o','42o',
  '32o'
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


