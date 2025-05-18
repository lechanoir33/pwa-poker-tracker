const grid = document.getElementById('grid');

// Mains de départ poker 13x13 (simplifié en exemple complet)
const ranks = ['A','K','Q','J','T','9','8','7','6','5','4','3','2'];

// Génère toutes les combinaisons standard (suited, offsuit, pocket pairs)
function generateHands() {
  const hands = [];
  for (let i = 0; i < ranks.length; i++) {
    for (let j = 0; j < ranks.length; j++) {
      if (i === j) {
        hands.push(ranks[i] + ranks[j]); // pocket pair, ex: AA
      } else if (i < j) {
        hands.push(ranks[i] + ranks[j] + 's'); // suited, ex: AKs
      } else {
        hands.push(ranks[j] + ranks[i] + 'o'); // offsuit, ex: AKo
      }
    }
  }
  return hands;
}

const hands = generateHands();

const counters = {}; // clé=main, valeur=compteur

// Charge compteurs depuis localStorage
function loadCounters() {
  const saved = localStorage.getItem('pokerCounters');
  if (saved) {
    Object.assign(counters, JSON.parse(saved));
  }
}

// Sauvegarde compteurs dans localStorage
function saveCounters() {
  localStorage.setItem('pokerCounters', JSON.stringify(counters));
}

// Calcule couleur jaune foncée en fonction du compteur (max 10)
function getYellowShade(count) {
  const maxCount = 10;
  const base = 255; // clair
  const min = 150;  // foncé
  const val = Math.max(min, base - (count * 10));
  return `rgb(${val}, ${val}, 0)`; // nuance de jaune foncé
}

// Crée une cellule main
function createCell(hand) {
  const cell = document.createElement('div');
  cell.className = 'cell';
  cell.textContent = hand.toUpperCase();

  // compteur visuel
  const counter = document.createElement('div');
  counter.className = 'counter';
  counter.textContent = counters[hand] || 0;
  cell.appendChild(counter);

  // applique la couleur selon compteur
  const count = counters[hand] || 0;
  cell.style.backgroundColor = getYellowShade(count);

  // clic simple : incrémente compteur + sauvegarde + mise à jour affichage
  cell.addEventListener('click', () => {
    counters[hand] = (counters[hand] || 0) + 1;
    counter.textContent = counters[hand];
    cell.style.backgroundColor = getYellowShade(counters[hand]);
    saveCounters();
  });

  // appui long pour reset compteur
  let pressTimer = null;

  cell.addEventListener('mousedown', () => {
    pressTimer = setTimeout(() => {
      counters[hand] = 0;
      counter.textContent = 0;
      cell.style.backgroundColor = getYellowShade(0);
      saveCounters();
    }, 700); // 700 ms appui long
  });

  cell.addEventListener('mouseup', () => {
    clearTimeout(pressTimer);
  });
  cell.addEventListener('mouseleave', () => {
    clearTimeout(pressTimer);
  });

  return cell;
}

function init() {
  loadCounters();
  hands.forEach(hand => {
    const cell = createCell(hand);
    grid.appendChild(cell);
  });
}

init();
