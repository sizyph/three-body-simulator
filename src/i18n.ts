export type Lang = "en" | "fr" | "ja";

export const LANGS: Lang[] = ["en", "fr", "ja"];

export const LANG_INFO: Record<Lang, { flag: string; name: string }> = {
  en: { flag: "🇬🇧", name: "English" },
  fr: { flag: "🇫🇷", name: "Français" },
  ja: { flag: "🇯🇵", name: "日本語" },
};

export interface UIStrings {
  appTitle: string;
  appSubtitle: string;
  play: string;
  pause: string;
  reset: string;
  step: string;
  clearTrails: string;
  speed: string;
  tabPresets: string;
  tabManual: string;
  tabRandom: string;
  bodyLabel: string;
  mass: string;
  applyManual: string;
  randomPositionRange: string;
  randomVelocityRange: string;
  randomHint: string;
  generate: string;
  driftLabel: string;
  defaultTitle: string;
  defaultIntro: string;
  defaultPoincare: string;
  defaultCta: string;
  historyHeading: string;
  yearLabel: string;
  periodLabel: string;
  familyLabel: string;
  familyClassical: string;
  familySuvakov: string;
  familyChaotic: string;
  manualTitle: string;
  manualP1: string;
  manualP2: string;
  randomTitle: string;
  randomP1: string;
  randomP2: string;
  manualConfigStatus: string;
  randomConfigStatus: string;
  switchLanguageTooltip: string;
}

