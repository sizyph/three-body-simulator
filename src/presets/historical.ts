import type { Body } from "../physics/types";
import type { Lang } from "../i18n";

export interface Preset {
  id: string;
  year: number;
  discoverers: string;
  family: "classical" | "suvakov" | "chaotic";
  period?: number;
  bodies: Body[];
  name: Record<Lang, string>;
  summary: Record<Lang, string>;
  history: Record<Lang, string>;
}

// Šuvakov-Dmitrašinović canonical isosceles configuration:
//   body1 at (-1, 0) with velocity (p1, p2)
//   body2 at (+1, 0) with velocity (p1, p2)
//   body3 at ( 0, 0) with velocity (-2 p1, -2 p2)
// Equal unit masses, G = 1. Total momentum and angular momentum vanish.
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
    year: 2000,
    discoverers: "Moore (1993), Chenciner & Montgomery",
    family: "classical",
    period: 6.3259,
    bodies: [
      { mass: 1, position: { x: -0.97000436, y: 0.24308753 }, velocity: { x: 0.46620368, y: 0.43236573 } },
      { mass: 1, position: { x: 0.97000436, y: -0.24308753 }, velocity: { x: 0.46620368, y: 0.43236573 } },
      { mass: 1, position: { x: 0, y: 0 }, velocity: { x: -0.93240737, y: -0.86473146 } },
    ],
    name: {
      en: "Figure-eight",
      fr: "Figure-en-huit",
      ja: "八の字",
    },
    summary: {
      en: "Three equal masses chase each other along the same figure-eight curve.",
      fr: "Trois masses égales se poursuivent le long d'une même courbe en 8.",
      ja: "等質量3天体が同じ八の字曲線を追いかけ合います。",
    },
    history: {
      en: "Discovered numerically by Cris Moore in 1993, then mathematically proved by Alain Chenciner and Richard Montgomery in 2000. This is the first non-trivial periodic solution of the three-body problem found since Lagrange — a striking comeback for variational analysis. The three bodies trace exactly the same figure-eight curve and cross at regular intervals. It is stable under small perturbations, which makes it particularly remarkable.",
      fr: "Découverte numériquement par Cris Moore en 1993, puis démontrée mathématiquement par Alain Chenciner et Richard Montgomery en 2000. C'est la première solution périodique du problème à trois corps non triviale découverte depuis Lagrange — un retour spectaculaire de l'analyse variationnelle. Les trois corps tracent exactement la même courbe en huit et se croisent à intervalles réguliers. Stable face à des petites perturbations, ce qui la rend particulièrement remarquable.",
      ja: "1993年にクリス・ムーアが数値的に発見し、2000年にアラン・シャンシナーとリチャード・モンゴメリーによって数学的に証明されました。ラグランジュ以来初めて発見された非自明な三体問題の周期解であり、変分解析の劇的な復活を示しました。3つの天体は同じ八の字曲線を辿り、一定間隔で交差します。小さな摂動に対して安定であることが、この解を特に注目すべきものにしています。",
    },
  },
  {
    id: "euler",
    year: 1767,
    discoverers: "Leonhard Euler",
    family: "classical",
    bodies: [
      { mass: 1, position: { x: -1, y: 0 }, velocity: { x: 0, y: -Math.sqrt(5 / 4) } },
      { mass: 1, position: { x: 0, y: 0 }, velocity: { x: 0, y: 0 } },
      { mass: 1, position: { x: 1, y: 0 }, velocity: { x: 0, y: Math.sqrt(5 / 4) } },
    ],
    name: {
      en: "Euler's collinear solution",
      fr: "Solution colinéaire d'Euler",
      ja: "オイラーの直線解",
    },
    summary: {
      en: "Three collinear bodies rotating about the central one.",
      fr: "Trois corps alignés en rotation autour du corps central.",
      ja: "中央の天体まわりを回転する一直線上の3天体。",
    },
    history: {
      en: "Euler found in 1767 the first exact solution to the three-body problem: three masses lined up, remaining collinear as they rotate around their center of mass. For equal masses the central body stays still while the other two describe circles. The solution is unstable: any transverse perturbation makes the system diverge. Euler did not publish the result during his lifetime — it appeared in the posthumous Memoirs of the Saint Petersburg Academy.",
      fr: "Euler trouve en 1767 la première solution exacte du problème à trois corps : trois masses alignées qui restent alignées en tournant autour de leur centre de masse. Pour des masses égales, le corps central reste immobile pendant que les deux autres décrivent des cercles. Cette solution est instable : la moindre perturbation transverse fait diverger le système. Euler ne publie pas ce résultat de son vivant — il apparaît dans les Mémoires posthumes de l'Académie de Saint-Pétersbourg.",
      ja: "オイラーは1767年に三体問題の最初の厳密解を発見しました：3つの質量が一直線上に並び、重心まわりを回転しながらその配置を保つというものです。質量が等しい場合、中央の天体は静止し、両端の2つが円運動を描きます。この解は不安定で、垂直方向のわずかな摂動でも系は破綻します。オイラー自身は生前にこの結果を発表せず、サンクトペテルブルク科学アカデミーの遺稿集に登場しました。",
    },
  },
  {
    id: "lagrange",
    year: 1772,
    discoverers: "Joseph-Louis Lagrange",
    family: "classical",
    bodies: (() => {
      const v = Math.pow(3, -0.25);
      return [
        { mass: 1, position: { x: 1, y: 0 }, velocity: { x: 0, y: v } },
        { mass: 1, position: { x: -0.5, y: Math.sqrt(3) / 2 }, velocity: { x: (-v * Math.sqrt(3)) / 2, y: -v / 2 } },
        { mass: 1, position: { x: -0.5, y: -Math.sqrt(3) / 2 }, velocity: { x: (v * Math.sqrt(3)) / 2, y: -v / 2 } },
      ];
    })(),
    name: {
      en: "Lagrange's equilateral",
      fr: "Triangle équilatéral de Lagrange",
      ja: "ラグランジュの正三角形解",
    },
    summary: {
      en: "Three bodies at the vertices of a rotating equilateral triangle.",
      fr: "Trois corps aux sommets d'un triangle équilatéral en rotation.",
      ja: "正三角形の頂点に位置し、回転する3天体。",
    },
    history: {
      en: "In 1772 Lagrange won the Paris Academy of Sciences prize for his memoir 'Essai sur le problème des trois corps'. He proved that three bodies placed at the vertices of an equilateral triangle, with appropriate velocities, keep their shape while rotating around the center of mass. This solution has major practical significance: the Sun-Jupiter L4 and L5 points host the Trojan asteroids, and missions such as JWST (L2) or SOHO (L1) exploit the collinear Euler points.",
      fr: "En 1772, Lagrange remporte le prix de l'Académie des sciences pour son mémoire « Essai sur le problème des trois corps ». Il y démontre que trois corps placés aux sommets d'un triangle équilatéral, animés des vitesses appropriées, conservent leur configuration en tournant autour du centre de masse. Cette solution a une portée pratique majeure : les points de Lagrange L4 et L5 du système Soleil-Jupiter abritent les astéroïdes Troyens, et les missions JWST (L2) ou SOHO (L1) exploitent les points colinéaires d'Euler.",
      ja: "1772年、ラグランジュは論文「三体問題に関する試論」によりパリ科学アカデミーの懸賞を受賞しました。彼は、適切な速度を与えれば、正三角形の頂点に配置された3つの天体が形を保ったまま重心まわりに回転することを証明しました。この解は実用的にも極めて重要です：太陽-木星のL4・L5ラグランジュ点にはトロヤ群小惑星が存在し、JWST（L2）やSOHO（L1）といった探査機はオイラーの直線解の点を利用しています。",
    },
  },
  {
    id: "pythagorean",
    year: 1913,
    discoverers: "Carl Burrau",
    family: "chaotic",
    bodies: [
      { mass: 3, position: { x: 1, y: 3 }, velocity: { x: 0, y: 0 } },
      { mass: 4, position: { x: -2, y: -1 }, velocity: { x: 0, y: 0 } },
      { mass: 5, position: { x: 1, y: -1 }, velocity: { x: 0, y: 0 } },
    ],
    name: {
      en: "Pythagorean problem",
      fr: "Problème pythagoricien",
      ja: "ピタゴラス問題",
    },
    summary: {
      en: "Masses 3, 4, 5 at the vertices of a 3-4-5 triangle, released at rest.",
      fr: "Masses 3, 4, 5 aux sommets d'un triangle 3-4-5, lâchées au repos.",
      ja: "質量3, 4, 5を3-4-5三角形の頂点に配置し、静止から解放。",
    },
    history: {
      en: "In 1913 Carl Burrau posed this troubling configuration: three integer masses at the vertices of a right-angled Pythagorean triangle, each placed opposite the side whose length equals its mass. Released from rest, they begin a complex dance for almost 60 time units before a close encounter ejects one of them. Burrau's hand-calculations turned out to be inaccurate; only Szebehely and Peters's 1967 numerical computations revealed the true dynamics. Often cited as the paradigmatic example of deterministic chaos in the three-body problem.",
      fr: "Carl Burrau pose en 1913 cette configuration troublante : trois masses entières aux sommets d'un triangle rectangle pythagoricien, chacune située face au côté de longueur égale à sa masse. Lâchées sans vitesse, elles entament une danse complexe pendant presque 60 unités de temps avant qu'une rencontre rapprochée n'éjecte l'un des corps. Le calcul à la main d'Burrau s'est avéré inexact ; il faudra attendre les calculs numériques de Szebehely et Peters en 1967 pour révéler la dynamique réelle. Souvent cité comme exemple paradigmatique du chaos déterministe à trois corps.",
      ja: "1913年、カール・ブラオはこの不穏な配置を提案しました：直角三角形（ピタゴラスの3-4-5）の各頂点に整数質量を配置し、それぞれの天体は自身の質量と等しい長さの辺の対面に置かれます。静止状態から解放すると、約60時間単位にわたって複雑な舞踏を続けた後、近接遭遇により1天体が放出されます。ブラオの手計算は不正確で、シェベヘリとピーターズの1967年の数値計算により真の動力学が解明されました。三体問題における決定論的カオスの典型例としてしばしば引用されます。",
    },
  },
  {
    id: "butterfly-i",
    year: 2013,
    discoverers: "Šuvakov & Dmitrašinović",
    family: "suvakov",
    period: 6.2356,
    bodies: suvakov(0.30689, 0.12551),
    name: { en: "Butterfly I", fr: "Papillon I", ja: "バタフライ I" },
    summary: {
      en: "Butterfly-wing orbit, libration class.",
      fr: "Orbite en forme d'ailes de papillon, classe libration.",
      ja: "蝶の羽形の軌道、振動クラス。",
    },
    history: {
      en: "In 2013, Serbian physicists Milovan Šuvakov and Veljko Dmitrašinović published 13 new families of periodic orbits for the equal-mass three-body problem, named after their geometric shape. Butterfly I is one of the simplest — the common trajectory traces symmetric wings. Before their discovery only three families were known (Euler, Lagrange, Figure-8). Their method: systematic numerical exploration guided by the topology of trajectories.",
      fr: "En 2013, les physiciens serbes Milovan Šuvakov et Veljko Dmitrašinović publient 13 nouvelles familles d'orbites périodiques pour le problème à trois corps de masses égales, baptisées d'après leur forme géométrique. Le Papillon I est l'un des plus simples — la trajectoire commune dessine des ailes symétriques. Avant leur découverte, seulement trois familles étaient connues (Euler, Lagrange, Figure-8). Leur méthode : exploration numérique systématique guidée par la topologie des trajectoires.",
      ja: "2013年、セルビアの物理学者ミロヴァン・シュヴァコフとヴェリコ・ドミトラシノヴィッチは、等質量三体問題の新しい周期軌道族13個を発表し、その幾何学的形状にちなんで名付けました。バタフライIはその中で最も単純なもので、共通軌道が対称な翼を描きます。彼らの発見以前は、3つの族（オイラー、ラグランジュ、八の字）しか知られていませんでした。手法：軌道のトポロジーに基づく系統的な数値探索。",
    },
  },
  {
    id: "butterfly-ii",
    year: 2013,
    discoverers: "Šuvakov & Dmitrašinović",
    family: "suvakov",
    period: 7.0039,
    bodies: suvakov(0.39295, 0.09758),
    name: { en: "Butterfly II", fr: "Papillon II", ja: "バタフライ II" },
    summary: {
      en: "Butterfly variant, libration class.",
      fr: "Variation du Papillon, classe libration.",
      ja: "バタフライの変種、振動クラス。",
    },
    history: {
      en: "Second member of the Butterfly family. Butterflies form a 'libration' class — trajectories oscillate without net circulation around a point. Each family member is parameterized by a different pair of initial momenta.",
      fr: "Deuxième membre de la famille Papillon. Les Papillons forment une classe « libration » — les trajectoires oscillent sans circulation nette autour d'un point. Chaque membre de la famille est paramétré par un couple de moments initiaux différent.",
      ja: "バタフライ族の第2メンバー。バタフライ族は「振動」クラスに属し、ある点のまわりに正味の循環を伴わずに軌道が振動します。族の各メンバーは初期運動量の組によって特徴付けられます。",
    },
  },
  {
    id: "butterfly-iii",
    year: 2013,
    discoverers: "Šuvakov & Dmitrašinović",
    family: "suvakov",
    period: 13.8658,
    bodies: suvakov(0.40592, 0.23016),
    name: { en: "Butterfly III", fr: "Papillon III", ja: "バタフライ III" },
    summary: {
      en: "More complex shape, longer period.",
      fr: "Forme plus complexe à période plus longue.",
      ja: "より複雑な形状、長い周期。",
    },
    history: {
      en: "Third Butterfly, period roughly twice as long as I. The number of self-intersections of the curve over one period grows with the index — Šuvakov and Dmitrašinović organize their gallery according to braid words on the shape sphere.",
      fr: "Troisième Papillon, période doublement plus longue que I. Le nombre d'auto-intersections de la courbe sur une période croît avec l'indice — Šuvakov et Dmitrašinović organisent leur galerie selon des mots tressés dans le plan des sphères.",
      ja: "3つ目のバタフライ。周期はIの約2倍。1周期あたりの自己交差数は番号とともに増加し、シュヴァコフとドミトラシノヴィッチは形状の位相球面における組紐語によってギャラリーを整理しました。",
    },
  },
  {
    id: "butterfly-iv",
    year: 2013,
    discoverers: "Šuvakov & Dmitrašinović",
    family: "suvakov",
    period: 79.4759,
    bodies: suvakov(0.350112, 0.07932),
    name: { en: "Butterfly IV", fr: "Papillon IV", ja: "バタフライ IV" },
    summary: {
      en: "Very long-period butterfly, rich geometry.",
      fr: "Papillon de très longue période, géométrie riche.",
      ja: "非常に長周期のバタフライ、豊かな幾何学。",
    },
    history: {
      en: "Fourth Butterfly. Its exceptionally long period (~80 units) makes it one of the most impressive to visualize: the curve winds many times before closing back exactly on itself.",
      fr: "Quatrième Papillon. Sa période exceptionnellement longue (~80 unités) en fait l'une des plus impressionnantes à visualiser : la courbe s'enroule de nombreuses fois avant de se refermer exactement sur elle-même.",
      ja: "4つ目のバタフライ。その異常に長い周期（約80単位）は、視覚的に最も印象的なものの一つです：曲線は何度も巻きながら、完全に自分自身に閉じます。",
    },
  },
  {
    id: "bumblebee",
    year: 2013,
    discoverers: "Šuvakov & Dmitrašinović",
    family: "suvakov",
    period: 63.5345,
    bodies: suvakov(0.18428, 0.58719),
    name: { en: "Bumblebee", fr: "Bourdon (Bumblebee)", ja: "バンブルビー (Bumblebee)" },
    summary: {
      en: "Buzzing trajectory, very long period.",
      fr: "Trajectoire bourdonnante, période très longue.",
      ja: "羽音のような複雑な軌道、非常に長い周期。",
    },
    history: {
      en: "The Bumblebee owes its name to its busy, tightly buzzing trajectory. It is one of the most exotic orbits in the Šuvakov family — its very long period lets the three bodies weave a pattern that looks random yet closes perfectly.",
      fr: "Le Bourdon doit son nom à la forme bourdonnée et serrée de sa trajectoire. C'est l'une des orbites les plus exotiques de la famille Šuvakov — sa très longue période permet aux trois corps de tisser un motif d'apparence aléatoire qui pourtant se referme parfaitement.",
      ja: "バンブルビー（マルハナバチ）はその密に羽音を立てるような軌道形状からこの名がつきました。シュヴァコフ族の中で最もエキゾチックな軌道の一つで、非常に長い周期が3天体に一見ランダムな模様を織らせながら、完璧に閉じる軌道を実現します。",
    },
  },
  {
    id: "moth-i",
    year: 2013,
    discoverers: "Šuvakov & Dmitrašinović",
    family: "suvakov",
    period: 14.8939,
    bodies: suvakov(0.46444, 0.39606),
    name: { en: "Moth I", fr: "Mite I (Moth I)", ja: "モス I (Moth I)" },
    summary: {
      en: "Moth-wing shape, libration class.",
      fr: "Forme d'ailes de mite, classe libration.",
      ja: "蛾の翼の形、振動クラス。",
    },
    history: {
      en: "First Moth. Like the Butterflies, these orbits belong to the libration class but their topological signature (braid) differs, giving more rounded and fragmented wing shapes.",
      fr: "Première de la famille « Mite ». Tout comme les Papillons, ces orbites appartiennent à la classe libration mais leur signature topologique (tresse) diffère, donnant des formes d'ailes plus arrondies et fragmentées.",
      ja: "モス（蛾）族の第1メンバー。バタフライと同様に振動クラスに属しますが、トポロジー的シグネチャ（組紐）が異なり、より丸く断片化した翼形状を生みます。",
    },
  },
  {
    id: "moth-ii",
    year: 2013,
    discoverers: "Šuvakov & Dmitrašinović",
    family: "suvakov",
    period: 28.6703,
    bodies: suvakov(0.43917, 0.45297),
    name: { en: "Moth II", fr: "Mite II (Moth II)", ja: "モス II (Moth II)" },
    summary: {
      en: "Moth with roughly doubled period.",
      fr: "Mite à deux fois la période.",
      ja: "周期がおよそ2倍のモス。",
    },
    history: {
      en: "Moth II — its period is about twice as long. Visually: overlapping wings, more self-intersections.",
      fr: "La Mite II est la suivante dans la famille — sa période est environ deux fois plus longue. Aspect visuel : ailes superposées, plus d'auto-intersections.",
      ja: "モスII。族の次のメンバーで、周期は約2倍。視覚的には：翼が重なり合い、自己交差が増えます。",
    },
  },
  {
    id: "moth-iii",
    year: 2013,
    discoverers: "Šuvakov & Dmitrašinović",
    family: "suvakov",
    period: 25.8406,
    bodies: suvakov(0.38344, 0.37736),
    name: { en: "Moth III", fr: "Mite III (Moth III)", ja: "モス III (Moth III)" },
    summary: {
      en: "Third Moth variant.",
      fr: "Troisième variante des Mites.",
      ja: "3つ目のモスの変種。",
    },
    history: {
      en: "Moth III completes the triad. The Moth family illustrates how small variations in initial conditions can produce topologically distinct orbits — all periodic, but with different 'braids'.",
      fr: "Mite III complète la triade. La famille Mite illustre comment de petites variations des conditions initiales peuvent produire des orbites topologiquement distinctes — toutes périodiques, mais avec des « tresses » différentes.",
      ja: "モスIIIは三部作を完成させます。モス族は、初期条件の小さな変化がトポロジー的に異なる軌道を生み出し得ることを示します — すべて周期的でありながら、異なる「組紐」を持っています。",
    },
  },
  {
    id: "goggles",
    year: 2013,
    discoverers: "Šuvakov & Dmitrašinović",
    family: "suvakov",
    period: 10.4668,
    bodies: suvakov(0.0833, 0.12789),
    name: { en: "Goggles", fr: "Lunettes (Goggles)", ja: "ゴーグル (Goggles)" },
    summary: {
      en: "Two goggles-like loops, libration class.",
      fr: "Deux boucles type lunettes, classe libration.",
      ja: "眼鏡のような2つのループ、振動クラス。",
    },
    history: {
      en: "The Goggles owe their name to the two loops formed by the common trajectory of the three bodies, evoking the lenses of a pair of goggles. It is one of the shortest-period orbits in the Šuvakov family.",
      fr: "Les Lunettes tirent leur nom des deux boucles qui forment la trajectoire commune des trois corps, évoquant les verres d'une paire de lunettes. C'est l'une des orbites de plus courte période parmi la famille Šuvakov.",
      ja: "ゴーグル（眼鏡）はその名を、3天体の共通軌道が描く2つのループに由来し、眼鏡のレンズを連想させます。シュヴァコフ族の中で最も短周期の軌道の一つです。",
    },
  },
  {
    id: "yin-yang-i",
    year: 2013,
    discoverers: "Šuvakov & Dmitrašinović",
    family: "suvakov",
    period: 17.3284,
    bodies: suvakov(0.51394, 0.30474),
    name: { en: "Yin-Yang I", fr: "Yin-Yang I", ja: "陰陽 I (Yin-Yang I)" },
    summary: {
      en: "Taoist symbol shape, circulation class.",
      fr: "Forme du symbole taoïste, classe circulation.",
      ja: "太極図の形状、循環クラス。",
    },
    history: {
      en: "The Yin-Yang belongs to the 'circulation' class: the common trajectory consists of two lobes traversed in a loop, evoking the Taoist symbol. It is one of the three fundamental topological classes identified by Šuvakov and Dmitrašinović.",
      fr: "Le Yin-Yang appartient à la classe « circulation » : la trajectoire commune comporte deux lobes parcourus en boucle, évoquant le symbole taoïste. C'est l'une des trois classes topologiques fondamentales identifiées par Šuvakov et Dmitrašinović.",
      ja: "陰陽は「循環」クラスに属します：共通軌道が2つのローブをループ状に辿り、道教の太極図を想起させます。シュヴァコフとドミトラシノヴィッチが特定した3つの基本トポロジークラスの一つです。",
    },
  },
  {
    id: "dragonfly",
    year: 2013,
    discoverers: "Šuvakov & Dmitrašinović",
    family: "suvakov",
    period: 21.271,
    bodies: suvakov(0.080584, 0.588836),
    name: { en: "Dragonfly", fr: "Libellule (Dragonfly)", ja: "ドラゴンフライ (Dragonfly)" },
    summary: {
      en: "Four slender wings, libration class.",
      fr: "Quatre ailes fines, classe libration.",
      ja: "4枚の細い翼、振動クラス。",
    },
    history: {
      en: "The Dragonfly displays four slender, symmetric wings. Its discovery is part of the same 2013 publication that dramatically expanded our catalog of periodic orbits for this 300-year-old problem.",
      fr: "La Libellule possède quatre ailes fines symétriques. Sa découverte fait partie de la même publication de 2013 qui a élargi spectaculairement notre catalogue d'orbites périodiques pour ce problème vieux de 300 ans.",
      ja: "ドラゴンフライ（トンボ）は4枚の細い対称な翼を持ちます。その発見は、300年の歴史を持つこの問題の周期軌道カタログを劇的に拡張した2013年の同じ論文に含まれています。",
    },
  },
  {
    id: "yarn",
    year: 2013,
    discoverers: "Šuvakov & Dmitrašinović",
    family: "suvakov",
    period: 55.5018,
    bodies: suvakov(0.55906, 0.34919),
    name: { en: "Yarn", fr: "Pelote (Yarn)", ja: "ヤーン (Yarn)" },
    summary: {
      en: "Trajectory tangled like a ball of yarn.",
      fr: "Trajectoire enroulée comme une pelote de fil.",
      ja: "毛糸玉のように絡まった軌道。",
    },
    history: {
      en: "The Yarn has a trajectory that tangles like a ball of wool before closing back on itself. Its numerical discovery required fine exploration of the initial conditions, testifying to the problem's extreme sensitivity: a 10⁻³ change in initial velocities destroys periodicity.",
      fr: "La Pelote (Yarn) a une trajectoire qui s'enchevêtre comme un écheveau de laine avant de se refermer. Sa découverte numérique a nécessité une exploration fine des conditions initiales, témoignant de la sensibilité extrême du problème : un changement de 10⁻³ dans les vitesses initiales détruit la périodicité.",
      ja: "ヤーン（毛糸玉）は、毛糸玉のようにもつれた軌道を描き、再び閉じます。その数値的発見には初期条件の精密な探索が必要で、問題の極度の敏感性を証明しています：初期速度の10⁻³の変化で周期性が失われます。",
    },
  },
];

export function getPresetById(id: string): Preset | undefined {
  return PRESETS.find((p) => p.id === id);
}
