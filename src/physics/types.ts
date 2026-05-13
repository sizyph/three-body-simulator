export type Vec2 = { x: number; y: number };

export interface Body {
  mass: number;
  position: Vec2;
  velocity: Vec2;
}

export interface State {
  bodies: Body[];
  time: number;
}

export const G = 1; // Newton's constant in normalized units

export const vec = {
  zero: (): Vec2 => ({ x: 0, y: 0 }),
  clone: (v: Vec2): Vec2 => ({ x: v.x, y: v.y }),
  add: (a: Vec2, b: Vec2): Vec2 => ({ x: a.x + b.x, y: a.y + b.y }),
  sub: (a: Vec2, b: Vec2): Vec2 => ({ x: a.x - b.x, y: a.y - b.y }),
  scale: (v: Vec2, s: number): Vec2 => ({ x: v.x * s, y: v.y * s }),
  norm2: (v: Vec2): number => v.x * v.x + v.y * v.y,
  norm: (v: Vec2): number => Math.sqrt(v.x * v.x + v.y * v.y),
};

export function cloneState(s: State): State {
  return {
    time: s.time,
    bodies: s.bodies.map((b) => ({
      mass: b.mass,
      position: vec.clone(b.position),
      velocity: vec.clone(b.velocity),
    })),
  };
}
