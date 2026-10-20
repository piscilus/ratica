const calculators = {
  gesamtzeit,
  rundenzeit,
  runden,
};

const calculatorContainer = document.querySelector("#calculator-container");
const calculatorLinks = document.querySelectorAll("[data-calculator-link]");

function getCalculatorName() {
  const name = window.location.hash.slice(1).trim().toLowerCase();

  if (name in calculators) {
    return name;
  }

  return "gesamtzeit";
}

function renderCalculator() {
  const name = getCalculatorName();
  const calculator = calculators[name];

  calculatorContainer.replaceChildren(calculator.render());

  calculatorLinks.forEach((link) => {
    link.classList.toggle(
      "active",
      link.dataset.calculatorLink === name
    );
  });

  window.history.replaceState(
    {},
    '',
    `${window.location.pathname}#${name}`
  );

  document.title = `${calculator.title} – Carrera Hybrid Rechner`;
}

window.addEventListener("hashchange", renderCalculator);



renderCalculator();



function parseTime(value) {
  const input = value.trim().replace(",", ".");

  if (!input) {
    return NaN;
  }

  if (input.includes(":")) {
    const parts = input.split(":");

    if (parts.length !== 2) {
      return NaN;
    }

    const minutes = Number(parts[0]);
    const seconds = Number(parts[1]);

    if (!Number.isFinite(minutes) || !Number.isFinite(seconds)) {
      return NaN;
    }

    if (minutes < 0 || seconds < 0 || seconds >= 60) {
      return NaN;
    }

    return Math.round((minutes * 60 + seconds) * 1000);
  }

  const seconds = Number(input);

  if (!Number.isFinite(seconds) || seconds <= 0) {
    return NaN;
  }

  return Math.round(seconds * 1000);
}

function formatTime(milliseconds) {
  const totalMilliseconds = Math.round(milliseconds);

  const hours = Math.floor(totalMilliseconds / 3_600_000);
  const minutes = Math.floor((totalMilliseconds % 3_600_000) / 60_000);
  const seconds = Math.floor((totalMilliseconds % 60_000) / 1000);
  const millis = totalMilliseconds % 1000;

  const paddedHours = String(hours).padStart(2, "0");
  const paddedMinutes = String(minutes).padStart(2, "0");
  const paddedSeconds = String(seconds).padStart(2, "0");
  const paddedMillis = String(millis).padStart(3, "0");

  return `${paddedHours}:${paddedMinutes}:${paddedSeconds},${paddedMillis}`;
}

