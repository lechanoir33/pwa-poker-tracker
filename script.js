const hands = [];

const ranks = ['A', 'K', 'Q', 'J', 'T', '9', '8', '7', '6', '5', '4', '3', '2'];

for (let i = 0; i < ranks.length; i++) {
  for (let j = 0; j < ranks.length; j++) {
    if (i === j) {
      hands.push(ranks[i] + ranks[j]); // Paire : AA, KK...
    } else if (i < j) {
      hands.push(ranks[i] + ranks[j] + 'o'); // Offsuit
    } else {
      hands.push(ranks[i] + ranks[j] + 's'); // Suited
    }
  }
}

const tableau = document.getElementById('tableau');

hands.forEach((hand) => {
  const div = document.createElement('div');
  div.className = 'mains';

  const label = document.createElement('label');
  label.textContent = hand;
  div.appendChild(label);

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  div.appendChild(checkbox);

  const counter = document.createElement('div');
  counter.className = 'counter';
  counter.textContent = '0';
  div.appendChild(counter);

  checkbox.addEventListener('click', () => {
    let count = parseInt(counter.textContent, 10);
    count++;
    counter.textContent = count;
    const blue = Math.min(255, 31 + count * 5);
    div.style.backgroundColor = `rgb(0, 0, ${blue})`;
  });

  let pressTimer;
  const resetCounter = () => {
    counter.textContent = '0';
    div.style.backgroundColor = '#001f3f';
  };

  [checkbox, counter].forEach((el) => {
    el.addEventListener('mousedown', () => {
      pressTimer = setTimeout(resetCounter, 1000);
    });
    el.addEventListener('mouseup', () => clearTimeout(pressTimer));
    el.addEventListener('mouseleave', () => clearTimeout(pressTimer));
    el.addEventListener('touchstart', () => {
      pressTimer = setTimeout(resetCounter, 1000);
    });
    el.addEventListener('touchend', () => clearTimeout(pressTimer));
  });

  tableau.appendChild(div);
});

document.addEventListener('contextmenu', (e) => e.preventDefault());