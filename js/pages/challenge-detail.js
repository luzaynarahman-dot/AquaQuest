/* ============================================================ */
/* AQUAQUEST — CHALLENGE DETAIL PAGE                             */
/* Full page view for challenges                                 */
/* Overview · Evidence · Community · Progress · Join CTA         */
/* ============================================================ */

let challengeDetailState = {
  challengeId: null
};

/* ============================================================ */
/* 1. OPEN                                                       */
/* ============================================================ */
function openChallengeDetail(challengeId) {
  const challenge = getChallengeById(challengeId);
  if (!challenge) {
    showToast('Challenge not found');
    return;
  }

  challengeDetailState.challengeId = challengeId;
  showPage('challenge-detail');
  renderChallengeDetail();
}

function closeChallengeDetail() {
  const current = challengeDetailState.challengeId;
  challengeDetailState.challengeId = null;
  showPage('actions');
}

/* ============================================================ */
/* 2. MAIN RENDER                                                */
/* ============================================================ */
function renderChallengeDetail() {
  const page = document.getElementById('page-challenge-detail');
  if (!page) return;

  const challengeId = challengeDetailState.challengeId;
  const challenge = getChallengeById(challengeId);
  if (!challenge) {
    page.innerHTML = `<div class="page-container"><p>Challenge not found</p></div>`;
    return;
  }

  const site = challenge.siteId ? getSiteById(challenge.siteId) : null;
  const joined = (APP.joinedActions || []).includes(challenge.id);
  const userContributed = Contributions.hasUserContributed(challenge.id, 'user_self');
  const progress = Contributions.getProgress(challenge.id);
  const contributions = Contributions.getByChallenge(challenge.id);
  const previewContributions = contributions.slice(0, 3);

  const activityColor = getActivityTypeColor(challenge.activityType);
  const activityLabel = getActivityTypeLabel(challenge.activityType);
  const activityIcon = getActivityTypeIcon(challenge.activityType);

  page.innerHTML = `
    <div class="page-container challenge-detail-page">

      <!-- ============================================ -->
      <!-- HERO COVER                                    -->
      <!-- ============================================ -->
      <div class="challenge-detail-cover-wrap">
        <div class="challenge-detail-cover">
          <img src="${challenge.cover}" alt="" onerror="this.style.opacity='0'">
          <div class="challenge-detail-cover-overlay"></div>

          <button type="button" class="challenge-detail-back" onclick="closeChallengeDetail()" aria-label="Back">
            <i class="fas fa-arrow-left"></i>
          </button>
          <button type="button" class="challenge-detail-share" onclick="shareChallenge('${challenge.id}')" aria-label="Share">
            <i class="fas fa-share-alt"></i>
          </button>

          <div class="challenge-detail-cover-title">
            <span class="challenge-type-badge" style="background:${activityColor}DD;">
              <i class="fas ${activityIcon}"></i> ${activityLabel}
            </span>
            <h1 class="challenge-detail-title">${escapeHtml(challenge.title)}</h1>
            <p class="challenge-detail-loc">
              <i class="fas fa-map-marker-alt"></i> ${escapeHtml(challenge.location)}
            </p>
          </div>
        </div>
      </div>

      <!-- ============================================ -->
      <!-- STATS BAR                                     -->
      <!-- ============================================ -->
      <div class="challenge-stats-bar">
        <div class="challenge-stat">
          <p class="challenge-stat-value">${challenge.joined || 0}</p>
          <p class="challenge-stat-label">Participants</p>
        </div>
        <div class="challenge-stat">
          <p class="challenge-stat-value">${progress.current}</p>
          <p class="challenge-stat-label">Contributions</p>
        </div>
        <div class="challenge-stat">
          <p class="challenge-stat-value">${challenge.estimatedTime || '20 min'}</p>
          <p class="challenge-stat-label">Time</p>
        </div>
        <div class="challenge-stat">
          <p class="challenge-stat-value">${challenge.points || 30}</p>
          <p class="challenge-stat-label">Points</p>
        </div>
      </div>

      <!-- ============================================ -->
      <!-- DESCRIPTION                                   -->
      <!-- ============================================ -->
      <section class="challenge-section-card">
        <h3 class="challenge-section-title">
          <i class="fas fa-info-circle"></i> About this challenge
        </h3>
        <p class="challenge-description">${escapeHtml(challenge.description)}</p>
        <div class="challenge-host-row">
          <i class="fas fa-users"></i>
          <span>Hosted by <strong>${escapeHtml(challenge.host)}</strong></span>
        </div>
      </section>

      <!-- ============================================ -->
      <!-- WHAT YOU'LL DO                                -->
      <!-- ============================================ -->
      <section class="challenge-section-card">
        <h3 class="challenge-section-title">
          <i class="fas fa-list-check"></i> What you'll do
        </h3>
        <ol class="challenge-steps-list">
          <li>
            <div class="challenge-step-num">1</div>
            <div class="challenge-step-text">Visit the selected water site</div>
          </li>
          <li>
            <div class="challenge-step-num">2</div>
            <div class="challenge-step-text">Document conditions before starting</div>
          </li>
          <li>
            <div class="challenge-step-num">3</div>
            <div class="challenge-step-text">Complete the activity (cleanup, observation, etc.)</div>
          </li>
          <li>
            <div class="challenge-step-num">4</div>
            <div class="challenge-step-text">Submit your evidence via photo + notes</div>
          </li>
          <li>
            <div class="challenge-step-num">5</div>
            <div class="challenge-step-text">Your contribution joins the community record</div>
          </li>
        </ol>
      </section>

      <!-- ============================================ -->
      <!-- EVIDENCE REQUIRED                             -->
      <!-- ============================================ -->
      <section class="challenge-section-card">
        <h3 class="challenge-section-title">
          <i class="fas fa-clipboard-check"></i> Evidence required
        </h3>
        <div class="challenge-evidence-list">
          ${(challenge.evidenceRequired || []).map(e => `
            <div class="challenge-evidence-item">
              <div class="challenge-evidence-icon">
                <i class="fas ${e.icon}"></i>
              </div>
              <div class="challenge-evidence-info">
                <p class="challenge-evidence-label">${escapeHtml(e.label)}</p>
                <p class="challenge-evidence-hint">${escapeHtml(e.hint)}</p>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="challenge-auto-meta">
          <span><i class="fas fa-map-marker-alt"></i> Location auto-attached</span>
          <span><i class="fas fa-clock"></i> Time auto-attached</span>
        </div>
      </section>

      <!-- ============================================ -->
      <!-- COMMUNITY PROGRESS                            -->
      <!-- ============================================ -->
      <section class="challenge-section-card">
        <h3 class="challenge-section-title">
          <i class="fas fa-chart-simple"></i> Community progress
        </h3>

        <div class="challenge-progress-block">
          <div class="challenge-progress-header">
            <span class="challenge-progress-count">
              <strong>${progress.current}</strong> / ${progress.target} contributions
            </span>
            <span class="challenge-progress-percent">${progress.percent}%</span>
          </div>
          <div class="challenge-progress-bar">
            <div class="challenge-progress-fill"
                 style="width: ${progress.percent}%; background: ${activityColor};"></div>
          </div>
        </div>

        <p class="challenge-participants-note">
          <i class="fas fa-users"></i>
          ${challenge.joined || 0} people have joined this challenge
        </p>
      </section>

      <!-- ============================================ -->
      <!-- COMMUNITY EVIDENCE PREVIEW                    -->
      <!-- ============================================ -->
      ${previewContributions.length ? `
        <section class="challenge-section-card">
          <div class="challenge-section-header-row">
            <h3 class="challenge-section-title">
              <i class="fas fa-images"></i> Recent community evidence
            </h3>
            <button type="button" class="challenge-see-all-btn"
                    onclick="openChallengeEvidence('${challenge.id}')">
              See all (${contributions.length}) <i class="fas fa-arrow-right"></i>
            </button>
          </div>

          <div class="challenge-evidence-preview">
            ${previewContributions.map(c => renderContributionPreviewCard(c)).join('')}
          </div>
        </section>
      ` : ''}

      <!-- ============================================ -->
      <!-- USER CONTRIBUTION (if submitted)              -->
      <!-- ============================================ -->
      ${userContributed ? `
        <section class="challenge-section-card challenge-user-contribution">
          <h3 class="challenge-section-title">
            <i class="fas fa-check-circle" style="color:var(--pc-success);"></i> Your contribution
          </h3>
          <div class="challenge-user-contribution-content">
            <p class="challenge-user-contrib-status">
              <i class="fas fa-check-circle"></i>
              Submitted
            </p>
            <button type="button" class="challenge-view-my-btn"
                    onclick="openChallengeEvidence('${challenge.id}')">
              <i class="fas fa-eye"></i> View my contribution
            </button>
          </div>
        </section>
      ` : ''}

      <!-- ============================================ -->
      <!-- MAIN CTA                                      -->
      <!-- ============================================ -->
      <div class="challenge-detail-cta">
        ${!joined ? `
          <button type="button" class="challenge-join-btn"
                  onclick="handleChallengeJoin('${challenge.id}')"
                  style="background:${activityColor};">
            <i class="fas fa-hand-holding-heart"></i>
            Join Challenge
          </button>
        ` : !userContributed ? `
          <button type="button" class="challenge-start-btn"
                  onclick="startChallengeActivity('${challenge.id}')"
                  style="background:${activityColor};">
            <i class="fas fa-play-circle"></i>
            Start Activity
          </button>
          <button type="button" class="challenge-leave-btn"
                  onclick="handleChallengeLeave('${challenge.id}')">
            <i class="fas fa-sign-out-alt"></i> Leave challenge
          </button>
        ` : `
          <div class="challenge-completed-badge">
            <i class="fas fa-check-double"></i>
            You've contributed to this challenge
          </div>
          <button type="button" class="challenge-secondary-btn"
                  onclick="startChallengeActivity('${challenge.id}')">
            <i class="fas fa-plus"></i> Submit another contribution
          </button>
        `}
      </div>

    </div>
  `;

  attachChallengeDetailHandlers();
}

/* ============================================================ */
/* 3. CONTRIBUTION PREVIEW CARD                                  */
/* ============================================================ */
function renderContributionPreviewCard(contribution) {
  const activityColor = getActivityTypeColor(contribution.activityType);
  const activityIcon = getActivityTypeIcon(contribution.activityType);
  const timeText = Contributions.formatRelativeTime(contribution);
  const hasPhotos = contribution.beforePhoto || contribution.afterPhoto || contribution.photo;

  return `
    <div class="contribution-preview-card"
         onclick="openContributionDetail('${contribution.id}')">
      ${hasPhotos ? `
        <div class="contribution-preview-photos">
          ${contribution.beforePhoto ? `
            <div class="contribution-photo-thumb">
              <img src="${contribution.beforePhoto}" alt="" onerror="this.style.opacity='0'">
              ${contribution.afterPhoto ? '<span class="photo-label">Before</span>' : ''}
            </div>
          ` : ''}
          ${contribution.afterPhoto ? `
            <div class="contribution-photo-thumb">
              <img src="${contribution.afterPhoto}" alt="" onerror="this.style.opacity='0'">
              <span class="photo-label">After</span>
            </div>
          ` : ''}
          ${!contribution.beforePhoto && !contribution.afterPhoto && contribution.photo ? `
            <div class="contribution-photo-thumb full-width">
              <img src="${contribution.photo}" alt="" onerror="this.style.opacity='0'">
            </div>
          ` : ''}
        </div>
      ` : `
        <div class="contribution-preview-noimage">
          <i class="fas ${activityIcon}"></i>
        </div>
      `}

      <div class="contribution-preview-body">
        <div class="contribution-preview-header">
          <div class="contribution-preview-avatar">
            ${contribution.contributorAvatar
              ? `<img src="${contribution.contributorAvatar}" alt="" onerror="this.style.display='none'; this.parentElement.textContent='${contribution.contributorName.charAt(0).toUpperCase()}'">`
              : contribution.contributorName.charAt(0).toUpperCase()
            }
          </div>
          <div style="flex:1; min-width:0;">
            <p class="contribution-preview-name">${escapeHtml(contribution.contributorName)}</p>
            <p class="contribution-preview-meta">
              <span class="contribution-type-chip" style="background:${activityColor}15; color:${activityColor};">
                <i class="fas ${activityIcon}"></i> ${getActivityTypeLabel(contribution.activityType)}
              </span>
              <span class="contribution-time">${timeText}</span>
            </p>
          </div>
        </div>

        ${contribution.activityNote ? `
          <p class="contribution-preview-note">${escapeHtml(contribution.activityNote.substring(0, 100))}${contribution.activityNote.length > 100 ? '…' : ''}</p>
        ` : ''}

        <p class="contribution-preview-location">
          <i class="fas fa-map-marker-alt"></i> ${escapeHtml(Contributions.formatLocation(contribution))}
        </p>
      </div>
    </div>
  `;
}

/* ============================================================ */
/* 4. JOIN / LEAVE HANDLERS                                      */
/* ============================================================ */
function handleChallengeJoin(challengeId) {
  if (!isLoggedIn()) {
    showToast('Sign in to join challenges');
    openModal('loginModal');
    if (typeof renderLoginModal === 'function') renderLoginModal();
    return;
  }

  const challenge = getChallengeById(challengeId);
  if (!challenge) return;

  /* Simple confirm modal */
  const modal = document.getElementById('quickViewModal');
  if (!modal) return;

  modal.querySelector('.modal-content').innerHTML = `
    <button type="button" class="close-modal" onclick="closeModal('quickViewModal')">
      <i class="fas fa-times"></i>
    </button>
    <h2 class="modal-title"><i class="fas fa-hand-holding-heart"></i> Join Challenge?</h2>

    <div class="join-confirm-body">
      <p class="join-confirm-title">${escapeHtml(challenge.title)}</p>

      <div class="join-confirm-info">
        <div class="join-confirm-row">
          <i class="fas fa-map-marker-alt"></i>
          <span>${escapeHtml(challenge.location)}</span>
        </div>
        <div class="join-confirm-row">
          <i class="fas fa-clipboard-check"></i>
          <span>You'll need to submit evidence</span>
        </div>
      </div>

      <p class="join-confirm-hint">
        After joining, tap <strong>Start Activity</strong> when you're ready to complete the challenge.
      </p>

      <div class="join-confirm-actions">
        <button type="button" class="observe-btn observe-btn-ghost" onclick="closeModal('quickViewModal')">
          Cancel
        </button>
        <button type="button" class="observe-btn observe-btn-primary" style="background:${getActivityTypeColor(challenge.activityType)};"
                onclick="confirmChallengeJoin('${challenge.id}')">
          <i class="fas fa-check"></i> Join
        </button>
      </div>
    </div>
  `;

  openModal('quickViewModal');
}

function confirmChallengeJoin(challengeId) {
  const challenge = getChallengeById(challengeId);
  if (!challenge) return;

  APP.joinedActions = APP.joinedActions || [];
  if (APP.joinedActions.includes(challengeId)) {
    closeModal('quickViewModal');
    showToast('Already joined');
    return;
  }

  APP.joinedActions.push(challengeId);
  Storage.set(APP.KEYS.JOINED_ACTIONS, APP.joinedActions);

  /* Increment joined count */
  challenge.joined = (challenge.joined || 0) + 1;

  closeModal('quickViewModal');
  showToast('Joined challenge!');

  /* Re-render */
  renderChallengeDetail();

  if (typeof refreshDrawer === 'function') refreshDrawer();
}

function handleChallengeLeave(challengeId) {
  const challenge = getChallengeById(challengeId);
  if (!challenge) return;

  const modal = document.getElementById('quickViewModal');
  if (!modal) return;

  modal.querySelector('.modal-content').innerHTML = `
    <button type="button" class="close-modal" onclick="closeModal('quickViewModal')">
      <i class="fas fa-times"></i>
    </button>
    <h2 class="modal-title"><i class="fas fa-sign-out-alt"></i> Leave Challenge?</h2>

    <div class="join-confirm-body">
      <p class="join-confirm-hint">
        You can rejoin any time. Your contributions (if any) will stay in the community record.
      </p>

      <div class="join-confirm-actions">
        <button type="button" class="observe-btn observe-btn-ghost" onclick="closeModal('quickViewModal')">
          Stay
        </button>
        <button type="button" class="observe-btn observe-btn-primary" style="background:var(--pc-danger);"
                onclick="confirmChallengeLeave('${challengeId}')">
          <i class="fas fa-sign-out-alt"></i> Leave
        </button>
      </div>
    </div>
  `;

  openModal('quickViewModal');
}

function confirmChallengeLeave(challengeId) {
  APP.joinedActions = (APP.joinedActions || []).filter(id => id !== challengeId);
  Storage.set(APP.KEYS.JOINED_ACTIONS, APP.joinedActions);

  const challenge = getChallengeById(challengeId);
  if (challenge) {
    challenge.joined = Math.max(0, (challenge.joined || 1) - 1);
  }

  closeModal('quickViewModal');
  showToast('Left challenge');

  renderChallengeDetail();

  if (typeof refreshDrawer === 'function') refreshDrawer();
}

/* ============================================================ */
/* 5. START ACTIVITY                                             */
/* ============================================================ */
function startChallengeActivity(challengeId) {
  const challenge = getChallengeById(challengeId);
  if (!challenge) return;

  if (typeof openContributionFlow === 'function') {
    openContributionFlow(challengeId);
  } else {
    showToast('Activity flow coming next phase');
  }
}

/* ============================================================ */
/* 6. EVIDENCE GALLERY                                           */
/* ============================================================ */
function openChallengeEvidence(challengeId) {
  const challenge = getChallengeById(challengeId);
  if (!challenge) return;

  const contributions = Contributions.getByChallenge(challengeId);
  const modal = document.getElementById('quickViewModal');
  if (!modal) return;

  modal.querySelector('.modal-content').classList.add('modal-large');

  modal.querySelector('.modal-content').innerHTML = `
    <button type="button" class="close-modal" onclick="closeModal('quickViewModal')">
      <i class="fas fa-times"></i>
    </button>
    <h2 class="modal-title">
      <i class="fas fa-images"></i> Community Evidence
      <span style="font-size:13px; color:var(--pc-text-muted); font-weight:600; margin-left:6px;">
        (${contributions.length})
      </span>
    </h2>

    ${contributions.length ? `
      <div class="challenge-evidence-gallery">
        ${contributions.map(c => renderContributionPreviewCard(c)).join('')}
      </div>
    ` : `
      <div class="empty-state">
        <i class="fas fa-images"></i>
        <p>No contributions yet</p>
        <p style="font-size:12.5px; color:var(--pc-text-muted); margin-top:6px;">
          Be the first to contribute!
        </p>
      </div>
    `}
  `;

  openModal('quickViewModal');
}

/* ============================================================ */
/* 7. SHARE                                                      */
/* ============================================================ */
function shareChallenge(challengeId) {
  const challenge = getChallengeById(challengeId);
  if (!challenge) return;

  const data = {
    title: challenge.title + ' — AquaQuest',
    text: `Join me in "${challenge.title}" — ${challenge.description.substring(0, 80)}...`,
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
/* 8. HANDLERS                                                   */
/* ============================================================ */
function attachChallengeDetailHandlers() {
  /* Any additional handlers if needed */
}

/* ============================================================ */
/* 9. EXPORTS                                                    */
/* ============================================================ */
window.openChallengeDetail = openChallengeDetail;
window.closeChallengeDetail = closeChallengeDetail;
window.renderChallengeDetail = renderChallengeDetail;
window.renderContributionPreviewCard = renderContributionPreviewCard;
window.handleChallengeJoin = handleChallengeJoin;
window.confirmChallengeJoin = confirmChallengeJoin;
window.handleChallengeLeave = handleChallengeLeave;
window.confirmChallengeLeave = confirmChallengeLeave;
window.startChallengeActivity = startChallengeActivity;
window.openChallengeEvidence = openChallengeEvidence;
window.shareChallenge = shareChallenge;

console.log('[AquaQuest] Challenge detail page loaded');