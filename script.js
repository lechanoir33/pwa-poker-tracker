const premiums = ['TT', 'JJ', 'QQ', 'KK', 'AA'];
const nbCases = 4;
const sessionsContainer = document.getElementById('sessions');

function getPastSessions(startDate, endDate) {
  const dates = [];
  const current = new Date(startDate);
  while (current <= endDate) {
    const day = current.getDay();
    if (day === 1 || day === 4) { // Lundi (1) et Jeudi (4)
      dates.push(new Date(current));
    }
    current.setDate(current.getDate() + 1);
  }
  return dates.reverse(); // Du plus récent au plus ancien
}

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

function loadState(key) {
  return localStorage.getItem(key) === '1';
}

function saveState(key, value) {
  localStorage.setItem(key, value ? '1' : '0');
}

function createCheckbox(dateStr, hand, index) {
  const id = `${dateStr}_${hand}_${index}`;
  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = loadState(id);
  checkbox.addEventListener('change', () => {
    saveState(id, checkbox.checked);
  });
  return checkbox;
}

function createSession(date) {
  const dateStr = formatDate(date);
  const sessionDiv = document.createElement('div');
  sessionDiv.className = 'session';

  const title = document.createElement('h2');
  title.textContent = dateStr;
  sessionDiv.appendChild(title);

  premiums.forEach((hand) => {
    const row = document.createElement('div');
    row.className = 'hand-row';

    const label = document.createElement('div');
    label.className = 'hand-label';
    label.textContent = hand;
    row.appendChild(label);

    for (let i = 0; i < nbCases; i++) {
      row.appendChild(createCheckbox(dateStr, hand, i));
    }

    sessionDiv.appendChild(row);
  });

  sessionsContainer.appendChild(sessionDiv);
}

// Génère les sessions depuis début 2024 jusqu’à aujourd’hui
const start = new Date('2024-01-01');
const end = new Date();
const sessions = getPastSessions(start, end);
sessions.forEach(createSession);
