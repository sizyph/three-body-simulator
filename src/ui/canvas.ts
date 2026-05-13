import type { Simulation } from "../physics/simulation";

export const BODY_COLORS = ["#7CD3FF", "#FF8FE3", "#FFE07A"];
export const BODY_LABELS = ["A", "B", "C"];

interface ViewState {
  scale: number; // world units per pixel
  targetScale: number;
}

export class CanvasRenderer {
  ctx: CanvasRenderingContext2D;
  canvas: HTMLCanvasElement;
  dpr: number;
  view: ViewState = { scale: 0.012, targetScale: 0.012 };

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 2D context unavailable");
    this.ctx = ctx;
    this.dpr = window.devicePixelRatio || 1;
    this.resize();
  }

  resize(): void {
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = Math.round(rect.width * this.dpr);
    this.canvas.height = Math.round(rect.height * this.dpr);
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
  }

  // Pick a scale so the largest body position fits with some margin.
  fitTo(sim: Simulation): void {
    let maxR = 1.5;
    for (const b of sim.state.bodies) {
      const r = Math.hypot(b.position.x, b.position.y);
      if (r > maxR) maxR = r;
    }
    const rect = this.canvas.getBoundingClientRect();
    const halfMin = Math.min(rect.width, rect.height) / 2;
    this.view.targetScale = (maxR * 1.25) / halfMin;
    this.view.scale = this.view.targetScale;
  }

  updateAutoZoom(sim: Simulation): void {
    let maxR = 1;
    for (const trail of sim.trails) {
      for (const p of trail) {
        const r = Math.hypot(p.x, p.y);
        if (r > maxR) maxR = r;
      }
    }
    for (const b of sim.state.bodies) {
      const r = Math.hypot(b.position.x, b.position.y);
      if (r > maxR) maxR = r;
    }
    const rect = this.canvas.getBoundingClientRect();
    const halfMin = Math.min(rect.width, rect.height) / 2;
    this.view.targetScale = (maxR * 1.15) / halfMin;
    // Smooth zoom in only (never zoom in tighter automatically when corps revient)
    if (this.view.targetScale > this.view.scale) {
      this.view.scale += (this.view.targetScale - this.view.scale) * 0.04;
    }
  }

  worldToScreen(x: number, y: number, w: number, h: number): [number, number] {
    return [w / 2 + x / this.view.scale, h / 2 - y / this.view.scale];
  }

  draw(sim: Simulation): void {
    const rect = this.canvas.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    const ctx = this.ctx;

    // Background
    ctx.fillStyle = "#0a0c14";
    ctx.fillRect(0, 0, w, h);

    // Subtle grid
    this.drawGrid(w, h);

    // Center marker (center of mass)
    ctx.fillStyle = "rgba(255,255,255,0.18)";
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, 2, 0, Math.PI * 2);
    ctx.fill();

    // Trails
    for (let i = 0; i < sim.trails.length; i++) {
      const trail = sim.trails[i];
      if (trail.length < 2) continue;
      ctx.strokeStyle = BODY_COLORS[i] + "AA";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      const [sx0, sy0] = this.worldToScreen(trail[0].x, trail[0].y, w, h);
      ctx.moveTo(sx0, sy0);
      for (let k = 1; k < trail.length; k++) {
        const [sx, sy] = this.worldToScreen(trail[k].x, trail[k].y, w, h);
        ctx.lineTo(sx, sy);
      }
      ctx.stroke();
    }

    // Bodies
    for (let i = 0; i < sim.state.bodies.length; i++) {
      const b = sim.state.bodies[i];
      const [sx, sy] = this.worldToScreen(b.position.x, b.position.y, w, h);
      const r = 4 + 2.5 * Math.cbrt(b.mass);

      // Halo
      const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, r * 5);
      grad.addColorStop(0, BODY_COLORS[i] + "55");
      grad.addColorStop(1, BODY_COLORS[i] + "00");
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(sx, sy, r * 5, 0, Math.PI * 2);
      ctx.fill();

      // Core
      ctx.fillStyle = BODY_COLORS[i];
      ctx.beginPath();
      ctx.arc(sx, sy, r, 0, Math.PI * 2);
      ctx.fill();

      // Label
      ctx.fillStyle = "#0a0c14";
      ctx.font = "bold 10px ui-sans-serif, system-ui";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(BODY_LABELS[i], sx, sy + 0.5);
    }
  }

  private drawGrid(w: number, h: number): void {
    const ctx = this.ctx;
    ctx.strokeStyle = "rgba(255,255,255,0.04)";
    ctx.lineWidth = 1;
    const step = 50; // pixels
    ctx.beginPath();
    for (let x = (w / 2) % step; x < w; x += step) {
      ctx.moveTo(x + 0.5, 0);
      ctx.lineTo(x + 0.5, h);
    }
    for (let y = (h / 2) % step; y < h; y += step) {
      ctx.moveTo(0, y + 0.5);
      ctx.lineTo(w, y + 0.5);
    }
    ctx.stroke();
  }
}
