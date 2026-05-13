import type { Preset } from "../presets/historical";

export class InfoPanel {
  root: HTMLElement;

  constructor(root: HTMLElement) {
    this.root = root;
    this.renderEmpty();
  }

  renderEmpty(): void {
    this.root.innerHTML = `
      <div class="info-empty">
        <h3>À propos</h3>
        <p>
          Le <strong>problème à trois corps</strong> consiste à déterminer le mouvement de
          trois masses ponctuelles soumises uniquement à leur attraction gravitationnelle mutuelle.
        </p>
        <p>
          En 1889, <strong>Henri Poincaré</strong> démontre qu'il n'existe pas de solution
          analytique générale — le système est <em>chaotique</em>. Ce résultat fonde la théorie
          des systèmes dynamiques modernes.
        </p>
        <p>Choisis un cas historique pour explorer une solution remarquable.</p>
      </div>
    `;
  }

  renderPreset(p: Preset): void {
    const periodStr = p.period
      ? `<div class="info-stat"><span>Période</span><strong>${p.period.toFixed(4)}</strong></div>`
      : "";
    this.root.innerHTML = `
      <div class="info-card">
        <h3>${escapeHtml(p.name)}</h3>
        <div class="info-meta">${p.year} · ${escapeHtml(p.discoverers)}</div>
        <p class="info-summary">${escapeHtml(p.summary)}</p>
        <div class="info-stats">
          <div class="info-stat"><span>Année</span><strong>${p.year}</strong></div>
          ${periodStr}
          <div class="info-stat"><span>Famille</span><strong>${familyLabel(p.family)}</strong></div>
        </div>
        <h4>Contexte historique</h4>
        <p class="info-history">${escapeHtml(p.history)}</p>
      </div>
    `;
  }

  renderManual(): void {
    this.root.innerHTML = `
      <div class="info-card">
        <h3>Configuration manuelle</h3>
        <p>
          Choisis librement masses, positions et vitesses. Conseil : pour que le système ne dérive pas
          hors-écran, garde la quantité de mouvement totale proche de zéro
          (la somme des <code>m·v</code> doit être nulle).
        </p>
        <p>
          La quasi-totalité des configurations sont chaotiques. Seules certaines familles très
          particulières produisent des orbites périodiques.
        </p>
      </div>
    `;
  }

  renderRandom(): void {
    this.root.innerHTML = `
      <div class="info-card">
        <h3>Tirage aléatoire</h3>
        <p>
          Les positions et vitesses sont tirées uniformément dans les plages choisies.
          Le centre de masse est ensuite ramené au repos.
        </p>
        <p>
          Tu observeras presque toujours le scénario typique : deux corps forment un système
          binaire, le troisième est éjecté à l'infini. C'est ce qu'on appelle l'<em>évolution
          hiérarchique</em>, prédite théoriquement et confirmée par les simulations à grande échelle.
        </p>
      </div>
    `;
  }
}

function familyLabel(f: Preset["family"]): string {
  switch (f) {
    case "classical":
      return "Classique";
    case "suvakov":
      return "Šuvakov 2013";
    case "chaotic":
      return "Chaotique";
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
