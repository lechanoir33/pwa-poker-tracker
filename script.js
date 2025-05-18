document.addEventListener('DOMContentLoaded', () => {
  const hands = [
    'AA', 'KK', 'QQ', 'JJ', 'TT',
    'AKs', 'AQs', 'AJs', 'ATs',
    'AKo', 'AQo', 'AJo', 'KQs'
  ];

  const grid = document.getElementById('grid');
  grid.style.userSelect = 'none';

  hands.forEach(hand => {
    const container = document.createElement('div');
    container.className = 'cell-container';

    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.textContent = hand;
    cell.style.userSelect = 'none';

    let count = 0;
    const counter = document.createElement('div');
    counter.className = 'counter';
    counter.textContent = count;
    counter.style.userSelect = 'none';

    function getColorForCount(count) {
      const maxCount = 20;
      const intensity = Math.min(255, 50 + (count / maxCount) * 205);
      return `rgb(0, 0, ${intensity})`;
    }

    cell.style.backgroundColor = getColorForCount(count);

    cell.addEventListener('click', () => {
      count++;
      counter.textContent = count;
      cell.style.backgroundColor = getColorForCount(count);
    });

    // Appui long sur le compteur pour réinitialiser
    let pressTimer;

    function startPressTimer() {
      pressTimer = setTimeout(() => {
        count = 0;
        counter.textContent = count;
        cell.style.backgroundColor = getColorForCount(count);
      }, 800);
    }

    function cancelPressTimer() {
      clearTimeout(pressTimer);
    }

    counter.addEventListener('mousedown', startPressTimer);
    counter.addEventListener('mouseup', cancelPressTimer);
    counter.addEventListener('mouseleave', cancelPressTimer);
    counter.addEventListener('touchstart', startPressTimer);
    counter.addEventListener('touchend', cancelPressTimer);

    container.appendChild(cell);
    container.appendChild(counter);
    grid.appendChild(container);
  });
});

// Désactiver le clic droit
document.addEventListener('contextmenu', event => event.preventDefault());
