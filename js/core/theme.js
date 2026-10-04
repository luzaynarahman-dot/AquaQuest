/* ============================================================ */
/* AQUAQUEST — THEME MANAGER                                     */
/* Light / Dark mode with persistence                            */
/* ============================================================ */

const Theme = {
  KEY: 'aq_theme',

  init() {
    const saved = localStorage.getItem(this.KEY) || 'light';
    this.apply(saved);

    const toggle = document.getElementById('drawerDarkMode');
    if (toggle) toggle.checked = saved === 'dark';
  },

  apply(mode) {
    if (mode === 'dark') {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem(this.KEY, mode);
    this.updateThemeColor(mode);
  },

  updateThemeColor(mode) {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.content = mode === 'dark' ? '#061E2A' : '#0E3A4C';
    }
  },

  toggle(enabled) {
    this.apply(enabled ? 'dark' : 'light');
  },

  isDark() {
    return document.body.classList.contains('dark-mode');
  }
};

window.Theme = Theme;
window.toggleTheme = (enabled) => Theme.toggle(enabled);
console.log('[AquaQuest] Theme loaded');