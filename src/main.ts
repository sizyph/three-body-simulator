import "./style.css";
import { Simulation } from "./physics/simulation";
import { CanvasRenderer } from "./ui/canvas";
import { ManualControls, randomBodies } from "./ui/controls";
import { PresetMenu } from "./ui/preset-menu";
import { InfoPanel } from "./ui/info-panel";
import { LanguageSwitcher } from "./ui/language-switcher";
import { PRESETS, type Preset } from "./presets/historical";
import { getLang, onLangChange, t } from "./i18n";

// ----- DOM refs -----
const canvas = document.getElementById("canvas") as HTMLCanvasElement;
const statusEl = document.getElementById("status") as HTMLDivElement;
const playBtn = document.getElementById("btn-play") as HTMLButtonElement;
const resetBtn = document.getElementById("btn-reset") as HTMLButtonElement;
const stepBtn = document.getElementById("btn-step") as HTMLButtonElement;
const clearTrailsBtn = document.getElementById("btn-clear-trails") as HTMLButtonElement;
const speedInput = document.getElementById("speed") as HTMLInputElement;
const speedVal = document.getElementById("speed-val") as HTMLSpanElement;
const rndPos = document.getElementById("rnd-pos") as HTMLInputElement;
const rndPosVal = document.getElementById("rnd-pos-val") as HTMLSpanElement;
const rndVel = document.getElementById("rnd-vel") as HTMLInputElement;
const rndVelVal = document.getElementById("rnd-vel-val") as HTMLSpanElement;
const rndBtn = document.getElementById("btn-random") as HTMLButtonElement;
const applyManualBtn = document.getElementById("btn-apply-manual") as HTMLButtonElement;
const appTitle = document.getElementById("app-title") as HTMLHeadingElement;
const appSubtitle = document.getElementById("app-subtitle") as HTMLDivElement;
const speedLabel = document.getElementById("speed-label") as HTMLSpanElement;
const rndPosLabel = document.getElementById("rnd-pos-label") as HTMLSpanElement;
const rndVelLabel = document.getElementById("rnd-vel-label") as HTMLSpanElement;
const tabPresetsBtn = document.getElementById("tab-presets") as HTMLButtonElement;
const tabManualBtn = document.getElementById("tab-manual") as HTMLButtonElement;
const tabRandomBtn = document.getElementById("tab-random") as HTMLButtonElement;
const randomHint = document.getElementById("random-hint") as HTMLParagraphElement;
const langSwitcherEl = document.getElementById("lang-switcher") as HTMLSpanElement;

// ----- Set initial document lang attribute -----
document.documentElement.lang = getLang();

// ----- Init simulation with default preset (Figure-8) -----
const defaultPreset = PRESETS[0];
const sim = new Simulation(defaultPreset.bodies);
const renderer = new CanvasRenderer(canvas);
renderer.fitTo(sim);

const manual = new ManualControls(document.getElementById("manual-controls") as HTMLElement);
manual.setBodies(sim.state.bodies);

const info = new InfoPanel(document.getElementById("info-panel") as HTMLElement);
const presetMenu = new PresetMenu(
  document.getElementById("preset-list") as HTMLElement,
  (preset) => loadPreset(preset),
);

new LanguageSwitcher(langSwitcherEl);

presetMenu.select(defaultPreset.id);
info.renderPreset(defaultPreset);

// ----- State -----
let running = false;
type StatusKind =
  | { kind: "preset"; preset: Preset }
  | { kind: "manual" }
  | { kind: "random" }
  | { kind: "none" };
let statusKind: StatusKind = { kind: "preset", preset: defaultPreset };

// ----- Apply translations to static-ish elements -----
function applyStaticTranslations(): void {
  document.title = t().appTitle;
  appTitle.textContent = t().appTitle;
  appSubtitle.textContent = t().appSubtitle;
  resetBtn.textContent = t().reset;
  stepBtn.textContent = t().step;
  clearTrailsBtn.textContent = t().clearTrails;
  speedLabel.textContent = t().speed;
  tabPresetsBtn.textContent = t().tabPresets;
  tabManualBtn.textContent = t().tabManual;
  tabRandomBtn.textContent = t().tabRandom;
  randomHint.textContent = t().randomHint;
  rndPosLabel.textContent = t().randomPositionRange;
  rndVelLabel.textContent = t().randomVelocityRange;
  rndBtn.textContent = t().generate;
  applyManualBtn.textContent = t().applyManual;
  updatePlayButtonLabel();
}

