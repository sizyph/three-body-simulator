import type { Body } from "../physics/types";
import { BODY_COLORS, BODY_LABELS } from "./canvas";

interface ManualField {
  mass: HTMLInputElement;
  px: HTMLInputElement;
  py: HTMLInputElement;
  vx: HTMLInputElement;
  vy: HTMLInputElement;
}

export class ManualControls {
  fields: ManualField[] = [];
  root: HTMLElement;

  constructor(root: HTMLElement) {
    this.root = root;
    this.render();
  }

  private render(): void {
    this.root.innerHTML = "";
    for (let i = 0; i < 3; i++) {
      const card = document.createElement("div");
      card.className = "body-card";
      card.style.borderLeftColor = BODY_COLORS[i];
      card.innerHTML = `
        <div class="body-card-head">
          <span class="dot" style="background:${BODY_COLORS[i]}"></span>
          Corps ${BODY_LABELS[i]}
        </div>
        <div class="grid">
          <label>Masse <input type="number" step="0.1" value="1" data-k="mass"></label>
          <label>x <input type="number" step="0.01" value="0" data-k="px"></label>
          <label>y <input type="number" step="0.01" value="0" data-k="py"></label>
          <label>vx <input type="number" step="0.01" value="0" data-k="vx"></label>
          <label>vy <input type="number" step="0.01" value="0" data-k="vy"></label>
        </div>
      `;
      this.root.appendChild(card);
      const get = (k: string) =>
        card.querySelector(`[data-k="${k}"]`) as HTMLInputElement;
      this.fields.push({
        mass: get("mass"),
        px: get("px"),
        py: get("py"),
        vx: get("vx"),
        vy: get("vy"),
      });
    }
  }

  setBodies(bodies: Body[]): void {
    for (let i = 0; i < 3; i++) {
      const f = this.fields[i];
      const b = bodies[i];
      f.mass.value = String(round(b.mass));
      f.px.value = String(round(b.position.x));
      f.py.value = String(round(b.position.y));
      f.vx.value = String(round(b.velocity.x));
      f.vy.value = String(round(b.velocity.y));
    }
  }

  readBodies(): Body[] {
    return this.fields.map((f) => ({
      mass: Math.max(0.001, parseFloat(f.mass.value) || 1),
      position: { x: parseFloat(f.px.value) || 0, y: parseFloat(f.py.value) || 0 },
      velocity: { x: parseFloat(f.vx.value) || 0, y: parseFloat(f.vy.value) || 0 },
    }));
  }
}

function round(x: number, digits = 4): number {
  const f = Math.pow(10, digits);
  return Math.round(x * f) / f;
}

export function randomBodies(posRange: number, velRange: number): Body[] {
  const r = () => (Math.random() * 2 - 1);
  const bodies: Body[] = [];
  for (let i = 0; i < 3; i++) {
    bodies.push({
      mass: 0.5 + Math.random() * 1.5,
      position: { x: r() * posRange, y: r() * posRange },
      velocity: { x: r() * velRange, y: r() * velRange },
    });
  }
  // Subtract COM velocity so the system doesn't drift off-screen.
  let totM = 0;
  let vx = 0;
  let vy = 0;
  for (const b of bodies) {
    totM += b.mass;
    vx += b.mass * b.velocity.x;
    vy += b.mass * b.velocity.y;
  }
  for (const b of bodies) {
    b.velocity.x -= vx / totM;
    b.velocity.y -= vy / totM;
  }
  return bodies;
}
