import { recenter, stepVerlet, totalEnergy } from "./integrator";
import type { Body, State } from "./types";
import { cloneState } from "./types";

export class Simulation {
  state: State;
  initial: State;
  dt: number = 0.002;
  substeps: number = 4;
  speedMultiplier: number = 1;
  trails: Array<Array<{ x: number; y: number }>> = [];
  maxTrailLength = 4000;
  initialEnergy: number;

  constructor(bodies: Body[], opts?: { dt?: number; substeps?: number }) {
    this.state = { time: 0, bodies: bodies.map((b) => structuredClone(b)) };
    recenter(this.state);
    this.initial = cloneState(this.state);
    this.trails = this.state.bodies.map((b) => [{ ...b.position }]);
    this.initialEnergy = totalEnergy(this.state);
    if (opts?.dt !== undefined) this.dt = opts.dt;
    if (opts?.substeps !== undefined) this.substeps = opts.substeps;
  }

  reset(): void {
    this.state = cloneState(this.initial);
    this.trails = this.state.bodies.map((b) => [{ ...b.position }]);
    this.initialEnergy = totalEnergy(this.state);
  }

  loadBodies(bodies: Body[]): void {
    this.state = { time: 0, bodies: bodies.map((b) => structuredClone(b)) };
    recenter(this.state);
    this.initial = cloneState(this.state);
    this.trails = this.state.bodies.map((b) => [{ ...b.position }]);
    this.initialEnergy = totalEnergy(this.state);
  }

  step(): void {
    const stepsThisFrame = Math.max(1, Math.round(this.substeps * this.speedMultiplier));
    for (let k = 0; k < stepsThisFrame; k++) {
      stepVerlet(this.state, this.dt);
    }
    for (let i = 0; i < this.state.bodies.length; i++) {
      const trail = this.trails[i];
      const p = this.state.bodies[i].position;
      const last = trail[trail.length - 1];
      // Skip pushing if barely moved (keeps trail data sane)
      const dx = p.x - last.x;
      const dy = p.y - last.y;
      if (dx * dx + dy * dy > 1e-6) {
        trail.push({ x: p.x, y: p.y });
        if (trail.length > this.maxTrailLength) {
          trail.splice(0, trail.length - this.maxTrailLength);
        }
      }
    }
  }

  clearTrails(): void {
    this.trails = this.state.bodies.map((b) => [{ ...b.position }]);
  }

  energyDrift(): number {
    if (this.initialEnergy === 0) return 0;
    return (totalEnergy(this.state) - this.initialEnergy) / Math.abs(this.initialEnergy);
  }
}
