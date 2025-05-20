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
    selectedHands.push(hand);  // Toujours ajouter (doublons autorisés)
    localStorage.setItem('selectedHands', JSON.stringify(selectedHands));
    updateSelectedHandsDisplay();
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
  if (!container) return; // Sécurité si l’élément n’existe pas
  container.innerHTML = '';

  const selectedHands = JSON.parse(localStorage.getItem('selectedHands')) || [];

  selectedHands.forEach((hand) => {
    if (typeof hand !== 'string') return;
    
    const wrapper = document.createElement('div');
    wrapper.style.margin = '4px';
    wrapper.style.display = 'flex';
    wrapper.style.alignItems = 'center';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = false;
    checkbox.style.marginRight = '5px';

    const label = document.createElement('span');
    console.log('Main récupérée du localStorage :', hand);
    label.textContent = hand + ' /';
    label.style.color = 'white';

    wrapper.appendChild(checkbox);
    wrapper.appendChild(label);
    container.appendChild(wrapper);
  });
}
  
// Sécurité
document.addEventListener('contextmenu', e => e.preventDefault());
document.addEventListener('selectstart', e => e.preventDefault());
document.addEventListener('dblclick', e => e.preventDefault());

// Chargement initial
loadCounts();
updateSelectedHandsDisplay();
