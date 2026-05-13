import type { Preset } from "../presets/historical";
import { getLang, onLangChange, t } from "../i18n";

type Mode =
  | { kind: "empty" }
  | { kind: "preset"; preset: Preset }
  | { kind: "manual" }
  | { kind: "random" };

export class InfoPanel {
  root: HTMLElement;
  mode: Mode = { kind: "empty" };

  constructor(root: HTMLElement) {
    this.root = root;
    this.render();
    onLangChange(() => this.render());
  }

  renderEmpty(): void {
    this.mode = { kind: "empty" };
    this.render();
  }

  renderPreset(p: Preset): void {
    this.mode = { kind: "preset", preset: p };
    this.render();
  }

  renderManual(): void {
    this.mode = { kind: "manual" };
    this.render();
  }

  renderRandom(): void {
    this.mode = { kind: "random" };
    this.render();
  }

  private render(): void {
    switch (this.mode.kind) {
      case "empty":
        this.root.innerHTML = `
          <div class="info-empty">
            <h3>${escapeHtml(t().defaultTitle)}</h3>
            <p>${t().defaultIntro}</p>
            <p>${t().defaultPoincare}</p>
            <p>${escapeHtml(t().defaultCta)}</p>
          </div>
        `;
        break;
      case "preset": {
        const lang = getLang();
        const p = this.mode.preset;
        const periodStr = p.period
          ? `<div class="info-stat"><span>${escapeHtml(t().periodLabel)}</span><strong>${p.period.toFixed(4)}</strong></div>`
          : "";
        const familyName =
          p.family === "classical"
            ? t().familyClassical
            : p.family === "suvakov"
            ? t().familySuvakov
            : t().familyChaotic;
        this.root.innerHTML = `
          <div class="info-card">
            <h3>${escapeHtml(p.name[lang])}</h3>
            <div class="info-meta">${p.year} · ${escapeHtml(p.discoverers)}</div>
            <p class="info-summary">${escapeHtml(p.summary[lang])}</p>
            <div class="info-stats">
              <div class="info-stat"><span>${escapeHtml(t().yearLabel)}</span><strong>${p.year}</strong></div>
              ${periodStr}
              <div class="info-stat"><span>${escapeHtml(t().familyLabel)}</span><strong>${escapeHtml(familyName)}</strong></div>
            </div>
            <h4>${escapeHtml(t().historyHeading)}</h4>
            <p class="info-history">${escapeHtml(p.history[lang])}</p>
          </div>
        `;
        break;
      }
      case "manual":
        this.root.innerHTML = `
          <div class="info-card">
            <h3>${escapeHtml(t().manualTitle)}</h3>
            <p>${t().manualP1}</p>
            <p>${t().manualP2}</p>
          </div>
        `;
        break;
      case "random":
        this.root.innerHTML = `
          <div class="info-card">
            <h3>${escapeHtml(t().randomTitle)}</h3>
            <p>${t().randomP1}</p>
            <p>${t().randomP2}</p>
          </div>
        `;
        break;
    }
  }
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
