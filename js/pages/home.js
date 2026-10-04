/* ============================================================ */
/* AQUAQUEST — EXPLORE (HOME) PAGE                               */
/* Dashboard — "Explore Waters" section (not "My Waters")        */
/* ============================================================ */

let homeState = {
  tipIndex: 0
};

/* ============================================================ */
/* 1. MAIN RENDER                                                */
/* ============================================================ */
function renderHome() {
  const page = document.getElementById('page-home');
  if (!page) return;

  if (typeof SITES === 'undefined' || typeof CHALLENGES === 'undefined') {
    console.warn('[Home] Data not ready, retrying...');
    setTimeout(renderHome, 200);
    return;
  }

  const user = APP.user;
  const userName = user ? (user.name || 'Explorer').split(' ')[0] : 'Explorer';

  page.innerHTML = `
    <div class="page-container">

      ${renderExploreHero(userName)}
      ${renderMapPreviewCard()}
      ${renderQuickStats()}

      ${renderExploreWaters()}
      ${renderRecentObservations()}
      ${renderCommunityActions()}
      ${renderTipCard()}

    </div>
  `;

  attachHomeHandlers();
}

/* ============================================================ */
/* 2. HERO                                                       */
/* ============================================================ */
function renderExploreHero(userName) {
  const greeting = getTimeGreeting();

  return `
    <section class="explore-hero">
      <div class="explore-hero-inner">
        <div>
          <h2 class="explore-greeting">${greeting}, ${escapeHtml(userName)}</h2>
          <p class="explore-sub">Discover the health of waterbodies around you</p>
          <button class="explore-cta" onclick="quickActionObserve()">
            <i class="fas fa-eye"></i> Record Observation
          </button>
        </div>
        <div class="explore-illustration">
          <img src="assets/hero-welcome.jpg" alt="" onerror="this.style.opacity='0'">
        </div>
      </div>
    </section>
  `;
}

