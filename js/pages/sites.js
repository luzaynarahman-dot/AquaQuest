/* ============================================================ */
/* AQUAQUEST — MY WATERS PAGE (Explore Waters)                   */
/* List of all waterbodies + user's monitored                   */
/* ============================================================ */

let sitesState = {
  filter: 'all',
  showOnlyMonitored: false
};

/* ============================================================ */
/* 1. MAIN RENDER                                                */
/* ============================================================ */
function renderSites() {
  const page = document.getElementById('page-sites');
  if (!page) return;

  const monitoredCount = typeof Monitoring !== 'undefined'
    ? Monitoring.count()
    : 0;

  page.innerHTML = `
    <div class="page-container">

      ${renderBackHeader(
        'Explore Waters',
        SITES.length + ' waterbodies to explore' + (monitoredCount > 0 ? ` · ${monitoredCount} monitored` : '')
      )}

      ${monitoredCount > 0 ? `
        <div class="sites-toggle-row">
          <button class="sites-toggle-chip ${!sitesState.showOnlyMonitored ? 'active' : ''}"
                  onclick="toggleSitesView(false)">
            <i class="fas fa-globe"></i> All Waters (${SITES.length})
          </button>
          <button class="sites-toggle-chip ${sitesState.showOnlyMonitored ? 'active' : ''}"
                  onclick="toggleSitesView(true)">
            <i class="fas fa-eye"></i> My Waters (${monitoredCount})
          </button>
        </div>
      ` : ''}

      <div class="site-filter-chips" id="siteFilterChips">
        ${renderFilterChips()}
      </div>

      <div class="sites-list-full" id="sitesListFull">
        ${renderSitesList()}
      </div>

    </div>
  `;

  attachSitesHandlers();
}

/* ============================================================ */
/* 2. FILTER CHIPS                                               */
/* ============================================================ */
function renderFilterChips() {
  const filters = [
    { id: 'all',       label: 'All',        icon: 'fa-border-all' },
    { id: 'river',     label: 'Rivers',     icon: 'fa-water' },
    { id: 'canal',     label: 'Canals',     icon: 'fa-water' },
    { id: 'stream',    label: 'Streams',    icon: 'fa-water' },
    { id: 'beach',     label: 'Beaches',    icon: 'fa-umbrella-beach' },
    { id: 'wetland',   label: 'Wetlands',   icon: 'fa-leaf' },
    { id: 'estuary',   label: 'Estuaries',  icon: 'fa-water' }
  ];

  return filters.map(f => `
    <button class="site-filter-chip ${sitesState.filter === f.id ? 'active' : ''}"
            data-site-filter="${f.id}">
      <i class="fas ${f.icon}"></i> ${f.label}
    </button>
  `).join('');
}

/* ============================================================ */
/* 3. SITES LIST                                                 */
/* ============================================================ */
function renderSitesList() {
  let sites = SITES;

  /* Filter by type */
  if (sitesState.filter !== 'all') {
    sites = sites.filter(s => s.type === sitesState.filter);
  }

  /* Filter by monitored */
  if (sitesState.showOnlyMonitored && typeof Monitoring !== 'undefined') {
    const monitoredIds = Monitoring.getMonitoredIds();
    sites = sites.filter(s => monitoredIds.includes(s.id));
  }

  if (!sites.length) {
    const isEmptyMonitored = sitesState.showOnlyMonitored && Monitoring.count() === 0;

    return `
      <div class="empty-state" style="background:var(--pc-card); border-radius:16px; padding:40px 20px;">
        <i class="fas ${isEmptyMonitored ? 'fa-eye' : 'fa-water'}"></i>
        <p style="font-size:14px; font-weight:700; color:var(--pc-text); margin-bottom:6px;">
          ${isEmptyMonitored ? 'No monitored waters yet' : 'No sites in this category'}
        </p>
        <p style="font-size:12.5px; color:var(--pc-text-muted); margin-bottom:14px;">
          ${isEmptyMonitored
            ? 'Monitor a waterbody from the Explore tab to keep track of it'
            : 'Try a different filter'}
        </p>
        ${isEmptyMonitored ? `
          <button class="btn btn-primary btn-sm" onclick="toggleSitesView(false)">
            <i class="fas fa-compass"></i> Explore All Waters
          </button>
        ` : ''}
      </div>
    `;
  }

  return sites.map(site => renderSiteListCard(site)).join('');
}

