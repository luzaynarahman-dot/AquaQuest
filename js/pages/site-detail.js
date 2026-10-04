/* ============================================================ */
/* AQUAQUEST — SITE DETAIL PAGE                                  */
/* Single waterbody — stats, charts, observations, wildlife      */
/* + Monitor button                                              */
/* ============================================================ */

let siteDetailState = {
  siteId: null,
  activeTab: 'overview'
};

/* ============================================================ */
/* 1. OPEN / CLOSE                                               */
/* ============================================================ */
function openSiteDetail(siteId) {
  const site = getSiteById(siteId);
  if (!site) {
    showToast('Site not found');
    return;
  }

  siteDetailState.siteId = siteId;
  siteDetailState.activeTab = 'overview';
  APP.activeSiteId = siteId;
  Storage.set(APP.KEYS.ACTIVE_SITE, siteId);

  showPage('site-detail');
  renderSiteDetail();
}

function closeSiteDetail() {
  siteDetailState.siteId = null;

  if (typeof NavHistory !== 'undefined') {
    NavHistory.back();
  } else {
    showPage('sites', { _skipHistoryPush: true });
  }
}

/* ============================================================ */
/* 2. MAIN RENDER                                                */
/* ============================================================ */
function renderSiteDetail() {
  const page = document.getElementById('page-site-detail');
  if (!page) return;

  const siteId = siteDetailState.siteId;
  const site = getSiteById(siteId);
  if (!site) return;

  const stats = Observations.getSiteStats(siteId);
  const obs = Observations.getBySite(siteId);
  const observersCount = getObserversCount(siteId);

  page.innerHTML = `
    <div class="page-container">

      <div class="site-detail-cover-wrap">
        <div class="site-detail-cover">
          <img src="${site.cover}" alt="${escapeHtml(site.name)}" onerror="this.style.opacity='0'">
          <div class="site-detail-cover-overlay"></div>
          <button type="button" class="site-detail-back" onclick="closeSiteDetail()" aria-label="Back">
            <i class="fas fa-arrow-left"></i>
          </button>
          <button type="button" class="site-detail-share" onclick="shareSite('${siteId}')" aria-label="Share">
            <i class="fas fa-share-alt"></i>
          </button>
          <div class="site-detail-cover-title">
            <span class="site-card-type-badge">
              <i class="fas ${getSiteTypeIcon(site.type)}"></i>
              ${getSiteTypeLabel(site.type)}
            </span>
            <h1 class="site-detail-name">${escapeHtml(site.name)}</h1>
            <p class="site-detail-loc">
              <i class="fas fa-map-marker-alt"></i> ${escapeHtml(site.location.area)}, ${escapeHtml(site.location.district)}
            </p>
          </div>
        </div>
      </div>

      ${renderSiteMonitorBar(siteId)}

      ${renderStatsRow(stats, site, observersCount)}

      <div class="site-detail-tabs">
        <button type="button" class="site-detail-tab ${siteDetailState.activeTab === 'overview' ? 'active' : ''}" data-site-detail-tab="overview">
          <i class="fas fa-chart-line"></i> Overview
        </button>
        <button type="button" class="site-detail-tab ${siteDetailState.activeTab === 'observations' ? 'active' : ''}" data-site-detail-tab="observations">
          <i class="fas fa-eye"></i> Observations
        </button>
        <button type="button" class="site-detail-tab ${siteDetailState.activeTab === 'wildlife' ? 'active' : ''}" data-site-detail-tab="wildlife">
          <i class="fas fa-fish"></i> Wildlife
        </button>
        <button type="button" class="site-detail-tab ${siteDetailState.activeTab === 'about' ? 'active' : ''}" data-site-detail-tab="about">
          <i class="fas fa-info-circle"></i> About
        </button>
      </div>

      <div id="siteDetailTabContent">
        ${renderSiteTabContent(siteId, site, stats, obs, observersCount)}
      </div>

      <button type="button" class="site-observe-cta" onclick="observeAtSite('${siteId}')">
        <i class="fas fa-plus-circle"></i>
        Record Observation at ${escapeHtml(site.name)}
      </button>

    </div>
  `;

  attachSiteDetailHandlers();

  setTimeout(() => initSiteCharts(siteId), 100);
}

