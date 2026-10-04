/* ============================================================ */
/* AQUAQUEST — ACTIVITY FLOW                                     */
/* Guided contribution flow — Cleanup / Observation / Wildlife   */
/* Complete · Fresh · Photo upload async · No errors             */
/* ============================================================ */

let activityState = {
  challengeId: null,
  activityType: null,
  step: 1,
  totalSteps: 0,
  data: {
    /* Cleanup / Restoration */
    beforePhoto: null,
    afterPhoto: null,
    activitySelections: [],
    quantity: null,
    activityNote: '',

    /* Observation */
    observationData: {
      clarity: null,
      litter: null,
      smell: null,
      colour: null,
      wildlife: [],
      ph: null,
      temperature: null,
      turbidity: null
    },

    /* Wildlife */
    wildlifeData: {
      category: null,
      species: '',
      count: null,
      behavior: '',
      confidence: 'confident'
    },

    /* Common */
    photo: null
  }
};

/* ============================================================ */
/* 1. OPEN FLOW                                                  */
/* ============================================================ */
function openContributionFlow(challengeId) {
  if (!isLoggedIn()) {
    showToast('Sign in to contribute');
    openModal('loginModal');
    if (typeof renderLoginModal === 'function') renderLoginModal();
    return;
  }

  const challenge = getChallengeById(challengeId);
  if (!challenge) {
    showToast('Challenge not found');
    return;
  }

  activityState.challengeId = challengeId;
  activityState.activityType = challenge.activityType || 'observation';
  activityState.step = 1;
  activityState.data = {
    beforePhoto: null,
    afterPhoto: null,
    activitySelections: [],
    quantity: null,
    activityNote: '',
    observationData: {
      clarity: null,
      litter: null,
      smell: null,
      colour: null,
      wildlife: [],
      ph: null,
      temperature: null,
      turbidity: null
    },
    wildlifeData: {
      category: null,
      species: '',
      count: null,
      behavior: '',
      confidence: 'confident'
    },
    photo: null
  };

  activityState.totalSteps = getTotalStepsForType(activityState.activityType);

  showPage('contribution-flow');
  renderContributionFlow();
}

/* ============================================================ */
/* 2. STEP COUNT BY TYPE                                         */
/* ============================================================ */
function getTotalStepsForType(activityType) {
  switch (activityType) {
    case 'cleanup':      return 5;
    case 'restoration':  return 5;
    case 'observation':  return 4;
    case 'wildlife':     return 4;
    case 'measurement':  return 4;
    default:             return 4;
  }
}

/* ============================================================ */
/* 3. MAIN RENDER                                                */
/* ============================================================ */
function renderContributionFlow() {
  const page = document.getElementById('page-contribution-flow');
  if (!page) return;

  const challenge = getChallengeById(activityState.challengeId);
  if (!challenge) return;

  const step = activityState.step;
  const total = activityState.totalSteps;
  const progress = (step / total) * 100;
  const canProceed = validateFlowStep();
  const isLast = step === total;

  page.innerHTML = `
    <div class="page-container contribution-flow-page">

      <div class="flow-header">
        <button type="button" class="flow-back-btn" onclick="handleFlowBack()" aria-label="Back">
          <i class="fas fa-arrow-left"></i>
        </button>
        <div class="flow-header-info">
          <p class="flow-header-challenge">${escapeHtml(challenge.title)}</p>
          <p class="flow-header-step">Step ${step} of ${total}</p>
        </div>
        <button type="button" class="flow-close-btn" onclick="handleFlowClose()" aria-label="Close">
          <i class="fas fa-times"></i>
        </button>
      </div>

      <div class="flow-progress">
        <div class="flow-progress-fill" style="width:${progress}%;"></div>
      </div>

      <div class="flow-content">
        ${renderFlowStepContent(challenge, step)}
      </div>

      <div class="flow-nav">
        ${step > 1 ? `
          <button type="button" class="flow-btn flow-btn-ghost" onclick="handleFlowPrev()">
            <i class="fas fa-arrow-left"></i> Back
          </button>
        ` : '<div></div>'}

        ${isLast ? `
          <button type="button" class="flow-btn flow-btn-primary"
                  onclick="handleFlowSubmit()"
                  ${!canProceed ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''}>
            <i class="fas fa-paper-plane"></i> Submit Contribution
          </button>
        ` : `
          <button type="button" class="flow-btn flow-btn-primary"
                  onclick="handleFlowNext()"
                  ${!canProceed ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''}>
            Next <i class="fas fa-arrow-right"></i>
          </button>
        `}
      </div>

    </div>
  `;

  attachFlowHandlers();
}

/* ============================================================ */
/* 4. STEP CONTENT ROUTER                                        */
/* ============================================================ */
function renderFlowStepContent(challenge, step) {
  const type = activityState.activityType;

  if (type === 'cleanup' || type === 'restoration') {
    switch (step) {
      case 1: return renderCleanupStep1(challenge);
      case 2: return renderCleanupStep2(challenge);
      case 3: return renderCleanupStep3(challenge);
      case 4: return renderCleanupStep4(challenge);
      case 5: return renderCleanupStep5(challenge);
    }
  }

  if (type === 'observation') {
    switch (step) {
      case 1: return renderObservationStep1(challenge);
      case 2: return renderObservationStep2(challenge);
      case 3: return renderObservationStep3(challenge);
      case 4: return renderObservationStep4(challenge);
    }
  }

  if (type === 'wildlife') {
    switch (step) {
      case 1: return renderWildlifeStep1(challenge);
      case 2: return renderWildlifeStep2(challenge);
      case 3: return renderWildlifeStep3(challenge);
      case 4: return renderWildlifeStep4(challenge);
    }
  }

  return '';
}

