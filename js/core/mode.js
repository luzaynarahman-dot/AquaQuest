/* ============================================================ */
/* AQUAQUEST — APP MODE MANAGER                                  */
/* Single source of truth: demo / fresh / returning              */
/* + Monitored Sites state                                       */
/* ============================================================ */

const AppMode = {

  KEY: 'aq_mode',
  DEMO_FLAG: 'aq_demo_mode',
  MONITORED_KEY: 'aq_monitored_sites',

  /* ============================================================ */
  /* CURRENT MODE                                                  */
  /* ============================================================ */
  get() {
    if (localStorage.getItem(this.DEMO_FLAG) === 'true') {
      return 'demo';
    }

    const mode = localStorage.getItem(this.KEY);
    if (!mode) return 'fresh';

    if (localStorage.getItem('aq_token')) {
      return 'returning';
    }

    return mode;
  },

  /* ============================================================ */
  /* SHORTCUTS                                                     */
  /* ============================================================ */
  isDemo() {
    return this.get() === 'demo';
  },

  isFresh() {
    return this.get() === 'fresh';
  },

  isReturning() {
    return this.get() === 'returning';
  },

  isLoggedIn() {
    return !!localStorage.getItem('aq_token');
  },

  /* ============================================================ */
  /* SET                                                           */
  /* ============================================================ */
  set(mode) {
    if (!mode) return;
    localStorage.setItem(this.KEY, mode);
  },

  markFresh() {
    this.set('fresh');
  },

  markReturning() {
    this.set('returning');
  },

  /* ============================================================ */
  /* FRESH STATE ENFORCEMENT                                       */
  /* ============================================================ */
  enforceFreshState() {
    if (this.isDemo()) return;
    if (this.isLoggedIn()) return;

    const wipeKeys = [
      'aq_observations',
      'aq_reports',
      'aq_stories',
      'aq_contributions',
      'aq_notifications',
      'aq_joinedActions',
      'aq_completedActions',
      'aq_saved_stories',
      'aq_following_map',
      'aq_points',
      'aq_level',
      'aq_badges',
      'aq_streak',
      'aq_lastObserveDate',
      'aq_activeSiteId',
      'aq_monitored_sites',
      'aq_custom_sites'
    ];

    wipeKeys.forEach(k => {
      try { localStorage.removeItem(k); } catch (e) {}
    });

    if (typeof APP !== 'undefined') {
      APP.observations = [];
      APP.reports = [];
      APP.stories = [];
      APP.contributions = [];
      APP.notifications = [];
      APP.joinedActions = [];
      APP.completedActions = [];
      APP.monitoredSites = [];
      APP.customSites = [];
      APP.points = 0;
      APP.level = 'Bronze Guardian';
      APP.badges = [];
      APP.streak = 0;
      APP.lastObserveDate = null;
      APP.activeSiteId = null;
    }
  },

  /* ============================================================ */
  /* SIGNUP / LOGOUT                                               */
  /* ============================================================ */
  onSignup() {
    this.markReturning();
  },

  onLogout() {
    this.enforceFreshState();
    this.markFresh();
  },

  /* ============================================================ */
  /* ⭐ MONITORED SITES — user's personal collection                */
  /* ============================================================ */
  getMonitoredSites() {
    try {
      const raw = localStorage.getItem(this.MONITORED_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      return [];
    }
  },

  isMonitored(siteId) {
    if (!siteId) return false;
    return this.getMonitoredSites().includes(siteId);
  },

  monitorSite(siteId) {
    if (!siteId) return false;
    const list = this.getMonitoredSites();
    if (list.includes(siteId)) return false;

    list.push(siteId);
    localStorage.setItem(this.MONITORED_KEY, JSON.stringify(list));

    if (typeof APP !== 'undefined') {
      APP.monitoredSites = list;
    }
    return true;
  },

  unmonitorSite(siteId) {
    if (!siteId) return false;
    let list = this.getMonitoredSites();
    if (!list.includes(siteId)) return false;

    list = list.filter(id => id !== siteId);
    localStorage.setItem(this.MONITORED_KEY, JSON.stringify(list));

    if (typeof APP !== 'undefined') {
      APP.monitoredSites = list;
    }
    return true;
  },

  toggleMonitor(siteId) {
    if (this.isMonitored(siteId)) {
      this.unmonitorSite(siteId);
      return false;
    }
    this.monitorSite(siteId);
    return true;
  },

  getMonitoredCount() {
    return this.getMonitoredSites().length;
  }
};

window.AppMode = AppMode;
console.log('[AquaQuest] AppMode loaded —', AppMode.get(), '| Monitoring:', AppMode.getMonitoredCount(), 'sites');