function getTimeGreeting() {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

/* ============================================================ */
/* 3. MAP PREVIEW                                                */
/* ============================================================ */
function renderMapPreviewCard() {
  const siteCount = SITES.length;
  const obsCount = (APP.observations || []).length;

  return `
    <button class="map-preview-card" onclick="showPage('map')">
      <div class="map-preview-text">
        <p class="map-preview-label">
          <i class="fas fa-map-location-dot"></i> Community Map
        </p>
        <p class="map-preview-title">Explore waterbodies near you</p>
        <p class="map-preview-sub">${siteCount} sites · ${obsCount} observations</p>
      </div>
      <div class="map-preview-icon">
        <i class="fas fa-map-location-dot"></i>
      </div>
    </button>
  `;
}

/* ============================================================ */
/* 4. QUICK STATS                                                */
/* ============================================================ */
function renderQuickStats() {
  const isLoggedInUser = typeof isLoggedIn === 'function' && isLoggedIn();

  const monitored = isLoggedInUser && typeof Monitoring !== 'undefined'
    ? Monitoring.count()
    : 0;
  const myObs = isLoggedInUser ? Observations.getMine().length : 0;
  const streak = isLoggedInUser ? (APP.streak || 0) : 0;
  const points = isLoggedInUser ? (APP.points || 0) : 0;

  return `
    <div class="quick-stats">
      <button class="quick-stat" onclick="scrollToMyWaters()">
        <div class="quick-stat-icon" style="color:var(--pc-accent);"><i class="fas fa-water"></i></div>
        <p class="quick-stat-value">${monitored}</p>
        <p class="quick-stat-label">Monitoring</p>
      </button>
      <button class="quick-stat" onclick="showPage('profile')">
        <div class="quick-stat-icon" style="color:var(--pc-success);"><i class="fas fa-eye"></i></div>
        <p class="quick-stat-value">${myObs}</p>
        <p class="quick-stat-label">Observations</p>
      </button>
      <button class="quick-stat" onclick="showPage('profile')">
        <div class="quick-stat-icon" style="color:var(--pc-warning);"><i class="fas fa-fire"></i></div>
        <p class="quick-stat-value">${streak}</p>
        <p class="quick-stat-label">Day Streak</p>
      </button>
      <button class="quick-stat" onclick="showPage('profile')">
        <div class="quick-stat-icon" style="color:var(--pc-purple);"><i class="fas fa-medal"></i></div>
        <p class="quick-stat-value">${formatCount(points)}</p>
        <p class="quick-stat-label">Points</p>
      </button>
    </div>
  `;
}

/* ============================================================ */
/* 5. EXPLORE WATERS (was "My Waters")                           */
/* ============================================================ */
function renderExploreWaters() {
  const sites = SITES.slice(0, 6);

  return `
    <div class="section-title-row">
      <h3 class="section-title"><i class="fas fa-water"></i> Explore Waters</h3>
      <button class="section-link" onclick="showPage('sites')">
        See all <i class="fas fa-arrow-right"></i>
      </button>
    </div>
    <div class="site-scroll">
      ${sites.map(site => renderSiteCard(site)).join('')}
    </div>
  `;
}

function renderSiteCard(site) {
  const obsCount = (APP.observations || []).filter(o => o.siteId === site.id).length;
  const health = computeSiteHealth(site.id);
  const isMonitored = typeof Monitoring !== 'undefined' && Monitoring.isMonitored(site.id);

  return `
    <button class="site-card" onclick="openSiteDetail('${site.id}')">
      <div class="site-card-img">
        <img src="${site.cover}" alt="${escapeHtml(site.name)}" onerror="this.style.opacity='0'">
        <span class="site-card-type-badge">
          <i class="fas ${getSiteTypeIcon(site.type)}"></i>
          ${getSiteTypeLabel(site.type)}
        </span>
        <span class="site-card-health health-${health.grade}"></span>
        ${isMonitored ? `
          <span class="site-card-monitor-badge" title="Monitoring">
            <i class="fas fa-eye"></i>
          </span>
        ` : ''}
      </div>
      <div class="site-card-body">
        <p class="site-card-name">${escapeHtml(site.name)}</p>
        <p class="site-card-location">
          <i class="fas fa-map-marker-alt"></i> ${escapeHtml(site.location.area)}
        </p>
        <div class="site-card-meta">
          <span><i class="fas fa-eye"></i> ${obsCount}</span>
          <span><i class="fas fa-users"></i> ${getObserversCount(site.id)}</span>
        </div>
      </div>
    </button>
  `;
}

/* ============================================================ */
/* 6. RECENT OBSERVATIONS                                        */
/* ============================================================ */
function renderRecentObservations() {
  const isLoggedInUser = typeof isLoggedIn === 'function' && isLoggedIn();

  if (!isLoggedInUser) {
    return `
      <div class="section-title-row">
        <h3 class="section-title"><i class="fas fa-eye"></i> Recent Observations</h3>
      </div>
      <div class="empty-state" style="background:var(--pc-card); border-radius:16px; padding:40px 20px;">
        <i class="fas fa-eye"></i>
        <p style="font-size:14px; font-weight:700; color:var(--pc-text); margin-bottom:6px;">Sign in to start observing</p>
        <p style="font-size:12.5px; color:var(--pc-text-muted); margin-bottom:16px;">Log water conditions, wildlife, and changes at your local waterbodies</p>
        <button class="btn btn-primary btn-sm" onclick="openModal('loginModal'); if(typeof renderLoginModal==='function') renderLoginModal();">
          <i class="fas fa-sign-in-alt"></i> Sign In
        </button>
      </div>
    `;
  }

  const obs = Observations.getMine().slice(0, 3);

  if (!obs.length) {
    return `
      <div class="section-title-row">
        <h3 class="section-title"><i class="fas fa-eye"></i> Recent Observations</h3>
      </div>
      <div class="empty-state" style="background:var(--pc-card); border-radius:16px; padding:40px 20px;">
        <i class="fas fa-eye"></i>
        <p style="font-size:14px; font-weight:700; color:var(--pc-text); margin-bottom:6px;">No observations yet</p>
        <p style="font-size:12.5px; color:var(--pc-text-muted); margin-bottom:16px;">Start your journey — record your first water observation</p>
        <button class="btn btn-primary btn-sm" onclick="quickActionObserve()">
          <i class="fas fa-plus"></i> Record First Observation
        </button>
      </div>
    `;
  }

  return `
    <div class="section-title-row">
      <h3 class="section-title"><i class="fas fa-eye"></i> Recent Observations</h3>
      <button class="section-link" onclick="showPage('feed')">
        See all <i class="fas fa-arrow-right"></i>
      </button>
    </div>
    <div class="obs-feed">
      ${obs.map(o => renderObservationCard(o)).join('')}
    </div>
  `;
}

function renderObservationCard(obs) {
  const site = getSiteById(obs.siteId);
  const siteName = site ? site.name : 'Unknown Site';
  const timeStr = timeAgo(obs.date);

  const clarityLabel = getClarityLabel(obs.clarity);
  const clarityClass = getClarityClass(obs.clarity);

  const thumbHtml = obs.photo
    ? `<div class="obs-thumb"><img src="${obs.photo}" alt="" onerror="this.style.opacity='0'"></div>`
    : `<div class="obs-thumb no-photo"><i class="fas fa-water"></i></div>`;

  return `
    <button class="obs-card" onclick="openObservationDetail('${obs.id}')">
      ${thumbHtml}
      <div class="obs-info">
        <p class="obs-site-name">
          <i class="fas fa-map-marker-alt"></i> ${escapeHtml(siteName)}
        </p>
        <p class="obs-note">${escapeHtml(obs.note || 'No note')}</p>
        <div class="obs-footer">
          <span class="obs-indicator ${clarityClass}">
            <i class="fas fa-eye"></i> ${clarityLabel}
          </span>
          <span class="obs-footer-item">
            <i class="far fa-clock"></i> ${timeStr}
          </span>
        </div>
      </div>
    </button>
  `;
}

function getClarityLabel(clarity) {
  const map = {
    excellent: 'Excellent',
    good: 'Good',
    moderate: 'Moderate',
    poor: 'Poor',
    critical: 'Critical'
  };
  return map[clarity] || 'Unknown';
}

function getClarityClass(clarity) {
  return 'ind-' + (clarity || 'moderate');
}

/* ============================================================ */
/* 7. COMMUNITY ACTIONS                                          */
/* ============================================================ */
function renderCommunityActions() {
  const actions = CHALLENGES.slice(0, 4);

  return `
    <div class="section-title-row">
      <h3 class="section-title"><i class="fas fa-seedling"></i> Community Actions</h3>
      <button class="section-link" onclick="showPage('actions')">
        See all <i class="fas fa-arrow-right"></i>
      </button>
    </div>
    <div class="action-scroll">
      ${actions.map(a => renderActionCard(a)).join('')}
    </div>
  `;
}

function renderActionCard(action) {
  const joined = (APP.joinedActions || []).includes(action.id);

  return `
    <button class="action-card" onclick="openActionDetail('${action.id}')">
      <div class="action-card-img">
        <img src="${action.cover}" alt="" onerror="this.style.opacity='0'">
        <span class="action-card-badge" style="background:${action.color}DD;">
          <i class="fas ${action.icon}"></i> ${capitalize(action.type.replace('-', ' '))}
        </span>
        <span class="action-card-points">
          <i class="fas fa-star"></i> ${action.points}
        </span>
        <div class="action-card-title-overlay">
          <p>${escapeHtml(action.title)}</p>
        </div>
      </div>
      <div class="action-card-body">
        <div class="action-card-meta-row">
          <span><i class="fas fa-users"></i> ${action.joined}/${action.maxParticipants}</span>
          <span>${joined ? '✓ Joined' : 'Tap to view'}</span>
        </div>
      </div>
    </button>
  `;
}

/* ============================================================ */
/* 8. TIP CARD                                                   */
/* ============================================================ */
const DAILY_TIPS = [
  'Take photos from the same spot every time — consistency turns random photos into powerful scientific data.',
  'Healthy freshwater sits between pH 6.5 and 8.5. Test with simple strips and log your readings.',
  'If you see a sudden fish kill, report it immediately. Early detection saves entire ecosystems.',
  'Early morning is the best time to observe wildlife around waterbodies — birds and fish are most active.',
  'Mangroves absorb up to 4x more carbon than rainforests. Support restoration actions near you.',
  'Water clarity is the fastest indicator of water health. Note it every time you visit.',
  'Litter on the bank today becomes microplastics in the water tomorrow. Every cleanup counts.',
  'Otters, kingfishers, and dragonflies are all indicators of healthy water. Watch for them.'
];

function renderTipCard() {
  const tip = DAILY_TIPS[homeState.tipIndex % DAILY_TIPS.length];

  return `
    <div class="tip-card">
      <p class="tip-label">
        <i class="fas fa-lightbulb"></i> Today's Tip
      </p>
      <p class="tip-text">${tip}</p>
      <button class="section-link" style="margin-top:10px; color:var(--pc-warning);" onclick="nextHomeTip()">
        Next tip <i class="fas fa-arrow-right"></i>
      </button>
    </div>
  `;
}

function nextHomeTip() {
  homeState.tipIndex = (homeState.tipIndex + 1) % DAILY_TIPS.length;
  renderHome();
}

/* ============================================================ */
/* 9. SITE HEALTH COMPUTATION                                    */
/* ============================================================ */
function computeSiteHealth(siteId) {
  const observations = (APP.observations || []).filter(o => o.siteId === siteId);

  if (!observations.length) {
    return { grade: 'moderate', score: 50 };
  }

  const recent = observations.slice(0, 10);

  let score = 0;
  recent.forEach(o => {
    const clarityScore = { excellent: 4, good: 3, moderate: 2, poor: 1, critical: 0 }[o.clarity] ?? 2;
    const litterScore = { none: 4, little: 3, moderate: 2, heavy: 1, severe: 0 }[o.litter] ?? 2;
    score += (clarityScore + litterScore) / 2;
  });

  const avg = score / recent.length;
  const normalized = (avg / 4) * 100;

  let grade;
  if (normalized >= 85) grade = 'excellent';
  else if (normalized >= 65) grade = 'good';
  else if (normalized >= 45) grade = 'moderate';
  else if (normalized >= 25) grade = 'poor';
  else grade = 'critical';

  return { grade, score: Math.round(normalized) };
}

/* ============================================================ */
/* 10. SCROLL HELPER                                             */
/* ============================================================ */
function scrollToMyWaters() {
  if (typeof isLoggedIn === 'function' && !isLoggedIn()) {
    if (typeof showToast === 'function') showToast('Sign in to see My Waters');
    return;
  }
  showPage('profile');
  setTimeout(() => {
    if (typeof scrollToProfileSites === 'function') scrollToProfileSites();
  }, 400);
}

/* ============================================================ */
/* 11. HANDLERS                                                  */
/* ============================================================ */
function attachHomeHandlers() {
  /* Handlers already inline */
}

/* ============================================================ */
/* 12. EXPORTS                                                   */
/* ============================================================ */
window.renderHome = renderHome;
window.computeSiteHealth = computeSiteHealth;
window.nextHomeTip = nextHomeTip;
window.scrollToMyWaters = scrollToMyWaters;

console.log('[AquaQuest] Home page loaded');