/* ============================================================ */
/* 5. CLEANUP FLOW                                               */
/* ============================================================ */

/* ---------- Step 1: Before photo ---------- */
function renderCleanupStep1(challenge) {
  const hasPhoto = !!activityState.data.beforePhoto;

  return `
    <div class="flow-step">

      <div class="flow-step-icon"
           style="background:var(--pc-accent-soft); color:var(--pc-accent);">
        <i class="fas fa-camera"></i>
      </div>

      <h2 class="flow-step-title">
        Capture your starting point
      </h2>

      <p class="flow-step-sub">
        Show us the area before you begin. This helps make your impact visible.
      </p>

      <label
        class="flow-photo-upload ${hasPhoto ? 'has-photo' : ''}"
        for="flowBeforePhoto"
      >

        ${hasPhoto ? `
          <img
            src="${activityState.data.beforePhoto}"
            alt="Before photo"
          >

          <button
            type="button"
            class="flow-photo-remove"
            onclick="event.preventDefault(); event.stopPropagation(); removeFlowPhoto('beforePhoto');"
            aria-label="Remove photo"
          >
            <i class="fas fa-times"></i>
          </button>

          <span class="flow-photo-label">
            Before
          </span>

        ` : `

          <i class="fas fa-camera"></i>

          <p>
            Capture before photo
          </p>

          <span>
            JPG / PNG · Up to 15 MB
          </span>

        `}

      </label>

      <input
        type="file"
        id="flowBeforePhoto"
        accept="image/*"
        style="display:none;"
      >

      <div class="flow-hint">
        <i class="fas fa-lightbulb"></i>

        <span>
          Stand in the same spot for your before &amp; after photos
          so the difference is easier to see.
        </span>
      </div>

    </div>
  `;
}

/* ---------- Step 2: Activity selection ---------- */
function renderCleanupStep2(challenge) {
  const selections = activityState.data.activitySelections || [];
  const quantity = activityState.data.quantity;

  const options = [
    { id: 'Removed litter', icon: 'fa-trash' },
    { id: 'Sorted waste', icon: 'fa-recycle' },
    { id: 'Cleared blocked area', icon: 'fa-water' },
    { id: 'Other', icon: 'fa-ellipsis' }
  ];

  const quantityOptions = [
    { id: 'small', label: 'Small bag' },
    { id: '1-2', label: '1–2 bags' },
    { id: '3+', label: '3+ bags' },
    { id: 'unsure', label: 'Not sure' }
  ];

  return `
    <div class="flow-step">
      <div class="flow-step-icon" style="background:var(--pc-success-soft); color:var(--pc-success);">
        <i class="fas fa-broom"></i>
      </div>

      <h2 class="flow-step-title">What did you do?</h2>
      <p class="flow-step-sub">Select all that apply.</p>

      <div class="flow-options-list">
        ${options.map(o => `
          <button type="button"
                  class="flow-option-item ${selections.includes(o.id) ? 'selected' : ''}"
                  data-flow-selection="${o.id}">
            <div class="flow-option-check">
              <i class="fas ${selections.includes(o.id) ? 'fa-check-circle' : 'fa-circle'}"></i>
            </div>
            <i class="fas ${o.icon} flow-option-icon"></i>
            <span class="flow-option-label">${o.label}</span>
          </button>
        `).join('')}
      </div>

      <h3 class="flow-subheading">Approximate amount</h3>

      <div class="flow-quantity-row">
        ${quantityOptions.map(q => `
          <button type="button"
                  class="flow-quantity-chip ${quantity === q.id ? 'active' : ''}"
                  data-flow-quantity="${q.id}">
            ${q.label}
          </button>
        `).join('')}
      </div>
    </div>
  `;
}

/* ---------- Step 3: After photo ---------- */
function renderCleanupStep3(challenge) {
  const hasPhoto = !!activityState.data.afterPhoto;

  return `
    <div class="flow-step">
      <div class="flow-step-icon" style="background:var(--pc-accent-soft); color:var(--pc-accent);">
        <i class="fas fa-camera-retro"></i>
      </div>

      <h2 class="flow-step-title">Show what changed</h2>
      <p class="flow-step-sub">Take a photo of the same area after your activity.</p>

      <label class="flow-photo-upload ${hasPhoto ? 'has-photo' : ''}" for="flowAfterPhoto">
        ${hasPhoto ? `
          <img src="${activityState.data.afterPhoto}" alt="After">
          <button type="button" class="flow-photo-remove" onclick="event.preventDefault(); event.stopPropagation(); removeFlowPhoto('afterPhoto');">
            <i class="fas fa-times"></i>
          </button>
        ` : `
          <i class="fas fa-camera"></i>
          <p>Tap to add after photo</p>
          <span>Same spot as before — shows the change</span>
        `}
      </label>
      <input type="file" id="flowAfterPhoto" accept="image/*" style="display:none;">
    </div>
  `;
}