/* ============================================================ */
/* 3. MONITOR BAR                                                */
/* ============================================================ */
function renderSiteMonitorBar(siteId) {
  const isMonitoring = typeof Monitoring !== 'undefined' && Monitoring.isMonitored(siteId);
  const isCustom = typeof SiteCreation !== 'undefined' && SiteCreation.isCustom(siteId);

  return `
    <div class="site-monitor-bar">
      <div class="site-monitor-info">
        <i class="fas fa-water"></i>
        <div>
          <p class="site-monitor-title">${isMonitoring ? 'You are monitoring this water' : 'Track this waterbody'}</p>
          <p class="site-monitor-sub">${isMonitoring ? 'Updates will appear in My Waters' : 'Get updates in your personal My Waters list'}</p>
        </div>
      </div>
      <div class="site-monitor-actions">
        ${typeof Monitoring !== 'undefined' ? Monitoring.renderMonitorButton(siteId) : ''}
        ${isCustom ? `
          <button type="button"
                  class="site-delete-btn"
                  onclick="confirmDeleteCustomSite('${siteId}')"
                  aria-label="Delete site">
            <i class="fas fa-trash"></i>
          </button>
        ` : ''}
      </div>
    </div>
  `;
}

/* ============================================================ */
/* 4. STATS ROW                                                  */
/* ============================================================ */
function renderStatsRow(stats, site, observersCount) {
  const healthLabel = capitalize(stats.health.grade);
  const healthColor = {
    excellent: 'var(--aq-excellent)',
    good: 'var(--aq-good)',
    moderate: 'var(--aq-moderate)',
    poor: 'var(--aq-poor)',
    critical: 'var(--aq-critical)'
  }[stats.health.grade] || 'var(--aq-moderate)';

  return `
    <div class="site-detail-stats">
      <div class="site-detail-stat">
        <div class="site-detail-stat-icon" style="background:${healthColor}20; color:${healthColor};">
          <i class="fas fa-heart-pulse"></i>
        </div>
        <p class="site-detail-stat-value" style="color:${healthColor};">${healthLabel}</p>
        <p class="site-detail-stat-label">Health</p>
      </div>
      <div class="site-detail-stat">
        <div class="site-detail-stat-icon" style="background:var(--pc-accent-soft); color:var(--pc-accent);">
          <i class="fas fa-eye"></i>
        </div>
        <p class="site-detail-stat-value">${stats.count}</p>
        <p class="site-detail-stat-label">Observations</p>
      </div>
      <div class="site-detail-stat">
        <div class="site-detail-stat-icon" style="background:var(--pc-purple-soft); color:var(--pc-purple);">
          <i class="fas fa-users"></i>
        </div>
        <p class="site-detail-stat-value">${observersCount}</p>
        <p class="site-detail-stat-label">Observers</p>
      </div>
      <div class="site-detail-stat">
        <div class="site-detail-stat-icon" style="background:var(--pc-warning-soft); color:var(--pc-warning);">
          <i class="far fa-clock"></i>
        </div>
        <p class="site-detail-stat-value">${stats.lastObserved ? timeAgo(stats.lastObserved) : '—'}</p>
        <p class="site-detail-stat-label">Last Update</p>
      </div>
    </div>
  `;
}

/* ============================================================ */
/* 5. TAB CONTENT ROUTER                                         */
/* ============================================================ */
function renderSiteTabContent(siteId, site, stats, obs, observersCount) {
  switch (siteDetailState.activeTab) {
    case 'overview':     return renderOverviewTab(siteId, stats, observersCount);
    case 'observations': return renderObservationsTab(obs);
    case 'wildlife':     return renderWildlifeTab(stats);
    case 'about':        return renderAboutTab(site, observersCount);
    default:             return renderOverviewTab(siteId, stats, observersCount);
  }
}

