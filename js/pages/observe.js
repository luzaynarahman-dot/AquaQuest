/* ============================================================ */
/* AQUAQUEST — OBSERVE FORM                                      */
/* 5-step guided observation flow                                */
/* Complete · Bug-free · Photo upload async                      */
/* ============================================================ */

let observeState = {
  step: 1,
  totalSteps: 5,
  siteId: null,
  data: {
    clarity: null,
    litter: null,
    smell: null,
    colour: null,
    wildlife: [],
    ph: null,
    turbidity: null,
    temperature: null,
    photo: null,
    note: ''
  }
};

/* ============================================================ */
/* 1. OPEN FLOW                                                  */
/* ============================================================ */
function openObservationFlow(preselectSiteId) {
  if (!isLoggedIn()) {
    showToast('Sign in to record observations');
    openModal('loginModal');
    if (typeof renderLoginModal === 'function') renderLoginModal();
    return;
  }

  observeState.step = 1;
  observeState.siteId = preselectSiteId || APP.activeSiteId || SITES[0]?.id || null;
  observeState.data = {
    clarity: null,
    litter: null,
    smell: null,
    colour: null,
    wildlife: [],
    ph: null,
    turbidity: null,
    temperature: null,
    photo: null,
    note: ''
  };

  const modal = document.getElementById('observationModal');
  if (!modal) return;

  renderObserveForm();
  openModal('observationModal');
}

/* ============================================================ */
/* 2. MAIN RENDER                                                */
/* ============================================================ */
function renderObserveForm() {
  const modal = document.getElementById('observationModal');
  if (!modal) return;

  modal.querySelector('.modal-content').innerHTML = `
    <button type="button" class="close-modal" onclick="cancelObservation()">
      <i class="fas fa-times"></i>
    </button>

    ${renderProgressBar()}
    ${renderStepContent()}
  `;

  attachObserveHandlers();
}

/* ============================================================ */
/* 3. PROGRESS BAR                                               */
/* ============================================================ */
function renderProgressBar() {
  const progress = (observeState.step / observeState.totalSteps) * 100;

  return `
    <div class="observe-progress-wrap">
      <div class="observe-progress-header">
        <span class="observe-step-label">Step ${observeState.step} of ${observeState.totalSteps}</span>
        <span class="observe-step-title">${getStepTitle(observeState.step)}</span>
      </div>
      <div class="observe-progress-bar">
        <div class="observe-progress-fill" style="width:${progress}%;"></div>
      </div>
    </div>
  `;
}

function getStepTitle(step) {
  const titles = {
    1: 'Water Appearance',
    2: 'Litter & Pollution',
    3: 'Wildlife Sighting',
    4: 'Photo & Notes',
    5: 'Review & Submit'
  };
  return titles[step] || '';
}

/* ============================================================ */
/* 4. STEP CONTENT ROUTER                                        */
/* ============================================================ */
function renderStepContent() {
  switch (observeState.step) {
    case 1: return renderStep1();
    case 2: return renderStep2();
    case 3: return renderStep3();
    case 4: return renderStep4();
    case 5: return renderStep5();
    default: return '';
  }
}

