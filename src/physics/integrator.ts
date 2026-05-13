import { G, type Body, type State, type Vec2, vec } from "./types";

// Softening prevents singularities when bodies get extremely close.
const SOFTENING2 = 1e-6;

function accelerations(bodies: Body[]): Vec2[] {
  const n = bodies.length;
  const acc: Vec2[] = bodies.map(() => vec.zero());
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const dx = bodies[j].position.x - bodies[i].position.x;
      const dy = bodies[j].position.y - bodies[i].position.y;
      const r2 = dx * dx + dy * dy + SOFTENING2;
      const invR3 = 1 / (r2 * Math.sqrt(r2));
      const fx = G * dx * invR3;
      const fy = G * dy * invR3;
      acc[i].x += fx * bodies[j].mass;
      acc[i].y += fy * bodies[j].mass;
      acc[j].x -= fx * bodies[i].mass;
      acc[j].y -= fy * bodies[i].mass;
    }
  }
  return acc;
}

// Velocity-Verlet integration. Symplectic, conserves energy well over long runs —
// crucial here because the system is chaotic and a non-symplectic scheme drifts.
export function stepVerlet(state: State, dt: number): void {
  const bodies = state.bodies;
  const a0 = accelerations(bodies);

  for (let i = 0; i < bodies.length; i++) {
    bodies[i].position.x += bodies[i].velocity.x * dt + 0.5 * a0[i].x * dt * dt;
    bodies[i].position.y += bodies[i].velocity.y * dt + 0.5 * a0[i].y * dt * dt;
  }

  const a1 = accelerations(bodies);

  for (let i = 0; i < bodies.length; i++) {
    bodies[i].velocity.x += 0.5 * (a0[i].x + a1[i].x) * dt;
    bodies[i].velocity.y += 0.5 * (a0[i].y + a1[i].y) * dt;
  }

  state.time += dt;
}

export function totalEnergy(state: State): number {
  let ke = 0;
  let pe = 0;
  const b = state.bodies;
  for (let i = 0; i < b.length; i++) {
    ke += 0.5 * b[i].mass * vec.norm2(b[i].velocity);
    for (let j = i + 1; j < b.length; j++) {
      const r = vec.norm(vec.sub(b[i].position, b[j].position));
      pe -= (G * b[i].mass * b[j].mass) / Math.max(r, Math.sqrt(SOFTENING2));
    }
  }
  return ke + pe;
}

export function centerOfMass(bodies: Body[]): Vec2 {
  let m = 0;
  const c = vec.zero();
  for (const b of bodies) {
    c.x += b.mass * b.position.x;
    c.y += b.mass * b.position.y;
    m += b.mass;
  }
  return { x: c.x / m, y: c.y / m };
}

export function centerOfMassVelocity(bodies: Body[]): Vec2 {
  let m = 0;
  const c = vec.zero();
  for (const b of bodies) {
    c.x += b.mass * b.velocity.x;
    c.y += b.mass * b.velocity.y;
    m += b.mass;
  }
  return { x: c.x / m, y: c.y / m };
}

// Shift to center-of-mass frame so motion stays centered on screen.
export function recenter(state: State): void {
  const com = centerOfMass(state.bodies);
  const cov = centerOfMassVelocity(state.bodies);
  for (const b of state.bodies) {
    b.position.x -= com.x;
    b.position.y -= com.y;
    b.velocity.x -= cov.x;
    b.velocity.y -= cov.y;
  }
}