function updatePlayButtonLabel(): void {
  playBtn.textContent = running ? t().pause : t().play;
}

// ----- Functions -----
function loadPreset(preset: Preset): void {
  sim.loadBodies(preset.bodies);
  renderer.fitTo(sim);
  manual.setBodies(sim.state.bodies);
  statusKind = { kind: "preset", preset };
  info.renderPreset(preset);
  setRunning(false);
}

function setRunning(next: boolean): void {
  running = next;
  updatePlayButtonLabel();
  playBtn.classList.toggle("primary", !running);
}

function tick(): void {
  if (running) sim.step();
  renderer.updateAutoZoom(sim);
  renderer.draw(sim);
  updateStatus();
  requestAnimationFrame(tick);
}

function statusTitleText(): string {
  switch (statusKind.kind) {
    case "preset":
      return statusKind.preset.name[getLang()];
    case "manual":
      return t().manualConfigStatus;
    case "random":
      return t().randomConfigStatus;
    case "none":
      return "";
  }
}

function updateStatus(): void {
  const drift = sim.energyDrift();
  const driftStr = (drift * 100).toFixed(3);
  const titleText = statusTitleText();
  const titleHtml = titleText ? `<strong>${escapeHtml(titleText)}</strong> · ` : "";
  statusEl.innerHTML = `
    ${titleHtml}
    t = ${sim.state.time.toFixed(2)} ·
    ${escapeHtml(t().driftLabel)} = ${driftStr}%
  `;
}

// ----- Event wiring -----
playBtn.addEventListener("click", () => setRunning(!running));

resetBtn.addEventListener("click", () => {
  sim.reset();
  manual.setBodies(sim.state.bodies);
  renderer.fitTo(sim);
  setRunning(false);
});

stepBtn.addEventListener("click", () => {
  if (!running) sim.step();
});

clearTrailsBtn.addEventListener("click", () => sim.clearTrails());

speedInput.addEventListener("input", () => {
  const v = parseFloat(speedInput.value);
  sim.speedMultiplier = v;
  speedVal.textContent = `${v.toFixed(1)}×`;
});

rndPos.addEventListener("input", () => {
  rndPosVal.textContent = parseFloat(rndPos.value).toFixed(1);
});
rndVel.addEventListener("input", () => {
  rndVelVal.textContent = parseFloat(rndVel.value).toFixed(2);
});

rndBtn.addEventListener("click", () => {
  const bodies = randomBodies(parseFloat(rndPos.value), parseFloat(rndVel.value));
  sim.loadBodies(bodies);
  manual.setBodies(sim.state.bodies);
  renderer.fitTo(sim);
  presetMenu.select("");
  statusKind = { kind: "random" };
  info.renderRandom();
  setRunning(false);
});

applyManualBtn.addEventListener("click", () => {
  const bodies = manual.readBodies();
  sim.loadBodies(bodies);
  renderer.fitTo(sim);
  presetMenu.select("");
  statusKind = { kind: "manual" };
  info.renderManual();
  setRunning(false);
});

// ----- Tabs -----
const tabs = document.querySelectorAll<HTMLButtonElement>(".tab");
const panels = document.querySelectorAll<HTMLDivElement>(".tab-panel");
tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((tt) => tt.classList.toggle("active", tt === tab));
    const key = tab.dataset.tab;
    panels.forEach((p) => p.classList.toggle("active", p.dataset.panel === key));
    if (key === "manual") info.renderManual();
    else if (key === "random") info.renderRandom();
    else if (key === "presets") {
      const p = PRESETS.find((x) => x.id === presetMenu.selectedId);
      if (p) info.renderPreset(p);
      else info.renderEmpty();
    }
  });
});

// ----- Resize handling -----
window.addEventListener("resize", () => {
  renderer.resize();
});

// ----- Language change handling -----
onLangChange(() => {
  applyStaticTranslations();
});

// ----- Helpers -----
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ----- Go -----
applyStaticTranslations();
renderer.draw(sim);
updateStatus();
requestAnimationFrame(tick);
