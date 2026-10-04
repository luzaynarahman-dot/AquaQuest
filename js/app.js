/* ============================================================ */
/* AQUAQUEST — APP CORE                                          */
/* Global state, Router, Init                                    */
/* Complete · Fresh · Contributions integrated                   */
/* ============================================================ */

/* ============================================================ */
/* 1. GLOBAL STATE                                               */
/* ============================================================ */
const APP = {
  currentPage: 'home',

  user: null,
  token: null,

  /* Water-specific data */
  sites: [],
  observations: [],
  reports: [],
  stories: [],
  actions: [],
  joinedActions: [],
  completedActions: [],
  contributions: [],
  notifications: [],

  activeSiteId: null,

  /* Gamification */
  points: 0,
  level: 'Bronze Guardian',
  badges: [],
  streak: 0,
  lastObserveDate: null,

  /* UI state */
  isDrawerOpen: false,
  theme: 'light',

  /* Storage keys */
  KEYS: {
    TOKEN: 'aq_token',
    USER: 'aq_user',
    THEME: 'aq_theme',
    SITES: 'aq_sites',
    OBSERVATIONS: 'aq_observations',
    REPORTS: 'aq_reports',
    STORIES: 'aq_stories',
    ACTIONS: 'aq_actions',
    JOINED_ACTIONS: 'aq_joinedActions',
    COMPLETED_ACTIONS: 'aq_completedActions',
    CONTRIBUTIONS: 'aq_contributions',
    NOTIFICATIONS: 'aq_notifications',
    ACTIVE_SITE: 'aq_activeSiteId',
    POINTS: 'aq_points',
    LEVEL: 'aq_level',
    BADGES: 'aq_badges',
    STREAK: 'aq_streak',
    LAST_OBSERVE: 'aq_lastObserveDate',
    SAVED_STORIES: 'aq_saved_stories'
  }
};

/* ============================================================ */
/* 2. ROUTER                                                     */
/* ============================================================ */
function showPage(pageName) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));

  const target = document.getElementById('page-' + pageName);
  if (!target) {
    console.warn('[Router] Page not found:', pageName);
    return;
  }

  target.classList.add('active');
  APP.currentPage = pageName;

  document.body.classList.toggle(
    'flow-active',
    pageName === 'contribution-flow'
  );

  document.querySelectorAll('.bottom-nav .nav-item').forEach(item => {
    item.classList.toggle('active', item.dataset.nav === pageName);
  });

  window.scrollTo(0, 0);

  const nav = document.getElementById('topNav');
  if (nav) nav.classList.remove('nav-hidden');

  updateNavbarIcons(pageName);

  if (typeof closeNavSearch === 'function') closeNavSearch();

  /* Skip skeleton for full-render pages */
  if (pageName === 'user-profile' ||
      pageName === 'site-detail' ||
      pageName === 'challenge-detail' ||
      pageName === 'contribution-flow' ||
      pageName === 'contribution-success') {
    return;
  }

  renderPageContent(pageName);
}

/* ============================================================ */
/* 3. NAVBAR ICON VISIBILITY                                     */
/* ============================================================ */
function updateNavbarIcons(pageName) {
  const searchIcon = document.getElementById('searchIcon');
  if (!searchIcon) return;

  const searchablePages = ['home', 'feed', 'learn', 'map', 'sites'];
  if (searchablePages.includes(pageName)) {
    searchIcon.style.display = 'inline-flex';
  } else {
    searchIcon.style.display = 'none';
  }
}

/* ============================================================ */
/* 4. PAGE RENDER                                                */
/* ============================================================ */
function renderPageContent(pageName) {
  if (typeof showSkeleton === 'function') {
    showSkeleton(pageName);
  }

  let attempts = 0;
  const maxAttempts = 30;

  function attemptRender() {
    attempts++;

    const renderers = {
      home:                typeof renderHome === 'function'               ? renderHome               : null,
      map:                 typeof renderMap === 'function'                ? renderMap                : null,
      sites:               typeof renderSites === 'function'              ? renderSites              : null,
      'site-detail':       typeof renderSiteDetail === 'function'         ? renderSiteDetail         : null,
      observe:             typeof renderObserve === 'function'            ? renderObserve            : null,
      feed:                typeof renderFeed === 'function'               ? renderFeed               : null,
      learn:               typeof renderLearn === 'function'              ? renderLearn              : null,
      saved:               typeof renderSaved === 'function'              ? renderSaved              : null,
      actions:             typeof renderActions === 'function'            ? renderActions            : null,
      'challenge-detail':  typeof renderChallengeDetail === 'function'    ? renderChallengeDetail    : null,
      'contribution-flow': typeof renderContributionFlow === 'function'   ? renderContributionFlow   : null,
      'contribution-success': typeof renderContributionSuccess === 'function' ? renderContributionSuccess : null,
      reports:             typeof renderReports === 'function'            ? renderReports            : null,
      profile:             typeof renderProfile === 'function'            ? renderProfile            : null,
      'user-profile':      (typeof window.ProfileView === 'object' && window.ProfileView && typeof window.ProfileView.render === 'function')
        ? function() { window.ProfileView.render(); }
        : null
    };

    const renderFn = renderers[pageName];

    if (!renderFn && attempts < maxAttempts) {
      setTimeout(attemptRender, 100);
      return;
    }

    if (!renderFn) {
      console.warn('[Router] Renderer never loaded:', pageName);
      showErrorBoundary(pageName);
      return;
    }

    try {
      renderFn();
      const page = document.getElementById('page-' + pageName);
      if (page) {
        page.classList.add('content-loaded');
        setTimeout(() => page.classList.remove('content-loaded'), 400);
      }
    } catch (err) {
      console.error('[Render Error]', pageName, err);
      showErrorBoundary(pageName);
    }
  }

  setTimeout(attemptRender, 250);
}