/* ============================================================ */
/* 5. STEP 1 — WATER APPEARANCE                                  */
/* ============================================================ */
function renderStep1() {
  const site = getSiteById(observeState.siteId);

  return `
    <div class="observe-body">
      ${site ? `
        <div class="observe-site-context">
          <img src="${site.cover}" alt="">
          <div>
            <p class="observe-site-label">Observing at</p>
            <p class="observe-site-name">${escapeHtml(site.name)}</p>
          </div>
          <button type="button" class="observe-change-site" onclick="changeObserveSite()">
            Change
          </button>
        </div>
      ` : ''}

      <p class="observe-question">How does the water look right now?</p>

      <div class="observe-options">
        ${renderOptionCard('clarity', 'excellent', 'Crystal Clear', 'Can see deep into the water', 'fa-star', '#10B981')}
        ${renderOptionCard('clarity', 'good', 'Clear', 'Mostly clear with slight tint', 'fa-circle-check', '#22C55E')}
        ${renderOptionCard('clarity', 'moderate', 'Murky', 'Cloudy but visible', 'fa-circle-half-stroke', '#F59E0B')}
        ${renderOptionCard('clarity', 'poor', 'Very Cloudy', 'Difficult to see through', 'fa-circle-exclamation', '#F97316')}
        ${renderOptionCard('clarity', 'critical', 'Unusual Colour', 'Green, brown, or black', 'fa-triangle-exclamation', '#EF4444')}
      </div>

      <p class="observe-question" style="margin-top:22px;">Water colour</p>

      <div class="observe-chip-row">
        ${renderChip('colour', 'normal', 'Normal', 'fa-tint')}
        ${renderChip('colour', 'green', 'Greenish', 'fa-leaf')}
        ${renderChip('colour', 'brown', 'Brownish', 'fa-mountain')}
        ${renderChip('colour', 'black', 'Dark / Black', 'fa-moon')}
        ${renderChip('colour', 'oily', 'Oily sheen', 'fa-oil-can')}
      </div>

      <p class="observe-question" style="margin-top:22px;">Smell</p>

      <div class="observe-chip-row">
        ${renderChip('smell', 'none', 'No smell', 'fa-wind')}
        ${renderChip('smell', 'mild', 'Mild', 'fa-nose')}
        ${renderChip('smell', 'strong', 'Strong', 'fa-face-tired')}
        ${renderChip('smell', 'foul', 'Foul', 'fa-skull')}
      </div>

      ${renderObserveNav()}
    </div>
  `;
}

function renderOptionCard(field, value, label, sub, icon, color) {
  const selected = observeState.data[field] === value;
  return `
    <button type="button"
            class="observe-option ${selected ? 'selected' : ''}"
            data-observe-field="${field}"
            data-observe-value="${value}">
      <div class="observe-option-icon" style="background:${color}20; color:${color};">
        <i class="fas ${icon}"></i>
      </div>
      <div class="observe-option-info">
        <p class="observe-option-label">${label}</p>
        <p class="observe-option-sub">${sub}</p>
      </div>
      <i class="fas ${selected ? 'fa-check-circle' : 'fa-circle'} observe-option-check"></i>
    </button>
  `;
}

function renderChip(field, value, label, icon) {
  const selected = observeState.data[field] === value;

  return `
    <button type="button"
            class="observe-chip ${selected ? 'active' : ''}"
            data-observe-field="${field}"
            data-observe-value="${value}">
      <i class="fas ${icon}"></i> ${label}
    </button>
  `;
}

/* ============================================================ */
/* 6. STEP 2 — LITTER & POLLUTION                                */
/* ============================================================ */
function renderStep2() {
  return `
    <div class="observe-body">
      <p class="observe-question">How much litter is visible?</p>

      <div class="observe-options">
        ${renderOptionCard('litter', 'none', 'No Litter', 'Completely clean', 'fa-check-circle', '#10B981')}
        ${renderOptionCard('litter', 'little', 'A Little', 'A few items here and there', 'fa-leaf', '#84CC16')}
        ${renderOptionCard('litter', 'moderate', 'Moderate', 'Visible trash, needs cleanup', 'fa-trash', '#F59E0B')}
        ${renderOptionCard('litter', 'heavy', 'Heavy', 'Lots of trash, urgent cleanup', 'fa-trash-can', '#F97316')}
        ${renderOptionCard('litter', 'severe', 'Severe', 'Blocking the waterway', 'fa-dumpster', '#EF4444')}
      </div>

      <div class="observe-tip">
        <i class="fas fa-lightbulb"></i>
        <p>Count and note specific items you see — plastic bottles, bags, fishing nets, etc.</p>
      </div>

      ${renderObserveNav()}
    </div>
  `;
}

