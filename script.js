const hands = [
  "AA", "KK", "QQ", "JJ", "TT", "AKs", "AQs", "AJs", "ATs", "KQs",
  "AKo", "AQo", "AJo", "KQo"
];

const tableContainer = document.getElementById("hands-table");

// Chargement des compteurs depuis le localStorage
const counters = JSON.parse(localStorage.getItem("pokerCounters")) || {};

hands.forEach(hand => {
  const container = document.createElement("div");
  container.className = "hand-container";

  // Crée la case à cocher
  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.id = `checkbox-${hand}`;
  checkbox.checked = counters[hand] > 0;

  // Crée le label (nom de la main)
  const label = document.createElement("label");
  label.setAttribute("for", `checkbox-${hand}`);
  label.textContent = hand.toUpperCase().replace("S", "s").replace("O", "o");

  // Crée le compteur
  const counter = document.createElement("div");
  counter.className = "counter";
  counter.textContent = counters[hand] || 0;

  // Incrémentation au clic sur la case ou le label
  const handleClick = () => {
    counters[hand] = (counters[hand] || 0) + 1;
    counter.textContent = counters[hand];
    checkbox.checked = true;
    updateColor(container, counters[hand]);
    saveCounters();
  };

  checkbox.addEventListener("click", handleClick);
  label.addEventListener("click", handleClick);

  // Réinitialisation sur appui long sur le compteur
  let pressTimer;
  counter.addEventListener("mousedown", () => {
    pressTimer = setTimeout(() => {
      counters[hand] = 0;
      counter.textContent = "0";
      checkbox.checked = false;
      updateColor(container, 0);
      saveCounters();
    }, 1000);
  });

  counter.addEventListener("mouseup", () => clearTimeout(pressTimer));
  counter.addEventListener("mouseleave", () => clearTimeout(pressTimer));

  container.appendChild(checkbox);
  container.appendChild(label);
  container.appendChild(counter);
  updateColor(container, counters[hand]);
  tableContainer.appendChild(container);
});

function updateColor(el, value) {
  // plus la valeur est grande, plus le fond s’éclaircit
  let brightness = Math.min(255, 40 + value * 20);
  el.style.backgroundColor = `rgb(${brightness}, ${brightness}, 255)`; // Bleu clair
}

function saveCounters() {
  localStorage.setItem("pokerCounters", JSON.stringify(counters));
}


// Sécurité et protection
document.addEventListener('contextmenu', e => e.preventDefault());  // Clic droit interdit
document.addEventListener('selectstart', e => e.preventDefault());  // Empêche sélection
document.addEventListener('dblclick', e => e.preventDefault());     // Empêche zoom ou sélection double clic
