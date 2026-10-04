/* ============================================================ */
/* AQUAQUEST — NAVIGATION                                        */
/* Debug-enabled + guaranteed single-listener                    */
/* ============================================================ */

const NavHistory = {
  stack: ['home'],
  isPoppingInternally: false,
  _listenerAttached: false,

  /* ============================================================ */
  /* PUSH                                                          */
  /* ============================================================ */
  push(pageName, options = {}) {
    if (!pageName) return;

    const top = this.stack[this.stack.length - 1];
    if (top === pageName && !options.force) {
      console.log('[Nav] Push skipped (same page):', pageName);
      return;
    }

    this.stack.push(pageName);
    console.log('[Nav] Pushed:', pageName, '| Stack:', this.stack.join(' → '));

    try {
      history.pushState({ page: pageName }, '', '#' + pageName);
    } catch (e) {}
  },

  /* ============================================================ */
  /* RESET                                                         */
  /* ============================================================ */
  resetToRoot(pageName) {
    this.stack = [pageName];
    console.log('[Nav] Reset to root:', pageName);

    try {
      history.replaceState({ page: pageName }, '', '#' + pageName);
    } catch (e) {}
  },

  /* ============================================================ */
  /* BACK — from in-app back arrow button                          */
  /* ============================================================ */
  back() {
    console.log('[Nav] BACK called | Stack before:', this.stack.join(' → '));

    if (this.stack.length <= 1) {
      console.log('[Nav] At root — asking to exit');
      if (confirm('Exit AquaQuest?')) {
        window.close();
        setTimeout(() => {
          try { history.back(); } catch(e) {}
        }, 100);
      }
      return false;
    }

    /* Remove current page */
    this.stack.pop();

    const previous = this.stack[this.stack.length - 1];
    console.log('[Nav] Navigating back to:', previous, '| Stack now:', this.stack.join(' → '));

    /* Update history WITHOUT triggering popstate */
    try {
      history.replaceState({ page: previous }, '', '#' + previous);
    } catch (e) {}

    /* Set flag to block popstate during this render */
    this.isPoppingInternally = true;

    /* Navigate — skip history push */
    if (typeof window.showPage === 'function') {
      window.showPage(previous, { _skipHistoryPush: true });
    }

    /* Clear flag after render completes */
    setTimeout(() => {
      this.isPoppingInternally = false;
    }, 250);

    return true;
  },

  /* ============================================================ */
  /* CURRENT                                                       */
  /* ============================================================ */
  current() {
    return this.stack[this.stack.length - 1] || 'home';
  },

  /* ============================================================ */
  /* BROWSER BACK HANDLER (hardware back)                          */
  /* ============================================================ */
  handleBrowserBack(e) {
    console.log('[Nav] Browser back fired');

    /* Block if in-app back is running */
    if (this.isPoppingInternally) {
      console.log('[Nav] Blocked (internal pop in progress)');
      return;
    }

    if (this.stack.length <= 1) {
      console.log('[Nav] At root — letting browser exit');
      return;
    }

    this.stack.pop();
    const previous = this.stack[this.stack.length - 1];
    console.log('[Nav] Browser back → going to:', previous, '| Stack:', this.stack.join(' → '));

    this.isPoppingInternally = true;

    if (typeof window.showPage === 'function') {
      window.showPage(previous, { _skipHistoryPush: true });
    }

    try {
      history.replaceState({ page: previous }, '', '#' + previous);
    } catch (err) {}

    setTimeout(() => {
      this.isPoppingInternally = false;
    }, 250);
  },

  /* ============================================================ */
  /* ATTACH LISTENERS (only once)                                  */
  /* ============================================================ */
  attachListeners() {
    if (this._listenerAttached) {
      console.log('[Nav] Listeners already attached — skipping');
      return;
    }

    this._listenerAttached = true;

    window.addEventListener('popstate', (e) => {
      NavHistory.handleBrowserBack(e);
    });

    console.log('[Nav] Popstate listener attached');
  }
};

/* ============================================================ */
/* ATTACH LISTENERS IMMEDIATELY                                  */
/* ============================================================ */
NavHistory.attachListeners();

/* ============================================================ */
/* INITIAL HISTORY STATE                                         */
/* ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  try {
    history.replaceState({ page: 'home' }, '', '#home');
  } catch (e) {}
});

/* ============================================================ */
/* BACK HEADER COMPONENT                                         */
/* ============================================================ */
function renderBackHeader(title, subtitle) {
  return `
    <div class="page-back-header">
      <button class="page-back-btn" onclick="NavHistory.back()" aria-label="Back">
        <i class="fas fa-arrow-left"></i>
      </button>
      <div class="page-back-title-wrap">
        <h2 class="page-back-title">${escapeHtml(title)}</h2>
        ${subtitle ? `<p class="page-back-sub">${escapeHtml(subtitle)}</p>` : ''}
      </div>
    </div>
  `;
}

/* ============================================================ */
/* PATCH showPage — track history automatically                  */
/* ============================================================ */
(function patchShowPage() {
  /* Prevent double-patch */
  if (window.__aq_showPagePatched) {
    console.log('[Nav] showPage already patched');
    return;
  }

  const originalShowPage = window.showPage;

  if (typeof originalShowPage !== 'function') {
    setTimeout(patchShowPage, 100);
    return;
  }

  window.__aq_showPagePatched = true;
  console.log('[Nav] Patching showPage');

  window.showPage = function(pageName, options = {}) {
    /* If skip — just render */
    if (options._skipHistoryPush) {
      console.log('[Nav] showPage (skip push):', pageName);
      originalShowPage(pageName);
      return;
    }

    /* Root tabs → reset stack */
    const rootTabs = ['home', 'map', 'feed', 'profile'];
    if (rootTabs.includes(pageName)) {
      console.log('[Nav] showPage (root tab):', pageName);
      NavHistory.resetToRoot(pageName);
      originalShowPage(pageName);
      return;
    }

    /* Other pages → push */
    console.log('[Nav] showPage (push):', pageName);
    NavHistory.push(pageName, options);
    originalShowPage(pageName);
  };
})();

window.NavHistory = NavHistory;
window.renderBackHeader = renderBackHeader;

console.log('[AquaQuest] Navigation loaded');