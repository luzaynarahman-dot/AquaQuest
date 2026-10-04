/* ============================================================ */
/* AQUAQUEST — PWA SERVICE WORKER REGISTRATION                   */
/* Offline support · Install prompt · Update handling            */
/* ============================================================ */

const PWA = {

  swRegistration: null,
  deferredPrompt: null,

  /* ============================================================ */
  /* INIT                                                          */
  /* ============================================================ */
  init() {
    if (!('serviceWorker' in navigator)) {
      console.log('[PWA] Service workers not supported');
      return;
    }

    /* Register service worker */
    this.register();

    /* Handle install prompt */
    this.setupInstallPrompt();

    /* Handle online/offline */
    this.setupNetworkStatus();
  },

  /* ============================================================ */
  /* REGISTER SERVICE WORKER                                       */
  /* ============================================================ */
  async register() {
    try {
      const registration = await navigator.serviceWorker.register('./service-worker.js', {
  scope: './'
});

      this.swRegistration = registration;
      console.log('[PWA] Service worker registered:', registration.scope);

      /* Check for updates */
      registration.addEventListener('updatefound', () => {
        const newWorker = registration.installing;
        if (!newWorker) return;

        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            console.log('[PWA] New version available');
            this.promptUpdate();
          }
        });
      });

    } catch (err) {
      console.warn('[PWA] Service worker registration failed:', err.message);
    }
  },

  /* ============================================================ */
  /* UPDATE PROMPT                                                 */
  /* ============================================================ */
  promptUpdate() {
    if (typeof showToast === 'function') {
      showToast('New version available — refresh to update');
    }
  },

  /* ============================================================ */
  /* INSTALL PROMPT                                                */
  /* ============================================================ */
  setupInstallPrompt() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredPrompt = e;
      console.log('[PWA] Install prompt available');

      /* Show install button if exists */
      const installBtn = document.getElementById('pwaInstallBtn');
      if (installBtn) {
        installBtn.style.display = 'inline-flex';
      }
    });

    window.addEventListener('appinstalled', () => {
      console.log('[PWA] App installed');
      this.deferredPrompt = null;

      if (typeof showToast === 'function') {
        showToast('AquaQuest installed to home screen');
      }
    });
  },

  /* ============================================================ */
  /* TRIGGER INSTALL                                               */
  /* ============================================================ */
  async install() {
    if (!this.deferredPrompt) {
      if (typeof showToast === 'function') {
        showToast('Install not available yet');
      }
      return;
    }

    this.deferredPrompt.prompt();
    const { outcome } = await this.deferredPrompt.userChoice;

    console.log('[PWA] Install outcome:', outcome);

    this.deferredPrompt = null;
  },

  /* ============================================================ */
  /* NETWORK STATUS                                                */
  /* ============================================================ */
  setupNetworkStatus() {
    window.addEventListener('online', () => {
      console.log('[PWA] Back online');
      if (typeof showToast === 'function') {
        showToast('Back online');
      }
    });

    window.addEventListener('offline', () => {
      console.log('[PWA] Went offline');
      if (typeof showToast === 'function') {
        showToast('You are offline — cached data available');
      }
    });
  },

  /* ============================================================ */
  /* CHECK FOR UPDATES MANUALLY                                    */
  /* ============================================================ */
  async checkForUpdates() {
    if (!this.swRegistration) return;

    try {
      await this.swRegistration.update();
      console.log('[PWA] Update check complete');
    } catch (err) {
      console.warn('[PWA] Update check failed:', err);
    }
  }
};

/* ============================================================ */
/* AUTO-INIT                                                     */
/* ============================================================ */
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => PWA.init());
} else {
  PWA.init();
}

/* ============================================================ */
/* EXPORTS                                                       */
/* ============================================================ */
window.PWA = PWA;
window.installPWA = () => PWA.install();

console.log('[AquaQuest] PWA loaded');