/* ---------- Step 4: Note ---------- */
function renderCleanupStep4(challenge) {
  const note = activityState.data.activityNote || '';

  return `
    <div class="flow-step">
      <div class="flow-step-icon" style="background:var(--pc-purple-soft); color:var(--pc-purple);">
        <i class="fas fa-note-sticky"></i>
      </div>

      <h2 class="flow-step-title">Tell the community what you noticed</h2>
      <p class="flow-step-sub">Optional but recommended — helps document conditions.</p>

      <textarea id="flowActivityNote"
                class="flow-textarea"
                rows="5"
                maxlength="300"
                placeholder="Example: Removed plastic packaging and bottles from the canal edge.">${escapeHtml(note)}</textarea>

      <p class="flow-textarea-counter">
        <span id="flowNoteCount">${note.length}</span> / 300
      </p>
    </div>
  `;
}

/* ---------- Step 5: Review ---------- */
function renderCleanupStep5(challenge) {
  const d = activityState.data;
  const site = challenge.siteId ? getSiteById(challenge.siteId) : null;
  const now = new Date();

  const quantityLabels = {
    'small': 'Small bag',
    '1-2': '1–2 bags',
    '3+': '3+ bags',
    'unsure': 'Not sure'
  };

  return `
    <div class="flow-step">
      <div class="flow-step-icon" style="background:var(--pc-success-soft); color:var(--pc-success);">
        <i class="fas fa-check-double"></i>
      </div>

      <h2 class="flow-step-title">Review your contribution</h2>
      <p class="flow-step-sub">Submit to add this to the community record.</p>

      <div class="flow-review-block">
        <p class="flow-review-location">
          <i class="fas fa-map-marker-alt"></i>
          ${escapeHtml(site ? site.name : challenge.location)}
        </p>
        <p class="flow-review-time">
          <i class="fas fa-clock"></i>
          ${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · ${now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
        </p>
      </div>

      ${d.beforePhoto || d.afterPhoto ? `
        <div class="flow-review-photos">
          ${d.beforePhoto ? `
            <div class="flow-review-photo">
              <img src="${d.beforePhoto}" alt="" onerror="this.style.opacity='0'">
              <span class="flow-photo-label">Before</span>
            </div>
          ` : ''}
          ${d.afterPhoto ? `
            <div class="flow-review-photo">
              <img src="${d.afterPhoto}" alt="" onerror="this.style.opacity='0'">
              <span class="flow-photo-label">After</span>
            </div>
          ` : ''}
        </div>
      ` : ''}

      ${d.activitySelections && d.activitySelections.length ? `
        <div class="flow-review-item">
          <p class="flow-review-key">Activity</p>
          <p class="flow-review-value">${d.activitySelections.map(s => escapeHtml(s)).join(', ')}</p>
        </div>
      ` : ''}

      ${d.quantity ? `
        <div class="flow-review-item">
          <p class="flow-review-key">Amount</p>
          <p class="flow-review-value">${quantityLabels[d.quantity] || d.quantity}</p>
        </div>
      ` : ''}

      ${d.activityNote ? `
        <div class="flow-review-item">
          <p class="flow-review-key">Note</p>
          <p class="flow-review-value flow-review-note">${escapeHtml(d.activityNote)}</p>
        </div>
      ` : ''}
    </div>
  `;
}

/* ============================================================ */
/* 6. OBSERVATION FLOW                                           */
/* ============================================================ */

function renderObservationStep1(challenge) {
  const d = activityState.data.observationData;

  return `
    <div class="flow-step">
      <div class="flow-step-icon" style="background:var(--pc-accent-soft); color:var(--pc-accent);">
        <i class="fas fa-eye"></i>
      </div>

      <h2 class="flow-step-title">Record your observation</h2>
      <p class="flow-step-sub">How does the water look right now?</p>

      <h3 class="flow-subheading">Water clarity</h3>
      <div class="flow-options-grid">
        ${renderObservationOption('clarity', 'excellent', 'Crystal Clear', 'fa-star')}
        ${renderObservationOption('clarity', 'good', 'Clear', 'fa-circle-check')}
        ${renderObservationOption('clarity', 'moderate', 'Murky', 'fa-circle-half-stroke')}
        ${renderObservationOption('clarity', 'poor', 'Very Cloudy', 'fa-circle-exclamation')}
        ${renderObservationOption('clarity', 'critical', 'Unusual Colour', 'fa-triangle-exclamation')}
      </div>

      <h3 class="flow-subheading">Litter</h3>
      <div class="flow-options-grid">
        ${renderObservationOption('litter', 'none', 'None', 'fa-check-circle')}
        ${renderObservationOption('litter', 'little', 'A Little', 'fa-leaf')}
        ${renderObservationOption('litter', 'moderate', 'Moderate', 'fa-trash')}
        ${renderObservationOption('litter', 'heavy', 'Heavy', 'fa-trash-can')}
      </div>

      <h3 class="flow-subheading">Wildlife observed</h3>
      <div class="flow-wildlife-grid">
        ${renderWildlifeChip('fish', 'Fish', 'fa-fish')}
        ${renderWildlifeChip('birds', 'Birds', 'fa-dove')}
        ${renderWildlifeChip('plants', 'Plants', 'fa-seedling')}
        ${renderWildlifeChip('crabs', 'Crabs', 'fa-shrimp')}
        ${renderWildlifeChip('insects', 'Insects', 'fa-bug')}
        ${renderWildlifeChip('none', 'None observed', 'fa-eye-slash')}
      </div>
    </div>
  `;
}

