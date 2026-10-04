/* ============================================================ */
/* AQUAQUEST — REPORT CONCERN FLOW                               */
/* 3-step modal for submitting pollution concerns                */
/* ============================================================ */

let reportState = {
  step: 1,
  totalSteps: 3,
  siteId: null,
  data: {
    type: null,
    description: '',
    photo: null,
    location: null
  }
};

/* ============================================================ */
/* 1. CONCERN TYPES                                              */
/* ============================================================ */
const REPORT_TYPES = [
  { id: 'litter',     label: 'Heavy Litter',          icon: 'fa-trash',              color: '#F59E0B', desc: 'Plastic, waste, or debris buildup' },
  { id: 'colour',     label: 'Unusual Colour',        icon: 'fa-palette',            color: '#8B5CF6', desc: 'Green, brown, black, or oily water' },
  { id: 'smell',      label: 'Strong Smell',          icon: 'fa-nose',               color: '#EF4444', desc: 'Chemical, sewage, or foul odour' },
  { id: 'dead-fish',  label: 'Dead Fish / Wildlife',  icon: 'fa-fish-fins',          color: '#DC2626', desc: 'Fish kill or dead animals in water' },
  { id: 'wastewater', label: 'Wastewater Discharge',  icon: 'fa-industry',           color: '#0891B2', desc: 'Sewage or industrial outflow' },
  { id: 'blocked',    label: 'Blocked Waterway',      icon: 'fa-water',              color: '#0284C7', desc: 'Debris blocking flow' },
  { id: 'other',      label: 'Other Concern',         icon: 'fa-circle-exclamation', color: '#7FA3B5', desc: 'Something else not listed' }
];

/* ============================================================ */
/* 2. OPEN FLOW                                                  */
/* ============================================================ */
function openReportFlow(preselectSiteId) {
  if (!isLoggedIn()) {
    showToast('Sign in to submit a report');
    openModal('loginModal');
    if (typeof renderLoginModal === 'function') renderLoginModal();
    return;
  }

  reportState.step = 1;
  reportState.siteId = preselectSiteId || APP.activeSiteId || SITES[0]?.id || null;
  reportState.data = {
    type: null,
    description: '',
    photo: null,
    location: null
  };

  const modal = document.getElementById('reportModal');
  if (!modal) return;

  renderReportForm();
  openModal('reportModal');
}

/* ============================================================ */
/* 3. RENDER                                                     */
/* ============================================================ */
function renderReportForm() {
  const modal = document.getElementById('reportModal');
  if (!modal) return;

  modal.querySelector('.modal-content').innerHTML = `
    <button type="button" class="close-modal" onclick="closeModal('reportModal')">
      <i class="fas fa-times"></i>
    </button>

    <div class="report-progress-wrap">
      <div class="report-progress-header">
        <span class="report-step-label">Step ${reportState.step} of ${reportState.totalSteps}</span>
        <span class="report-step-title">${getReportStepTitle(reportState.step)}</span>
      </div>
      <div class="report-progress-bar">
        <div class="report-progress-fill" style="width:${(reportState.step / reportState.totalSteps) * 100}%;"></div>
      </div>
    </div>

    <div class="report-body">
      ${renderReportStepContent()}
    </div>
  `;

  attachReportHandlers();
}

function getReportStepTitle(step) {
  return {
    1: 'What did you notice?',
    2: 'Details & Photo',
    3: 'Location & Submit'
  }[step] || '';
}

function renderReportStepContent() {
  switch (reportState.step) {
    case 1: return renderReportStep1();
    case 2: return renderReportStep2();
    case 3: return renderReportStep3();
    default: return '';
  }
}

/* ---------- STEP 1: TYPE ---------- */
function renderReportStep1() {
  return `
    <p class="report-question">What kind of concern do you want to report?</p>

    <div class="report-types-grid">
      ${REPORT_TYPES.map(t => `
        <button type="button"
                class="report-type-card ${reportState.data.type === t.id ? 'selected' : ''}"
                data-report-type="${t.id}">
          <div class="report-type-icon" style="background:${t.color}15; color:${t.color};">
            <i class="fas ${t.icon}"></i>
          </div>
          <p class="report-type-label">${t.label}</p>
          <p class="report-type-desc">${t.desc}</p>
        </button>
      `).join('')}
    </div>

    ${renderReportNav()}
  `;
}

