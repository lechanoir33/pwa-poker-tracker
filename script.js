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
    container.style.userSelect = 'none';

    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.textContent = hand;
    cell.style.userSelect = 'none';

    let count = 0;
    const counter = document.createElement('div');
    counter.className = 'counter';
    counter.textContent = count;

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

    cell.addEventListener('mousedown', startPressTimer);
    cell.addEventListener('mouseup', cancelPressTimer);
    cell.addEventListener('mouseleave', cancelPressTimer);
    cell.addEventListener('touchstart', startPressTimer);
    cell.addEventListener('touchend', cancelPressTimer);
    cell.addEventListener('touchcancel', cancelPressTimer);

    counter.addEventListener('mousedown', startPressTimer);
    counter.addEventListener('mouseup', cancelPressTimer);
    counter.addEventListener('mouseleave', cancelPressTimer);
    counter.addEventListener('touchstart', startPressTimer);
    counter.addEventListener('touchend', cancelPressTimer);
    counter.addEventListener('touchcancel', cancelPressTimer);

    container.appendChild(cell);
    container.appendChild(counter);
    grid.appendChild(container);
  });
});

document.addEventListener('contextmenu', event => event.preventDefault());
