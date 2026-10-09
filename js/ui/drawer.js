/* ============================================================ */
/* AQUAQUEST — SIDE DRAWER                                       */
/* ============================================================ */

const Drawer = {
  isOpen: false,
  els: {},

  init() {
    this.cacheElements();
    this.attachEvents();
    this.refresh();
  },

  cacheElements() {
    this.els.drawer = document.getElementById('sideDrawer');
    this.els.backdrop = document.getElementById('drawerBackdrop');
    this.els.hamburgerBtn = document.getElementById('hamburgerBtn');
    this.els.avatar = document.getElementById('drawerAvatar');
    this.els.userName = document.getElementById('drawerUserName');
    this.els.userEmail = document.getElementById('drawerUserEmail');
    this.els.signinBanner = document.getElementById('drawerSigninBanner');
    this.els.signinBtn = document.getElementById('drawerSigninBtn');
    this.els.authBtn = document.getElementById('drawerAuthBtn');
    this.els.authText = document.getElementById('drawerAuthText');
    this.els.authIcon = document.getElementById('drawerAuthIcon');
    this.els.darkToggle = document.getElementById('drawerDarkMode');
    this.els.sitesCount = document.getElementById('drawerSitesCount');
    this.els.reportsCount = document.getElementById('drawerReportsCount');
    this.els.notifCount = document.getElementById('drawerNotifCount');
  },

  attachEvents() {
    this.els.backdrop?.addEventListener('click', () => this.close());

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) this.close();
    });

    this.els.drawer?.addEventListener('click', (e) => {
      const item = e.target.closest('[data-drawer-action]');
      if (!item) return;
      this.handleAction(item.dataset.drawerAction);
    });

    this.els.darkToggle?.addEventListener('change', (e) => {
      e.stopPropagation();
      if (typeof toggleTheme === 'function') {
        toggleTheme(e.target.checked);
      }
    });

    this.els.signinBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.close();
      setTimeout(() => {
        openModal('loginModal');
        if (typeof renderLoginModal === 'function') renderLoginModal();
      }, 300);
    });

    this.els.authBtn?.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isLoggedIn()) {
        this.close();
        setTimeout(logout, 300);
      } else {
        this.close();
        setTimeout(() => {
          openModal('loginModal');
          if (typeof renderLoginModal === 'function') renderLoginModal();
        }, 300);
      }
    });
  },

  open() {
    this.isOpen = true;
    this.els.drawer?.classList.add('active');
    this.els.backdrop?.classList.add('active');
    this.els.hamburgerBtn?.classList.add('active');
    document.body.style.overflow = 'hidden';
    this.els.drawer?.setAttribute('aria-hidden', 'false');
  },

  close() {
    this.isOpen = false;
    this.els.drawer?.classList.remove('active');
    this.els.backdrop?.classList.remove('active');
    this.els.hamburgerBtn?.classList.remove('active');
    document.body.style.overflow = '';
    this.els.drawer?.setAttribute('aria-hidden', 'true');
  },

  toggle() {
    this.isOpen ? this.close() : this.open();
  },

  refresh() {
    const loggedIn = isLoggedIn();
    const user = getCurrentUser();

    if (loggedIn && user) {
      const initial = (user.name || 'U').charAt(0).toUpperCase();
      if (this.els.avatar) {
        if (user.avatar) {
          this.els.avatar.innerHTML = `<img src="${user.avatar}" alt="">`;
        } else {
          this.els.avatar.textContent = initial;
        }
        this.els.avatar.classList.add('logged-in');
      }
      if (this.els.userName) this.els.userName.textContent = user.name || 'User';
      if (this.els.userEmail) this.els.userEmail.textContent = user.email || '';
    } else {
      if (this.els.avatar) {
        this.els.avatar.textContent = '?';
        this.els.avatar.classList.remove('logged-in');
      }
      if (this.els.userName) this.els.userName.textContent = 'Welcome';
      if (this.els.userEmail) this.els.userEmail.textContent = 'Sign in to continue';
    }

    if (loggedIn) {
      this.els.signinBanner?.classList.add('hidden');
    } else {
      this.els.signinBanner?.classList.remove('hidden');
    }

    if (this.els.authText) {
      this.els.authText.textContent = loggedIn ? 'Sign Out' : 'Login / Sign Up';
    }
    if (this.els.authIcon) {
      this.els.authIcon.className = loggedIn ? 'fas fa-sign-out-alt' : 'fas fa-sign-in-alt';
    }
    if (this.els.authBtn) {
      this.els.authBtn.classList.toggle('logged-in', loggedIn);
    }

    if (this.els.darkToggle) {
      this.els.darkToggle.checked = document.body.classList.contains('dark-mode');
    }

    this.refreshCounts();
  },

  refreshCounts() {
  /* ---- Not logged in: hide all badges ---- */
  const loggedIn = typeof isLoggedIn === 'function' && isLoggedIn();

  if (!loggedIn) {
    if (this.els.sitesCount) {
      this.els.sitesCount.textContent = '0';
      this.els.sitesCount.classList.add('hidden');
    }
    if (this.els.reportsCount) {
      this.els.reportsCount.textContent = '0';
      this.els.reportsCount.classList.add('hidden');
    }
    if (this.els.notifCount) {
      this.els.notifCount.textContent = '0';
      this.els.notifCount.classList.add('hidden');
    }
    return;
  }

  /* ---- Logged in: show real counts ---- */

  /* Sites — user's monitored sites */
  const sitesCount = (typeof Monitoring !== 'undefined' && Monitoring.count)
    ? Monitoring.count()
    : 0;

  if (this.els.sitesCount) {
    this.els.sitesCount.textContent = sitesCount;
    this.els.sitesCount.classList.toggle('hidden', sitesCount === 0);
  }

  /* Reports — user's active reports */
  const myId = APP.user?.id || 'user_self';
  const reports = (APP.reports || []).filter(r =>
    (r.reporterId === 'user_self' ||
     r.reporterId === 'user_demo' ||
     r.reporterId === myId) &&
    r.status !== 'resolved'
  ).length;

  if (this.els.reportsCount) {
    this.els.reportsCount.textContent = reports;
    this.els.reportsCount.classList.toggle('hidden', reports === 0);
  }

  /* Notifications — unread */
  const unread = (APP.notifications || []).filter(n => !n.read).length;

  if (this.els.notifCount) {
    this.els.notifCount.textContent = unread;
    this.els.notifCount.classList.toggle('hidden', unread === 0);
  }
},

  handleAction(action) {
    this.close();

    setTimeout(() => {
      switch (action) {
        case 'sites':         showPage('sites'); break;
        case 'map':           showPage('map'); break;
        case 'actions':       showPage('actions'); break;
        case 'learn':         showPage('learn'); break;
        case 'saved':         showPage('saved'); break;
        case 'reports':       showPage('reports'); break;
        case 'settings':      showPage('profile'); break;

        case 'notifications':
          if (typeof renderNotificationsModal === 'function') {
            renderNotificationsModal();
          } else {
            showToast('Notifications unavailable');
          }
          break;

        case 'export':        handleExportData(); break;
        case 'clear':         handleClearData(); break;

        case 'about':
          if (typeof renderAboutModal === 'function') {
            renderAboutModal();
          } else {
            showToast('About unavailable');
          }
          break;

        default:
          console.warn('[Drawer] Unknown action:', action);
          showToast('Feature coming soon');
      }
    }, 250);
  }
};

