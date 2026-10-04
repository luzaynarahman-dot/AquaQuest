/* ============================================================ */
/* AQUAQUEST — CONTRIBUTION DETAIL MODAL                         */
/* View a single contribution's evidence                         */
/* ============================================================ */

function openContributionDetail(contributionId) {
  const contribution = Contributions.getById(contributionId);
  if (!contribution) {
    showToast('Contribution not found');
    return;
  }

  const challenge = getChallengeById(contribution.challengeId);
  const modal = document.getElementById('quickViewModal');
  if (!modal) return;

  const activityColor = getActivityTypeColor(contribution.activityType);
  const activityIcon = getActivityTypeIcon(contribution.activityType);
  const activityLabel = getActivityTypeLabel(contribution.activityType);

  modal.querySelector('.modal-content').innerHTML = `
    <button type="button" class="close-modal" onclick="closeModal('quickViewModal')">
      <i class="fas fa-times"></i>
    </button>

    ${renderContributionEvidence(contribution)}

    <div class="contribution-detail-header">
      <div class="contribution-detail-avatar">
        ${contribution.contributorAvatar
          ? `<img src="${contribution.contributorAvatar}" alt="" onerror="this.style.display='none'; this.parentElement.textContent='${contribution.contributorName.charAt(0).toUpperCase()}'">`
          : contribution.contributorName.charAt(0).toUpperCase()
        }
      </div>
      <div class="contribution-detail-author-info">
        <p class="contribution-detail-author">${escapeHtml(contribution.contributorName)}</p>
        <p class="contribution-detail-meta">
          <span class="contribution-type-chip" style="background:${activityColor}15; color:${activityColor};">
            <i class="fas ${activityIcon}"></i> ${activityLabel}
          </span>
          <span class="contribution-time">${Contributions.formatRelativeTime(contribution)}</span>
        </p>
      </div>
    </div>

    ${challenge ? `
      <button type="button" class="contribution-detail-challenge"
              onclick="closeModal('quickViewModal'); setTimeout(()=>openChallengeDetail('${challenge.id}'), 200);">
        <i class="fas ${challenge.icon}" style="color:${challenge.color};"></i>
        <span>${escapeHtml(challenge.title)}</span>
        <i class="fas fa-chevron-right"></i>
      </button>
    ` : ''}

    ${contribution.activityNote ? `
      <div class="contribution-detail-note">
        <i class="fas fa-quote-left"></i>
        <p>${escapeHtml(contribution.activityNote)}</p>
      </div>
    ` : ''}

    ${renderContributionData(contribution)}

    <div class="contribution-detail-meta-block">
      <div class="contribution-detail-meta-row">
        <i class="fas fa-map-marker-alt"></i>
        <span>${escapeHtml(Contributions.formatLocation(contribution))}</span>
      </div>
      <div class="contribution-detail-meta-row">
        <i class="fas fa-clock"></i>
        <span>${Contributions.formatDateTime(contribution)}</span>
      </div>
      <div class="contribution-detail-meta-row">
        <i class="fas fa-hashtag"></i>
        <span>ID: ${contribution.id}</span>
      </div>
    </div>

    ${contribution.verified ? `
      <div class="contribution-detail-verified">
        <i class="fas fa-circle-check"></i>
        <span>Community confirmed</span>
      </div>
    ` : ''}
  `;

  openModal('quickViewModal');
}

/* ============================================================ */
/* EVIDENCE RENDERERS                                            */
/* ============================================================ */
function renderContributionEvidence(contribution) {
  if (contribution.beforePhoto || contribution.afterPhoto) {
    return `
      <div class="contribution-detail-photos">
        ${contribution.beforePhoto ? `
          <div class="contribution-detail-photo">
            <img src="${contribution.beforePhoto}" alt="Before" onerror="this.style.opacity='0'">
            <span class="flow-photo-label">Before</span>
          </div>
        ` : ''}
        ${contribution.afterPhoto ? `
          <div class="contribution-detail-photo">
            <img src="${contribution.afterPhoto}" alt="After" onerror="this.style.opacity='0'">
            <span class="flow-photo-label">After</span>
          </div>
        ` : ''}
      </div>
    `;
  }

  if (contribution.photo) {
    return `
      <div class="contribution-detail-photo-single">
        <img src="${contribution.photo}" alt="" onerror="this.style.opacity='0'">
      </div>
    `;
  }

  return '';
}

function renderContributionData(contribution) {
  if (contribution.observationData) {
    const d = contribution.observationData;
    return `
      <div class="contribution-detail-data">
        <p class="contribution-detail-data-title">Observation data</p>
        ${d.clarity ? `<div class="contribution-detail-data-row"><span>Clarity:</span><strong>${d.clarity}</strong></div>` : ''}
        ${d.litter ? `<div class="contribution-detail-data-row"><span>Litter:</span><strong>${d.litter}</strong></div>` : ''}
        ${d.smell ? `<div class="contribution-detail-data-row"><span>Smell:</span><strong>${d.smell}</strong></div>` : ''}
        ${d.colour ? `<div class="contribution-detail-data-row"><span>Colour:</span><strong>${d.colour}</strong></div>` : ''}
        ${d.wildlife && d.wildlife.length ? `<div class="contribution-detail-data-row"><span>Wildlife:</span><strong>${d.wildlife.join(', ')}</strong></div>` : ''}
        ${d.ph ? `<div class="contribution-detail-data-row"><span>pH:</span><strong>${d.ph}</strong></div>` : ''}
        ${d.temperature ? `<div class="contribution-detail-data-row"><span>Temp:</span><strong>${d.temperature}°C</strong></div>` : ''}
        ${d.turbidity ? `<div class="contribution-detail-data-row"><span>Turbidity:</span><strong>${d.turbidity} NTU</strong></div>` : ''}
      </div>
    `;
  }

  if (contribution.wildlifeData) {
    const w = contribution.wildlifeData;
    return `
      <div class="contribution-detail-data">
        <p class="contribution-detail-data-title">Wildlife observation</p>
        ${w.category ? `<div class="contribution-detail-data-row"><span>Category:</span><strong>${w.category}</strong></div>` : ''}
        ${w.species ? `<div class="contribution-detail-data-row"><span>Species:</span><strong>${escapeHtml(w.species)}</strong></div>` : ''}
        ${w.count ? `<div class="contribution-detail-data-row"><span>Count:</span><strong>${w.count}</strong></div>` : ''}
        ${w.behavior ? `<div class="contribution-detail-data-row"><span>Behavior:</span><strong>${escapeHtml(w.behavior)}</strong></div>` : ''}
        ${w.confidence ? `<div class="contribution-detail-data-row"><span>Confidence:</span><strong>${w.confidence}</strong></div>` : ''}
      </div>
    `;
  }

  return '';
}

/* ============================================================ */
/* EXPORTS                                                       */
/* ============================================================ */
window.openContributionDetail = openContributionDetail;
window.renderContributionEvidence = renderContributionEvidence;
window.renderContributionData = renderContributionData;

console.log('[AquaQuest] Contribution detail loaded');
