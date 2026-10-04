/* ============================================================ */
/* AQUAQUEST — MY REPORTS + REPORT DETAIL                        */
/* Complete · Fresh · Bug-free                                   */
/* ============================================================ */

let reportsState = {
  activeFilter: 'all'
};

/* ============================================================ */
/* 1. MAIN RENDER                                                */
/* ============================================================ */
function renderReports() {
  const page = document.getElementById('page-reports');
  if (!page) return;

  const reports = APP.reports || [];
  const myReports = reports.filter(r =>
    r.reporterId === 'user_self' ||
    r.reporterId === 'user_demo' ||
    r.reporterId === (APP.user?.id || '')
  );

  const active = myReports.filter(r => r.status !== 'resolved').length;
  const resolved = myReports.filter(r => r.status === 'resolved').length;

  page.innerHTML = `
    <div class="page-container">

      ${renderBackHeader('My Reports', `${myReports.length} total · ${active} active · ${resolved} resolved`)}

      <button class="report-new-btn" onclick="openReportFlow()">
        <i class="fas fa-plus"></i>
        <span>New Report</span>
      </button>

      <div class="site-filter-chips" id="reportsFilterChips">
        <button class="site-filter-chip ${reportsState.activeFilter === 'all' ? 'active' : ''}" data-report-filter="all">
          <i class="fas fa-border-all"></i> All (${myReports.length})
        </button>
        <button class="site-filter-chip ${reportsState.activeFilter === 'active' ? 'active' : ''}" data-report-filter="active">
          <i class="fas fa-hourglass-half"></i> Active (${active})
        </button>
        <button class="site-filter-chip ${reportsState.activeFilter === 'resolved' ? 'active' : ''}" data-report-filter="resolved">
          <i class="fas fa-check-circle"></i> Resolved (${resolved})
        </button>
      </div>

      <div id="reportsListFull">
        ${renderReportsList(myReports)}
      </div>

    </div>
  `;

  attachReportsHandlers();
}

function renderReportsList(reports) {
  let filtered = reports;

  if (reportsState.activeFilter === 'active') {
    filtered = reports.filter(r => r.status !== 'resolved');
  } else if (reportsState.activeFilter === 'resolved') {
    filtered = reports.filter(r => r.status === 'resolved');
  }

  if (!filtered.length) {
    return `
      <div class="empty-state" style="background:var(--pc-card); border-radius:16px; padding:40px 20px;">
        <i class="fas fa-flag"></i>
        <p style="font-size:14px; font-weight:700; color:var(--pc-text); margin-bottom:6px;">No reports here</p>
        <p style="font-size:12.5px; color:var(--pc-text-muted); margin-bottom:14px;">Report pollution or unusual water conditions</p>
        <button class="btn btn-primary btn-sm" onclick="openReportFlow()">
          <i class="fas fa-plus"></i> Create Report
        </button>
      </div>
    `;
  }

  return filtered.map(r => renderReportListCard(r)).join('');
}

function renderReportListCard(report) {
  const type = REPORT_TYPES.find(t => t.id === report.type) || REPORT_TYPES[6];
  const site = getSiteById(report.siteId);

  const statusInfo = {
    reported:  { label: 'Reported',     color: 'var(--pc-info)',    icon: 'fa-paper-plane' },
    community: { label: 'Under Review', color: 'var(--pc-warning)', icon: 'fa-users' },
    confirmed: { label: 'Confirmed',    color: 'var(--pc-accent)',  icon: 'fa-check-circle' },
    action:    { label: 'Action',       color: 'var(--pc-success)', icon: 'fa-person-running' },
    resolved:  { label: 'Resolved',     color: 'var(--pc-success)', icon: 'fa-check-double' }
  }[report.status] || { label: 'Reported', color: 'var(--pc-info)', icon: 'fa-paper-plane' };

  return `
    <button class="report-list-card" onclick="openReportDetail('${report.id}')">
      <div class="report-list-header">
        <div class="report-list-icon" style="background:${type.color}15; color:${type.color};">
          <i class="fas ${type.icon}"></i>
        </div>
        <div class="report-list-info">
          <div class="report-list-top">
            <p class="report-list-type">${escapeHtml(type.label)}</p>
            <span class="report-list-status" style="background:${statusInfo.color}15; color:${statusInfo.color};">
              <i class="fas ${statusInfo.icon}"></i> ${statusInfo.label}
            </span>
          </div>
          <p class="report-list-site">
            <i class="fas fa-map-marker-alt"></i> ${escapeHtml(site ? site.name : 'Unknown')}
          </p>
        </div>
      </div>
      <p class="report-list-desc">${escapeHtml(report.description.substring(0, 120))}${report.description.length > 120 ? '…' : ''}</p>
      <div class="report-list-footer">
        <span><i class="far fa-clock"></i> ${timeAgo(report.date)}</span>
        ${report.confirmations && report.confirmations.length ? `
          <span><i class="fas fa-user-check"></i> ${report.confirmations.length} confirmed</span>
        ` : ''}
        <span style="margin-left:auto;">View <i class="fas fa-arrow-right"></i></span>
      </div>
    </button>
  `;
}