function renderObservationOption(field, value, label, icon) {
  const selected = activityState.data.observationData[field] === value;

  return `
    <button type="button"
            class="flow-option-chip ${selected ? 'active' : ''}"
            data-flow-obs="${field}"
            data-flow-obs-value="${value}">
      <i class="fas ${icon}"></i>
      <span>${label}</span>
    </button>
  `;
}

function renderWildlifeChip(id, label, icon) {
  const selected = activityState.data.observationData.wildlife.includes(id);

  return `
    <button type="button"
            class="flow-wildlife-chip ${selected ? 'active' : ''}"
            data-flow-wildlife="${id}">
      <i class="fas ${icon}"></i>
      <span>${label}</span>
    </button>
  `;
}

function renderObservationStep2(challenge) {
  const hasPhoto = !!activityState.data.photo;

  return `
    <div class="flow-step">
      <div class="flow-step-icon" style="background:var(--pc-purple-soft); color:var(--pc-purple);">
        <i class="fas fa-camera"></i>
      </div>

      <h2 class="flow-step-title">Add a photo</h2>
      <p class="flow-step-sub">Recommended — helps document conditions.</p>

      <label class="flow-photo-upload ${hasPhoto ? 'has-photo' : ''}" for="flowObservationPhoto">
        ${hasPhoto ? `
          <img src="${activityState.data.photo}" alt="Observation">
          <button type="button" class="flow-photo-remove" onclick="event.preventDefault(); event.stopPropagation(); removeFlowPhoto('photo');">
            <i class="fas fa-times"></i>
          </button>
        ` : `
          <i class="fas fa-camera"></i>
          <p>Tap to add photo</p>
          <span>Same spot every time = consistent data</span>
        `}
      </label>
      <input type="file" id="flowObservationPhoto" accept="image/*" style="display:none;">
    </div>
  `;
}

function renderObservationStep3(challenge) {
  const d = activityState.data.observationData;
  const note = activityState.data.activityNote || '';

  return `
    <div class="flow-step">
      <div class="flow-step-icon" style="background:var(--pc-warning-soft); color:var(--pc-warning);">
        <i class="fas fa-note-sticky"></i>
      </div>

      <h2 class="flow-step-title">Notes &amp; measurements</h2>
      <p class="flow-step-sub">Optional — add what you noticed.</p>

      <textarea id="flowActivityNote"
                class="flow-textarea"
                rows="4"
                maxlength="300"
                placeholder="Example: Water was clearer than last week. Saw two kingfishers near the bend.">${escapeHtml(note)}</textarea>

      <h3 class="flow-subheading" style="margin-top:16px;">Advanced readings (optional)</h3>

      <div class="flow-measurements-grid">
        <div>
          <label>pH</label>
          <input type="number" id="flowPh" step="0.1" min="0" max="14" placeholder="7.2" value="${d.ph || ''}">
        </div>
        <div>
          <label>Temp (°C)</label>
          <input type="number" id="flowTemp" step="0.1" placeholder="25" value="${d.temperature || ''}">
        </div>
        <div>
          <label>Turbidity (NTU)</label>
          <input type="number" id="flowTurbidity" step="0.1" min="0" placeholder="12" value="${d.turbidity || ''}">
        </div>
      </div>
    </div>
  `;
}

function renderObservationStep4(challenge) {
  const d = activityState.data.observationData;
  const site = challenge.siteId ? getSiteById(challenge.siteId) : null;
  const now = new Date();

  const clarityLabels = {
    excellent: 'Crystal Clear',
    good: 'Clear',
    moderate: 'Murky',
    poor: 'Very Cloudy',
    critical: 'Unusual Colour'
  };

  const litterLabels = {
    none: 'None',
    little: 'A Little',
    moderate: 'Moderate',
    heavy: 'Heavy'
  };

  return `
    <div class="flow-step">
      <div class="flow-step-icon" style="background:var(--pc-success-soft); color:var(--pc-success);">
        <i class="fas fa-check-double"></i>
      </div>

      <h2 class="flow-step-title">Review your contribution</h2>
      <p class="flow-step-sub">Submit to add this to the site's community record.</p>

      <div class="flow-review-block">
        <p class="flow-review-location">
          <i class="fas fa-map-marker-alt"></i>
          ${escapeHtml(site ? site.name : challenge.location)}
        </p>
        <p class="flow-review-time">
          <i class="fas fa-clock"></i>
          ${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · ${now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
        </p>
      </div>

      ${activityState.data.photo ? `
        <div class="flow-review-photo-single">
          <img src="${activityState.data.photo}" alt="" onerror="this.style.opacity='0'">
        </div>
      ` : ''}

      ${d.clarity ? `
        <div class="flow-review-item">
          <p class="flow-review-key">Clarity</p>
          <p class="flow-review-value">${clarityLabels[d.clarity] || d.clarity}</p>
        </div>
      ` : ''}

      ${d.litter ? `
        <div class="flow-review-item">
          <p class="flow-review-key">Litter</p>
          <p class="flow-review-value">${litterLabels[d.litter] || d.litter}</p>
        </div>
      ` : ''}

      ${d.wildlife && d.wildlife.length ? `
        <div class="flow-review-item">
          <p class="flow-review-key">Wildlife</p>
          <p class="flow-review-value">${d.wildlife.join(', ')}</p>
        </div>
      ` : ''}

      ${activityState.data.activityNote ? `
        <div class="flow-review-item">
          <p class="flow-review-key">Note</p>
          <p class="flow-review-value flow-review-note">${escapeHtml(activityState.data.activityNote)}</p>
        </div>
      ` : ''}
    </div>
  `;
}

