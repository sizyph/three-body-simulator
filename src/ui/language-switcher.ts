import { LANGS, LANG_INFO, getLang, setLang, onLangChange, t } from "../i18n";

export class LanguageSwitcher {
  root: HTMLElement;
  current!: HTMLButtonElement;
  dropdown!: HTMLDivElement;
  open = false;

  constructor(root: HTMLElement) {
    this.root = root;
    this.render();
    this.attachOutsideClick();
    onLangChange(() => this.syncCurrent());
  }

  private render(): void {
    this.root.innerHTML = "";
    this.root.classList.add("lang-switcher");

    this.current = document.createElement("button");
    this.current.type = "button";
    this.current.className = "lang-current";
    this.current.addEventListener("click", (e) => {
      e.stopPropagation();
      this.toggle();
    });
    this.root.appendChild(this.current);

    this.dropdown = document.createElement("div");
    this.dropdown.className = "lang-dropdown hidden";
    for (const lang of LANGS) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.dataset.lang = lang;
      btn.innerHTML = `<span class="lang-flag">${LANG_INFO[lang].flag}</span> ${LANG_INFO[lang].name}`;
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        setLang(lang);
        this.close();
      });
      this.dropdown.appendChild(btn);
    }
    this.root.appendChild(this.dropdown);

    this.syncCurrent();
  }

  private syncCurrent(): void {
    const lang = getLang();
    this.current.innerHTML = `<span class="lang-flag">${LANG_INFO[lang].flag}</span>`;
    this.current.title = t().switchLanguageTooltip;
    this.current.setAttribute("aria-label", t().switchLanguageTooltip);
    for (const btn of this.dropdown.querySelectorAll<HTMLButtonElement>("button")) {
      btn.classList.toggle("active", btn.dataset.lang === lang);
    }
  }

  private toggle(): void {
    this.open = !this.open;
    this.dropdown.classList.toggle("hidden", !this.open);
  }

  private close(): void {
    this.open = false;
    this.dropdown.classList.add("hidden");
  }

  private attachOutsideClick(): void {
    document.addEventListener("click", () => this.close());
  }
}
