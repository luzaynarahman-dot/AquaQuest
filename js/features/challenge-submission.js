/* ============================================================ */
/* AQUAQUEST — CHALLENGE SUBMISSION                              */
/* User can suggest challenges (not directly publish)            */
/* Verified organizers publish; users suggest                    */
/* Complete · Cancel feature · My Suggestions                    */
/* ============================================================ */

const ChallengeSubmission = {

  KEY: 'aq_suggested_challenges',

  /* ============================================================ */
  /* GET ALL SUGGESTIONS                                           */
  /* ============================================================ */
  getAll() {
    try {
      const raw = localStorage.getItem(this.KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.warn('[ChallengeSubmission] Read failed:', e);
      return [];
    }
  },

  /* ============================================================ */
  /* GET MY SUGGESTIONS                                            */
  /* ============================================================ */
  getMine() {
    const user = (typeof APP !== 'undefined' && APP.user) || null;
    if (!user) return [];

    return this.getAll()
      .filter(s => s.submitterId === user.id || s.submitterId === 'user_self')
      .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
  },

  /* ============================================================ */
  /* GET BY STATUS                                                 */
  /* ============================================================ */
  getByStatus(status) {
    if (!status) return this.getAll();
    return this.getAll().filter(s => s.status === status);
  },

  /* ============================================================ */
  /* GET BY ID                                                     */
  /* ============================================================ */
  getById(id) {
    if (!id) return null;
    return this.getAll().find(s => s.id === id) || null;
  },

  /* ============================================================ */
  /* SAVE                                                          */
  /* ============================================================ */
  save(list) {
    try {
      localStorage.setItem(this.KEY, JSON.stringify(list));
      return true;
    } catch (e) {
      console.warn('[ChallengeSubmission] Save failed:', e);
      return false;
    }
  },

  /* ============================================================ */
  /* CREATE SUGGESTION                                             */
  /* ============================================================ */
  create(data) {
    if (!data || !data.title || !data.description) {
      console.warn('[ChallengeSubmission] Missing required fields');
      return null;
    }

    if (typeof isLoggedIn === 'function' && !isLoggedIn()) {
      if (typeof showToast === 'function') {
        showToast('Sign in to suggest a challenge');
      }
      if (typeof openModal === 'function') {
        openModal('loginModal');
        if (typeof renderLoginModal === 'function') renderLoginModal();
      }
      return null;
    }

    const user = (typeof APP !== 'undefined' && APP.user) || { id: 'user_self', name: 'You' };

    const suggestion = {
      id: 'sug_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      title: String(data.title).trim(),
      description: String(data.description).trim(),
      type: data.type || 'cleanup',
      location: String(data.location || '').trim(),
      suggestedDate: data.suggestedDate || null,
      goal: data.goal || '',
      why: String(data.why || '').trim(),
      cover: data.cover || null,

      submitterId: user.id || 'user_self',
      submitterName: user.name || 'You',
      submitterAvatar: user.avatar || null,

      status: 'pending',
      submittedAt: new Date().toISOString(),

      adminNote: null,
      reviewedAt: null
    };

    const list = this.getAll();
    list.push(suggestion);
    this.save(list);

    if (typeof Gamification !== 'undefined' && Gamification.award) {
      Gamification.award(5, 'Challenge suggested');
    }

    if (typeof addNotification === 'function') {
      addNotification(
        'action',
        '💡 Challenge Suggested',
        `Your suggestion "${suggestion.title}" is pending review by our team.`
      );
    }

    console.log('[ChallengeSubmission] Created:', suggestion.id);
    return suggestion;
  },

  /* ============================================================ */
  /* CANCEL / DELETE                                               */
  /* ============================================================ */
  cancel(suggestionId) {
    if (!suggestionId) return false;

    const list = this.getAll();
    const suggestion = list.find(s => s.id === suggestionId);

    if (!suggestion) {
      console.warn('[ChallengeSubmission] Suggestion not found:', suggestionId);
      return false;
    }

    /* Only allow cancel if pending */
    if (suggestion.status !== 'pending') {
      if (typeof showToast === 'function') {
        showToast('Only pending suggestions can be cancelled');
      }
      return false;
    }

    /* Remove from list */
    const filtered = list.filter(s => s.id !== suggestionId);
    this.save(filtered);

    console.log('[ChallengeSubmission] Cancelled:', suggestionId);
    return true;
  },

  /* ============================================================ */
  /* COUNT                                                         */
  /* ============================================================ */
  count() {
    return this.getAll().length;
  },

  countPending() {
    return this.getAll().filter(s => s.status === 'pending').length;
  },

  countMine() {
    return this.getMine().length;
  },

  countMyPending() {
    return this.getMine().filter(s => s.status === 'pending').length;
  }
};

/* ============================================================ */
/* SUGGESTION FLOW — STATE                                       */
/* ============================================================ */
let suggestionState = {
  data: {
    title: '',
    description: '',
    type: null,
    location: '',
    suggestedDate: null,
    goal: '',
    why: '',
    cover: null
  }
};

/* ============================================================ */
/* OPEN FORM                                                     */
/* ============================================================ */
function openSuggestChallengeFlow() {
  if (typeof isLoggedIn === 'function' && !isLoggedIn()) {
    if (typeof showToast === 'function') {
      showToast('Sign in to suggest a challenge');
    }
    if (typeof openModal === 'function') {
      openModal('loginModal');
      if (typeof renderLoginModal === 'function') renderLoginModal();
    }
    return;
  }

  /* Reset state */
  suggestionState = {
    data: {
      title: '',
      description: '',
      type: null,
      location: '',
      suggestedDate: null,
      goal: '',
      why: '',
      cover: null
    }
  };

  /* Reset handler flag */
  const modal = document.getElementById('quickViewModal');
  if (modal) {
    const content = modal.querySelector('.modal-content');
    if (content) content.dataset.suggestHandlersAttached = 'false';
  }

  renderSuggestChallengeModal();
}

/* ============================================================ */
/* RENDER MODAL                                                  */
/* ============================================================ */
function renderSuggestChallengeModal() {
  const modal = document.getElementById('quickViewModal');
  if (!modal) {
    console.warn('[Suggest] quickViewModal not found');
    return;
  }

  const content = modal.querySelector('.modal-content');
  if (!content) {
    console.warn('[Suggest] modal-content not found');
    return;
  }

  const d = suggestionState.data;
  const hasPhoto = !!d.cover;

  const types = [
    { id: 'cleanup',     label: 'Cleanup',      icon: 'fa-broom' },
    { id: 'restoration', label: 'Restoration',  icon: 'fa-seedling' },
    { id: 'observation', label: 'Observation',  icon: 'fa-eye' },
    { id: 'wildlife',    label: 'Wildlife',     icon: 'fa-fish' },
    { id: 'awareness',   label: 'Awareness',    icon: 'fa-bullhorn' }
  ];

  content.innerHTML = `
    <button type="button" class="close-modal" onclick="closeModal('quickViewModal')">
      <i class="fas fa-times"></i>
    </button>

    <div class="suggest-header">
      <div class="suggest-icon">
        <i class="fas fa-lightbulb"></i>
      </div>
      <div>
        <h2 class="suggest-title">Suggest a Challenge</h2>
        <p class="suggest-sub">Community Actions · Reviewed by our team</p>
      </div>
    </div>

    <div class="suggest-info">
      <i class="fas fa-info-circle"></i>
      <p>Your suggestion will be reviewed by our team. Verified organizers can then publish it as a live challenge for everyone.</p>
    </div>

    <div class="suggest-body">

      <label class="add-site-label">Challenge Title *</label>
      <input type="text"
             id="suggestTitle"
             class="add-site-input"
             placeholder="e.g. Clean Up Cox's Bazar Beach"
             maxlength="80"
             value="${escapeHtml(d.title || '')}">

      <label class="add-site-label">What should participants do? *</label>
      <textarea id="suggestDescription"
                class="add-site-textarea"
                rows="3"
                maxlength="300"
                placeholder="Describe the challenge — actions, goals, duration...">${escapeHtml(d.description || '')}</textarea>

      <label class="add-site-label">Action Type *</label>
      <div class="suggest-type-grid">
        ${types.map(t => `
          <button type="button"
                  class="add-site-type-chip ${d.type === t.id ? 'active' : ''}"
                  data-suggest-type="${t.id}">
            <i class="fas ${t.icon}"></i>
            <span>${t.label}</span>
          </button>
        `).join('')}
      </div>

      <label class="add-site-label">Location</label>
      <input type="text"
             id="suggestLocation"
             class="add-site-input"
             placeholder="e.g. Cox's Bazar, Bangladesh"
             maxlength="80"
             value="${escapeHtml(d.location || '')}">

      <label class="add-site-label">Suggested Date</label>
      <input type="date"
             id="suggestDate"
             class="add-site-input"
             value="${d.suggestedDate || ''}">

      <label class="add-site-label">Goal</label>
      <input type="text"
             id="suggestGoal"
             class="add-site-input"
             placeholder="e.g. Collect 100 bags of litter"
             maxlength="100"
             value="${escapeHtml(d.goal || '')}">

      <label class="add-site-label">Why does this matter?</label>
      <textarea id="suggestWhy"
                class="add-site-textarea"
                rows="2"
                maxlength="200"
                placeholder="Why should this challenge happen?">${escapeHtml(d.why || '')}</textarea>

      <label class="add-site-label">Cover Image (optional)</label>
      <label class="add-site-photo-upload ${hasPhoto ? 'has-photo' : ''}" for="suggestPhotoInput">
        ${hasPhoto ? `
          <img src="${d.cover}" alt="Cover">
          <button type="button"
                  class="add-site-photo-remove"
                  onclick="event.preventDefault(); event.stopPropagation(); removeSuggestPhoto();">
            <i class="fas fa-times"></i>
          </button>
          <span class="add-site-photo-label">Cover</span>
        ` : `
          <i class="fas fa-image"></i>
          <p>Add cover image</p>
          <span>JPG, PNG · max 15MB</span>
        `}
      </label>
      <input type="file" id="suggestPhotoInput" accept="image/*" style="display:none;">

      <div class="suggest-actions">
        <button type="button" class="observe-btn observe-btn-ghost" onclick="closeModal('quickViewModal')">
          Cancel
        </button>
        <button type="button" class="observe-btn observe-btn-primary" onclick="submitSuggestion()">
          <i class="fas fa-paper-plane"></i> Submit for Review
        </button>
      </div>
    </div>
  `;

  /* Reset handler flag */
  content.dataset.suggestHandlersAttached = 'false';

  attachSuggestHandlers();
  attachSuggestPhotoInput();

  if (typeof openModal === 'function') {
    openModal('quickViewModal');
  } else {
    modal.classList.add('active');
  }
}

/* ============================================================ */
/* HANDLERS                                                      */
/* ============================================================ */
function attachSuggestHandlers() {
  const modal = document.getElementById('quickViewModal');
  if (!modal) return;

  const content = modal.querySelector('.modal-content');
  if (!content) return;

  if (content.dataset.suggestHandlersAttached === 'true') return;
  content.dataset.suggestHandlersAttached = 'true';

  content.addEventListener('click', (e) => {
    const typeBtn = e.target.closest('[data-suggest-type]');
    if (typeBtn) {
      e.preventDefault();
      e.stopPropagation();
      captureSuggestInputs();
      suggestionState.data.type = typeBtn.dataset.suggestType;
      renderSuggestChallengeModal();
    }
  });
}

function attachSuggestPhotoInput() {
  const photoInput = document.getElementById('suggestPhotoInput');
  if (!photoInput) return;

  if (photoInput.dataset.listenerAttached === 'true') return;
  photoInput.dataset.listenerAttached = 'true';

  photoInput.addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      if (typeof showToast === 'function') showToast('Please select an image file');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      if (typeof showToast === 'function') showToast('Image too large (max 15MB)');
      return;
    }

    try {
      if (typeof showToast === 'function') showToast('Processing image...');
      captureSuggestInputs();

      if (typeof compressImage !== 'function') {
        throw new Error('compressImage not loaded');
      }

      const compressed = await compressImage(file, 1200, 0.75);
      suggestionState.data.cover = compressed;
      renderSuggestChallengeModal();
      if (typeof showToast === 'function') showToast('Cover added');
    } catch (err) {
      console.error('[Suggest] Photo compress failed:', err);
      if (typeof showToast === 'function') showToast('Could not process image');
    }
  });
}

