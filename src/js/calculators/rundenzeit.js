const rundenzeit = {
  title: "Durchschnittliche Rundenzeit berechnen",

  render() {
    const section = document.createElement("section");
    section.className = "calculator";

    section.innerHTML = `
      <h1>Durchschnittliche Rundenzeit berechnen</h1>
      <p class="calculator-intro">
        Dieser Rechner ermittelt die zu fahrende durchschnittliche Rundenzeit, um die Gesamtzeit nach einer bestimmen Rundenanzahl zu erreichen. Die Zeit der ersten Runde wird gesondert berücksichtigt.
      </p>
      <p class="calculator-intro">Berechnungsformel:
      <math xmlns="http://www.w3.org/1998/Math/MathML" display="inline">
        <mrow>
          <msub><mi>T</mi><mn>RØ</mn></msub>
          <mo>=</mo>
          <mfrac>
            <mrow>
              <msub><mi>T</mi><mn>ges</mn></msub>
              <mo>-</mo>
              <msub><mi>T</mi><mn>R1</mn></msub>
            </mrow>
            <mrow>
              <mi>R</mi>
              <mo>-</mo>
              <mn>1</mn>
            </mrow>
          </mfrac>
        </mrow>
      </math></p>
      <hr>
      <form id="avglap-form">
        <div class="form-grid">
          <div class="form-field">
            <label for="total-lap">Gesamtzeit (T<sub>ges</sub>)</label>
            <input
              id="total-lap"
              name="totalLap"
              type="text"
              inputmode="decimal"
              placeholder="03:56,700"
              value="03:56,700"
              required>
            <p class="help">Format: HH:MM:SS,mmm oder Sekunden, z. B. 12,500</p>
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
            <p class="help">2 bis 1000 Runden</p>
          </div>
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
        </div>
        <div class="form-actions">
          <button type="submit">Berechnen</button>
        </div>
        <div id="avglap-error" class="error" hidden role="alert"></div>
        <div class="result" aria-live="polite">
          <span class="result-label">Die durchschnittliche Zeit ab Runde 2 (T<sub>RØ</sub>)</span>
          <strong id="avglap-result" class="result-value">00:00:11,800</strong>
        </div>
      </form>
    `;

    const form = section.querySelector("#avglap-form");
    const result = section.querySelector("#avglap-result");
    const error = section.querySelector("#avglap-error");

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      try {
        const totalLap = parseTime(form.elements.totalLap.value);
        const firstLap = parseTime(form.elements.firstLap.value);
        const lapCount = Number(form.elements.lapCount.value);

        validateg(totalLap, firstLap, lapCount);

        const avgMilliseconds = (totalLap - firstLap) / (lapCount - 1);

        result.textContent = formatTime(avgMilliseconds);
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

function validateg(totalLap, firstLap, lapCount) {
  if (!Number.isFinite(totalLap) || totalLap <= 0) {
    throw new Error("Die Gesamtzeit ist ungültig.");
  }

  if (!Number.isFinite(firstLap) || firstLap <= 0) {
    throw new Error("Die Zeit der ersten Runde ist ungültig.");
  }

  if (!Number.isInteger(lapCount) || lapCount < 2 || lapCount > 1000) {
    throw new Error("Die Rundenanzahl muss eine ganze Zahl größer als 1 und maximal 1000 sein.");
  }
}