/* ---------- STEP 2: DETAILS ---------- */
function renderReportStep2() {
  return `
    <p class="report-question">Describe what you saw</p>
    <p class="report-hint">Be specific — this helps responders understand urgency</p>

    <textarea id="reportDescription" rows="5" maxlength="500"
              placeholder="What did you notice? When did you first see it? Any other details..."
              required>${escapeHtml(reportState.data.description)}</textarea>

    <p class="report-question" style="margin-top:22px;">Add a photo</p>
    <p class="report-hint">A photo goes a long way in getting action</p>

    <label class="report-photo-upload ${reportState.data.photo ? 'has-photo' : ''}" for="reportPhotoInput">
      ${reportState.data.photo
        ? `<img src="${reportState.data.photo}" alt="">
           <button type="button" class="report-photo-remove" onclick="event.preventDefault(); event.stopPropagation(); removeReportPhoto();">
             <i class="fas fa-times"></i>
           </button>`
        : `<i class="fas fa-camera"></i>
           <p>Tap to add photo</p>
           <span>JPG, PNG · max 3MB</span>`
      }
    </label>
    <input type="file" id="reportPhotoInput" accept="image/*" style="display:none;">

    ${renderReportNav()}
  `;
}

/* ---------- STEP 3: LOCATION ---------- */
function renderReportStep3() {
  return `
    <p class="report-question">Where is this happening?</p>

    <div class="report-site-picker">
      ${SITES.map(s => `
        <button type="button"
                class="report-site-option ${reportState.siteId === s.id ? 'selected' : ''}"
                data-report-site="${s.id}">
          <img src="${s.cover}" alt="" onerror="this.style.opacity='0'">
          <div>
            <p class="report-site-name">${escapeHtml(s.name)}</p>
            <p class="report-site-loc">${escapeHtml(s.location.area)}</p>
          </div>
          ${reportState.siteId === s.id ? '<i class="fas fa-check-circle report-site-check"></i>' : ''}
        </button>
      `).join('')}
    </div>

    <div class="report-urgency-note">
      <i class="fas fa-info-circle"></i>
      <p>Your report will be reviewed by our team. Community members will confirm within 24 hours.</p>
    </div>

    ${renderReportNav(true)}
  `;
}

/* ---------- NAV ---------- */
function renderReportNav(isLast = false) {
  const canProceed = validateReportStep();

  return `
    <div class="report-nav">
      ${reportState.step > 1
        ? `<button type="button" class="observe-btn observe-btn-ghost" onclick="reportPrevStep()">
             <i class="fas fa-arrow-left"></i> Back
           </button>`
        : '<div></div>'
      }

      ${isLast
        ? `<button type="button" class="observe-btn observe-btn-primary" onclick="submitReport()">
             <i class="fas fa-paper-plane"></i> Submit Report
           </button>`
        : `<button type="button" class="observe-btn observe-btn-primary ${!canProceed ? 'disabled' : ''}"
                   ${!canProceed ? 'disabled' : ''}
                   onclick="reportNextStep()">
             Next <i class="fas fa-arrow-right"></i>
           </button>`
      }
    </div>
  `;
}

function validateReportStep() {
  if (reportState.step === 1) return !!reportState.data.type;
  if (reportState.step === 2) return true;
  if (reportState.step === 3) return !!reportState.siteId;
  return true;
}

/* ============================================================ */
/* 4. HANDLERS — Event Delegation (survives re-renders)          */
/* ============================================================ */
function attachReportHandlers() {
  const modal = document.getElementById('reportModal');
  if (!modal) return;

  const content = modal.querySelector('.modal-content');
  if (!content) return;

  /*
   * Attach delegated click handler only once.
   */
  if (content.dataset.reportHandlersAttached !== 'true') {
    content.dataset.reportHandlersAttached = 'true';

    content.addEventListener('click', (e) => {
      /* Report type card */
      const typeBtn = e.target.closest('[data-report-type]');
      if (typeBtn) {
        e.preventDefault();
        e.stopPropagation();

        reportState.data.type = typeBtn.dataset.reportType;
        renderReportForm();
        return;
      }

      /* Report site option */
      const siteBtn = e.target.closest('[data-report-site]');
      if (siteBtn) {
        e.preventDefault();
        e.stopPropagation();

        reportState.siteId = siteBtn.dataset.reportSite;
        renderReportForm();
        return;
      }

      /* Photo remove */
      const photoRemoveBtn = e.target.closest('.report-photo-remove');
      if (photoRemoveBtn) {
        e.preventDefault();
        e.stopPropagation();

        removeReportPhoto();
        return;
      }
    });
  }

  /*
   * Description input is recreated on every render,
   * so attach to the CURRENT element.
   */
  const desc = document.getElementById('reportDescription');

  if (desc && !desc.dataset.listenerAttached) {
    desc.dataset.listenerAttached = 'true';

    desc.addEventListener('input', () => {
      reportState.data.description = desc.value;
    });
  }

  /*
   * Photo input is also recreated on every render.
   * Always check the CURRENT input.
   */
  const photoInput = document.getElementById('reportPhotoInput');

  if (photoInput && !photoInput.dataset.listenerAttached) {
    photoInput.dataset.listenerAttached = 'true';
    photoInput.addEventListener('change', handleReportPhoto);
  }
}

