import type { Body } from "../physics/types";

export interface Preset {
  id: string;
  name: string;
  year: number;
  discoverers: string;
  family: "classical" | "suvakov" | "chaotic";
  period?: number; // Period in normalized time units, if known
  bodies: Body[];
  summary: string; // One-line description
  history: string; // Longer historical context (HTML-safe text)
}

// Šuvakov-Dmitrašinović 2013 use a canonical isoceles initial configuration:
//   body1 at (-1, 0) with velocity (p1, p2)
//   body2 at (+1, 0) with velocity (p1, p2)
//   body3 at ( 0, 0) with velocity (-2p1, -2p2)
// All masses equal to 1, G = 1. Total momentum and angular momentum vanish.
function suvakov(p1: number, p2: number): Body[] {
  return [
    { mass: 1, position: { x: -1, y: 0 }, velocity: { x: p1, y: p2 } },
    { mass: 1, position: { x: 1, y: 0 }, velocity: { x: p1, y: p2 } },
    { mass: 1, position: { x: 0, y: 0 }, velocity: { x: -2 * p1, y: -2 * p2 } },
  ];
}

export const PRESETS: Preset[] = [
  {
    id: "figure-eight",
    name: "Figure-en-huit",
    year: 2000,
    discoverers: "Moore (1993), Chenciner & Montgomery",
    family: "classical",
    period: 6.3259,
    bodies: [
      {
        mass: 1,
        position: { x: -0.97000436, y: 0.24308753 },
        velocity: { x: 0.46620368, y: 0.43236573 },
      },
      {
        mass: 1,
        position: { x: 0.97000436, y: -0.24308753 },
        velocity: { x: 0.46620368, y: 0.43236573 },
      },
      {
        mass: 1,
        position: { x: 0, y: 0 },
        velocity: { x: -0.93240737, y: -0.86473146 },
      },
    ],
    summary: "Trois masses égales se poursuivent le long d'une même courbe en 8.",
    history:
      "Découverte numériquement par Cris Moore en 1993, puis démontrée mathématiquement par Alain Chenciner et Richard Montgomery en 2000. C'est la première solution périodique du problème à trois corps non triviale découverte depuis Lagrange — un retour spectaculaire de l'analyse variationnelle. Les trois corps tracent exactement la même courbe en huit et se croisent à intervalles réguliers. Stable face à des petites perturbations, ce qui la rend particulièrement remarquable.",
  },
  {
    id: "euler",
    name: "Solution colinéaire d'Euler",
    year: 1767,
    discoverers: "Leonhard Euler",
    family: "classical",
    bodies: [
      {
        mass: 1,
        position: { x: -1, y: 0 },
        velocity: { x: 0, y: -Math.sqrt(5 / 4) },
      },
      { mass: 1, position: { x: 0, y: 0 }, velocity: { x: 0, y: 0 } },
      {
        mass: 1,
        position: { x: 1, y: 0 },
        velocity: { x: 0, y: Math.sqrt(5 / 4) },
      },
    ],
    summary: "Trois corps alignés en rotation autour du corps central.",
    history:
      "Euler trouve en 1767 la première solution exacte du problème à trois corps : trois masses alignées qui restent alignées en tournant autour de leur centre de masse. Pour des masses égales, le corps central reste immobile pendant que les deux autres décrivent des cercles. Cette solution est instable : la moindre perturbation transverse fait diverger le système. Euler ne publie pas ce résultat de son vivant — il apparaît dans les Mémoires posthumes de l'Académie de Saint-Pétersbourg.",
  },
  {
    id: "lagrange",
    name: "Triangle équilatéral de Lagrange",
    year: 1772,
    discoverers: "Joseph-Louis Lagrange",
    family: "classical",
    bodies: (() => {
      const v = Math.pow(3, -0.25); // ≈ 0.7598
      return [
        { mass: 1, position: { x: 1, y: 0 }, velocity: { x: 0, y: v } },
        {
          mass: 1,
          position: { x: -0.5, y: Math.sqrt(3) / 2 },
          velocity: { x: (-v * Math.sqrt(3)) / 2, y: -v / 2 },
        },
        {
          mass: 1,
          position: { x: -0.5, y: -Math.sqrt(3) / 2 },
          velocity: { x: (v * Math.sqrt(3)) / 2, y: -v / 2 },
        },
      ];
    })(),
    summary: "Trois corps aux sommets d'un triangle équilatéral en rotation.",
    history:
      "En 1772, Lagrange remporte le prix de l'Académie des sciences pour son mémoire « Essai sur le problème des trois corps ». Il y démontre que trois corps placés aux sommets d'un triangle équilatéral, animés des vitesses appropriées, conservent leur configuration en tournant autour du centre de masse. Cette solution a une portée pratique majeure : les points de Lagrange L4 et L5 du système Soleil-Jupiter abritent les astéroïdes Troyens, et les missions JWST (L2) ou SOHO (L1) exploitent les points colinéaires d'Euler.",
  },
  {
    id: "pythagorean",
    name: "Problème pythagoricien",
    year: 1913,
    discoverers: "Carl Burrau",
    family: "chaotic",
    bodies: [
      { mass: 3, position: { x: 1, y: 3 }, velocity: { x: 0, y: 0 } },
      { mass: 4, position: { x: -2, y: -1 }, velocity: { x: 0, y: 0 } },
      { mass: 5, position: { x: 1, y: -1 }, velocity: { x: 0, y: 0 } },
    ],
    summary: "Masses 3, 4, 5 aux sommets d'un triangle 3-4-5, lâchées au repos.",
    history:
      "Carl Burrau pose en 1913 cette configuration troublante : trois masses entières aux sommets d'un triangle rectangle pythagoricien, chacune située face au côté de longueur égale à sa masse. Lâchées sans vitesse, elles entament une danse complexe pendant presque 60 unités de temps avant qu'une rencontre rapprochée n'éjecte l'un des corps. Le calcul à la main d'Burrau s'est avéré inexact ; il faudra attendre les calculs numériques de Szebehely et Peters en 1967 pour révéler la dynamique réelle. Souvent cité comme exemple paradigmatique du chaos déterministe à trois corps.",
  },
  {
    id: "butterfly-i",
    name: "Papillon I",
    year: 2013,
    discoverers: "Šuvakov & Dmitrašinović",
    family: "suvakov",
    period: 6.2356,
    bodies: suvakov(0.30689, 0.12551),
    summary: "Orbite en forme d'ailes de papillon, classe libration.",
    history:
      "En 2013, les physiciens serbes Milovan Šuvakov et Veljko Dmitrašinović publient 13 nouvelles familles d'orbites périodiques pour le problème à trois corps de masses égales, baptisées d'après leur forme géométrique. Le Papillon I est l'un des plus simples — la trajectoire commune dessine des ailes symétriques. Avant leur découverte, seulement trois familles étaient connues (Euler, Lagrange, Figure-8). Leur méthode : exploration numérique systématique guidée par la topologie des trajectoires.",
  },
  {
    id: "butterfly-ii",
    name: "Papillon II",
    year: 2013,
    discoverers: "Šuvakov & Dmitrašinović",
    family: "suvakov",
    period: 7.0039,
    bodies: suvakov(0.39295, 0.09758),
    summary: "Variation du Papillon, classe libration.",
    history:
      "Deuxième membre de la famille Papillon. Les Papillons forment une classe « libration » — les trajectoires oscillent sans circulation nette autour d'un point. Chaque membre de la famille est paramétré par un couple de moments initiaux différent.",
  },
  {
    id: "butterfly-iii",
    name: "Papillon III",
    year: 2013,
    discoverers: "Šuvakov & Dmitrašinović",
    family: "suvakov",
    period: 13.8658,
    bodies: suvakov(0.40592, 0.23016),
    summary: "Forme plus complexe à période plus longue.",
    history:
      "Troisième Papillon, période doublement plus longue que I. Le nombre d'auto-intersections de la courbe sur une période croît avec l'indice — Šuvakov et Dmitrašinović organisent leur galerie selon des mots tressés dans le plan des sphères.",
  },
  {
    id: "butterfly-iv",
    name: "Papillon IV",
    year: 2013,
    discoverers: "Šuvakov & Dmitrašinović",
    family: "suvakov",
    period: 79.4759,
    bodies: suvakov(0.350112, 0.07932),
    summary: "Papillon de très longue période, géométrie riche.",
    history:
      "Quatrième Papillon. Sa période exceptionnellement longue (~80 unités) en fait l'une des plus impressionnantes à visualiser : la courbe s'enroule de nombreuses fois avant de se refermer exactement sur elle-même.",
  },
  {
    id: "bumblebee",
    name: "Bourdon (Bumblebee)",
    year: 2013,
    discoverers: "Šuvakov & Dmitrašinović",
    family: "suvakov",
    period: 63.5345,
    bodies: suvakov(0.18428, 0.58719),
    summary: "Trajectoire bourdonnante, period très longue.",
    history:
      "Le Bourdon doit son nom à la forme bourdonnée et serrée de sa trajectoire. C'est l'une des orbites les plus exotiques de la famille Šuvakov — sa très longue période permet aux trois corps de tisser un motif d'apparence aléatoire qui pourtant se referme parfaitement.",
  },
  {
    id: "moth-i",
    name: "Mite I (Moth I)",
    year: 2013,
    discoverers: "Šuvakov & Dmitrašinović",
    family: "suvakov",
    period: 14.8939,
    bodies: suvakov(0.46444, 0.39606),
    summary: "Forme d'ailes de mite, classe libration.",
    history:
      "Première de la famille « Mite ». Tout comme les Papillons, ces orbites appartiennent à la classe libration mais leur signature topologique (tresse) diffère, donnant des formes d'ailes plus arrondies et fragmentées.",
  },
  {
    id: "moth-ii",
    name: "Mite II (Moth II)",
    year: 2013,
    discoverers: "Šuvakov & Dmitrašinović",
    family: "suvakov",
    period: 28.6703,
    bodies: suvakov(0.43917, 0.45297),
    summary: "Mite à deux fois la période.",
    history:
      "La Mite II est la suivante dans la famille — sa période est environ deux fois plus longue. Aspect visuel : ailes superposées, plus d'auto-intersections.",
  },
  {
    id: "moth-iii",
    name: "Mite III (Moth III)",
    year: 2013,
    discoverers: "Šuvakov & Dmitrašinović",
    family: "suvakov",
    period: 25.8406,
    bodies: suvakov(0.38344, 0.37736),
    summary: "Troisième variante des Mites.",
    history:
      "Mite III complète la triade. La famille Mite illustre comment de petites variations des conditions initiales peuvent produire des orbites topologiquement distinctes — toutes périodiques, mais avec des « tresses » différentes.",
  },
  {
    id: "goggles",
    name: "Lunettes (Goggles)",
    year: 2013,
    discoverers: "Šuvakov & Dmitrašinović",
    family: "suvakov",
    period: 10.4668,
    bodies: suvakov(0.08330, 0.12789),
    summary: "Deux boucles type lunettes, classe libration.",
    history:
      "Les Lunettes tirent leur nom des deux boucles qui forment la trajectoire commune des trois corps, évoquant les verres d'une paire de lunettes. C'est l'une des orbites de plus courte période parmi la famille Šuvakov.",
  },
  {
    id: "yin-yang-i",
    name: "Yin-Yang I",
    year: 2013,
    discoverers: "Šuvakov & Dmitrašinović",
    family: "suvakov",
    period: 17.3284,
    bodies: suvakov(0.51394, 0.30474),
    summary: "Forme du symbole taoïste, classe circulation.",
    history:
      "Le Yin-Yang appartient à la classe « circulation » : la trajectoire commune comporte deux lobes parcourus en boucle, évoquant le symbole taoïste. C'est l'une des trois classes topologiques fondamentales identifiées par Šuvakov et Dmitrašinović.",
  },
  {
    id: "dragonfly",
    name: "Libellule (Dragonfly)",
    year: 2013,
    discoverers: "Šuvakov & Dmitrašinović",
    family: "suvakov",
    period: 21.2710,
    bodies: suvakov(0.080584, 0.588836),
    summary: "Quatre ailes fines, classe libration.",
    history:
      "La Libellule possède quatre ailes fines symétriques. Sa découverte fait partie de la même publication de 2013 qui a élargi spectaculairement notre catalogue d'orbites périodiques pour ce problème vieux de 300 ans.",
  },
  {
    id: "yarn",
    name: "Pelote (Yarn)",
    year: 2013,
    discoverers: "Šuvakov & Dmitrašinović",
    family: "suvakov",
    period: 55.5018,
    bodies: suvakov(0.55906, 0.34919),
    summary: "Trajectoire enroulée comme une pelote de fil.",
    history:
      "La Pelote (Yarn) a une trajectoire qui s'enchevêtre comme un écheveau de laine avant de se refermer. Sa découverte numérique a nécessité une exploration fine des conditions initiales, témoignant de la sensibilité extrême du problème : un changement de 10⁻³ dans les vitesses initiales détruit la périodicité.",
  },
];

export function getPresetById(id: string): Preset | undefined {
  return PRESETS.find((p) => p.id === id);
}