/* ============================================================ */
/* 6. OVERVIEW TAB                                               */
/* ============================================================ */
function renderOverviewTab(siteId, stats, observersCount) {
  if (stats.count === 0) {
    return `
      <div class="empty-state" style="background:var(--pc-card); border-radius:16px; padding:40px 20px;">
        <i class="fas fa-chart-line"></i>
        <p style="font-size:14px; font-weight:700; color:var(--pc-text); margin-bottom:6px;">No observations yet</p>
        <p style="font-size:12.5px; color:var(--pc-text-muted); margin-bottom:14px;">Be the first to log data at this site</p>
        <button type="button" class="btn btn-primary btn-sm" onclick="observeAtSite('${siteId}')">
          <i class="fas fa-plus"></i> Record Observation
        </button>
      </div>
    `;
  }

  return `
    <div class="site-chart-card">
      <div class="site-chart-header">
        <h3><i class="fas fa-chart-line"></i> Water Quality Trend</h3>
        <span class="site-chart-sub">Last ${stats.trendData.length} observations</span>
      </div>
      <div style="position:relative; height:220px;">
        <canvas id="siteTrendChart"></canvas>
      </div>
    </div>

    <div class="health-snapshot">
      <p class="health-snapshot-title">
        <i class="fas fa-heart-pulse"></i> Current Snapshot
      </p>

      <div class="health-row">
        <div class="health-icon"><i class="fas fa-eye"></i></div>
        <div class="health-info">
          <p class="health-label">Water Clarity</p>
          <p class="health-value-text">${Observations.clarityLabel(
            stats.avgClarity >= 3.5 ? 'excellent' :
            stats.avgClarity >= 2.5 ? 'good' :
            stats.avgClarity >= 1.5 ? 'moderate' :
            stats.avgClarity >= 0.5 ? 'poor' : 'critical'
          )}</p>
        </div>
        ${renderHealthBars(stats.avgClarity)}
      </div>

      <div class="health-row">
        <div class="health-icon" style="background:var(--pc-warning-soft); color:var(--pc-warning);">
          <i class="fas fa-trash"></i>
        </div>
        <div class="health-info">
          <p class="health-label">Litter Level</p>
          <p class="health-value-text">${Observations.litterLabel(
            stats.avgLitter >= 3.5 ? 'none' :
            stats.avgLitter >= 2.5 ? 'little' :
            stats.avgLitter >= 1.5 ? 'moderate' :
            stats.avgLitter >= 0.5 ? 'heavy' : 'severe'
          )}</p>
        </div>
        ${renderHealthBars(stats.avgLitter, 'warning')}
      </div>
    </div>

    <div class="observers-card">
      <div class="observers-icon">
        <i class="fas fa-users"></i>
      </div>
      <div class="observers-info">
        <p class="observers-value">${observersCount}</p>
        <p class="observers-label">${observersCount === 1 ? 'Citizen scientist has' : 'Citizen scientists have'} observed this site</p>
      </div>
    </div>
  `;
}

function renderHealthBars(value, type = 'accent') {
  const filled = Math.round(value);
  let html = '<div class="health-bars">';

  for (let i = 0; i < 5; i++) {
    const isFilled = i < filled;
    let cls = 'health-bar';
    if (isFilled) {
      cls += ' filled';
      if (type === 'warning') cls += ' moderate';
    }
    html += `<span class="${cls}"></span>`;
  }

  html += '</div>';
  return html;
}

/* ============================================================ */
/* 7. OBSERVATIONS TAB                                          */
/* ============================================================ */
function renderObservationsTab(obs) {
  if (!obs.length) {
    return `
      <div class="empty-state" style="background:var(--pc-card); border-radius:16px; padding:40px 20px;">
        <i class="fas fa-eye"></i>
        <p style="font-size:14px; font-weight:700; color:var(--pc-text);">No observations yet</p>
      </div>
    `;
  }

  return `
    <div class="obs-feed">
      ${obs.map(o => renderObservationCard(o)).join('')}
    </div>
  `;
}