/* ============================================================ */
/* 7. STEP 3 — WILDLIFE                                          */
/* ============================================================ */
function renderStep3() {
  const wildlifeOptions = [
    { id: 'fish', label: 'Fish', icon: 'fa-fish' },
    { id: 'birds', label: 'Birds', icon: 'fa-dove' },
    { id: 'plants', label: 'Aquatic plants', icon: 'fa-seedling' },
    { id: 'crabs', label: 'Crabs', icon: 'fa-shrimp' },
    { id: 'shells', label: 'Shells', icon: 'fa-shell' },
    { id: 'butterflies', label: 'Butterflies', icon: 'fa-leaf' },
    { id: 'turtles', label: 'Turtles', icon: 'fa-shield-halved' },
    { id: 'insects', label: 'Insects', icon: 'fa-bug' },
    { id: 'mammals', label: 'Mammals', icon: 'fa-paw' }
  ];

  return `
    <div class="observe-body">
      <p class="observe-question">What wildlife did you notice?</p>
      <p class="observe-hint">Select all that apply</p>

      <div class="observe-wildlife-grid">
        ${wildlifeOptions.map(w => `
          <button type="button"
                  class="observe-wildlife-item ${observeState.data.wildlife.includes(w.id) ? 'active' : ''}"
                  data-observe-wildlife="${w.id}">
            <i class="fas ${w.icon}"></i>
            <span>${w.label}</span>
          </button>
        `).join('')}
      </div>

      <div class="observe-tip">
        <i class="fas fa-lightbulb"></i>
        <p>Wildlife presence is a strong indicator of water health. More species = healthier water.</p>
      </div>

      ${renderObserveNav()}
    </div>
  `;
}

/* ============================================================ */
/* 8. STEP 4 — PHOTO & NOTES                                     */
/* ============================================================ */
function renderStep4() {
  return `
    <div class="observe-body">
      <p class="observe-question">Add a photo (optional)</p>

      <label class="observe-photo-upload ${observeState.data.photo ? 'has-photo' : ''}" for="observePhotoInput">
        ${observeState.data.photo
          ? `<img src="${observeState.data.photo}" alt="Preview">
             <button type="button" class="observe-photo-remove" onclick="event.preventDefault(); event.stopPropagation(); removeObservePhoto();">
               <i class="fas fa-times"></i>
             </button>`
          : `<i class="fas fa-camera"></i>
             <p>Tap to add photo</p>
             <span>JPG, PNG · max 15MB</span>`
        }
      </label>
      <input type="file" id="observePhotoInput" accept="image/*" style="display:none;">

      <p class="observe-question" style="margin-top:22px;">Advanced readings (optional)</p>
      <p class="observe-hint">If you have a test kit</p>

      <div class="observe-advanced-grid">
        <div>
          <label>pH</label>
          <input type="number" id="observePh" step="0.1" min="0" max="14"
                 placeholder="e.g. 7.2" value="${observeState.data.ph || ''}">
        </div>
        <div>
          <label>Turbidity (NTU)</label>
          <input type="number" id="observeTurbidity" step="0.1" min="0"
                 placeholder="e.g. 12" value="${observeState.data.turbidity || ''}">
        </div>
        <div>
          <label>Temp (°C)</label>
          <input type="number" id="observeTemp" step="0.1"
                 placeholder="e.g. 25" value="${observeState.data.temperature || ''}">
        </div>
      </div>

      <p class="observe-question" style="margin-top:22px;">Notes</p>
      <textarea id="observeNote" rows="3" placeholder="Anything else you noticed..." maxlength="300">${escapeHtml(observeState.data.note)}</textarea>

      ${renderObserveNav()}
    </div>
  `;
}