/* ============================================================ */
/* 5. PHOTO UPLOAD                                               */
/* ============================================================ */
async function handleReportPhoto(e) {
  const file = e.target.files?.[0];
  if (!file) return;

  if (!file.type.startsWith('image/')) {
    showToast('Please select an image file');
    return;
  }

  if (file.size > 15 * 1024 * 1024) {
    showToast('Image too large (max 15MB)');
    return;
  }

  try {
    showToast('Processing image...');
    const compressed = await compressImage(file, 1200, 0.75);
    reportState.data.photo = compressed;

    const desc = document.getElementById('reportDescription');
    if (desc) reportState.data.description = desc.value;

    renderReportForm();
    showToast('Photo added');
  } catch (err) {
    console.error('[Report] Photo compress failed:', err);
    showToast('Could not process image');
  }
}

function removeReportPhoto() {
  const desc = document.getElementById('reportDescription');
  if (desc) reportState.data.description = desc.value;

  reportState.data.photo = null;
  renderReportForm();
}

/* ============================================================ */
/* 6. STEP NAVIGATION                                            */
/* ============================================================ */
function reportNextStep() {
  if (!validateReportStep()) {
    showToast('Please complete this step');
    return;
  }

  if (reportState.step === 2) {
    const desc = document.getElementById('reportDescription');
    if (desc) reportState.data.description = desc.value;
  }

  if (reportState.step < reportState.totalSteps) {
    reportState.step++;
    renderReportForm();
  }
}

function reportPrevStep() {
  if (reportState.step > 1) {
    if (reportState.step === 2) {
      const desc = document.getElementById('reportDescription');
      if (desc) reportState.data.description = desc.value;
    }

    reportState.step--;
    renderReportForm();
  }
}

/* ============================================================ */
/* 7. SUBMIT                                                     */
/* ============================================================ */
function submitReport() {
  const desc = document.getElementById('reportDescription');
  if (desc) reportState.data.description = desc.value;

  if (!reportState.data.type) {
    showToast('Please select a type');
    return;
  }

  if (!reportState.data.description || reportState.data.description.trim().length < 10) {
    showToast('Please describe in at least 10 characters');
    return;
  }

  const user = APP.user || { name: 'Guest' };
  const site = getSiteById(reportState.siteId);

  const report = {
    id: 'rep_' + Date.now(),
    type: reportState.data.type,
    siteId: reportState.siteId,
    reporterId: 'user_self',
    reporterName: user.name || 'Guest',
    reporterAvatar: user.avatar || null,
    date: new Date().toISOString(),
    description: reportState.data.description.trim(),
    photo: reportState.data.photo,
    location: site ? site.location.area : 'Unknown',
    status: 'reported',
    confirmations: [],
    timeline: [
      { stage: 'reported', label: 'Report Submitted', time: new Date().toISOString() }
    ]
  };

  APP.reports = APP.reports || [];
  APP.reports.unshift(report);
  Storage.set(APP.KEYS.REPORTS, APP.reports);

  if (typeof addNotification === 'function') {
    addNotification('report', '🚩 Report Submitted', `Your concern at ${site?.name || 'the site'} is being reviewed.`);
  }

  if (typeof Gamification !== 'undefined' && Gamification.awardForReport) {
    Gamification.awardForReport();
  }

  closeModal('reportModal');

  if (typeof updateBodyScrollLock === 'function') {
    updateBodyScrollLock();
  }

  showToast('Report submitted — thank you!');

  if (typeof confetti === 'function') {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#EF4444', '#F59E0B', '#22D3EE']
    });
  }

  if (typeof refreshDrawer === 'function') refreshDrawer();

  /* Open report detail after short delay */
  setTimeout(() => {
    if (typeof openReportDetail === 'function') {
      openReportDetail(report.id);
    }
  }, 500);

  /* Refresh reports page if active */
  if (APP.currentPage === 'reports') {
    setTimeout(() => {
      if (typeof renderReports === 'function') renderReports();
    }, 400);
  }
}

/* ============================================================ */
/* 8. EXPORTS                                                    */
/* ============================================================ */
window.openReportFlow = openReportFlow;
window.reportNextStep = reportNextStep;
window.reportPrevStep = reportPrevStep;
window.submitReport = submitReport;
window.removeReportPhoto = removeReportPhoto;
window.REPORT_TYPES = REPORT_TYPES;

console.log('[AquaQuest] Report flow loaded');