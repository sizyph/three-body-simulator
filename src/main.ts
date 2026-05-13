import "./style.css";
import { Simulation } from "./physics/simulation";
import { CanvasRenderer } from "./ui/canvas";
import { ManualControls, randomBodies } from "./ui/controls";
import { PresetMenu } from "./ui/preset-menu";
import { InfoPanel } from "./ui/info-panel";
import { PRESETS, type Preset } from "./presets/historical";

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

presetMenu.select(defaultPreset.id);
info.renderPreset(defaultPreset);

// ----- State -----
let running = false;
let currentPresetName: string | null = defaultPreset.name;

// ----- Functions -----
function loadPreset(preset: Preset): void {
  sim.loadBodies(preset.bodies);
  renderer.fitTo(sim);
  manual.setBodies(sim.state.bodies);
  currentPresetName = preset.name;
  info.renderPreset(preset);
  updatePlayState(false);
}

function setRunning(next: boolean): void {
  running = next;
  playBtn.textContent = running ? "⏸ Pause" : "▶︎ Lancer";
  playBtn.classList.toggle("primary", !running);
}

function updatePlayState(next: boolean): void {
  setRunning(next);
}

function tick(): void {
  if (running) sim.step();
  renderer.updateAutoZoom(sim);
  renderer.draw(sim);
  updateStatus();
  requestAnimationFrame(tick);
}

function updateStatus(): void {
  const drift = sim.energyDrift();
  const driftStr = (drift * 100).toFixed(3);
  const title = currentPresetName ? `<strong>${escapeHtml(currentPresetName)}</strong> · ` : "";
  statusEl.innerHTML = `
    ${title}
    t = ${sim.state.time.toFixed(2)} ·
    dérive E = ${driftStr}%
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
  presetMenu.select(""); // no preset highlighted
  currentPresetName = "Tirage aléatoire";
  info.renderRandom();
  setRunning(false);
});

applyManualBtn.addEventListener("click", () => {
  const bodies = manual.readBodies();
  sim.loadBodies(bodies);
  renderer.fitTo(sim);
  presetMenu.select("");
  currentPresetName = "Configuration manuelle";
  info.renderManual();
  setRunning(false);
});

// ----- Tabs -----
const tabs = document.querySelectorAll<HTMLButtonElement>(".tab");
const panels = document.querySelectorAll<HTMLDivElement>(".tab-panel");
tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((t) => t.classList.toggle("active", t === tab));
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

// ----- Helpers -----
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

// ----- Go -----
renderer.draw(sim);
updateStatus();
requestAnimationFrame(tick);