/* ============================================================ */
/* 7. WILDLIFE FLOW                                              */
/* ============================================================ */

function renderWildlifeStep1(challenge) {
  const d = activityState.data.wildlifeData;

  const categories = [
    { id: 'fish', label: 'Fish', icon: 'fa-fish' },
    { id: 'birds', label: 'Birds', icon: 'fa-dove' },
    { id: 'insects', label: 'Insects', icon: 'fa-bug' },
    { id: 'plants', label: 'Plants', icon: 'fa-seedling' },
    { id: 'mammals', label: 'Mammals', icon: 'fa-paw' },
    { id: 'other', label: 'Other', icon: 'fa-ellipsis' }
  ];

  return `
    <div class="flow-step">
      <div class="flow-step-icon" style="background:var(--pc-purple-soft); color:var(--pc-purple);">
        <i class="fas fa-fish"></i>
      </div>

      <h2 class="flow-step-title">What wildlife did you observe?</h2>
      <p class="flow-step-sub">Uncertain identifications are okay — this is citizen science.</p>

      <h3 class="flow-subheading">Category</h3>
      <div class="flow-options-grid">
        ${categories.map(c => `
          <button type="button"
                  class="flow-option-chip ${d.category === c.id ? 'active' : ''}"
                  data-flow-wildcat="${c.id}">
            <i class="fas ${c.icon}"></i>
            <span>${c.label}</span>
          </button>
        `).join('')}
      </div>

      <h3 class="flow-subheading">Species (if known)</h3>
      <input type="text"
             id="flowSpecies"
             class="flow-input"
             placeholder="e.g. Kingfisher, or leave blank if unsure"
             maxlength="80"
             value="${escapeHtml(d.species || '')}">

      <div class="flow-measurements-grid" style="margin-top:16px;">
        <div>
          <label>Count</label>
          <input type="number" id="flowCount" min="1" max="500" placeholder="2" value="${d.count || ''}">
        </div>
        <div>
          <label>Confidence</label>
          <select id="flowConfidence">
            <option value="confident" ${d.confidence === 'confident' ? 'selected' : ''}>Confident</option>
            <option value="unsure" ${d.confidence === 'unsure' ? 'selected' : ''}>Unsure</option>
            <option value="guessing" ${d.confidence === 'guessing' ? 'selected' : ''}>Guessing</option>
          </select>
        </div>
      </div>
    </div>
  `;
}

function renderWildlifeStep2(challenge) {
  const hasPhoto = !!activityState.data.photo;

  return `
    <div class="flow-step">
      <div class="flow-step-icon" style="background:var(--pc-accent-soft); color:var(--pc-accent);">
        <i class="fas fa-camera"></i>
      </div>

      <h2 class="flow-step-title">Photo (if possible)</h2>
      <p class="flow-step-sub">Helps verify the sighting — but don't disturb the animal.</p>

      <label class="flow-photo-upload ${hasPhoto ? 'has-photo' : ''}" for="flowWildlifePhoto">
        ${hasPhoto ? `
          <img src="${activityState.data.photo}" alt="Wildlife">
          <button type="button" class="flow-photo-remove" onclick="event.preventDefault(); event.stopPropagation(); removeFlowPhoto('photo');">
            <i class="fas fa-times"></i>
          </button>
        ` : `
          <i class="fas fa-camera"></i>
          <p>Tap to add photo</p>
          <span>Optional but recommended</span>
        `}
      </label>
      <input type="file" id="flowWildlifePhoto" accept="image/*" style="display:none;">

      <div class="flow-hint">
        <i class="fas fa-shield-halved"></i>
        <span>Never approach or disturb wildlife for a photo.</span>
      </div>
    </div>
  `;
}

function renderWildlifeStep3(challenge) {
  const note = activityState.data.activityNote || '';
  const behavior = activityState.data.wildlifeData.behavior || '';

  return `
    <div class="flow-step">
      <div class="flow-step-icon" style="background:var(--pc-warning-soft); color:var(--pc-warning);">
        <i class="fas fa-note-sticky"></i>
      </div>

      <h2 class="flow-step-title">Describe what you saw</h2>
      <p class="flow-step-sub">Behavior, location, conditions.</p>

      <label style="font-size:12px; font-weight:700; color:var(--pc-text-2); text-transform:uppercase; letter-spacing:0.3px; display:block; margin-bottom:6px;">
        Behavior
      </label>
      <input type="text"
             id="flowBehavior"
             class="flow-input"
             placeholder="e.g. Hunting near the water edge"
             maxlength="80"
             value="${escapeHtml(behavior)}">

      <label style="font-size:12px; font-weight:700; color:var(--pc-text-2); text-transform:uppercase; letter-spacing:0.3px; display:block; margin:14px 0 6px;">
        Notes
      </label>
      <textarea id="flowActivityNote"
                class="flow-textarea"
                rows="4"
                maxlength="300"
                placeholder="Example: Two kingfishers diving for fish near the pool below the waterfall.">${escapeHtml(note)}</textarea>
    </div>
  `;
}