/* ============================================================ */
/* 5. ERROR BOUNDARY                                             */
/* ============================================================ */
function showErrorBoundary(pageName) {
  const page = document.getElementById('page-' + pageName);
  if (!page) return;

  page.innerHTML = `
    <div class="page-container">
      <div class="error-boundary-card">
        <div class="error-boundary-icon">
          <i class="fas fa-water"></i>
        </div>
        <h3 class="error-boundary-title">Something went wrong</h3>
        <p class="error-boundary-message">
          This page couldn't load properly. Please try again.
        </p>
        <div class="error-boundary-actions">
          <button class="btn btn-primary" onclick="retryPage('${pageName}')">
            <i class="fas fa-rotate-right"></i> Retry
          </button>
          <button class="btn btn-outline" onclick="showPage('home')">
            <i class="fas fa-home"></i> Go Home
          </button>
        </div>
      </div>
    </div>
  `;
  showToast('Something went wrong. Please try again.');
}

function retryPage(pageName) {
  renderPageContent(pageName);
}

/* ============================================================ */
/* 6. LOAD ALL DATA                                              */
/* ============================================================ */
function loadAllData() {
  /* ⭐ STEP 1: Enforce fresh state FIRST */
  if (typeof AppMode !== 'undefined') {
    AppMode.enforceFreshState();
  }

  const K = APP.KEYS;

  APP.token = localStorage.getItem(K.TOKEN) || null;
  APP.user = Storage.get(K.USER, null);
  APP.sites = Storage.get(K.SITES, []);
  APP.observations = Storage.get(K.OBSERVATIONS, []);
  APP.reports = Storage.get(K.REPORTS, []);
  APP.stories = Storage.get(K.STORIES, []);
  APP.actions = Storage.get(K.ACTIONS, []);
  APP.joinedActions = Storage.get(K.JOINED_ACTIONS, []);
  APP.completedActions = Storage.get(K.COMPLETED_ACTIONS, []);
  APP.contributions = Storage.get(K.CONTRIBUTIONS, []);
  APP.notifications = Storage.get(K.NOTIFICATIONS, []);
  APP.activeSiteId = Storage.get(K.ACTIVE_SITE, null);
  APP.points = Storage.get(K.POINTS, 0);
  APP.level = Storage.get(K.LEVEL, 'Bronze Guardian');
  APP.badges = Storage.get(K.BADGES, []);
  APP.streak = Storage.get(K.STREAK, 0);
    APP.lastObserveDate = Storage.get(K.LAST_OBSERVE, null);

  /* ⭐ Load custom sites into SITES array */
  if (typeof SiteCreation !== 'undefined') {
    SiteCreation.loadAllSites();
  }
}

/* ============================================================ */
/* 7. INIT                                                       */
/* ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  Theme.init();
  loadAllData();

  initBottomNav();
  initGlobalHandlers();
  initBackToTop();
  initNavAutoHide();
  initQuickActionSheet();

  updateNavbarIcons(APP.currentPage || 'home');
  renderPageContent('home');

  updateNotifBadge();

  console.log('[AquaQuest] v1.0 initialized');
});

/* ============================================================ */
/* 8. BOTTOM NAV                                                 */
/* ============================================================ */
function initBottomNav() {
  document.querySelectorAll('.bottom-nav .nav-item[data-nav]').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const page = item.dataset.nav;
      if (page) showPage(page);
    });
  });
}

/* ============================================================ */
/* 9. GLOBAL HANDLERS                                            */
/* ============================================================ */
function initGlobalHandlers() {
  const hamburger = document.getElementById('hamburgerBtn');
  if (hamburger) {
    hamburger.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (typeof openDrawer === 'function') openDrawer();
    });
  }

  const notifIcon = document.getElementById('notifIcon');
  if (notifIcon) {
    notifIcon.addEventListener('click', (e) => {
      e.preventDefault();
      if (typeof renderNotificationsModal === 'function') {
        renderNotificationsModal();
      } else {
        showToast('Notifications unavailable');
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (typeof closeDrawer === 'function') closeDrawer();
      closeAllModals();
      closeQuickActionSheet();
    }
  });
}

