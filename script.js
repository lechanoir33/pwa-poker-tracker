function isMondayOrThursday(date) {
  const day = date.getDay();
  return day === 1 || day === 4; // Lundi = 1, Jeudi = 4
}

function formatDate(date) {
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

function generateSessionHTML(date) {
  const hands = ['TT', 'JJ', 'QQ', 'KK', 'AA'];
  const session = document.createElement('section');
  session.className = 'session';

  const title = document.createElement('h2');
  title.textContent = formatDate(date);
  session.appendChild(title);

  hands.forEach(hand => {
    const row = document.createElement('div');
    row.className = 'hand-row';

    const label = document.createElement('div');
    label.className = 'hand-label';
    label.textContent = hand;
    row.appendChild(label);

    const checkboxContainer = document.createElement('div');
    checkboxContainer.className = 'checkboxes';

    for (let i = 0; i < 4; i++) {
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.id = `${hand}-${i}-${date.toISOString()}`;

      // Retenir l’état coché/décoché (sauvegarde locale)
      checkbox.checked = localStorage.getItem(checkbox.id) === 'true';
      checkbox.addEventListener('change', () => {
        localStorage.setItem(checkbox.id, checkbox.checked);
      });

      checkboxContainer.appendChild(checkbox);
    }

    row.appendChild(checkboxContainer);
    session.appendChild(row);
  });

  return session;
}

function renderSessions(startDate, endDate) {
  const container = document.getElementById('sessions');
  const current = new Date(startDate);

  while (current <= endDate) {
    if (isMondayOrThursday(current)) {
      const sessionEl = generateSessionHTML(new Date(current));
      container.appendChild(sessionEl);
    }
    current.setDate(current.getDate() + 1);
  }
}

// ⚙️ Plage de dates : du 12 mai 2025 au 12 novembre 2025
const start = new Date('2025-05-12');
const end = new Date('2025-11-12');
renderSessions(start, end);