function renderWildlifeStep4(challenge) {
  const d = activityState.data.wildlifeData;
  const site = challenge.siteId ? getSiteById(challenge.siteId) : null;
  const now = new Date();

  const categoryLabels = {
    fish: 'Fish',
    birds: 'Birds',
    insects: 'Insects',
    plants: 'Plants',
    mammals: 'Mammals',
    other: 'Other'
  };

  return `
    <div class="flow-step">
      <div class="flow-step-icon" style="background:var(--pc-success-soft); color:var(--pc-success);">
        <i class="fas fa-check-double"></i>
      </div>

      <h2 class="flow-step-title">Review your contribution</h2>
      <p class="flow-step-sub">Submit to add this sighting to the community record.</p>

      <div class="flow-review-block">
        <p class="flow-review-location">
          <i class="fas fa-map-marker-alt"></i>
          ${escapeHtml(site ? site.name : challenge.location)}
        </p>
        <p class="flow-review-time">
          <i class="fas fa-clock"></i>
          ${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · ${now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
        </p>
      </div>

      ${activityState.data.photo ? `
        <div class="flow-review-photo-single">
          <img src="${activityState.data.photo}" alt="" onerror="this.style.opacity='0'">
        </div>
      ` : ''}

      ${d.category ? `
        <div class="flow-review-item">
          <p class="flow-review-key">Category</p>
          <p class="flow-review-value">${categoryLabels[d.category] || d.category}</p>
        </div>
      ` : ''}

      ${d.species ? `
        <div class="flow-review-item">
          <p class="flow-review-key">Species</p>
          <p class="flow-review-value">${escapeHtml(d.species)}</p>
        </div>
      ` : ''}

      ${d.count ? `
        <div class="flow-review-item">
          <p class="flow-review-key">Count</p>
          <p class="flow-review-value">${d.count}</p>
        </div>
      ` : ''}

      ${d.behavior ? `
        <div class="flow-review-item">
          <p class="flow-review-key">Behavior</p>
          <p class="flow-review-value">${escapeHtml(d.behavior)}</p>
        </div>
      ` : ''}

      ${activityState.data.activityNote ? `
        <div class="flow-review-item">
          <p class="flow-review-key">Notes</p>
          <p class="flow-review-value flow-review-note">${escapeHtml(activityState.data.activityNote)}</p>
        </div>
      ` : ''}
    </div>
  `;
}

/* ============================================================ */
/* 8. HANDLERS — with listener guard                             */
/* ============================================================ */
function attachFlowHandlers() {
  const page = document.getElementById('page-contribution-flow');
  if (!page) return;

  /* ---------- Photo uploads (with listener guard) ---------- */
  const beforePhotoInput = document.getElementById('flowBeforePhoto');
  if (beforePhotoInput && !beforePhotoInput.dataset.listenerAttached) {
    beforePhotoInput.dataset.listenerAttached = 'true';
    beforePhotoInput.addEventListener('change', (e) => handleFlowPhotoUpload(e, 'beforePhoto'));
  }

  const afterPhotoInput = document.getElementById('flowAfterPhoto');
  if (afterPhotoInput && !afterPhotoInput.dataset.listenerAttached) {
    afterPhotoInput.dataset.listenerAttached = 'true';
    afterPhotoInput.addEventListener('change', (e) => handleFlowPhotoUpload(e, 'afterPhoto'));
  }

  const obsPhotoInput = document.getElementById('flowObservationPhoto');
  if (obsPhotoInput && !obsPhotoInput.dataset.listenerAttached) {
    obsPhotoInput.dataset.listenerAttached = 'true';
    obsPhotoInput.addEventListener('change', (e) => handleFlowPhotoUpload(e, 'photo'));
  }

  const wildPhotoInput = document.getElementById('flowWildlifePhoto');
  if (wildPhotoInput && !wildPhotoInput.dataset.listenerAttached) {
    wildPhotoInput.dataset.listenerAttached = 'true';
    wildPhotoInput.addEventListener('change', (e) => handleFlowPhotoUpload(e, 'photo'));
  }

  /* ---------- Activity selections (cleanup step 2) ---------- */
  page.querySelectorAll('[data-flow-selection]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.flowSelection;
      const arr = activityState.data.activitySelections;
      const idx = arr.indexOf(id);
      if (idx === -1) arr.push(id);
      else arr.splice(idx, 1);
      renderContributionFlow();
    });
  });

  /* ---------- Quantity chips ---------- */
  page.querySelectorAll('[data-flow-quantity]').forEach(btn => {
    btn.addEventListener('click', () => {
      activityState.data.quantity = btn.dataset.flowQuantity;
      renderContributionFlow();
    });
  });

  /* ---------- Observation chips ---------- */
  page.querySelectorAll('[data-flow-obs]').forEach(btn => {
    btn.addEventListener('click', () => {
      const field = btn.dataset.flowObs;
      const value = btn.dataset.flowObsValue;
      activityState.data.observationData[field] = value;
      renderContributionFlow();
    });
  });

  /* ---------- Wildlife multi-select ---------- */
  page.querySelectorAll('[data-flow-wildlife]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.flowWildlife;
      const arr = activityState.data.observationData.wildlife;

      if (id === 'none') {
        activityState.data.observationData.wildlife = [];
      } else {
        const noneIdx = arr.indexOf('none');
        if (noneIdx !== -1) arr.splice(noneIdx, 1);

        const idx = arr.indexOf(id);
        if (idx === -1) arr.push(id);
        else arr.splice(idx, 1);
      }

      renderContributionFlow();
    });
  });

  /* ---------- Wildlife category ---------- */
  page.querySelectorAll('[data-flow-wildcat]').forEach(btn => {
    btn.addEventListener('click', () => {
      activityState.data.wildlifeData.category = btn.dataset.flowWildcat;
      renderContributionFlow();
    });
  });

  /* ---------- Note input with counter ---------- */
  const noteInput = document.getElementById('flowActivityNote');
  if (noteInput) {
    noteInput.addEventListener('input', () => {
      activityState.data.activityNote = noteInput.value;
      const counter = document.getElementById('flowNoteCount');
      if (counter) counter.textContent = noteInput.value.length;
    });
  }

  /* ---------- Wildlife inputs ---------- */
  const behaviorInput = document.getElementById('flowBehavior');
  if (behaviorInput) {
    behaviorInput.addEventListener('input', () => {
      activityState.data.wildlifeData.behavior = behaviorInput.value;
    });
  }

  const speciesInput = document.getElementById('flowSpecies');
  if (speciesInput) {
    speciesInput.addEventListener('input', () => {
      activityState.data.wildlifeData.species = speciesInput.value;
    });
  }

  const countInput = document.getElementById('flowCount');
  if (countInput) {
    countInput.addEventListener('input', () => {
      activityState.data.wildlifeData.count = countInput.value ? parseInt(countInput.value, 10) : null;
    });
  }

  const confInput = document.getElementById('flowConfidence');
  if (confInput) {
    confInput.addEventListener('change', () => {
      activityState.data.wildlifeData.confidence = confInput.value;
    });
  }

  /* ---------- Measurement inputs ---------- */
  const phInput = document.getElementById('flowPh');
  const tempInput = document.getElementById('flowTemp');
  const turbInput = document.getElementById('flowTurbidity');

  if (phInput) phInput.addEventListener('input', () => {
    activityState.data.observationData.ph = phInput.value ? parseFloat(phInput.value) : null;
  });
  if (tempInput) tempInput.addEventListener('input', () => {
    activityState.data.observationData.temperature = tempInput.value ? parseFloat(tempInput.value) : null;
  });
  if (turbInput) turbInput.addEventListener('input', () => {
    activityState.data.observationData.turbidity = turbInput.value ? parseFloat(turbInput.value) : null;
  });
}