const dict: Record<Lang, UIStrings> = {
  en: {
    appTitle: "Three-Body Problem",
    appSubtitle: "Simulator — Newton, Verlet integrator",
    play: "▶︎ Run",
    pause: "⏸ Pause",
    reset: "↺ Reset",
    step: "→ Step",
    clearTrails: "∅ Clear trails",
    speed: "Speed",
    tabPresets: "Historical cases",
    tabManual: "Manual",
    tabRandom: "Random",
    bodyLabel: "Body",
    mass: "Mass",
    applyManual: "Apply",
    randomPositionRange: "Position range",
    randomVelocityRange: "Velocity range",
    randomHint:
      "Generates 3 bodies with random positions and velocities (center of mass at rest). Most configurations are chaotic — typically one body gets ejected.",
    generate: "Generate",
    driftLabel: "energy drift",
    defaultTitle: "About",
    defaultIntro:
      "The <strong>three-body problem</strong> consists in determining the motion of three point masses subject only to their mutual gravitational attraction.",
    defaultPoincare:
      "In 1889, <strong>Henri Poincaré</strong> proved that no general analytical solution exists — the system is <em>chaotic</em>. This result founded modern dynamical systems theory.",
    defaultCta: "Pick a historical case to explore a remarkable solution.",
    historyHeading: "Historical context",
    yearLabel: "Year",
    periodLabel: "Period",
    familyLabel: "Family",
    familyClassical: "Classical",
    familySuvakov: "Šuvakov-Dmitrašinović",
    familyChaotic: "Chaotic",
    manualTitle: "Manual configuration",
    manualP1:
      "Freely choose masses, positions and velocities. Tip: to prevent the system from drifting off-screen, keep the total momentum close to zero (the sum of <code>m·v</code> should be zero).",
    manualP2:
      "Almost every configuration is chaotic. Only very particular families produce periodic orbits.",
    randomTitle: "Random draw",
    randomP1:
      "Positions and velocities are drawn uniformly within the chosen ranges. The center of mass is then brought to rest.",
    randomP2:
      "You will almost always observe the typical scenario: two bodies form a binary, the third is ejected to infinity. This is the so-called <em>hierarchical evolution</em>, predicted theoretically and confirmed by large-scale simulations.",
    manualConfigStatus: "Manual configuration",
    randomConfigStatus: "Random draw",
    switchLanguageTooltip: "Change language",
  },
  fr: {
    appTitle: "Problème à trois corps",
    appSubtitle: "Simulateur — Newton, intégrateur Verlet",
    play: "▶︎ Lancer",
    pause: "⏸ Pause",
    reset: "↺ Réinitialiser",
    step: "→ Pas",
    clearTrails: "∅ Effacer traces",
    speed: "Vitesse",
    tabPresets: "Cas historiques",
    tabManual: "Manuel",
    tabRandom: "Aléatoire",
    bodyLabel: "Corps",
    mass: "Masse",
    applyManual: "Appliquer",
    randomPositionRange: "Plage de position",
    randomVelocityRange: "Plage de vitesse",
    randomHint:
      "Génère 3 corps avec positions et vitesses aléatoires (centre de masse au repos). La plupart des configurations sont chaotiques — un corps finit en général éjecté.",
    generate: "Générer",
    driftLabel: "dérive E",
    defaultTitle: "À propos",
    defaultIntro:
      "Le <strong>problème à trois corps</strong> consiste à déterminer le mouvement de trois masses ponctuelles soumises uniquement à leur attraction gravitationnelle mutuelle.",
    defaultPoincare:
      "En 1889, <strong>Henri Poincaré</strong> démontre qu'il n'existe pas de solution analytique générale — le système est <em>chaotique</em>. Ce résultat fonde la théorie des systèmes dynamiques modernes.",
    defaultCta: "Choisis un cas historique pour explorer une solution remarquable.",
    historyHeading: "Contexte historique",
    yearLabel: "Année",
    periodLabel: "Période",
    familyLabel: "Famille",
    familyClassical: "Classique",
    familySuvakov: "Šuvakov-Dmitrašinović",
    familyChaotic: "Chaotique",
    manualTitle: "Configuration manuelle",
    manualP1:
      "Choisis librement masses, positions et vitesses. Conseil : pour que le système ne dérive pas hors-écran, garde la quantité de mouvement totale proche de zéro (la somme des <code>m·v</code> doit être nulle).",
    manualP2:
      "La quasi-totalité des configurations sont chaotiques. Seules certaines familles très particulières produisent des orbites périodiques.",
    randomTitle: "Tirage aléatoire",
    randomP1:
      "Les positions et vitesses sont tirées uniformément dans les plages choisies. Le centre de masse est ensuite ramené au repos.",
    randomP2:
      "Tu observeras presque toujours le scénario typique : deux corps forment un système binaire, le troisième est éjecté à l'infini. C'est ce qu'on appelle l'<em>évolution hiérarchique</em>, prédite théoriquement et confirmée par les simulations à grande échelle.",
    manualConfigStatus: "Configuration manuelle",
    randomConfigStatus: "Tirage aléatoire",
    switchLanguageTooltip: "Changer de langue",
  },
  ja: {
    appTitle: "三体問題",
    appSubtitle: "シミュレーター — ニュートン重力、Verlet積分法",
    play: "▶︎ 開始",
    pause: "⏸ 一時停止",
    reset: "↺ リセット",
    step: "→ ステップ",
    clearTrails: "∅ 軌跡を消去",
    speed: "速度",
    tabPresets: "歴史的事例",
    tabManual: "手動",
    tabRandom: "ランダム",
    bodyLabel: "天体",
    mass: "質量",
    applyManual: "適用",
    randomPositionRange: "位置の範囲",
    randomVelocityRange: "速度の範囲",
    randomHint:
      "ランダムな位置と速度で3つの天体を生成します（重心は静止）。ほとんどの配置はカオス的で、通常は1つの天体が無限遠に放出されます。",
    generate: "生成",
    driftLabel: "エネルギー誤差",
    defaultTitle: "概要",
    defaultIntro:
      "<strong>三体問題</strong>とは、相互の重力のみを受ける3つの質点の運動を求める問題です。",
    defaultPoincare:
      "1889年、<strong>アンリ・ポアンカレ</strong>は一般解析解が存在しないことを証明しました。系は<em>カオス的</em>であり、この結果は現代の力学系理論の礎となりました。",
    defaultCta: "歴史的事例を選んで、注目すべき解を探索してください。",
    historyHeading: "歴史的背景",
    yearLabel: "発見年",
    periodLabel: "周期",
    familyLabel: "分類",
    familyClassical: "古典解",
    familySuvakov: "シュヴァコフ・ドミトラシノヴィッチ",
    familyChaotic: "カオス",
    manualTitle: "手動設定",
    manualP1:
      "質量、位置、速度を自由に設定できます。ヒント：系が画面外に逃げないよう、全運動量をゼロ付近に保ってください（<code>m·v</code> の総和がゼロ）。",
    manualP2:
      "ほぼすべての配置はカオス的です。周期軌道を生むのは、ごく特殊な解の族のみです。",
    randomTitle: "ランダム生成",
    randomP1:
      "位置と速度は指定範囲で一様分布から抽出され、その後重心は静止状態に戻されます。",
    randomP2:
      "ほぼ必ず典型的な進化が観察されます：2天体が連星を形成し、3つ目は無限遠へ放出されます。これは<em>階層的進化</em>と呼ばれ、理論的に予測され大規模シミュレーションでも確認されています。",
    manualConfigStatus: "手動設定",
    randomConfigStatus: "ランダム生成",
    switchLanguageTooltip: "言語を切り替え",
  },
};

let currentLang: Lang = detectInitialLang();
const listeners: Array<() => void> = [];

function detectInitialLang(): Lang {
  const stored = localStorage.getItem("lang");
  if (stored === "en" || stored === "fr" || stored === "ja") return stored;
  // Try browser language as fallback hint
  const nav = (navigator.language || "").toLowerCase();
  if (nav.startsWith("fr")) return "fr";
  if (nav.startsWith("ja")) return "ja";
  return "en";
}

export function getLang(): Lang {
  return currentLang;
}

export function setLang(l: Lang): void {
  if (l === currentLang) return;
  currentLang = l;
  localStorage.setItem("lang", l);
  document.documentElement.lang = l;
  for (const fn of listeners) fn();
}

export function onLangChange(fn: () => void): void {
  listeners.push(fn);
}

export function t(): UIStrings {
  return dict[currentLang];
}