/* ============================================================ */
/* 2. HANDLERS                                                   */
/* ============================================================ */
function attachReportsHandlers() {
  document.querySelectorAll('[data-report-filter]').forEach(chip => {
    chip.addEventListener('click', () => {
      reportsState.activeFilter = chip.dataset.reportFilter;

      document.querySelectorAll('[data-report-filter]').forEach(c => {
        c.classList.toggle('active', c.dataset.reportFilter === reportsState.activeFilter);
      });

      const myReports = (APP.reports || []).filter(r =>
        r.reporterId === 'user_self' ||
        r.reporterId === 'user_demo' ||
        r.reporterId === (APP.user?.id || '')
      );

      const list = document.getElementById('reportsListFull');
      if (list) list.innerHTML = renderReportsList(myReports);
    });
  });
}

/* ============================================================ */
/* 3. REPORT DETAIL MODAL                                        */
/* ============================================================ */
function openReportDetail(reportId) {
  const report = (APP.reports || []).find(r => r.id === reportId);
  if (!report) {
    showToast('Report not found');
    return;
  }

  const type = REPORT_TYPES.find(t => t.id === report.type) || REPORT_TYPES[6];
  const site = getSiteById(report.siteId);

  const statusInfo = {
    reported:  { label: 'Reported',     color: 'var(--pc-info)',    icon: 'fa-paper-plane',    desc: 'Awaiting community review' },
    community: { label: 'Under Review', color: 'var(--pc-warning)', icon: 'fa-users',          desc: 'Community members are confirming' },
    confirmed: { label: 'Confirmed',    color: 'var(--pc-accent)',  icon: 'fa-check-circle',   desc: 'Verified by 3+ members' },
    action:    { label: 'Action',       color: 'var(--pc-success)', icon: 'fa-person-running', desc: 'Cleanup or response in progress' },
    resolved:  { label: 'Resolved',     color: 'var(--pc-success)', icon: 'fa-check-double',   desc: 'Issue successfully addressed' }
  }[report.status] || { label: 'Reported', color: 'var(--pc-info)', icon: 'fa-paper-plane', desc: '' };

  const stages = [
    { key: 'reported',  label: 'Report Submitted', icon: 'fa-paper-plane' },
    { key: 'community', label: 'Community Review', icon: 'fa-users' },
    { key: 'confirmed', label: 'Confirmed',        icon: 'fa-check-circle' },
    { key: 'action',    label: 'Action Initiated', icon: 'fa-person-running' },
    { key: 'resolved',  label: 'Resolved',         icon: 'fa-check-double' }
  ];

  const stageOrder = ['reported', 'community', 'confirmed', 'action', 'resolved'];
  const currentIdx = stageOrder.indexOf(report.status);

  const modal = document.getElementById('quickViewModal');
  if (!modal) return;

  modal.querySelector('.modal-content').innerHTML = `
    <button class="close-modal" onclick="closeModal('quickViewModal')">
      <i class="fas fa-times"></i>
    </button>

    <div class="report-detail-header" style="background:linear-gradient(135deg, ${type.color}, ${type.color}CC);">
      <div class="report-detail-icon">
        <i class="fas ${type.icon}"></i>
      </div>
      <div>
        <p class="report-detail-type">${escapeHtml(type.label)}</p>
        <p class="report-detail-loc">
          <i class="fas fa-map-marker-alt"></i> ${escapeHtml(site ? site.name : 'Unknown')}
        </p>
      </div>
    </div>

    <div class="report-detail-status-badge" style="background:${statusInfo.color}15; color:${statusInfo.color}; border-color:${statusInfo.color}40;">
      <i class="fas ${statusInfo.icon}"></i>
      <span>${statusInfo.label}</span>
    </div>
    <p style="text-align:center; font-size:12px; color:var(--pc-text-muted); margin-bottom:20px; font-weight:600;">
      ${statusInfo.desc}
    </p>

    ${report.photo ? `
      <div class="report-detail-photo">
        <img src="${report.photo}" alt="" onerror="this.style.opacity='0'">
      </div>
    ` : ''}

    <div class="report-detail-description">
      <p>${escapeHtml(report.description)}</p>
    </div>

    <div class="report-detail-meta">
      <div class="report-detail-meta-row">
        <i class="far fa-calendar"></i>
        <span>Reported ${timeAgo(report.date)}</span>
      </div>
      <div class="report-detail-meta-row">
        <i class="fas fa-user"></i>
        <span>By ${escapeHtml(report.reporterName || 'Anonymous')}</span>
      </div>
      ${report.confirmations && report.confirmations.length ? `
        <div class="report-detail-meta-row">
          <i class="fas fa-user-check"></i>
          <span>${report.confirmations.length} community confirmations</span>
        </div>
      ` : ''}
    </div>

    <div class="report-timeline">
      <p class="report-timeline-title">Status Timeline</p>
      ${stages.map((stage, i) => {
        const isDone = i <= currentIdx;
        const isCurrent = i === currentIdx;
        const cls = isDone ? 'done' : (isCurrent ? 'current' : '');
        return `
          <div class="report-timeline-item ${cls}">
            <div class="report-timeline-dot">
              <i class="fas ${isDone && !isCurrent ? 'fa-check' : stage.icon}"></i>
            </div>
            <div class="report-timeline-info">
              <p class="report-timeline-label">${stage.label}</p>
              <p class="report-timeline-time">${isDone ? 'Completed' : isCurrent ? 'In progress' : 'Pending'}</p>
            </div>
          </div>
        `;
      }).join('')}
    </div>

    ${report.status !== 'resolved' ? `
      <div class="report-detail-actions">
        <button class="observe-btn observe-btn-primary" onclick="confirmReport('${report.id}')" style="flex:1;">
          <i class="fas fa-user-check"></i> I Confirm This Concern
        </button>
        ${isOwnReport(report) ? `
          <button class="observe-btn observe-btn-ghost" onclick="advanceReportStage('${report.id}')">
            <i class="fas fa-forward"></i>
          </button>
        ` : ''}
      </div>
    ` : `
      <div class="report-resolved-banner">
        <i class="fas fa-check-circle"></i>
        <span>Resolved — Thank you for your report</span>
      </div>
    `}
  `;

  openModal('quickViewModal');
}