/* ============================================================ */
/* 9. STEP 5 — REVIEW                                            */
/* ============================================================ */
function renderStep5() {
  const site = getSiteById(observeState.siteId);
  const d = observeState.data;

  return `
    <div class="observe-body">
      <div class="observe-review">
        <p class="observe-review-title">Review your observation</p>

        <div class="observe-review-row">
          <span class="observe-review-label">Site</span>
          <span class="observe-review-value">${site ? escapeHtml(site.name) : '—'}</span>
        </div>
        <div class="observe-review-row">
          <span class="observe-review-label">Clarity</span>
          <span class="observe-review-value">${d.clarity ? Observations.clarityLabel(d.clarity) : '—'}</span>
        </div>
        <div class="observe-review-row">
          <span class="observe-review-label">Colour</span>
          <span class="observe-review-value">${d.colour ? Observations.colourLabel(d.colour) : '—'}</span>
        </div>
        <div class="observe-review-row">
          <span class="observe-review-label">Smell</span>
          <span class="observe-review-value">${d.smell ? Observations.smellLabel(d.smell) : '—'}</span>
        </div>
        <div class="observe-review-row">
          <span class="observe-review-label">Litter</span>
          <span class="observe-review-value">${d.litter ? Observations.litterLabel(d.litter) : '—'}</span>
        </div>
        <div class="observe-review-row">
          <span class="observe-review-label">Wildlife</span>
          <span class="observe-review-value">${d.wildlife.length ? d.wildlife.map(w => Observations.wildlifeLabel(w)).join(', ') : 'None'}</span>
        </div>
        ${d.ph ? `
          <div class="observe-review-row">
            <span class="observe-review-label">pH</span>
            <span class="observe-review-value">${d.ph}</span>
          </div>
        ` : ''}
        ${d.photo ? `
          <div class="observe-review-row" style="flex-direction:column; align-items:flex-start; gap:8px;">
            <span class="observe-review-label">Photo</span>
            <img src="${d.photo}" alt="" style="width:100%; max-height:180px; object-fit:cover; border-radius:12px;">
          </div>
        ` : ''}
        ${d.note ? `
          <div class="observe-review-row" style="flex-direction:column; align-items:flex-start; gap:6px;">
            <span class="observe-review-label">Notes</span>
            <p style="font-size:13px; color:var(--pc-text-2); line-height:1.5;">${escapeHtml(d.note)}</p>
          </div>
        ` : ''}
      </div>

      <div class="observe-reward-preview">
        <i class="fas fa-star"></i>
        <span>You'll earn <strong>+${d.photo ? 15 : 10} points</strong> for this observation</span>
      </div>

      ${renderObserveNav(true)}
    </div>
  `;
}

/* ============================================================ */
/* 10. NAVIGATION                                                */
/* ============================================================ */
function renderObserveNav(isLast = false) {
  const canProceed = validateCurrentStep();

  return `
    <div class="observe-nav">
      ${observeState.step > 1 ? `
        <button type="button" class="observe-btn observe-btn-ghost" onclick="observePrevStep()">
          <i class="fas fa-arrow-left"></i> Back
        </button>
      ` : '<div></div>'}

      ${isLast ? `
        <button type="button" class="observe-btn observe-btn-primary" onclick="submitObservation()">
          <i class="fas fa-check"></i> Submit
        </button>
      ` : `
        <button type="button" class="observe-btn observe-btn-primary ${!canProceed ? 'disabled' : ''}"
                ${!canProceed ? 'disabled' : ''}
                onclick="observeNextStep()">
          Next <i class="fas fa-arrow-right"></i>
        </button>
      `}
    </div>
  `;
}

function validateCurrentStep() {
  const d = observeState.data;

  switch (observeState.step) {
    case 1:
      return !!d.clarity;
    case 2:
      return !!d.litter;
    case 3:
    case 4:
    case 5:
      return true;
    default:
      return true;
  }
}

/* ============================================================ */
/* 11. STEP NAVIGATION                                           */
/* ============================================================ */
function observeNextStep() {
  if (!validateCurrentStep()) {
    showToast('Please complete this step');
    return;
  }

  if (observeState.step === 4) {
    captureStep4Inputs();
  }

  if (observeState.step < observeState.totalSteps) {
    observeState.step++;
    renderObserveForm();
  }
}

