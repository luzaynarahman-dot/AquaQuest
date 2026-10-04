/* ============================================================ */
/* AQUAQUEST — COMMUNITY ACTIONS PAGE                            */
/* Complete · Join flow with proof upload                        */
/* ============================================================ */

let actionsState = {
  activeFilter: 'all',
  joinState: {
    actionId: null,
    step: 1,
    proof: null,
    note: ''
  }
};

/* ============================================================ */
/* 1. MAIN RENDER                                                */
/* ============================================================ */
function renderActions() {
  const page = document.getElementById('page-actions');
  if (!page) return;

  page.innerHTML = `
    <div class="page-container">

      ${renderBackHeader('Community Actions', 'Join cleanups, restoration & monitoring drives')}

      ${renderSuggestChallengeCard()}

      ${typeof renderMySuggestions === 'function' ? renderMySuggestions() : ''}

      <div class="site-filter-chips" id="actionsFilterChips">
        ${renderActionFilters()}
      </div>

      <div class="actions-list-full">
        ${renderActionsList()}
      </div>

    </div>
  `;

  attachActionsHandlers();
}

/* ============================================================ */
/* SUGGEST CHALLENGE CARD — top of page                          */
/* ============================================================ */
function renderSuggestChallengeCard() {
  return `
    <button type="button"
            class="suggest-challenge-card"
            onclick="openSuggestChallengeFlow()">
      <div class="suggest-challenge-icon">
        <i class="fas fa-lightbulb"></i>
      </div>
      <div class="suggest-challenge-info">
        <p class="suggest-challenge-title">Have an idea for a challenge?</p>
        <p class="suggest-challenge-sub">Suggest it — our team reviews and publishes</p>
      </div>
      <i class="fas fa-chevron-right suggest-challenge-arrow"></i>
    </button>
  `;
}

function renderActionFilters() {
  const types = [
    { id: 'all',           label: 'All',            icon: 'fa-border-all' },
    { id: 'cleanup',       label: 'Cleanups',       icon: 'fa-broom' },
    { id: 'restoration',   label: 'Restoration',    icon: 'fa-seedling' },
    { id: 'observation-week', label: 'Challenges',  icon: 'fa-eye' },
    { id: 'biodiversity-watch', label: 'Biodiversity', icon: 'fa-fish' }
  ];

  return types.map(t => {
    const count = t.id === 'all'
      ? CHALLENGES.length
      : CHALLENGES.filter(c => c.type === t.id).length;

    return `
      <button class="site-filter-chip ${actionsState.activeFilter === t.id ? 'active' : ''}"
              data-action-filter="${t.id}">
        <i class="fas ${t.icon}"></i> ${t.label} (${count})
      </button>
    `;
  }).join('');
}

function renderActionsList() {
  let actions = CHALLENGES;

  if (actionsState.activeFilter !== 'all') {
    actions = actions.filter(a => a.type === actionsState.activeFilter);
  }

  if (!actions.length) {
    return `
      <div class="empty-state" style="background:var(--pc-card); border-radius:16px; padding:40px 20px;">
        <i class="fas fa-seedling"></i>
        <p style="font-size:14px; font-weight:700; color:var(--pc-text);">No actions in this category</p>
      </div>
    `;
  }

  return actions.map(a => renderActionListCard(a)).join('');
}

function renderActionListCard(action) {
  const joined = (APP.joinedActions || []).includes(action.id);
  const completed = (APP.completedActions || []).includes(action.id);
  const site = action.siteId ? getSiteById(action.siteId) : null;

  const fillPercent = Math.round((action.joined / action.maxParticipants) * 100);

  return `
    <button class="action-list-card" onclick="openActionDetail('${action.id}')">
      <div class="action-list-cover">
        <img src="${action.cover}" alt="" onerror="this.style.opacity='0'">
        <span class="action-card-badge" style="background:${action.color}DD;">
          <i class="fas ${action.icon}"></i> ${capitalize(action.type.replace('-', ' '))}
        </span>
        <span class="action-card-points">
          <i class="fas fa-star"></i> ${action.points}
        </span>
        ${completed ? `
          <span class="action-joined-badge" style="background:rgba(16, 185, 129, 0.95);">
            <i class="fas fa-check-double"></i> Completed
          </span>
        ` : joined ? `
          <span class="action-joined-badge">
            <i class="fas fa-check-circle"></i> Joined
          </span>
        ` : ''}
      </div>

      <div class="action-list-body">
        <p class="action-list-title">${escapeHtml(action.title)}</p>
        <p class="action-list-desc">${escapeHtml(action.description.substring(0, 130))}${action.description.length > 130 ? '…' : ''}</p>

        <div class="action-list-meta">
          ${site ? `
            <span class="action-list-meta-item">
              <i class="fas fa-map-marker-alt"></i> ${escapeHtml(site.name)}
            </span>
          ` : `
            <span class="action-list-meta-item">
              <i class="fas fa-globe"></i> Any waterbody
            </span>
          `}
        </div>

        <div class="action-list-progress">
          <div class="action-list-progress-header">
            <span><i class="fas fa-users"></i> ${action.joined}/${action.maxParticipants} joined</span>
            <span>${fillPercent}%</span>
          </div>
          <div class="action-list-progress-bar">
            <div class="action-list-progress-fill" style="width:${fillPercent}%; background:${action.color};"></div>
          </div>
        </div>
      </div>
    </button>
  `;
}

