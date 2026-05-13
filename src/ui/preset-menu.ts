import { PRESETS, type Preset } from "../presets/historical";

const FAMILY_LABEL: Record<Preset["family"], string> = {
  classical: "Classique",
  suvakov: "Šuvakov-Dmitrašinović",
  chaotic: "Chaotique",
};

export class PresetMenu {
  root: HTMLElement;
  onSelect: (p: Preset) => void;
  selectedId: string | null = null;

  constructor(root: HTMLElement, onSelect: (p: Preset) => void) {
    this.root = root;
    this.onSelect = onSelect;
    this.render();
  }

  private render(): void {
    this.root.innerHTML = "";
    const groups = new Map<Preset["family"], Preset[]>();
    for (const p of PRESETS) {
      const arr = groups.get(p.family) ?? [];
      arr.push(p);
      groups.set(p.family, arr);
    }
    for (const family of ["classical", "suvakov", "chaotic"] as Preset["family"][]) {
      const arr = groups.get(family);
      if (!arr || arr.length === 0) continue;
      const group = document.createElement("div");
      group.className = "preset-group";
      group.innerHTML = `<div class="preset-group-title">${FAMILY_LABEL[family]}</div>`;
      this.root.appendChild(group);

      for (const preset of arr) {
        const btn = document.createElement("button");
        btn.className = "preset-btn";
        btn.dataset.id = preset.id;
        btn.innerHTML = `
          <span class="preset-name">${preset.name}</span>
          <span class="preset-meta">${preset.year} · ${preset.discoverers}</span>
        `;
        btn.addEventListener("click", () => {
          this.select(preset.id);
          this.onSelect(preset);
        });
        group.appendChild(btn);
      }
    }
  }

  select(id: string): void {
    this.selectedId = id;
    for (const btn of this.root.querySelectorAll(".preset-btn")) {
      btn.classList.toggle("active", (btn as HTMLElement).dataset.id === id);
    }
  }
}