/* ============================================================ */
/* 8. WILDLIFE TAB                                               */
/* ============================================================ */
function renderWildlifeTab(stats) {
  if (Object.keys(stats.wildlifeCount).length === 0) {
    return `
      <div class="empty-state" style="background:var(--pc-card); border-radius:16px; padding:40px 20px;">
        <i class="fas fa-fish"></i>
        <p style="font-size:14px; font-weight:700; color:var(--pc-text);">No wildlife recorded yet</p>
      </div>
    `;
  }

  const entries = Object.entries(stats.wildlifeCount)
    .sort((a, b) => b[1] - a[1]);

  return `
    <div class="site-chart-card">
      <div class="site-chart-header">
        <h3><i class="fas fa-fish"></i> Wildlife Breakdown</h3>
      </div>
      <div style="position:relative; height:240px;">
        <canvas id="wildlifeChart"></canvas>
      </div>
    </div>

    <div class="wildlife-list">
      ${entries.map(([key, count]) => `
        <div class="wildlife-item">
          <div class="wildlife-icon">
            <i class="fas ${Observations.wildlifeIcon(key)}"></i>
          </div>
          <div class="wildlife-info">
            <p class="wildlife-name">${Observations.wildlifeLabel(key)}</p>
            <p class="wildlife-count">Seen in ${count} observation${count > 1 ? 's' : ''}</p>
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

/* ============================================================ */
/* 9. ABOUT TAB                                                  */
/* ============================================================ */
function renderAboutTab(site, observersCount) {
  const statusBadge = site.status === 'community'
    ? `<span class="site-status-badge community"><i class="fas fa-user"></i> Community Added</span>`
    : `<span class="site-status-badge verified"><i class="fas fa-check-circle"></i> Verified Site</span>`;

  return `
    <div class="site-about-card">
      ${statusBadge}

      <p class="site-about-desc">${escapeHtml(site.description)}</p>

      <div class="site-about-grid">
        <div class="site-about-item">
          <i class="fas fa-map-marker-alt"></i>
          <div>
            <p class="site-about-key">Location</p>
            <p class="site-about-val">${escapeHtml(site.location.area)}</p>
          </div>
        </div>
        <div class="site-about-item">
          <i class="fas fa-water"></i>
          <div>
            <p class="site-about-key">Type</p>
            <p class="site-about-val">${getSiteTypeLabel(site.type)}</p>
          </div>
        </div>
        <div class="site-about-item">
          <i class="fas fa-users"></i>
          <div>
            <p class="site-about-key">Observers</p>
            <p class="site-about-val">${observersCount} unique contributor${observersCount === 1 ? '' : 's'}</p>
          </div>
        </div>
        <div class="site-about-item">
          <i class="fas fa-calendar"></i>
          <div>
            <p class="site-about-key">Added</p>
            <p class="site-about-val">${formatDate(site.createdAt)}</p>
          </div>
        </div>
      </div>

      ${site.tags && site.tags.length ? `
        <div class="site-about-tags">
          ${site.tags.map(tag => `<span class="site-tag">${escapeHtml(tag)}</span>`).join('')}
        </div>
      ` : ''}
    </div>
  `;
}

/* ============================================================ */
/* 10. CHARTS                                                    */
/* ============================================================ */
function initSiteCharts(siteId) {
  if (siteDetailState.activeTab === 'overview') {
    Charts.renderSiteTrend('siteTrendChart', siteId);
  }
  if (siteDetailState.activeTab === 'wildlife') {
    Charts.renderWildlife('wildlifeChart', siteId);
  }
}

/* ============================================================ */
/* 11. HANDLERS                                                  */
/* ============================================================ */
function attachSiteDetailHandlers() {
  document.querySelectorAll('[data-site-detail-tab]').forEach(tab => {
    tab.addEventListener('click', () => {
      siteDetailState.activeTab = tab.dataset.siteDetailTab;

      document.querySelectorAll('[data-site-detail-tab]').forEach(t => {
        t.classList.toggle('active', t.dataset.siteDetailTab === siteDetailState.activeTab);
      });

      const siteId = siteDetailState.siteId;
      const site = getSiteById(siteId);
      const stats = Observations.getSiteStats(siteId);
      const obs = Observations.getBySite(siteId);
      const observersCount = getObserversCount(siteId);

      const content = document.getElementById('siteDetailTabContent');
      if (content) {
        content.innerHTML = renderSiteTabContent(siteId, site, stats, obs, observersCount);
      }

      setTimeout(() => initSiteCharts(siteId), 100);
    });
  });
}

/* ============================================================ */
/* 12. SHARE                                                     */
/* ============================================================ */
function shareSite(siteId) {
  const site = getSiteById(siteId);
  if (!site) return;

  const data = {
    title: site.name + ' — AquaQuest',
    text: `Check out ${site.name} on AquaQuest. ${site.description.substring(0, 80)}...`,
    url: window.location.origin
  };

  if (navigator.share) {
    navigator.share(data).then(() => showToast('Shared!')).catch(() => {});
  } else {
    navigator.clipboard.writeText(`${data.title}\n${data.text}\n${data.url}`)
      .then(() => showToast('Link copied'))
      .catch(() => {});
  }
}

/* ============================================================ */
/* 13. OBSERVE AT SITE                                           */
/* ============================================================ */
function observeAtSite(siteId) {
  if (typeof openObservationFlow === 'function') {
    openObservationFlow(siteId);
  } else {
    showToast('Observation flow unavailable');
  }
}

/* ============================================================ */
/* DELETE CUSTOM SITE                                            */
/* ============================================================ */
function confirmDeleteCustomSite(siteId) {
  const site = getSiteById(siteId);
  if (!site) {
    showToast('Site not found');
    return;
  }

  if (!SiteCreation.isCustom(siteId)) {
    showToast('Only custom sites can be deleted');
    return;
  }

  if (!confirm(`Delete "${site.name}" permanently?\n\nThis will also remove it from your My Waters.`)) {
    return;
  }

  const deleted = SiteCreation.delete(siteId);

  if (!deleted) {
    showToast('Could not delete site');
    return;
  }

  showToast('Site deleted');

  /* Go back to sites page */
  setTimeout(() => {
  if (typeof NavHistory !== 'undefined') {
    NavHistory.back();
  } else {
    showPage('sites', { _skipHistoryPush: true });
  }

  if (typeof renderSites === 'function') renderSites();
}, 400);

  if (typeof refreshDrawer === 'function') refreshDrawer();
}

/* ============================================================ */
/* 14. EXPORTS                                                   */
/* ============================================================ */
window.openSiteDetail = openSiteDetail;
window.closeSiteDetail = closeSiteDetail;
window.renderSiteDetail = renderSiteDetail;
window.shareSite = shareSite;
window.observeAtSite = observeAtSite;
window.confirmDeleteCustomSite = confirmDeleteCustomSite;

console.log('[AquaQuest] Site detail loaded');