function openDrawer() { Drawer.open(); }
function closeDrawer() { Drawer.close(); }
function refreshDrawer() { Drawer.refresh(); }

/* ============================================================ */
/* EXPORT DATA                                                   */
/* ============================================================ */
function handleExportData() {
  const data = {
    user: APP.user,
    sites: APP.sites,
    observations: APP.observations,
    reports: APP.reports,
    stories: APP.stories,
    joinedActions: APP.joinedActions,
    points: APP.points,
    badges: APP.badges,
    streak: APP.streak
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `aquaquest-data-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Data exported');
}

function handleClearData() {
  if (!confirm('Clear all app data? Your login will be preserved.')) return;

  const token = localStorage.getItem(APP.KEYS.TOKEN);
  const user = localStorage.getItem(APP.KEYS.USER);
  const theme = localStorage.getItem(APP.KEYS.THEME);

  Storage.clear();

  if (token) localStorage.setItem(APP.KEYS.TOKEN, token);
  if (user) localStorage.setItem(APP.KEYS.USER, user);
  if (theme) localStorage.setItem(APP.KEYS.THEME, theme);

  showToast('Data cleared');
  setTimeout(() => location.reload(), 800);
}

/* ============================================================ */
/* ABOUT MODAL                                                   */
/* ============================================================ */
function renderAboutModal() {
  const modal = document.getElementById('aboutModal');
  if (!modal) return;

  modal.querySelector('.modal-content').innerHTML = `
    <button class="close-modal" onclick="closeModal('aboutModal')">
      <i class="fas fa-times"></i>
    </button>
    <h2 class="modal-title"><i class="fas fa-water"></i> About AquaQuest</h2>

    <div style="text-align:center; margin-bottom:20px;">
      <img src="assets/logo.png" alt="AquaQuest" style="width:100px; height:100px; object-fit:contain; margin:0 auto 12px; border-radius:20px;" onerror="this.style.display='none'">
      <p style="font-size:1.1rem; font-weight:800; color:var(--pc-text); margin-bottom:4px;">AquaQuest</p>
      <p style="font-size:12px; color:var(--pc-text-muted); font-weight:600;">v1.0 · Explore · Navigate · Discover</p>
    </div>

    <p style="color:var(--pc-text-2); font-size:13.5px; line-height:1.6; margin-bottom:18px; text-align:center;">
      A citizen science platform for water health. Observe, report, and protect the waterbodies around you.
    </p>

    <p style="font-weight:800; color:var(--pc-accent); font-size:12px; text-transform:uppercase; letter-spacing:0.4px; margin-bottom:10px;">Features</p>
      <ul style="list-style:none; padding:0; display:flex; flex-direction:column; gap:8px;">
        <li style="padding:10px; background:var(--pc-paper); border-radius:10px; font-size:13px; display:flex; align-items:center; gap:10px;"><i class="fas fa-eye" style="color:var(--pc-accent); width:18px;"></i> Log water observations</li>
        <li style="padding:10px; background:var(--pc-paper); border-radius:10px; font-size:13px; display:flex; align-items:center; gap:10px;"><i class="fas fa-map-location-dot" style="color:var(--pc-accent); width:18px;"></i> Community water map</li>
        <li style="padding:10px; background:var(--pc-paper); border-radius:10px; font-size:13px; display:flex; align-items:center; gap:10px;"><i class="fas fa-flag" style="color:var(--pc-accent); width:18px;"></i> Report pollution concerns</li>
        <li style="padding:10px; background:var(--pc-paper); border-radius:10px; font-size:13px; display:flex; align-items:center; gap:10px;"><i class="fas fa-seedling" style="color:var(--pc-accent); width:18px;"></i> Join community actions</li>
        <li style="padding:10px; background:var(--pc-paper); border-radius:10px; font-size:13px; display:flex; align-items:center; gap:10px;"><i class="fas fa-graduation-cap" style="color:var(--pc-accent); width:18px;"></i> Learn about water health</li>
      </ul>
      
      <div style="margin-top:20px; padding:14px; background:linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(34, 211, 238, 0.08)); border-left:3px solid var(--pc-success); border-radius:12px;">
        <p style="font-weight:800; color:var(--pc-success); font-size:11px; text-transform:uppercase; letter-spacing:0.4px; margin-bottom:6px;">
          <i class="fas fa-heart-pulse"></i> One Health Approach
        </p>
        <p style="font-size:12.5px; color:var(--pc-text-2); line-height:1.5; margin:0;">
          AquaQuest follows the One Health framework — recognizing that the health of water, wildlife, and people are deeply connected. Healthy waters mean healthy communities.
        </p>
      </div>
      
      <p style="text-align:center; font-size:11px; color:var(--pc-text-muted); margin-top:20px;">
        AquaQuest · Citizen Science Platform
      </p>
  `;

  openModal('aboutModal');
}

/* ============================================================ */
/* LOGIN MODAL                                                   */
/* ============================================================ */
function renderLoginModal() {
  const modal = document.getElementById('loginModal');
  if (!modal) return;

  modal.querySelector('.modal-content').innerHTML = `
    <button class="close-modal" onclick="closeModal('loginModal')">
      <i class="fas fa-times"></i>
    </button>

    <div style="text-align:center; margin-bottom:22px;">
      <div style="width:68px; height:68px; border-radius:50%; background:linear-gradient(135deg, var(--pc-accent-soft), var(--pc-primary-light)); color:var(--pc-accent); display:flex; align-items:center; justify-content:center; font-size:30px; margin:0 auto 14px; border:3px solid var(--pc-card); box-shadow:0 6px 18px rgba(8,145,178,0.2);">
        <i class="fas fa-water"></i>
      </div>
      <h2 style="font-size:1.35rem; font-weight:800; color:var(--pc-text); margin-bottom:4px;">Welcome to AquaQuest</h2>
      <p style="font-size:15px; color:var(--pc-accent); font-family:'Caveat', cursive; font-weight:600;">Explore · Navigate · Discover</p>
    </div>

    <div style="padding:10px 14px; background:var(--pc-warning-soft); border-left:3px solid var(--pc-warning); border-radius:10px; margin-bottom:16px;">
      <p style="font-size:11.5px; color:var(--pc-text-2); line-height:1.5; margin:0; font-weight:600;">
        <i class="fas fa-info-circle" style="color:var(--pc-warning);"></i>
        <strong>Prototype:</strong> Create a local account to test the full workflow. No real authentication.
      </p>
    </div>

    <div style="display:flex; gap:6px; padding:4px; background:var(--pc-paper); border-radius:50px; margin-bottom:18px;">
      <button type="button" id="loginTabBtn" class="auth-tab-btn active" onclick="switchAuthTab('login')" style="flex:1; padding:10px; border:none; border-radius:50px; font-size:13px; font-weight:800; cursor:pointer; font-family:inherit; background:var(--pc-accent); color:#fff; transition:all 0.2s ease;">
        Sign In
      </button>
      <button type="button" id="signupTabBtn" class="auth-tab-btn" onclick="switchAuthTab('signup')" style="flex:1; padding:10px; border:none; border-radius:50px; font-size:13px; font-weight:800; cursor:pointer; font-family:inherit; background:transparent; color:var(--pc-text-2); transition:all 0.2s ease;">
        Sign Up
      </button>
    </div>

    <form id="loginForm" onsubmit="handleLoginSubmit(event)">
      <div id="signupNameWrap" style="display:none;">
        <label>Your Name</label>
        <input type="text" id="signupName" placeholder="e.g. Luzayna Rahman">
      </div>

      <label>Email</label>
      <input type="email" id="loginEmail" placeholder="you@example.com" required>

      <label style="margin-top:12px;">Password</label>
      <input type="password" id="loginPassword" placeholder="Enter password" required>

      <button type="submit" id="authSubmitBtn" class="btn btn-primary w-full" style="margin-top:16px;">
        <i class="fas fa-sign-in-alt"></i> Sign In
      </button>
    </form>

    <div style="text-align:center; margin-top:14px; padding-top:14px; border-top:1px solid var(--pc-border-light);">
      <p style="font-size:11.5px; color:var(--pc-text-muted); font-weight:600; margin-bottom:8px;">
        Or explore with seeded data
      </p>
      <button type="button" class="btn btn-accent w-full" onclick="closeModal('loginModal'); DemoMode.start()">
        <i class="fas fa-flask"></i> Try Demo Account
      </button>
      <p style="font-size:10.5px; color:var(--pc-text-muted); margin-top:8px;">
        demo@aquaquest.app · demo1234
      </p>
    </div>
  `;

  openModal('loginModal');
}

/* ============================================================ */
/* AUTH TAB SWITCHER                                             */
/* ============================================================ */
let authMode = 'login';

function switchAuthTab(mode) {
  authMode = mode;

  const loginBtn = document.getElementById('loginTabBtn');
  const signupBtn = document.getElementById('signupTabBtn');
  const nameWrap = document.getElementById('signupNameWrap');
  const submitBtn = document.getElementById('authSubmitBtn');

  if (mode === 'login') {
    loginBtn.style.background = 'var(--pc-accent)';
    loginBtn.style.color = '#fff';
    signupBtn.style.background = 'transparent';
    signupBtn.style.color = 'var(--pc-text-2)';
    if (nameWrap) nameWrap.style.display = 'none';
    if (submitBtn) submitBtn.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In';
  } else {
    signupBtn.style.background = 'var(--pc-accent)';
    signupBtn.style.color = '#fff';
    loginBtn.style.background = 'transparent';
    loginBtn.style.color = 'var(--pc-text-2)';
    if (nameWrap) nameWrap.style.display = 'block';
    if (submitBtn) submitBtn.innerHTML = '<i class="fas fa-user-plus"></i> Create Account';
  }
}

/* ============================================================ */
/* UNIFIED AUTH SUBMIT — handles both login & signup             */
/* ============================================================ */
async function handleLoginSubmit(e) {
  e.preventDefault();

  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  if (!email || !password) {
    showToast('Please fill all fields');
    return;
  }

  const submitBtn = document.getElementById('authSubmitBtn');
  const originalHTML = submitBtn ? submitBtn.innerHTML : '';

  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Please wait...';
  }

  let result;

  if (authMode === 'signup') {
    const name = document.getElementById('signupName')?.value.trim();
    result = await API.signup(email, password, name);
  } else {
    result = await API.login(email, password);
  }

  if (submitBtn) {
    submitBtn.disabled = false;
    submitBtn.innerHTML = originalHTML;
  }

  if (!result.success) {
    showToast(result.error || 'Authentication failed');
    return;
  }

  /* Demo account flow */
  if (result.data.isDemo) {
    closeModal('loginModal');

    if (typeof DemoMode !== 'undefined') {
      await DemoMode.load();
      showToast('Demo account loaded');
      setTimeout(() => window.location.reload(), 800);
    }
    return;
  }

  /* Real user flow */
  const userResult = await API.getCurrentUser(result.data.userId);

  if (!userResult.success) {
    showToast('Could not load user');
    return;
  }

  APP.token = result.data.token;
  APP.user = userResult.data;

  localStorage.setItem(APP.KEYS.TOKEN, APP.token);
  localStorage.setItem(APP.KEYS.USER, JSON.stringify(APP.user));

  /* ⭐ Mark as returning user */
  if (typeof AppMode !== 'undefined') {
    AppMode.markReturning();
  }
  
  /* ⭐ Create welcome notification */
  if (typeof addNotification === 'function') {
    addNotification(
      'system',
      '🌊 Welcome to AquaQuest',
      `Hi ${APP.user.name || 'Explorer'}! Start by recording your first observation at a nearby waterbody.`
    );
  }

  closeModal('loginModal');
  showToast('Welcome, ' + (APP.user.name || 'Explorer'));
  refreshDrawer();

  if (APP.currentPage === 'profile' && typeof renderProfile === 'function') {
    renderProfile();
  }
  if (APP.currentPage === 'home' && typeof renderHome === 'function') {
    renderHome();
  }
}

/* ============================================================ */
/* EXPORTS — add these                                       */
/* ============================================================ */
window.switchAuthTab = switchAuthTab;

/* ============================================================ */
/* AUTO-INIT + EXPORT                                            */
/* ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  Drawer.init();
});

window.Drawer = Drawer;
window.openDrawer = openDrawer;
window.closeDrawer = closeDrawer;
window.refreshDrawer = refreshDrawer;
window.handleExportData = handleExportData;
window.handleClearData = handleClearData;
window.renderAboutModal = renderAboutModal;
window.renderLoginModal = renderLoginModal;
window.handleLoginSubmit = handleLoginSubmit;

console.log('[AquaQuest] Drawer loaded');