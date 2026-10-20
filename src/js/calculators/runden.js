const runden = {
  title: "Erreichbare Runden berechnen",

  render() {
    const section = document.createElement("section");
    section.className = "calculator";
    section.innerHTML = `
      <h1>Erreichbare Runden berechnen</h1>
      <p class="calculator-intro">
        Dieser Rechner ermittelt die erreichbare Rundenanzahl basierend auf der Gesamtzeit und durchschnittlichen Rundenzeiten. Die Zeit der ersten Runde wird gesondert berücksichtigt.
      </p>
      <p class="calculator-intro">Berechnungsformel:
      <math xmlns="http://www.w3.org/1998/Math/MathML" display="inline">
        <mrow>
          <mi>R</mi>
          <mo>=</mo>
          <mn>1</mn>
          <mo>+</mo>
          <mo>⌈</mo>
            <mfrac>
              <mrow>
                <msub><mi>T</mi><mn>ges</mn></msub>
                <mo>-</mo>
                <msub><mi>T</mi><mn>R1</mn></msub>
              </mrow>
              <msub><mi>T</mi><mn>RØ</mn></msub>
            </mfrac>
          <mo>⌉</mo>
        </mrow>
      </math></p>
      <hr>
      <form id="maxlaps-form">
        <div class="form-grid">
          <div class="form-field">
            <label for="total-time">Gesamtzeit (T<sub>ges</sub>)</label>
            <input
              id="total-time"
              name="totalTime"
              type="text"
              inputmode="decimal"
              placeholder="03:56,700"
              value="03:56,700"
              required>
            <p class="help">Format: HH:MM:SS,mmm oder Sekunden, z. B. 12,500</p>
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
            <p class="help">Die durchschnittliche Zeit ab Runde 2</p>
          </div>
        </div>
        <div class="form-actions">
          <button type="submit">Berechnen</button>
        </div>
        <div id="maxlaps-error" class="error" hidden role="alert"></div>
        <div class="result" aria-live="polite">
          <span class="result-label">Erreichbare Anzahl an Runden (R)</span>
          <strong id="maxlaps-result" class="result-value">20</strong>
        </div>
      </form>
    `;

    const form = section.querySelector("#maxlaps-form");
    const result = section.querySelector("#maxlaps-result");
    const error = section.querySelector("#maxlaps-error");

    form.addEventListener("submit", (event) => {
      event.preventDefault();

      try {
        const totalTime = parseTime(form.elements.totalTime.value);
        const firstLap = parseTime(form.elements.firstLap.value);
        const avgLap = parseTime(form.elements.averageLap.value);

        validatel(totalTime, firstLap, avgLap);

        const maxLaps = 1 + Math.ceil((totalTime - firstLap) / avgLap);

        result.textContent = maxLaps;
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

function validatel(totalTime, firstLap, avgLap) {
  if (!Number.isFinite(totalTime) || totalTime <= 0) {
    throw new Error("Die Gesamtzeit ist ungültig.");
  }

  if (!Number.isFinite(firstLap) || firstLap <= 0) {
    throw new Error("Die Zeit der ersten Runde ist ungültig.");
  }

  if (!Number.isFinite(avgLap) || avgLap <= 0) {
    throw new Error("Die Zeit der ersten Runde ist ungültig.");
  }
}