/* ============================================================ */
/* 2. DETAIL MODAL                                               */
/* ============================================================ */
function openActionDetail(actionId) {
  const action = CHALLENGES.find(c => c.id === actionId);
  if (!action) return;

  /* ⭐ NEW — Navigate to full page instead of modal */
  if (typeof openChallengeDetail === 'function') {
    openChallengeDetail(actionId);
    return;
  }

  /* Fallback — should not happen */
  showToast('Challenge page unavailable');
}

/* ============================================================ */
/* 3. JOIN FLOW — 2 steps: confirm + commit                       */
/* ============================================================ */
function openJoinFlow(actionId) {
  if (!isLoggedIn()) {
    showToast('Sign in to join actions');
    openModal('loginModal');
    if (typeof renderLoginModal === 'function') renderLoginModal();
    return;
  }

  const action = CHALLENGES.find(c => c.id === actionId);
  if (!action) return;

  actionsState.joinState = {
    actionId: actionId,
    step: 1,
    proof: null,
    note: ''
  };

  renderJoinFlow();
}

function renderJoinFlow() {
  const modal = document.getElementById('quickViewModal');
  if (!modal) return;

  const action = CHALLENGES.find(c => c.id === actionsState.joinState.actionId);
  if (!action) return;

  const step = actionsState.joinState.step;

  modal.querySelector('.modal-content').innerHTML = `
    <button type="button" class="close-modal" onclick="closeModal('quickViewModal')">
      <i class="fas fa-times"></i>
    </button>

    <div class="join-flow-header" style="background:linear-gradient(135deg, ${action.color}, ${action.color}CC);">
      <div class="join-flow-icon">
        <i class="fas ${action.icon}"></i>
      </div>
      <div>
        <p class="join-flow-step">Step ${step} of 2</p>
        <h3 class="join-flow-title">${step === 1 ? 'Confirm Join' : 'Submit Proof'}</h3>
      </div>
    </div>

    <div class="join-flow-progress">
      <div class="join-flow-progress-fill" style="width:${(step / 2) * 100}%; background:${action.color};"></div>
    </div>

    ${step === 1 ? renderJoinStep1(action) : renderJoinStep2(action)}
  `;

  attachJoinFlowHandlers();
}

/* ---------- STEP 1: Confirm join ---------- */
function renderJoinStep1(action) {
  return `
    <div class="join-flow-body">
      <h4 class="join-flow-question">Ready to join "${escapeHtml(action.title)}"?</h4>

      <div class="join-flow-info">
        <div class="join-flow-info-row">
          <i class="fas fa-map-marker-alt"></i>
          <span>${escapeHtml(action.location)}</span>
        </div>
        <div class="join-flow-info-row">
          <i class="fas fa-calendar"></i>
          <span>${formatDate(action.startDate)}</span>
        </div>
        <div class="join-flow-info-row">
          <i class="far fa-clock"></i>
          <span>${escapeHtml(action.duration)}</span>
        </div>
        <div class="join-flow-info-row">
          <i class="fas fa-users"></i>
          <span>${action.joined}/${action.maxParticipants} people joined</span>
        </div>
      </div>

      <div class="join-flow-commitment">
        <i class="fas fa-info-circle"></i>
        <p>When you join, you commit to participating. After the event, you'll submit <strong>proof of participation</strong> (photo + note) to earn <strong>${action.points} points</strong>.</p>
      </div>

      <div class="join-flow-actions">
        <button type="button" class="observe-btn observe-btn-ghost" onclick="closeModal('quickViewModal')">
          Cancel
        </button>
        <button type="button" class="observe-btn observe-btn-primary" style="background:${action.color};" onclick="confirmJoinAction('${action.id}')">
          <i class="fas fa-check"></i> Confirm & Join
        </button>
      </div>
    </div>
  `;
}