function observePrevStep() {
  if (observeState.step > 1) {
    if (observeState.step === 4) {
      captureStep4Inputs();
    }
    observeState.step--;
    renderObserveForm();
  }
}

function captureStep4Inputs() {
  const ph = document.getElementById('observePh');
  const turbidity = document.getElementById('observeTurbidity');
  const temp = document.getElementById('observeTemp');
  const note = document.getElementById('observeNote');

  if (ph) observeState.data.ph = ph.value ? parseFloat(ph.value) : null;
  if (turbidity) observeState.data.turbidity = turbidity.value ? parseFloat(turbidity.value) : null;
  if (temp) observeState.data.temperature = temp.value ? parseFloat(temp.value) : null;
  if (note) observeState.data.note = note.value.trim();
}

/* ============================================================ */
/* 12. HANDLERS — Event Delegation                               */
/* ============================================================ */
function attachObserveHandlers() {
  const modal = document.getElementById('observationModal');
  if (!modal) return;

  const content = modal.querySelector('.modal-content');
  if (!content) return;

  /*
   * Attach the main delegated click handler only once.
   * The modal content itself survives re-renders.
   */
  if (content.dataset.observeHandlersAttached !== 'true') {
    content.dataset.observeHandlersAttached = 'true';

    content.addEventListener('click', (e) => {
      const fieldBtn = e.target.closest('[data-observe-field]');
      if (fieldBtn) {
        e.preventDefault();
        e.stopPropagation();

        const field = fieldBtn.dataset.observeField;
        const value = fieldBtn.dataset.observeValue;

        observeState.data[field] = value;
        renderObserveForm();
        return;
      }

      const wildlifeBtn = e.target.closest('[data-observe-wildlife]');
      if (wildlifeBtn) {
        e.preventDefault();
        e.stopPropagation();

        const val = wildlifeBtn.dataset.observeWildlife;
        const arr = observeState.data.wildlife;
        const idx = arr.indexOf(val);

        if (idx === -1) arr.push(val);
        else arr.splice(idx, 1);

        renderObserveForm();
        return;
      }

      const photoRemoveBtn = e.target.closest('.observe-photo-remove');
      if (photoRemoveBtn) {
        e.preventDefault();
        e.stopPropagation();

        removeObservePhoto();
        return;
      }
    });
  }

  /*
   * IMPORTANT:
   * This input is recreated every time the form re-renders.
   * Therefore we must check the CURRENT input on every render.
   */
  const photoInput = document.getElementById('observePhotoInput');

  if (photoInput && !photoInput.dataset.listenerAttached) {
    photoInput.dataset.listenerAttached = 'true';
    photoInput.addEventListener('change', handleObservePhoto);
  }
}

/* ⭐ Async photo handler with compression */
async function handleObservePhoto(e) {
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
    observeState.data.photo = compressed;
    renderObserveForm();
    showToast('Photo added');
  } catch (err) {
    console.error('[Observe] Photo compress failed:', err);
    showToast('Could not process image');
  }
}

function removeObservePhoto() {
  observeState.data.photo = null;
  renderObserveForm();
}

/* ============================================================ */
/* 13. CANCEL / CLOSE OBSERVATION                                */
/* ============================================================ */
function cancelObservation() {
  if (observeState.step > 1 && (observeState.data.clarity || observeState.data.litter)) {
    if (!confirm('Discard this observation?')) return;
  }

  closeModal('observationModal');

  if (typeof updateBodyScrollLock === 'function') {
    updateBodyScrollLock();
  }
}