/* ============================================================ */
/* 9. VALIDATION                                                 */
/* ============================================================ */
function validateFlowStep() {
  const type = activityState.activityType;
  const step = activityState.step;
  const d = activityState.data;

  if (type === 'cleanup' || type === 'restoration') {
    if (step === 1) return !!d.beforePhoto;
    if (step === 2) return d.activitySelections.length > 0;
    if (step === 3) return !!d.afterPhoto;
    if (step === 4) return true;
    if (step === 5) return true;
  }

  if (type === 'observation') {
    if (step === 1) return !!d.observationData.clarity;
    if (step === 2) return true;
    if (step === 3) return true;
    if (step === 4) return true;
  }

  if (type === 'wildlife') {
    if (step === 1) return !!d.wildlifeData.category;
    if (step === 2) return true;
    if (step === 3) return true;
    if (step === 4) return true;
  }

  return true;
}

/* ============================================================ */
/* 10. NAV ACTIONS                                               */
/* ============================================================ */
function handleFlowNext() {
  if (!validateFlowStep()) {
    showToast('Please complete this step');
    return;
  }

  captureCurrentInputs();

  if (activityState.step < activityState.totalSteps) {
    activityState.step++;
    renderContributionFlow();
  }
}

function handleFlowPrev() {
  captureCurrentInputs();

  if (activityState.step > 1) {
    activityState.step--;
    renderContributionFlow();
  }
}

function handleFlowBack() {
  if (activityState.step > 1) {
    handleFlowPrev();
  } else {
    handleFlowClose();
  }
}

function handleFlowClose() {
  if (activityState.step > 1) {
    if (!confirm('Leave this activity? Your progress will be lost.')) return;
  }

  const savedChallengeId = activityState.challengeId;
  activityState.challengeId = null;
  activityState.step = 1;

  showPage('challenge-detail');
  if (savedChallengeId && typeof challengeDetailState === 'object') {
    challengeDetailState.challengeId = savedChallengeId;
  }
  if (typeof renderChallengeDetail === 'function') renderChallengeDetail();
}

/* ============================================================ */
/* 11. CAPTURE INPUTS                                            */
/* ============================================================ */
function captureCurrentInputs() {
  const noteInput = document.getElementById('flowActivityNote');
  if (noteInput) activityState.data.activityNote = noteInput.value;

  const phInput = document.getElementById('flowPh');
  const tempInput = document.getElementById('flowTemp');
  const turbInput = document.getElementById('flowTurbidity');

  if (phInput) activityState.data.observationData.ph = phInput.value ? parseFloat(phInput.value) : null;
  if (tempInput) activityState.data.observationData.temperature = tempInput.value ? parseFloat(tempInput.value) : null;
  if (turbInput) activityState.data.observationData.turbidity = turbInput.value ? parseFloat(turbInput.value) : null;

  const speciesInput = document.getElementById('flowSpecies');
  if (speciesInput) activityState.data.wildlifeData.species = speciesInput.value;

  const behaviorInput = document.getElementById('flowBehavior');
  if (behaviorInput) activityState.data.wildlifeData.behavior = behaviorInput.value;

  const countInput = document.getElementById('flowCount');
  if (countInput) activityState.data.wildlifeData.count = countInput.value ? parseInt(countInput.value, 10) : null;

  const confInput = document.getElementById('flowConfidence');
  if (confInput) activityState.data.wildlifeData.confidence = confInput.value;
}