function confirmJoinAction(actionId) {
  const action = CHALLENGES.find(c => c.id === actionId);
  if (!action) return;

  APP.joinedActions = APP.joinedActions || [];
  if (APP.joinedActions.includes(actionId)) {
    showToast('Already joined');
    return;
  }

  APP.joinedActions.push(actionId);
  Storage.set(APP.KEYS.JOINED_ACTIONS, APP.joinedActions);

  action.joined = Math.min(action.maxParticipants, action.joined + 1);

  if (typeof addNotification === 'function') {
    addNotification('action', '🌱 Joined Action', `You joined "${action.title}". Submit proof after to earn ${action.points} points.`);
  }

  showToast('Joined! Submit proof to earn points.');

  if (typeof confetti === 'function') {
    confetti({
      particleCount: 60,
      spread: 50,
      origin: { y: 0.6 },
      colors: [action.color, '#22D3EE', '#10B981']
    });
  }

  closeModal('quickViewModal');

  setTimeout(() => {
    if (APP.currentPage === 'actions') renderActions();
    if (APP.currentPage === 'home') renderHome();
    openActionDetail(actionId);
  }, 300);

  if (typeof refreshDrawer === 'function') refreshDrawer();
}

/* ---------- STEP 2: Proof upload ---------- */
function openProofUpload(actionId) {
  actionsState.joinState.actionId = actionId;
  actionsState.joinState.step = 2;
  actionsState.joinState.proof = null;
  actionsState.joinState.note = '';
  renderJoinFlow();
}

function renderJoinStep2(action) {
  const proof = actionsState.joinState.proof;
  const note = actionsState.joinState.note;

  return `
    <div class="join-flow-body">
      <h4 class="join-flow-question">Submit proof of participation</h4>
      <p class="join-flow-hint">Add a photo and short note — this earns your points.</p>

      <label class="join-flow-photo-upload ${proof ? 'has-photo' : ''}" for="proofPhotoInput">
        ${proof
          ? `<img src="${proof}" alt="Proof">
             <button type="button" class="join-flow-photo-remove" onclick="event.preventDefault(); event.stopPropagation(); removeProofPhoto();">
               <i class="fas fa-times"></i>
             </button>`
          : `<i class="fas fa-camera"></i>
             <p>Tap to add proof photo</p>
             <span>Selfie, cleanup site, before/after — anything works</span>`
        }
      </label>
      <input type="file" id="proofPhotoInput" accept="image/*" style="display:none;">

      <label class="join-flow-label">Short note (optional)</label>
      <textarea id="proofNote" rows="3" maxlength="200" placeholder="e.g. Collected 3 bags of plastic near the old bridge...">${escapeHtml(note)}</textarea>

      <div class="join-flow-actions">
        <button type="button" class="observe-btn observe-btn-ghost" onclick="closeModal('quickViewModal')">
          Later
        </button>
        <button type="button" class="observe-btn observe-btn-primary" style="background:${action.color}; ${!proof ? 'opacity:0.5; cursor:not-allowed;' : ''}"
                ${!proof ? 'disabled' : ''}
                onclick="submitActionProof('${action.id}')">
          <i class="fas fa-check"></i> Claim ${action.points} Points
        </button>
      </div>

      <p class="join-flow-note">
        <i class="fas fa-lightbulb"></i>
        You can also submit proof later from the action detail page.
      </p>
    </div>
  `;
}

function attachJoinFlowHandlers() {
  const modal = document.getElementById('quickViewModal');
  if (!modal) return;

  const content = modal.querySelector('.modal-content');
  if (!content) return;

  if (content.dataset.joinHandlersAttached === 'true') return;
  content.dataset.joinHandlersAttached = 'true';

  content.addEventListener('click', (e) => {
    const removeBtn = e.target.closest('.join-flow-photo-remove');
    if (removeBtn) {
      e.preventDefault();
      e.stopPropagation();
      removeProofPhoto();
    }
  });

  const photoInput = document.getElementById('proofPhotoInput');
  if (photoInput) {
    photoInput.addEventListener('change', (e) => {
      const file = e.target.files?.[0];
      if (!file) return;
      if (file.size > 3 * 1024 * 1024) {
        showToast('Image too large (max 3MB)');
        return;
      }
      const reader = new FileReader();
      reader.onload = (ev) => {
        actionsState.joinState.proof = ev.target.result;
        renderJoinFlow();
      };
      reader.readAsDataURL(file);
    });
  }

  const noteInput = document.getElementById('proofNote');
  if (noteInput) {
    noteInput.addEventListener('input', () => {
      actionsState.joinState.note = noteInput.value;
    });
  }
}