/* ============================================================ */
/* CAPTURE INPUTS                                                */
/* ============================================================ */
function captureSuggestInputs() {
  const t = document.getElementById('suggestTitle');
  const d = document.getElementById('suggestDescription');
  const l = document.getElementById('suggestLocation');
  const dt = document.getElementById('suggestDate');
  const g = document.getElementById('suggestGoal');
  const w = document.getElementById('suggestWhy');

  if (t) suggestionState.data.title = t.value.trim();
  if (d) suggestionState.data.description = d.value.trim();
  if (l) suggestionState.data.location = l.value.trim();
  if (dt) suggestionState.data.suggestedDate = dt.value || null;
  if (g) suggestionState.data.goal = g.value.trim();
  if (w) suggestionState.data.why = w.value.trim();
}

function removeSuggestPhoto() {
  captureSuggestInputs();
  suggestionState.data.cover = null;
  renderSuggestChallengeModal();
}

/* ============================================================ */
/* SUBMIT                                                        */
/* ============================================================ */
function submitSuggestion() {
  captureSuggestInputs();

  const d = suggestionState.data;

  if (!d.title || d.title.length < 5) {
    if (typeof showToast === 'function') showToast('Please enter a title (min 5 characters)');
    return;
  }

  if (!d.description || d.description.length < 20) {
    if (typeof showToast === 'function') showToast('Please describe in at least 20 characters');
    return;
  }

  if (!d.type) {
    if (typeof showToast === 'function') showToast('Please select an action type');
    return;
  }

  const suggestion = ChallengeSubmission.create({
    title: d.title,
    description: d.description,
    type: d.type,
    location: d.location,
    suggestedDate: d.suggestedDate,
    goal: d.goal,
    why: d.why,
    cover: d.cover
  });

  if (!suggestion) {
    if (typeof showToast === 'function') showToast('Could not submit suggestion');
    return;
  }

  if (typeof closeModal === 'function') {
    closeModal('quickViewModal');
  }

  if (typeof showToast === 'function') {
    showToast('💡 Suggestion submitted for review');
  }

  if (typeof confetti === 'function') {
    confetti({
      particleCount: 60,
      spread: 50,
      origin: { y: 0.6 },
      colors: ['#F59E0B', '#FBBF24', '#22D3EE']
    });
  }

  /* Refresh actions page */
  setTimeout(() => {
    if (typeof APP !== 'undefined' && APP.currentPage === 'actions' &&
        typeof renderActions === 'function') {
      renderActions();
    }
  }, 300);

  if (typeof refreshDrawer === 'function') refreshDrawer();
}