/* ============================================================ */
/* 10. QUICK ACTION SHEET                                        */
/* ============================================================ */
function initQuickActionSheet() {
  const btn = document.getElementById('navAddBtn');
  if (btn) {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openQuickActionSheet();
    });
  }
}

function openQuickActionSheet() {
  const sheet = document.getElementById('quickActionSheet');
  if (sheet) sheet.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeQuickActionSheet() {
  const sheet = document.getElementById('quickActionSheet');
  if (sheet) sheet.classList.remove('active');
  document.body.style.overflow = '';
}

function quickActionObserve() {
  closeQuickActionSheet();
  setTimeout(() => {
    if (typeof openObservationFlow === 'function') {
      openObservationFlow();
    } else {
      showPage('observe');
    }
  }, 200);
}

function quickActionReport() {
  closeQuickActionSheet();
  setTimeout(() => {
    if (typeof openReportFlow === 'function') {
      openReportFlow();
    } else {
      showPage('reports');
    }
  }, 200);
}

function quickActionStory() {
  closeQuickActionSheet();
  setTimeout(() => {
    if (typeof openStoryComposer === 'function') {
      openStoryComposer();
    } else {
      showPage('feed');
    }
  }, 200);
}

/* ============================================================ */
/* 11. AUTO-HIDE NAV                                             */
/* ============================================================ */
function initNavAutoHide() {
  const nav = document.getElementById('topNav');
  if (!nav) return;

  let lastScrollY = window.scrollY;
  let ticking = false;

  function onScroll() {
    const currentScrollY = window.scrollY;
    const diff = currentScrollY - lastScrollY;

    if (currentScrollY < 80) {
      nav.classList.remove('nav-hidden');
    } else if (diff > 10) {
      nav.classList.add('nav-hidden');
    } else if (diff < -10) {
      nav.classList.remove('nav-hidden');
    }

    nav.classList.toggle('scrolled', currentScrollY > 10);
    lastScrollY = currentScrollY;
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(onScroll);
      ticking = true;
    }
  }, { passive: true });
}

/* ============================================================ */
/* 12. BACK TO TOP                                               */
/* ============================================================ */
function initBackToTop() {
  const btn = document.getElementById('backToTop');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('show', window.scrollY > 400);
  });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ============================================================ */
/* 13. NOTIFICATION BADGE                                        */
/* ============================================================ */
function updateNotifBadge() {
  const icons = document.querySelectorAll('.notif-icon');

  /* ⭐ Not logged in → no badge */
  if (!isLoggedIn()) {
    icons.forEach(icon => icon.setAttribute('data-count', 0));
    return;
  }

  const unread = (APP.notifications || []).filter(n => !n.read).length;
  icons.forEach(icon => {
    icon.setAttribute('data-count', unread);
  });
}

/* ============================================================ */
/* 14. AUTH                                                      */
/* ============================================================ */
function isLoggedIn() {
  return !!APP.token && !!APP.user;
}

function getCurrentUser() {
  return APP.user;
}

function logout() {
  /* Clear auth */
  APP.token = null;
  APP.user = null;
  Storage.remove(APP.KEYS.TOKEN);
  Storage.remove(APP.KEYS.USER);

  /* Clear demo flag if active */
  if (typeof DemoMode !== 'undefined' && DemoMode.isActive()) {
    DemoMode.clearActive();
  }

  /* Reset app mode */
  if (typeof AppMode !== 'undefined') {
    AppMode.onLogout();
  }

  /* Clear session-specific data */
  APP.reports = [];
  APP.notifications = [];
  APP.observations = [];
  APP.contributions = [];
  APP.joinedActions = [];
  APP.completedActions = [];
  APP.points = 0;
  APP.badges = [];
  APP.streak = 0;

  showToast('Signed out');

  setTimeout(() => location.reload(), 500);
}

/* ============================================================ */
/* 15. GLOBAL ERROR HANDLERS                                     */
/* ============================================================ */
window.addEventListener('error', (e) => {
  console.error('[Runtime Error]', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('[Unhandled Promise]', e.reason);
});

/* ============================================================ */
/* 16. EXPORTS                                                   */
/* ============================================================ */
window.APP = APP;
window.showPage = showPage;
window.isLoggedIn = isLoggedIn;
window.getCurrentUser = getCurrentUser;
window.logout = logout;
window.updateNotifBadge = updateNotifBadge;
window.renderPageContent = renderPageContent;
window.retryPage = retryPage;
window.updateNavbarIcons = updateNavbarIcons;
window.openQuickActionSheet = openQuickActionSheet;
window.closeQuickActionSheet = closeQuickActionSheet;
window.quickActionObserve = quickActionObserve;
window.quickActionReport = quickActionReport;
window.quickActionStory = quickActionStory;

console.log('[AquaQuest] Core loaded');