function renderSiteListCard(site) {
  const obsCount = Observations.getBySite(site.id).length;
  const stats = Observations.getSiteStats(site.id);
  const health = stats.health;
  const isMonitored = typeof Monitoring !== 'undefined' && Monitoring.isMonitored(site.id);

  const healthLabel = {
    excellent: 'Excellent',
    good: 'Good',
    moderate: 'Moderate',
    poor: 'Poor',
    critical: 'Critical'
  }[health.grade] || 'Moderate';

  const healthColor = {
    excellent: 'var(--aq-excellent)',
    good: 'var(--aq-good)',
    moderate: 'var(--aq-moderate)',
    poor: 'var(--aq-poor)',
    critical: 'var(--aq-critical)'
  }[health.grade] || 'var(--aq-moderate)';

  return `
    <button class="site-list-card" onclick="openSiteDetail('${site.id}')">
      <div class="site-list-cover">
        <img src="${site.cover}" alt="${escapeHtml(site.name)}" onerror="this.style.opacity='0'">
        <span class="site-card-type-badge">
          <i class="fas ${getSiteTypeIcon(site.type)}"></i>
          ${getSiteTypeLabel(site.type)}
        </span>
        <span class="site-card-health health-${health.grade}"></span>
        ${isMonitored ? `
          <span class="site-list-monitor-badge" title="You are monitoring this">
            <i class="fas fa-eye"></i>
          </span>
        ` : ''}
      </div>
      <div class="site-list-body">
        <div class="site-list-top">
          <div style="flex:1; min-width:0;">
            <p class="site-list-name">${escapeHtml(site.name)}</p>
            <p class="site-list-location">
              <i class="fas fa-map-marker-alt"></i> ${escapeHtml(site.location.area)}
            </p>
          </div>
          <span class="site-list-health-chip" style="color:${healthColor}; background:${healthColor}15; border-color:${healthColor}40;">
            <i class="fas fa-circle" style="font-size:7px;"></i> ${healthLabel}
          </span>
        </div>

        <p class="site-list-desc">${escapeHtml(site.description.substring(0, 110))}${site.description.length > 110 ? '…' : ''}</p>

        <div class="site-list-footer">
          <span class="site-list-stat">
            <i class="fas fa-eye"></i> ${obsCount} obs
          </span>
          <span class="site-list-stat">
            <i class="fas fa-users"></i> ${getObserversCount(site.id)} observers
          </span>
          <span class="site-list-stat" style="margin-left:auto;">
            View <i class="fas fa-arrow-right"></i>
          </span>
        </div>
      </div>
    </button>
  `;
}

/* ============================================================ */
/* 4. TOGGLE MONITORED VIEW                                      */
/* ============================================================ */
function toggleSitesView(showOnlyMonitored) {
  sitesState.showOnlyMonitored = showOnlyMonitored;

  document.querySelectorAll('.sites-toggle-chip').forEach((chip, idx) => {
    const isAll = idx === 0;
    chip.classList.toggle('active',
      (showOnlyMonitored && !isAll) || (!showOnlyMonitored && isAll)
    );
  });

  const list = document.getElementById('sitesListFull');
  if (list) list.innerHTML = renderSitesList();
}

/* ============================================================ */
/* 5. HANDLERS                                                   */
/* ============================================================ */
function attachSitesHandlers() {
  document.querySelectorAll('[data-site-filter]').forEach(chip => {
    chip.addEventListener('click', () => {
      sitesState.filter = chip.dataset.siteFilter;

      document.querySelectorAll('[data-site-filter]').forEach(c => {
        c.classList.toggle('active', c.dataset.siteFilter === sitesState.filter);
      });

      const list = document.getElementById('sitesListFull');
      if (list) list.innerHTML = renderSitesList();
    });
  });
}

/* ============================================================ */
/* 6. EXPORTS                                                    */
/* ============================================================ */
window.renderSites = renderSites;
window.toggleSitesView = toggleSitesView;

console.log('[AquaQuest] Sites page loaded');