/* ============================================================ */
/* MY SUGGESTIONS — RENDER HELPERS                               */
/* ============================================================ */
function renderMySuggestions() {
  if (typeof ChallengeSubmission === 'undefined') return '';

  const mine = ChallengeSubmission.getMine();
  if (!mine.length) return '';

  return `
    <div class="my-suggestions-section">
      <div class="my-suggestions-header">
        <h3 class="my-suggestions-title">
          <i class="fas fa-lightbulb"></i> My Suggestions
        </h3>
        <span class="my-suggestions-count">${mine.length}</span>
      </div>

      <div class="my-suggestions-list">
        ${mine.map(s => renderSuggestionCard(s)).join('')}
      </div>
    </div>
  `;
}

function renderSuggestionCard(suggestion) {
  if (!suggestion) return '';

  const statusInfo = {
    pending:  { label: 'Pending Review', color: '#F59E0B', icon: 'fa-clock',        bg: 'rgba(245, 158, 11, 0.12)' },
    approved: { label: 'Approved',       color: '#10B981', icon: 'fa-check-circle', bg: 'rgba(16, 185, 129, 0.12)' },
    rejected: { label: 'Not Approved',   color: '#EF4444', icon: 'fa-times-circle', bg: 'rgba(239, 68, 68, 0.12)' }
  }[suggestion.status] || { label: 'Pending', color: '#F59E0B', icon: 'fa-clock', bg: 'rgba(245, 158, 11, 0.12)' };

  const typeIcon = {
    cleanup: 'fa-broom',
    restoration: 'fa-seedling',
    observation: 'fa-eye',
    wildlife: 'fa-fish',
    awareness: 'fa-bullhorn'
  }[suggestion.type] || 'fa-clipboard';

  const canCancel = suggestion.status === 'pending';

  const desc = suggestion.description || '';
  const shortDesc = desc.length > 120 ? desc.substring(0, 120) + '…' : desc;

  return `
    <div class="suggestion-card" data-suggestion-id="${suggestion.id}">
      <div class="suggestion-card-header">
        <div class="suggestion-type-icon">
          <i class="fas ${typeIcon}"></i>
        </div>
        <div class="suggestion-card-title-wrap">
          <p class="suggestion-card-title">${escapeHtml(suggestion.title || 'Untitled')}</p>
          <p class="suggestion-card-time">
            <i class="far fa-clock"></i> ${timeAgo(suggestion.submittedAt)}
          </p>
        </div>
        <span class="suggestion-status-badge"
              style="background:${statusInfo.bg}; color:${statusInfo.color};">
          <i class="fas ${statusInfo.icon}"></i> ${statusInfo.label}
        </span>
      </div>

      <p class="suggestion-card-desc">${escapeHtml(shortDesc)}</p>

      ${suggestion.location ? `
        <p class="suggestion-card-meta">
          <i class="fas fa-map-marker-alt"></i> ${escapeHtml(suggestion.location)}
        </p>
      ` : ''}

      ${suggestion.status === 'rejected' && suggestion.adminNote ? `
        <div class="suggestion-reject-note">
          <i class="fas fa-info-circle"></i>
          <span>${escapeHtml(suggestion.adminNote)}</span>
        </div>
      ` : ''}

      ${canCancel ? `
        <div class="suggestion-card-actions">
          <button type="button"
                  class="suggestion-cancel-btn"
                  onclick="confirmCancelSuggestion('${suggestion.id}')">
            <i class="fas fa-trash"></i> Cancel Suggestion
          </button>
        </div>
      ` : ''}
    </div>
  `;
}