/* ============================================================ */
/* 12. PHOTO UPLOAD — ASYNC WITH COMPRESSION                     */
/* ============================================================ */
async function handleFlowPhotoUpload(e, field) {
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
    activityState.data[field] = compressed;
    renderContributionFlow();
    showToast('Photo added');
  } catch (err) {
    console.error('[ActivityFlow] Photo compress failed:', err);
    showToast('Could not process image');
  }
}

function removeFlowPhoto(field) {
  activityState.data[field] = null;
  renderContributionFlow();
}

/* ============================================================ */
/* 13. SUBMIT CONTRIBUTION                                       */
/* ============================================================ */
function handleFlowSubmit() {
  captureCurrentInputs();

  if (!validateFlowStep()) {
    showToast('Please complete the required fields');
    return;
  }

  const challenge = getChallengeById(activityState.challengeId);
  if (!challenge) {
    showToast('Challenge not found');
    return;
  }

  const d = activityState.data;
  const type = activityState.activityType;

  let contributionData = {
    challengeId: challenge.id,
    siteId: challenge.siteId,
    activityType: type,
    evidenceType: challenge.evidenceType,
    activityNote: d.activityNote || ''
  };

  if (type === 'cleanup' || type === 'restoration') {
    contributionData.beforePhoto = d.beforePhoto;
    contributionData.afterPhoto = d.afterPhoto;
    contributionData.activitySelections = d.activitySelections;
    contributionData.quantity = d.quantity;
  } else if (type === 'observation') {
    contributionData.photo = d.photo;
    contributionData.observationData = d.observationData;
  } else if (type === 'wildlife') {
    contributionData.photo = d.photo;
    contributionData.wildlifeData = d.wildlifeData;
  }

  const contribution = Contributions.create(contributionData);

  showContributionSuccess(contribution, challenge);
}

/* ============================================================ */
/* 14. SUCCESS SCREEN                                            */
/* ============================================================ */
function showContributionSuccess(contribution, challenge) {
  const modal = document.getElementById('quickViewModal');
  if (!modal) return;

  modal.querySelector('.modal-content').innerHTML = `
    <button type="button" class="close-modal" onclick="closeModal('quickViewModal')">
      <i class="fas fa-times"></i>
    </button>

    <div class="flow-success-wrap">
      <div class="flow-success-icon">
        <i class="fas fa-check-circle"></i>
      </div>

      <h2 class="flow-success-title">Contribution recorded</h2>
      <p class="flow-success-sub">
        Thank you for contributing to the <strong>${escapeHtml(challenge.title)}</strong>.
        Your evidence has been added to the community record.
      </p>

      <div class="flow-success-details">
        <div class="flow-success-row">
          <i class="fas fa-map-marker-alt"></i>
          <span>${escapeHtml(Contributions.formatLocation(contribution))}</span>
        </div>
        <div class="flow-success-row">
          <i class="fas fa-clock"></i>
          <span>${Contributions.formatDateTime(contribution)}</span>
        </div>
        <div class="flow-success-row">
          <i class="fas fa-hashtag"></i>
          <span>Contribution ID: ${contribution.id}</span>
        </div>
      </div>

      <div class="flow-success-impact">
        <i class="fas fa-chart-simple"></i>
        <p>Your contribution helps build a community record of conditions at this site.</p>
      </div>

      <button type="button" class="flow-success-btn"
              onclick="viewChallengeFromSuccess('${challenge.id}')">
        <i class="fas fa-arrow-right"></i> View Challenge
      </button>
    </div>
  `;

  openModal('quickViewModal');

  if (typeof confetti === 'function') {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#22D3EE', '#0891B2', '#10B981', '#FBBF24']
    });
  }
}

function viewChallengeFromSuccess(challengeId) {
  closeModal('quickViewModal');
  activityState.challengeId = null;
  activityState.step = 1;

  setTimeout(() => {
    challengeDetailState.challengeId = challengeId;
    showPage('challenge-detail');
    if (typeof renderChallengeDetail === 'function') renderChallengeDetail();
  }, 250);

  if (typeof refreshDrawer === 'function') refreshDrawer();
}

/* ============================================================ */
/* 15. EXPORTS                                                   */
/* ============================================================ */
window.openContributionFlow = openContributionFlow;
window.renderContributionFlow = renderContributionFlow;
window.handleFlowNext = handleFlowNext;
window.handleFlowPrev = handleFlowPrev;
window.handleFlowBack = handleFlowBack;
window.handleFlowClose = handleFlowClose;
window.handleFlowSubmit = handleFlowSubmit;
window.removeFlowPhoto = removeFlowPhoto;
window.viewChallengeFromSuccess = viewChallengeFromSuccess;
window.showContributionSuccess = showContributionSuccess;

console.log('[AquaQuest] Activity flow loaded');