function isOwnReport(report) {
  return report.reporterId === 'user_self' ||
         report.reporterId === 'user_demo' ||
         report.reporterId === (APP.user?.id || '');
}

function confirmReport(reportId) {
  const report = (APP.reports || []).find(r => r.id === reportId);
  if (!report) return;

  const user = APP.user || { name: 'You' };
  report.confirmations = report.confirmations || [];

  if (report.confirmations.includes(user.name)) {
    showToast('You already confirmed this');
    return;
  }

  report.confirmations.push(user.name);
  Storage.set(APP.KEYS.REPORTS, APP.reports);

  if (report.confirmations.length >= 3 && report.status === 'reported') {
    report.status = 'community';
    Storage.set(APP.KEYS.REPORTS, APP.reports);

    if (typeof addNotification === 'function') {
      addNotification('report', '✅ Report Confirmed', `Your report now has ${report.confirmations.length} confirmations.`);
    }
  }

  if (typeof Gamification !== 'undefined' && Gamification.award) {
    Gamification.award(2, 'Confirmation added');
  }

  showToast('Confirmation added');
  openReportDetail(reportId);
}

function advanceReportStage(reportId) {
  const report = (APP.reports || []).find(r => r.id === reportId);
  if (!report) return;

  const order = ['reported', 'community', 'confirmed', 'action', 'resolved'];
  const currentIdx = order.indexOf(report.status);

  if (currentIdx < order.length - 1) {
    report.status = order[currentIdx + 1];
    Storage.set(APP.KEYS.REPORTS, APP.reports);

    showToast('Status updated: ' + report.status);

    if (report.status === 'resolved' && typeof confetti === 'function') {
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#10B981', '#22D3EE', '#0891B2']
      });
    }

    if (APP.currentPage === 'reports') {
      renderReports();
    }

    openReportDetail(reportId);
  }
}

/* ============================================================ */
/* 4. EXPORTS                                                    */
/* ============================================================ */
window.renderReports = renderReports;
window.openReportDetail = openReportDetail;
window.confirmReport = confirmReport;
window.advanceReportStage = advanceReportStage;
window.isOwnReport = isOwnReport;

console.log('[AquaQuest] Reports loaded');