/* ============================================================ */
/* 14. CHANGE SITE                                               */
/* ============================================================ */
function changeObserveSite() {
  if (observeState.step === 4) {
    captureStep4Inputs();
  }

  const obsModal = document.getElementById('observationModal');
  if (obsModal) obsModal.classList.remove('active');

  const modal = document.getElementById('quickViewModal');
  if (!modal) return;

  modal.querySelector('.modal-content').innerHTML = `
    <button type="button" class="close-modal" onclick="cancelObserveSiteChange()">
      <i class="fas fa-times"></i>
    </button>
    <h2 class="modal-title"><i class="fas fa-water"></i> Choose Site</h2>
    <div style="display:flex; flex-direction:column; gap:8px;">
      ${SITES.map(s => `
        <button type="button" class="observe-site-pick" onclick="selectObserveSite('${s.id}')">
          <img src="${s.cover}" alt="" onerror="this.style.opacity='0'">
          <div>
            <p class="observe-site-pick-name">${escapeHtml(s.name)}</p>
            <p class="observe-site-pick-loc">${escapeHtml(s.location.area)}</p>
          </div>
        </button>
      `).join('')}
    </div>
  `;

  modal.classList.add('active');

  if (typeof updateBodyScrollLock === 'function') {
    updateBodyScrollLock();
  }
}

function cancelObserveSiteChange() {
  const picker = document.getElementById('quickViewModal');
  if (picker) picker.classList.remove('active');

  setTimeout(() => {
    const obsModal = document.getElementById('observationModal');
    if (obsModal) obsModal.classList.add('active');

    if (typeof updateBodyScrollLock === 'function') {
      updateBodyScrollLock();
    }
  }, 200);
}

function selectObserveSite(siteId) {
  observeState.siteId = siteId;

  const picker = document.getElementById('quickViewModal');
  if (picker) picker.classList.remove('active');

  setTimeout(() => {
    const obsModal = document.getElementById('observationModal');
    if (obsModal) obsModal.classList.add('active');
    renderObserveForm();

    if (typeof updateBodyScrollLock === 'function') {
      updateBodyScrollLock();
    }

    const site = getSiteById(siteId);
    if (site) showToast('Changed to ' + site.name);
  }, 200);
}

/* ============================================================ */
/* 15. SUBMIT                                                    */
/* ============================================================ */
function submitObservation() {
  captureStep4Inputs();

  const d = observeState.data;

  if (!d.clarity || !d.litter) {
    showToast('Please complete required fields');
    return;
  }

  const obs = Observations.create({
    siteId: observeState.siteId,
    clarity: d.clarity,
    litter: d.litter,
    smell: d.smell || 'none',
    colour: d.colour || 'normal',
    wildlife: d.wildlife || [],
    ph: d.ph,
    turbidity: d.turbidity,
    temperature: d.temperature,
    photo: d.photo,
    note: d.note || ''
  });

  closeModal('observationModal');

  if (typeof updateBodyScrollLock === 'function') {
    updateBodyScrollLock();
  }

  showToast('Observation recorded! +points');

  if (typeof confetti === 'function') {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#22D3EE', '#0891B2', '#10B981', '#FBBF24']
    });
  }

  setTimeout(() => {
    if (APP.currentPage === 'home') renderHome();
    if (APP.currentPage === 'site-detail') renderSiteDetail();
    if (APP.currentPage === 'sites') renderSites();
    if (APP.currentPage === 'feed') renderFeed();
    if (APP.currentPage === 'profile') renderProfile();
  }, 400);

  if (typeof refreshDrawer === 'function') refreshDrawer();
  if (typeof updateNotifBadge === 'function') updateNotifBadge();
}

/* ============================================================ */
/* 16. EXPORTS                                                   */
/* ============================================================ */
window.openObservationFlow = openObservationFlow;
window.observeNextStep = observeNextStep;
window.observePrevStep = observePrevStep;
window.submitObservation = submitObservation;
window.removeObservePhoto = removeObservePhoto;
window.changeObserveSite = changeObserveSite;
window.cancelObserveSiteChange = cancelObserveSiteChange;
window.cancelObservation = cancelObservation;
window.selectObserveSite = selectObserveSite;
window.renderObserve = () => {
  showPage('home');
  showToast('Tap the + button to record an observation');
};

console.log('[AquaQuest] Observe page loaded');