function removeProofPhoto() {
  actionsState.joinState.proof = null;
  renderJoinFlow();
}

function submitActionProof(actionId) {
  const action = CHALLENGES.find(c => c.id === actionId);
  if (!action) return;

  const state = actionsState.joinState;
  if (!state.proof) {
    showToast('Please add a proof photo');
    return;
  }

  /* Mark completed */
  APP.completedActions = APP.completedActions || [];
  if (!APP.completedActions.includes(actionId)) {
    APP.completedActions.push(actionId);
    Storage.set('aq_completedActions', APP.completedActions);
  }

  /* Award points now */
  if (typeof Gamification !== 'undefined' && Gamification.awardForAction) {
    Gamification.awardForAction(action);
  }

  if (typeof addNotification === 'function') {
    addNotification('action', '🏆 Proof Submitted', `Your proof for "${action.title}" was submitted. +${action.points} points!`);
  }

  closeModal('quickViewModal');
  showToast(`+${action.points} points earned! 🎉`);

  if (typeof confetti === 'function') {
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: [action.color, '#22D3EE', '#10B981', '#FBBF24']
    });
  }

  setTimeout(() => {
    if (APP.currentPage === 'actions') renderActions();
    if (APP.currentPage === 'home') renderHome();
    if (APP.currentPage === 'profile') renderProfile();
  }, 300);

  if (typeof refreshDrawer === 'function') refreshDrawer();
}

/* ============================================================ */
/* 4. LEAVE ACTION                                               */
/* ============================================================ */
function leaveAction(actionId) {
  if (!confirm('Leave this action?')) return;

  APP.joinedActions = (APP.joinedActions || []).filter(id => id !== actionId);
  Storage.set(APP.KEYS.JOINED_ACTIONS, APP.joinedActions);

  const action = CHALLENGES.find(c => c.id === actionId);
  if (action) {
    action.joined = Math.max(0, action.joined - 1);
  }

  showToast('Left action');
  closeModal('quickViewModal');

  setTimeout(() => {
    if (APP.currentPage === 'actions') renderActions();
    if (APP.currentPage === 'home') renderHome();
  }, 250);

  if (typeof refreshDrawer === 'function') refreshDrawer();
}

/* ============================================================ */
/* 5. SHARE                                                      */
/* ============================================================ */
function shareAction(actionId) {
  const action = CHALLENGES.find(c => c.id === actionId);
  if (!action) return;

  const data = {
    title: action.title,
    text: `Join me at "${action.title}" on AquaQuest! ${action.description.substring(0, 80)}...`,
    url: window.location.origin
  };

  if (navigator.share) {
    navigator.share(data).then(() => showToast('Shared!')).catch(() => {});
  } else {
    navigator.clipboard.writeText(`${data.title}\n${data.text}\n${data.url}`)
      .then(() => showToast('Copied to clipboard'))
      .catch(() => {});
  }
}

/* ============================================================ */
/* 6. HANDLERS                                                   */
/* ============================================================ */
function attachActionsHandlers() {
  document.querySelectorAll('[data-action-filter]').forEach(chip => {
    chip.addEventListener('click', () => {
      actionsState.activeFilter = chip.dataset.actionFilter;

      document.querySelectorAll('[data-action-filter]').forEach(c => {
        c.classList.toggle('active', c.dataset.actionFilter === actionsState.activeFilter);
      });

      const list = document.querySelector('.actions-list-full');
      if (list) list.innerHTML = renderActionsList();
    });
  });
}

/* ============================================================ */
/* 7. EXPORTS                                                    */
/* ============================================================ */
/* ============================================================ */
/* BACKWARD COMPAT — old function names                          */
/* ============================================================ */
window.openActionDetail = openActionDetail;
window.renderActions = renderActions;
window.openActionDetail = openActionDetail;
window.openJoinFlow = openJoinFlow;
window.confirmJoinAction = confirmJoinAction;
window.openProofUpload = openProofUpload;
window.submitActionProof = submitActionProof;
window.removeProofPhoto = removeProofPhoto;
window.leaveAction = leaveAction;
window.shareAction = shareAction;
window.renderSuggestChallengeCard = renderSuggestChallengeCard;

console.log('[AquaQuest] Actions page loaded');