# Three-Body Simulator

An interactive web simulator for the famous three-body problem in classical mechanics.
Built with TypeScript and Vite — no UI framework, no physics libraries.

> **Live sandbox:** https://sizyph.github.io/three-body-simulator/

The three-body problem asks how three point masses move under their mutual
gravitational attraction. Although the underlying equations were written down
by Newton in 1687, no closed-form analytical solution exists for arbitrary
initial conditions. Henri Poincaré proved in 1889 that the system is in
general chaotic — a result that founded modern dynamical systems theory and
became one of the cornerstones of chaos theory.

This simulator lets you:

- Run any of **16 historically significant periodic solutions** (Euler 1767,
  Lagrange 1772, Burrau 1913, Chenciner–Montgomery 2000, Šuvakov–Dmitrašinović 2013)
- Configure body masses, positions and velocities **manually**
- Generate **random** configurations to observe the typical chaotic ejection scenario
- Watch trajectories in real-time with persistent trails, auto-zoom, and an
  energy-drift indicator that confirms numerical stability

## Table of contents

- [Demo](#demo)
- [Features](#features)
- [The physics](#the-physics)
  - [Equations of motion](#equations-of-motion)
  - [Numerical integration](#numerical-integration)
  - [Conserved quantities](#conserved-quantities)
- [Historical cases](#historical-cases)
- [Architecture](#architecture)
- [Installation](#installation)
- [Development](#development)
- [Build & deploy](#build--deploy)
- [Browser support](#browser-support)
- [References](#references)
- [License](#license)

## Demo

A public sandbox is automatically deployed to GitHub Pages on every push to
`main`:

**https://sizyph.github.io/three-body-simulator/**

No installation required — just open the URL and explore.

## Features

- **Velocity-Verlet integrator** — symplectic, energy-conserving over long runs
- **16 historical periodic orbits** with initial conditions from the literature,
  grouped by family (Classical, Šuvakov–Dmitrašinović, Chaotic)
- **Manual configuration panel** — set mass, position (x, y) and velocity (vx, vy)
  for each of the three bodies independently
- **Random generator** with adjustable position and velocity ranges; the
  center-of-mass velocity is automatically subtracted so the system does not
  drift off-screen
- **Real-time canvas rendering** with persistent trails (up to 4000 points per body),
  glowing halos, and adaptive auto-zoom
- **Playback controls** — play/pause, single-step, reset, clear trails, and a
  speed slider (0.1×–5×)
- **Energy-drift readout** — instantaneous relative drift of total mechanical
  energy compared to the initial value; for symplectic Verlet on a periodic
  orbit, this typically stays below 10⁻³ %
- **Historical context panel** — for each preset, a description of the
  discoverer, the year, the orbital period (when known), and a paragraph of
  historical background
- **Responsive layout** that switches from side-by-side to stacked on narrow viewports
- **Three-language interface** — English (default), French, Japanese. Click the
  flag next to the title to switch. The selection is persisted in
  `localStorage` and the browser language is used as a fallback hint on first
  visit. Every preset name, summary and historical paragraph is translated to
  all three languages.

## The physics

### Equations of motion

Three point masses *m₁*, *m₂*, *m₃* with positions **r**ᵢ ∈ ℝ² interact through
Newton's universal gravitation. The acceleration of body *i* is:

```
        N
aᵢ = G  Σ   mⱼ (rⱼ - rᵢ) / |rⱼ - rᵢ|³
       j≠i
```

The simulator works in **normalized units** with `G = 1` and unit masses (except
for the Pythagorean case, which uses 3-4-5 masses). This is the standard
convention in the celestial mechanics literature.

A small **softening parameter** ε² = 10⁻⁶ is added to the squared distance to
prevent numerical singularities during close encounters:

```
|rⱼ - rᵢ|² → |rⱼ - rᵢ|² + ε²
```

For the periodic orbits considered here, close encounters are either avoided
entirely (Lagrange, Figure-8) or pass at a finite minimum distance, so the
softening has negligible effect on the dynamics.

### Numerical integration

The simulator uses the **velocity-Verlet** scheme:

```
rᵢ(t + Δt) = rᵢ(t) + vᵢ(t) Δt + ½ aᵢ(t) Δt²
vᵢ(t + Δt) = vᵢ(t) + ½ (aᵢ(t) + aᵢ(t + Δt)) Δt
```

Velocity-Verlet is **symplectic**, meaning it exactly preserves a discretized
analogue of phase-space volume. In practice this means total energy oscillates
around the true value rather than drifting monotonically, which is essential
for long-time integration of conservative systems. Non-symplectic schemes such
as RK4 are more accurate per step but drift secularly, and they would slowly
destroy the periodic orbits we want to display.

Default step size is `dt = 0.002` with 4 substeps per animation frame, giving
roughly 240 physics steps per second at 60 fps. The user-facing speed slider
multiplies the substep count.

### Conserved quantities

The simulator tracks total mechanical energy:

```
E = ½ Σᵢ mᵢ |vᵢ|² - G Σᵢ<ⱼ (mᵢ mⱼ) / |rⱼ - rᵢ|
```

The relative drift `(E(t) - E(0)) / |E(0)|` is shown in the status overlay.
For the bundled periodic orbits it remains below `10⁻³ %` over many periods.

The center of mass is translated to the origin and the bulk momentum is
subtracted at load time so the visible motion stays centered.

## Historical cases

### Classical solutions

| Case | Year | Discoverer | Notes |
|------|------|------------|-------|
| **Collinear (Euler)** | 1767 | Leonhard Euler | First exact solution — three masses on a rotating line. Unstable to transverse perturbations. |
| **Equilateral (Lagrange)** | 1772 | Joseph-Louis Lagrange | Equilateral-triangle rotation. Powers the Lagrange points L4/L5 in restricted three-body systems (Jovian Trojans). |
| **Figure-eight** | 2000 | Moore (1993, numerical), Chenciner & Montgomery (proof) | Three equal masses chasing each other along the same figure-eight curve. The first non-trivial new periodic solution in over 200 years. |

### Šuvakov–Dmitrašinović 2013 gallery

Equal-mass, zero-momentum, zero-angular-momentum periodic orbits discovered in
2013 by Milovan Šuvakov and Veljko Dmitrašinović. All use the canonical
isosceles initial configuration:

- body 1 at (−1, 0), velocity (*p₁*, *p₂*)
- body 2 at (+1, 0), velocity (*p₁*, *p₂*)
- body 3 at ( 0, 0), velocity (−2 *p₁*, −2 *p₂*)

| Case | (p₁, p₂) | Period T |
|------|----------|---------:|
| Butterfly I    | (0.30689, 0.12551)   | 6.2356 |
| Butterfly II   | (0.39295, 0.09758)   | 7.0039 |
| Butterfly III  | (0.40592, 0.23016)   | 13.8658 |
| Butterfly IV   | (0.350112, 0.07932)  | 79.4759 |
| Bumblebee      | (0.18428, 0.58719)   | 63.5345 |
| Moth I         | (0.46444, 0.39606)   | 14.8939 |
| Moth II        | (0.43917, 0.45297)   | 28.6703 |
| Moth III       | (0.38344, 0.37736)   | 25.8406 |
| Goggles        | (0.08330, 0.12789)   | 10.4668 |
| Yin-Yang I     | (0.51394, 0.30474)   | 17.3284 |
| Dragonfly      | (0.080584, 0.588836) | 21.2710 |
| Yarn           | (0.55906, 0.34919)   | 55.5018 |

### Chaotic

| Case | Year | Notes |
|------|------|-------|
| **Pythagorean (Burrau)** | 1913 | Masses 3, 4, 5 at the vertices of a 3-4-5 right triangle, released from rest. A canonical example of bounded chaos terminated by ejection. Burrau's hand calculations were inaccurate; the dynamics were only resolved numerically by Szebehely and Peters in 1967. |

## Architecture

```
src/
├── main.ts                    # Entry point — wires UI to simulation
├── style.css                  # Theme, layout, components
├── physics/
│   ├── types.ts               # Vec2, Body, State, G constant
│   ├── integrator.ts          # Velocity-Verlet, energy, COM
│   └── simulation.ts          # Simulation class, trails, reset
├── presets/
│   └── historical.ts          # 16 presets with initial conditions and history
└── ui/
    ├── canvas.ts              # CanvasRenderer — bodies, trails, grid, auto-zoom
    ├── controls.ts            # Manual sliders and random generator
    ├── preset-menu.ts         # Grouped preset list
    └── info-panel.ts          # Historical context renderer
```

The codebase is **zero-dependency** at runtime: only Vite and TypeScript are
required for development, and the production bundle contains nothing but the
hand-written code.

### Key types

```ts
type Vec2 = { x: number; y: number };

interface Body {
  mass: number;
  position: Vec2;
  velocity: Vec2;
}

interface State {
  bodies: Body[];
  time: number;
}
```

### Simulation API

```ts
const sim = new Simulation(bodies, { dt: 0.002, substeps: 4 });

sim.step();              // advance one frame (substeps × dt × speedMultiplier)
sim.reset();             // restore initial conditions
sim.loadBodies(bodies);  // replace bodies, save as new initial state
sim.clearTrails();
sim.energyDrift();       // relative drift since t=0
```

## Installation

### Prerequisites

- **Node.js** ≥ 18 (tested on 20)
- **npm** ≥ 9

### Clone and install

```bash
git clone https://github.com/Sizyph/three-body-simulator.git
cd three-body-simulator
npm install
```

## Development

```bash
npm run dev
```

Opens a Vite development server on http://localhost:5173 with hot-module
reloading. Edit any source file and the browser updates without losing
simulation state.

### Type-check only

```bash
npx tsc --noEmit
```

The project uses TypeScript strict mode with `noUnusedLocals` and
`noUnusedParameters` enabled.

## Build & deploy

### Production build

```bash
npm run build
```

Outputs a static bundle to `dist/`. The Vite config sets
`base: "/three-body-simulator/"` for production builds so the site works when
served under GitHub Pages at `https://sizyph.github.io/three-body-simulator/`.

### Local preview of production build

```bash
npm run preview
```

Serves the contents of `dist/` on http://localhost:4173.

### Automatic deployment

A GitHub Actions workflow (`.github/workflows/deploy.yml`) builds and
publishes the site to GitHub Pages on every push to `main`. No manual steps
needed once the workflow has run successfully once.

To enable Pages on a fresh fork, go to **Settings → Pages → Build and
deployment → Source** and select **GitHub Actions**.

## Browser support

Modern evergreen browsers (Chrome, Firefox, Safari, Edge) with support for:

- ES2022 modules
- Canvas 2D
- `structuredClone()`

Mobile browsers work but the layout collapses to a vertical stack below 900 px
width.

## References

- L. Euler, *De motu rectilineo trium corporum se mutuo attrahentium*, Novi
  Comm. Acad. Sci. Petrop. **11** (1767).
- J.-L. Lagrange, *Essai sur le problème des trois corps*, Œuvres **6**
  (1772).
- C. Burrau, "Numerische Berechnung eines Spezialfalles des Dreikörper­
  problems", *Astronomische Nachrichten* **195** (1913).
- H. Poincaré, *Les Méthodes Nouvelles de la Mécanique Céleste*,
  Gauthier-Villars (1892–1899).
- V. Szebehely and C. F. Peters, "Complete solution of a general problem of
  three bodies", *Astron. J.* **72** (1967).
- C. Moore, "Braids in classical dynamics", *Phys. Rev. Lett.* **70** (1993).
- A. Chenciner and R. Montgomery, "A remarkable periodic solution of the
  three-body problem in the case of equal masses", *Annals of Math.* **152**
  (2000).
- M. Šuvakov and V. Dmitrašinović, "Three classes of Newtonian three-body
  planar periodic orbits", *Phys. Rev. Lett.* **110**, 114301 (2013).
- L. Verlet, "Computer experiments on classical fluids. I. Thermodynamical
  properties of Lennard-Jones molecules", *Phys. Rev.* **159** (1967).

## License

MIT
