/* ============================================================ */
/* AQUAQUEST — MONITORING SYSTEM                                 */
/* User's personal "My Waters" collection                        */
/* Monitor ≠ Observe (separate concepts)                         */
/* ============================================================ */

const Monitoring = {

  /* ============================================================ */
  /* GET                                                           */
  /* ============================================================ */
  getMonitoredIds() {
    if (typeof AppMode === 'undefined') return [];
    return AppMode.getMonitoredSites();
  },

  getMonitoredSites() {
    const ids = this.getMonitoredIds();
    if (!ids.length) return [];

    return ids
      .map(id => {
        if (typeof getSiteById === 'function') return getSiteById(id);
        return null;
      })
      .filter(Boolean);
  },

  count() {
    return this.getMonitoredIds().length;
  },

  isMonitored(siteId) {
    if (!siteId) return false;
    if (typeof AppMode === 'undefined') return false;
    return AppMode.isMonitored(siteId);
  },

  /* ============================================================ */
  /* TOGGLE                                                        */
  /* ============================================================ */
  toggle(siteId) {
    if (!siteId) return false;

    if (typeof isLoggedIn === 'function' && !isLoggedIn()) {
      if (typeof showToast === 'function') {
        showToast('Sign in to monitor waterbodies');
      }
      if (typeof openModal === 'function') {
        openModal('loginModal');
        if (typeof renderLoginModal === 'function') renderLoginModal();
      }
      return false;
    }

    const site = typeof getSiteById === 'function' ? getSiteById(siteId) : null;
    if (!site) return false;

    const wasMonitoring = this.isMonitored(siteId);
    const nowMonitoring = AppMode.toggleMonitor(siteId);

    if (typeof showToast === 'function') {
      if (nowMonitoring) {
        showToast(`💙 Monitoring ${site.name}`);
      } else {
        showToast(`Removed ${site.name} from My Waters`);
      }
    }

    return nowMonitoring;
  },

  /* ============================================================ */
  /* ADD / REMOVE                                                  */
  /* ============================================================ */
  add(siteId) {
    if (!siteId) return false;
    return AppMode.monitorSite(siteId);
  },

  remove(siteId) {
    if (!siteId) return false;
    return AppMode.unmonitorSite(siteId);
  },

  /* ============================================================ */
  /* RENDER HELPERS                                                */
  /* ============================================================ */
  renderMonitorButton(siteId) {
    const isMonitoring = this.isMonitored(siteId);

    return `
      <button type="button"
              class="monitor-btn ${isMonitoring ? 'monitoring' : ''}"
              id="monitorBtn_${siteId}"
              onclick="event.stopPropagation(); handleMonitorToggle('${siteId}')"
              aria-label="${isMonitoring ? 'Stop monitoring' : 'Monitor this water'}">
        <i class="fas ${isMonitoring ? 'fa-check-circle' : 'fa-eye'}"></i>
        <span>${isMonitoring ? 'Monitoring' : 'Monitor this Water'}</span>
      </button>
    `;
  },

  renderMonitorIcon(siteId) {
    const isMonitoring = this.isMonitored(siteId);
    if (!isMonitoring) return '';

    return `<i class="fas fa-eye monitor-indicator" title="Monitoring"></i>`;
  }
};

/* ============================================================ */
/* GLOBAL HANDLER                                                */
/* ============================================================ */
function handleMonitorToggle(siteId) {
  if (!siteId) return;

  const nowMonitoring = Monitoring.toggle(siteId);

  /* Update button in-place */
  const btn = document.getElementById('monitorBtn_' + siteId);
  if (btn) {
    btn.classList.toggle('monitoring', nowMonitoring);
    const icon = btn.querySelector('i');
    const label = btn.querySelector('span');
    if (icon) icon.className = nowMonitoring ? 'fas fa-check-circle' : 'fas fa-eye';
    if (label) label.textContent = nowMonitoring ? 'Monitoring' : 'Monitor this Water';

    btn.classList.add('just-tapped');
    setTimeout(() => btn.classList.remove('just-tapped'), 400);
  }

  /* Refresh drawer badge */
  if (typeof refreshDrawer === 'function') refreshDrawer();

  /* Refresh profile if currently on profile */
  if (typeof APP !== 'undefined' && APP.currentPage === 'profile') {
    setTimeout(() => {
      if (typeof renderProfile === 'function') renderProfile();
    }, 200);
  }
}

/* ============================================================ */
/* EXPORTS                                                       */
/* ============================================================ */
window.Monitoring = Monitoring;
window.handleMonitorToggle = handleMonitorToggle;

console.log('[AquaQuest] Monitoring system loaded');