/* ============================================================ */
/* CANCEL CONFIRMATION                                           */
/* ============================================================ */
function confirmCancelSuggestion(suggestionId) {
  if (!suggestionId) return;

  const suggestion = ChallengeSubmission.getById(suggestionId);
  if (!suggestion) {
    if (typeof showToast === 'function') showToast('Suggestion not found');
    return;
  }

  const msg = `Cancel your suggestion "${suggestion.title}"?\n\nThis cannot be undone.`;

  if (!confirm(msg)) return;

  const cancelled = ChallengeSubmission.cancel(suggestionId);

  if (!cancelled) {
    if (typeof showToast === 'function') showToast('Could not cancel suggestion');
    return;
  }

  if (typeof showToast === 'function') showToast('Suggestion cancelled');

  /* Refresh actions page */
  if (typeof APP !== 'undefined' && APP.currentPage === 'actions' &&
      typeof renderActions === 'function') {
    renderActions();
  }

  if (typeof refreshDrawer === 'function') refreshDrawer();
}

/* ============================================================ */
/* EXPORTS                                                       */
/* ============================================================ */
window.ChallengeSubmission = ChallengeSubmission;
window.openSuggestChallengeFlow = openSuggestChallengeFlow;
window.renderSuggestChallengeModal = renderSuggestChallengeModal;
window.submitSuggestion = submitSuggestion;
window.removeSuggestPhoto = removeSuggestPhoto;
window.renderMySuggestions = renderMySuggestions;
window.renderSuggestionCard = renderSuggestionCard;
window.confirmCancelSuggestion = confirmCancelSuggestion;

console.log('[AquaQuest] Challenge submission loaded');