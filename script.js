const grid = document.getElementById('grid');

const ranks = ['A','K','Q','J','T','9','8','7','6','5','4','3','2'];

function generateHands() {
  const hands = [];
  for (let i = 0; i < ranks.length; i++) {
    for (let j = 0; j < ranks.length; j++) {
      if (i === j) {
        hands.push(ranks[i] + ranks[j]); // paire ex: AA
      } else if (i < j) {
        hands.push(ranks[i] + ranks[j] + 's'); // suited, s minuscule
      } else {
        hands.push(ranks[j] + ranks[i] + 'o'); // offsuit, o minuscule
      }
    }
  }
  return hands;
}

const hands = generateHands();
const counters = {};

function loadCounters() {
  const saved = localStorage.getItem('pokerCounters');
  if (saved) {
    Object.assign(counters, JSON.parse(saved));
  }
}

function saveCounters() {
  localStorage.setItem('pokerCounters', JSON.stringify(counters));
}

// Fonction pour interpoler entre deux couleurs hexadécimales
function interpolateColor(color1, color2, factor) {
  let result = "#";
  for (let i = 1; i < 7; i += 2) {
    const c1 = parseInt(color1.substr(i, 2), 16);
    const c2 = parseInt(color2.substr(i, 2), 16);
    let val = Math.round(c1 + factor * (c2 - c1));
    val = Math.min(255, Math.max(0, val));
    result += val.toString(16).padStart(2, '0');
  }
  return result;
}

function createCell(hand) {
  const cell = document.createElement('div');
  cell.className = 'cell';

  // Texte main avec s/o minuscules
  const handText = document.createElement('span');
  handText.className = 'hand-text';
  if (hand.endsWith('s') || hand.endsWith('o')) {
    handText.innerHTML = hand.slice(0, -1).toUpperCase() + '<small>' + hand.slice(-1) + '</small>';
  } else {
    handText.textContent = hand.toUpperCase();
  }
  cell.appendChild(handText);

  // compteur
  const counter = document.createElement('div');
  counter.className = 'counter';
  counter.textContent = counters[hand] || 0;
  cell.appendChild(counter);

  // fonction pour mettre à jour la couleur de fond selon compteur
  function updateBackground() {
    const maxCount = 20; // max compteur attendu pour le dégradé
    const count = counters[hand] || 0;
    const factor = Math.min(count / maxCount, 1);
    const darkBlue = '#001F4D';
    const lightBlue = '#99CCFF';
    cell.style.backgroundColor = interpolateColor(darkBlue, lightBlue, factor);
  }

  updateBackground();

  // clic simple pour incrémenter compteur
  cell.addEventListener('click', () => {
    counters[hand] = (counters[hand] || 0) + 1;
    counter.textContent = counters[hand];
    updateBackground();
    saveCounters();
  });

  // appui long pour reset compteur
  let pressTimer = null;

  cell.addEventListener('mousedown', () => {
    pressTimer = setTimeout(() => {
      counters[hand] = 0;
      counter.textContent = 0;
      updateBackground();
      saveCounters();
    }, 700);
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
