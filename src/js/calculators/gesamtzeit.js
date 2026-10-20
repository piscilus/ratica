const gesamtzeit = {
  title: "Gesamtrennzeit berechnen",

  render() {
    const section = document.createElement("section");
    section.className = "calculator";

    section.innerHTML = `
      <h1>Gesamtrennzeit berechnen</h1>
      <p class="calculator-intro">
        Dieser Rechner ermittelt die Gesamtrennzeit basierend auf der Rundenanzahl und der durchschnittlichen Rundenzeit. Die Zeit der ersten Runde wird gesondert berücksichtigt.
      <p class="calculator-intro">Berechnungsformel:
      <math xmlns="http://www.w3.org/1998/Math/MathML" display="inline">
        <mrow>
          <msub><mi>T</mi><mn>ges</mn></msub>
          <mo>=</mo>
          <msub><mi>T</mi><mn>R1</mn></msub>
          <mo>+</mo>
          <mo>(</mo>
          <mi>R</mi>
          <mo>-</mo>
          <mn>1</mn>
          <mo>)</mo>
          <mo>×</mo>
          <msub><mi>T</mi><mn>RØ</mn></msub>
        </mrow>
      </math></p>
      <hr>
      <form id="gesamtzeit-form">
        <div class="form-grid">
          <div class="form-field">
            <label for="first-lap">Zeit 1. Runde (T<sub>R1</sub>)</label>
            <input
              id="first-lap"
              name="firstLap"
              type="text"
              inputmode="decimal"
              placeholder="00:12,500"
              value="00:12,500"
              required>
            <p class="help">Format: MM:SS,mmm oder Sekunden, z. B. 12,500</p>
          </div>
          <div class="form-field">
            <label for="average-lap">Ø-Zeit weitere Runden (T<sub>RØ</sub>)</label>
            <input
              id="average-lap"
              name="averageLap"
              type="text"
              inputmode="decimal"
              placeholder="00:11,800"
              value="00:11,800"
              required>
            <p class="help">Format: MM:SS,mmm oder Sekunden, z. B. 12,500</p>
          </div>
          <div class="form-field">
            <label for="lap-count">Rundenanzahl (R)</label>
            <input
              id="lap-count"
              name="lapCount"
              type="number"
              min="1"
              step="1"
              value="20"
              required>
            <p class="help">1 bis 1000 Runden</p>
          </div>
        </div>
        <div class="form-actions">
          <button type="submit">Berechnen</button>
        </div>
        <div id="gesamtzeit-error" class="error" hidden role="alert"></div>
        <div class="result" aria-live="polite">
          <span class="result-label">Voraussichtliche Gesamtzeit (T<sub>ges</sub>)</span>
          <strong id="gesamtzeit-result" class="result-value">00:03:56,700</strong>
        </div>
      </form>
    `;

    const form = section.querySelector("#gesamtzeit-form");
    const result = section.querySelector("#gesamtzeit-result");
    const error = section.querySelector("#gesamtzeit-error");


    // Fill inputs from URL
    const params = new URLSearchParams(window.location.search);

    for (const input of form.elements) {
      if (input.name && params.has(input.name)) {
        input.value = params.get(input.name);
      }
    }

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const params = new URLSearchParams(new FormData(form));


  const query = params.toString();

  window.history.replaceState(
    {},
    '',
    `${window.location.pathname}${query ? '?' + query : ''}${window.location.hash}`
  );

      try {
        const firstLap = parseTime(form.elements.firstLap.value);
        const averageLap = parseTime(form.elements.averageLap.value);
        const lapCount = Number(form.elements.lapCount.value);

        validate(firstLap, averageLap, lapCount);

        const totalMilliseconds =
          firstLap + (lapCount - 1) * averageLap;

        result.textContent = formatTime(totalMilliseconds);
        error.hidden = true;
        error.textContent = "";
      } catch (err) {
        error.textContent = err.message;
        error.hidden = false;
      }
    });


    form.requestSubmit();

    return section;
  },
};

function validate(firstLap, averageLap, lapCount) {
  if (!Number.isFinite(firstLap) || firstLap <= 0) {
    throw new Error("Die Zeit der ersten Runde ist ungültig.");
  }

  if (!Number.isFinite(averageLap) || averageLap <= 0) {
    throw new Error("Die durchschnittliche Rundenzeit ist ungültig.");
  }

  if (!Number.isInteger(lapCount) || lapCount < 1 || lapCount > 1000) {
    throw new Error("Die Rundenanzahl muss eine ganze Zahl größer als 0 und maximal 1000 sein.");
  }
}
