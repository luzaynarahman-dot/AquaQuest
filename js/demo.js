/* ============================================================ */
/* AQUAQUEST — DEMO MODE                                         */
/* One-click premium demo with rich data                         */
/* Fixed: no reload loop, logo overlay, clean state              */
/* ============================================================ */

const DemoMode = {
  KEY: 'aq_demo_mode',
  STARTED_KEY: 'aq_demo_started',
  _starting: false,

  /* ============================================================ */
  /* STATE CHECKS                                                  */
  /* ============================================================ */
  isActive() {
    try {
      return localStorage.getItem(this.KEY) === 'true';
    } catch (e) {
      return false;
    }
  },

  markActive() {
    try {
      localStorage.setItem(this.KEY, 'true');
      localStorage.setItem(this.STARTED_KEY, Date.now().toString());

      if (typeof AppMode !== 'undefined') {
        AppMode.set('demo');
      }
    } catch (e) {}
  },

  clearActive() {
    try {
      localStorage.removeItem(this.KEY);
      localStorage.removeItem(this.STARTED_KEY);
      localStorage.removeItem('aq_mode');

      if (typeof AppMode !== 'undefined') {
        AppMode.markFresh();
      }
    } catch (e) {}
  },

  /* ============================================================ */
  /* START                                                         */
  /* ============================================================ */
  async start() {
    /* Prevent double-tap */
    if (this._starting) {
      console.log('[Demo] Already starting — ignoring');
      return;
    }
    this._starting = true;

    /* Close any open modals */
    if (typeof closeAllModals === 'function') {
      closeAllModals();
    }

    /* Show loading overlay */
    this.showOverlay();

    /* Step 1 — Loading sites */
    await this.sleep(400);
    this.updateOverlay('Loading water sites...');

    const loaded = await this.load();

    if (!loaded) {
      this._starting = false;
      this.hideOverlay();
      if (typeof showToast === 'function') {
        showToast('Demo load failed');
      }
      return;
    }

    /* Step 2 — Restoring impact */
    await this.sleep(500);
    this.updateOverlay('Restoring your impact...');

    /* Step 3 — Ready */
    await this.sleep(400);
    this.updateOverlay('Ready!');

    /* Small pause for smoothness */
    await this.sleep(600);

    /* Confetti burst */
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 180,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#0E3A4C', '#22D3EE', '#0891B2', '#4DD0E1', '#FBBF24']
      });
    }

    /* Hide overlay with fade */
    this.hideOverlay();

    /* Reset starting flag */
    this._starting = false;

    /* Reload APP state from localStorage */
    if (typeof loadAllData === 'function') {
      loadAllData();
    }

    /* Navigate to home */
    if (typeof showPage === 'function') {
      showPage('home');
    }

    /* Refresh drawer */
    if (typeof refreshDrawer === 'function') {
      refreshDrawer();
    }

    /* Update notification badge */
    if (typeof updateNotifBadge === 'function') {
      updateNotifBadge();
    }

    /* Show welcome toast */
    setTimeout(() => {
      if (typeof showToast === 'function') {
        showToast('Welcome to Demo Mode');
      }
    }, 400);
  },

  /* ============================================================ */
  /* LOAD DEMO DATA                                                */
  /* ============================================================ */
  async load() {
    if (!window.DEMO_DATA) {
      console.error('[Demo] DEMO_DATA missing');
      if (typeof showToast === 'function') {
        showToast('Demo data unavailable');
      }
      return false;
    }

    const D = window.DEMO_DATA;

    try {
      const token = 'demo_' + Date.now();

      /* Auth */
      localStorage.setItem('aq_token', token);
      localStorage.setItem('aq_user', JSON.stringify(D.user));

      /* Core data */
      localStorage.setItem('aq_sites', JSON.stringify(D.sites || []));
      localStorage.setItem('aq_observations', JSON.stringify(D.observations || []));
      localStorage.setItem('aq_reports', JSON.stringify(D.reports || []));
      localStorage.setItem('aq_stories', JSON.stringify(D.stories || []));
      localStorage.setItem('aq_actions', JSON.stringify(window.CHALLENGES || []));
      localStorage.setItem('aq_joinedActions', JSON.stringify(D.joinedActions || []));
      localStorage.setItem('aq_completedActions', JSON.stringify(D.completedActions || []));
      localStorage.setItem('aq_notifications', JSON.stringify(D.notifications || []));
      localStorage.setItem('aq_activeSiteId', JSON.stringify(D.activeSiteId || null));
      localStorage.setItem('aq_contributions', JSON.stringify(D.contributions || []));
      localStorage.setItem('aq_custom_sites', JSON.stringify(D.customSites || []));

      /* Monitored sites (My Waters) */
      localStorage.setItem('aq_monitored_sites', JSON.stringify(D.monitoredSites || []));

      /* Follows network */
      localStorage.setItem('aq_following_map', JSON.stringify(D.follows || {}));
      
      /* All users (for social lookups) */
      if (D.users) {
        localStorage.setItem('aq_demo_users', JSON.stringify(D.users));
      }

      /* Gamification */
      localStorage.setItem('aq_points', JSON.stringify(D.gamification?.points || 0));
      localStorage.setItem('aq_level', JSON.stringify(D.gamification?.level || 'Bronze Guardian'));
      localStorage.setItem('aq_badges', JSON.stringify(D.gamification?.badges || []));
      localStorage.setItem('aq_streak', JSON.stringify(D.gamification?.streak || 0));
      localStorage.setItem('aq_lastObserveDate', JSON.stringify(D.gamification?.lastObserveDate || null));

      /* Saved stories */
      localStorage.setItem('aq_saved_stories', JSON.stringify(D.savedStories || []));

      /* Mark demo as active */
      this.markActive();

      console.log('[Demo] Data loaded successfully');
      return true;

    } catch (err) {
      console.error('[Demo] Load failed:', err);
      return false;
    }
  },

  /* ============================================================ */
  /* SLEEP HELPER                                                  */
  /* ============================================================ */
  sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
  },

  /* ============================================================ */
  /* SHOW OVERLAY — with LOGO                                     */
  /* ============================================================ */
  showOverlay() {
  const existing = document.getElementById('demoOverlay');
  if (existing) existing.remove();

  const overlay = document.createElement('div');
  overlay.id = 'demoOverlay';
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    background: rgba(6, 30, 42, 0.94);
    backdrop-filter: blur(14px);
    -webkit-backdrop-filter: blur(14px);
    z-index: 3000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    opacity: 0;
    transition: opacity 0.35s ease;
  `;

  overlay.innerHTML = `
    <div style="text-align:center; max-width:360px; width:100%;">

      <div style="
        width: 150px;
        height: 150px;
        margin: 0 auto 28px;
        position: relative;
        animation: demoFloat 3s ease-in-out infinite;
        display: flex;
        align-items: center;
        justify-content: center;
        border-radius: 50%;
        overflow: hidden;
        box-shadow:
          0 15px 50px rgba(34, 211, 238, 0.5),
          0 0 0 6px rgba(34, 211, 238, 0.15);
      ">
        <img
          src="assets/logo-icon.jpg"
          alt="AquaQuest"
          style="
            width: 100%;
            height: 100%;
            object-fit: cover;
            object-position: center center;
            display: block;
          "
          onerror="this.outerHTML='<div style=&quot;width:100%;height:100%;background:linear-gradient(135deg,#22D3EE,#0891B2,#0E3A4C);display:flex;align-items:center;justify-content:center;font-size:60px;color:#fff;&quot;><i class=&quot;fas fa-water&quot;></i></div>'"
        >
      </div>

      <h2 style="
        font-family: 'Caveat', cursive;
        font-size: 2.5rem;
        font-weight: 700;
        color: #fff;
        margin-bottom: 10px;
        letter-spacing: 0.5px;
        line-height: 1.1;
        text-shadow: 0 2px 20px rgba(34, 211, 238, 0.4);
      ">
        Loading Demo
      </h2>

      <p id="demoSubText" style="
        font-size: 14px;
        color: rgba(255,255,255,0.88);
        margin-bottom: 26px;
        min-height: 22px;
        font-weight: 600;
        transition: opacity 0.2s ease;
      ">
        Preparing your water world...
      </p>

      <div style="
        width: 100%;
        height: 6px;
        background: rgba(255,255,255,0.15);
        border-radius: 20px;
        overflow: hidden;
      ">
        <div style="
          height: 100%;
          width: 100%;
          background: linear-gradient(90deg, transparent, #22D3EE, #4DD0E1, #22D3EE, transparent);
          background-size: 200% 100%;
          animation: demoShimmer 1.2s linear infinite;
          border-radius: 20px;
        "></div>
      </div>

    </div>

    <style>
      @keyframes demoFloat {
        0%, 100% { transform: translateY(0) scale(1); }
        50% { transform: translateY(-14px) scale(1.04); }
      }
      @keyframes demoShimmer {
        0% { background-position: 200% 0; }
        100% { background-position: -200% 0; }
      }
    </style>
  `;

  document.body.appendChild(overlay);
  document.body.style.overflow = 'hidden';

  requestAnimationFrame(() => {
    overlay.style.opacity = '1';
  });
},

  /* ============================================================ */
  /* UPDATE OVERLAY TEXT                                           */
  /* ============================================================ */
  updateOverlay(text) {
    const sub = document.getElementById('demoSubText');
    if (!sub) return;

    sub.style.opacity = '0';
    setTimeout(() => {
      sub.textContent = text;
      sub.style.opacity = '1';
    }, 150);
  },

  /* ============================================================ */
  /* HIDE OVERLAY                                                  */
  /* ============================================================ */
  hideOverlay() {
    const overlay = document.getElementById('demoOverlay');
    if (!overlay) return;

    overlay.style.opacity = '0';

    setTimeout(() => {
      overlay.remove();
      document.body.style.overflow = '';
    }, 350);
  },

  /* ============================================================ */
  /* EXIT DEMO                                                     */
  /* ============================================================ */
  async exit() {
    if (!confirm('Exit demo mode?\n\nAll demo data will be cleared. This cannot be undone.')) {
      return;
    }

    /* Clear demo flag */
    this.clearActive();

    /* Preserve theme + onboarding flag */
    const theme = localStorage.getItem('aq_theme');
    const onboarded = localStorage.getItem('aq_onboarded');

    /* Clear everything */
    localStorage.clear();

    /* Restore preserved settings */
    if (theme) localStorage.setItem('aq_theme', theme);
    if (onboarded) localStorage.setItem('aq_onboarded', onboarded);

    if (typeof showToast === 'function') {
      showToast('Exiting demo...');
    }

    setTimeout(() => window.location.reload(), 700);
  }
};

/* ============================================================ */
/* AUTO-INIT                                                     */
/* ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  /* Only show toast if demo is active AND user is actually logged in */
  if (DemoMode.isActive()) {
    const hasToken = !!localStorage.getItem('aq_token');
    const hasUser = !!localStorage.getItem('aq_user');

    if (hasToken && hasUser) {
      setTimeout(() => {
        if (typeof showToast === 'function') {
          showToast('Demo mode active');
        }
      }, 900);
    } else {
      /* Stale demo flag — clean it silently */
      try {
        localStorage.removeItem(DemoMode.KEY);
        localStorage.removeItem(DemoMode.STARTED_KEY);
        console.log('[Demo] Stale flag cleaned');
      } catch (e) {}
    }
  }
});

/* ============================================================ */
/* EXPORTS                                                       */
/* ============================================================ */
window.DemoMode = DemoMode;
window.startDemo = () => DemoMode.start();
window.exitDemo = () => DemoMode.exit();

console.log('[AquaQuest] Demo loaded');