
document.addEventListener('DOMContentLoaded', () => {
  const hands = [
    'AA', 'KK', 'QQ', 'JJ', 'TT',
    'AKs', 'AQs', 'AJs', 'ATs',
    'AKo', 'AQo', 'AJo', 'KQs'
  ];

  const grid = document.getElementById('grid');

  hands.forEach(hand => {
    const container = document.createElement('div');
    container.className = 'cell-container';

    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.textContent = hand;

    let count = 0;
    const counter = document.createElement('div');
    counter.className = 'counter';
    counter.textContent = count;

    function getColorForCount(count) {
      // Plus le compteur augmente, plus le bleu devient clair
      const maxCount = 20;
      const intensity = Math.min(255, 50 + (count / maxCount) * 205);
      return `rgb(0, 0, ${intensity})`;
    }

    cell.style.backgroundColor = getColorForCount(count);

    // Incrémenter le compteur au clic
    cell.addEventListener('click', () => {
      count++;
      counter.textContent = count;
      cell.style.backgroundColor = getColorForCount(count);
    });

    // Réinitialiser le compteur sur appui long (souris)
    let pressTimer;

    cell.addEventListener('mousedown', (e) => {
      pressTimer = setTimeout(() => {
        count = 0;
        counter.textContent = count;
        cell.style.backgroundColor = getColorForCount(count);
      }, 800);
    });

    cell.addEventListener('mouseup', () => {
      clearTimeout(pressTimer);
    });

    cell.addEventListener('mouseleave', () => {
      clearTimeout(pressTimer);
    });

    // Réinitialiser le compteur sur appui long (tactile)
    cell.addEventListener('touchstart', (e) => {
      pressTimer = setTimeout(() => {
        count = 0;
        counter.textContent = count;
        cell.style.backgroundColor = getColorForCount(count);
      }, 800);
    });

    cell.addEventListener('touchend', () => {
      clearTimeout(pressTimer);
    });

    container.appendChild(cell);
    container.appendChild(counter);
    grid.appendChild(container);
  });
});
