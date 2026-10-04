/* ============================================================ */
/* AQUAQUEST — OBSERVATIONS                                      */
/* CRUD for water observations + validation + stats              */
/* + One Health Insight Card                                     */
/* ============================================================ */

const Observations = {

  /* ============================================================ */
  /* 1. GET all observations                                       */
  /* ============================================================ */
  getAll() {
    return APP.observations || [];
  },

  /* ============================================================ */
  /* 2. GET by ID                                                  */
  /* ============================================================ */
  getById(id) {
    return this.getAll().find(o => o.id === id) || null;
  },

  /* ============================================================ */
  /* 3. GET by site                                                */
  /* ============================================================ */
  getBySite(siteId) {
    return this.getAll()
      .filter(o => o.siteId === siteId)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  /* ============================================================ */
  /* 4. GET by user                                                */
  /* ============================================================ */
  getByUser(userId) {
    return this.getAll()
      .filter(o => o.reporterId === userId)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  /* ============================================================ */
  /* 5. GET my observations (self)                                 */
  /* ============================================================ */
  getMine() {
    const myId = APP.user?.id || 'user_self';
    const isDemo = typeof AppMode !== 'undefined' && AppMode.isDemo();

    return this.getAll()
      .filter(o => {
        if (isDemo && o.reporterId === 'user_demo') return true;
        return o.reporterId === 'user_self' || o.reporterId === myId;
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  /* ============================================================ */
  /* 6. CREATE                                                     */
  /* ============================================================ */
  create(data) {
    const user = APP.user || { id: 'user_self', name: 'Guest', avatar: null };

    const obs = {
      id: 'obs_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      siteId: data.siteId,
      reporterId: user.id || 'user_self',
      reporterName: user.name || 'Guest',
      reporterAvatar: user.avatar || null,
      date: new Date().toISOString(),

      clarity: data.clarity || 'good',
      litter: data.litter || 'little',
      smell: data.smell || 'none',
      colour: data.colour || 'normal',
      wildlife: data.wildlife || [],

      ph: data.ph || null,
      turbidity: data.turbidity || null,
      temperature: data.temperature || null,

      photo: data.photo || null,
      note: data.note || '',

      confirmedBy: [],
      verified: false
    };

    APP.observations = APP.observations || [];
    APP.observations.unshift(obs);
    Storage.set(APP.KEYS.OBSERVATIONS, APP.observations);

    if (typeof Gamification !== 'undefined' && Gamification.awardForObservation) {
      Gamification.awardForObservation(obs);
    }

    this.updateStreak();
    return obs;
  },

  /* ============================================================ */
  /* 7. UPDATE                                                     */
  /* ============================================================ */
  update(id, data) {
    const idx = (APP.observations || []).findIndex(o => o.id === id);
    if (idx === -1) return null;

    APP.observations[idx] = {
      ...APP.observations[idx],
      ...data,
      updatedAt: new Date().toISOString()
    };

    Storage.set(APP.KEYS.OBSERVATIONS, APP.observations);
    return APP.observations[idx];
  },

  /* ============================================================ */
  /* 8. DELETE                                                     */
  /* ============================================================ */
  delete(id) {
    APP.observations = (APP.observations || []).filter(o => o.id !== id);
    Storage.set(APP.KEYS.OBSERVATIONS, APP.observations);
    return true;
  },

  /* ============================================================ */
  /* 9. STREAK                                                     */
  /* ============================================================ */
  updateStreak() {
    const today = new Date().toISOString().slice(0, 10);
    const last = APP.lastObserveDate;

    if (last === today) return APP.streak || 0;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().slice(0, 10);

    if (last === yesterdayStr) {
      APP.streak = (APP.streak || 0) + 1;
    } else {
      APP.streak = 1;
    }

    APP.lastObserveDate = today;
    Storage.set(APP.KEYS.STREAK, APP.streak);
    Storage.set(APP.KEYS.LAST_OBSERVE, today);

    return APP.streak;
  },

  /* ============================================================ */
  /* 10. SITE STATS                                                */
  /* ============================================================ */
  getSiteStats(siteId) {
    const obs = this.getBySite(siteId);

    if (!obs.length) {
      return {
        count: 0,
        avgClarity: null,
        avgLitter: null,
        lastObserved: null,
        health: { grade: 'moderate', score: 50 },
        wildlifeCount: {},
        trendData: []
      };
    }

    const clarityMap = { excellent: 4, good: 3, moderate: 2, poor: 1, critical: 0 };
    const litterMap = { none: 4, little: 3, moderate: 2, heavy: 1, severe: 0 };

    const avgClarity = obs.reduce((sum, o) => sum + (clarityMap[o.clarity] || 2), 0) / obs.length;
    const avgLitter = obs.reduce((sum, o) => sum + (litterMap[o.litter] || 2), 0) / obs.length;

    const wildlifeCount = {};
    obs.forEach(o => {
      (o.wildlife || []).forEach(w => {
        wildlifeCount[w] = (wildlifeCount[w] || 0) + 1;
      });
    });

    const trendData = obs.slice(0, 14).reverse().map(o => ({
      date: o.date,
      clarity: clarityMap[o.clarity] ?? 2,
      litter: litterMap[o.litter] ?? 2,
      ph: o.ph
    }));

    const health = this.computeHealth(avgClarity, avgLitter);

    return {
      count: obs.length,
      avgClarity,
      avgLitter,
      lastObserved: obs[0].date,
      health,
      wildlifeCount,
      trendData
    };
  },

  computeHealth(avgClarity, avgLitter) {
    const total = (avgClarity + avgLitter) / 2;
    const normalized = (total / 4) * 100;

    let grade;
    if (normalized >= 85) grade = 'excellent';
    else if (normalized >= 65) grade = 'good';
    else if (normalized >= 45) grade = 'moderate';
    else if (normalized >= 25) grade = 'poor';
    else grade = 'critical';

    return { grade, score: Math.round(normalized) };
  },

  /* ============================================================ */
  /* 11. INDICATOR LABELS                                          */
  /* ============================================================ */
  clarityLabel(v) {
    return {
      excellent: 'Excellent',
      good: 'Good',
      moderate: 'Moderate',
      poor: 'Poor',
      critical: 'Critical'
    }[v] || 'Unknown';
  },

  clarityIcon(v) {
    return {
      excellent: 'fa-star',
      good: 'fa-circle-check',
      moderate: 'fa-circle-half-stroke',
      poor: 'fa-circle-exclamation',
      critical: 'fa-triangle-exclamation'
    }[v] || 'fa-circle';
  },

  clarityColor(v) {
    return {
      excellent: '#10B981',
      good: '#22C55E',
      moderate: '#F59E0B',
      poor: '#F97316',
      critical: '#EF4444'
    }[v] || '#0891B2';
  },

  litterLabel(v) {
    return {
      none: 'No Litter',
      little: 'A little',
      moderate: 'Moderate',
      heavy: 'Heavy',
      severe: 'Severe'
    }[v] || 'Unknown';
  },

  litterIcon(v) {
    return {
      none: 'fa-check-circle',
      little: 'fa-leaf',
      moderate: 'fa-trash',
      heavy: 'fa-trash-can',
      severe: 'fa-dumpster'
    }[v] || 'fa-trash';
  },

  smellLabel(v) {
    return {
      none: 'No smell',
      mild: 'Mild',
      strong: 'Strong',
      foul: 'Foul'
    }[v] || 'Unknown';
  },

  smellIcon(v) {
    return {
      none: 'fa-wind',
      mild: 'fa-nose',
      strong: 'fa-face-tired',
      foul: 'fa-skull'
    }[v] || 'fa-wind';
  },

  colourLabel(v) {
    return {
      normal: 'Normal',
      green: 'Greenish',
      brown: 'Brownish',
      black: 'Black / Dark',
      oily: 'Oily sheen'
    }[v] || 'Unknown';
  },

  colourIcon(v) {
    return {
      normal: 'fa-tint',
      green: 'fa-leaf',
      brown: 'fa-mountain',
      black: 'fa-moon',
      oily: 'fa-oil-can'
    }[v] || 'fa-tint';
  },

  wildlifeLabel(v) {
    return {
      fish: 'Fish',
      birds: 'Birds',
      plants: 'Aquatic plants',
      crabs: 'Crabs',
      shells: 'Shells',
      butterflies: 'Butterflies',
      turtles: 'Turtles',
      insects: 'Insects',
      mammals: 'Mammals'
    }[v] || v;
  },

  wildlifeIcon(v) {
    return {
      fish: 'fa-fish',
      birds: 'fa-dove',
      plants: 'fa-seedling',
      crabs: 'fa-shrimp',
      shells: 'fa-shell',
      butterflies: 'fa-leaf',
      turtles: 'fa-shield-halved',
      insects: 'fa-bug',
      mammals: 'fa-paw'
    }[v] || 'fa-eye';
  },

  healthGradeFromScore(score) {
    if (score >= 85) return 'excellent';
    if (score >= 65) return 'good';
    if (score >= 45) return 'moderate';
    if (score >= 25) return 'poor';
    return 'critical';
  },

  /* ============================================================ */
  /* 12. ONE HEALTH INSIGHT — Rule-Based Analysis                  */
  /* ============================================================ */
  computeOneHealthInsight(obs) {
    if (!obs) {
      return null;
    }

    /* ------ Score water health ------ */
    const clarityScore = {
      excellent: 4, good: 3, moderate: 2, poor: 1, critical: 0
    }[obs.clarity] ?? 2;

    const litterScore = {
      none: 4, little: 3, moderate: 2, heavy: 1, severe: 0
    }[obs.litter] ?? 2;

    const smellScore = {
      none: 4, mild: 3, strong: 1, foul: 0
    }[obs.smell] ?? 4;

    const colourScore = {
      normal: 4, green: 2, brown: 2, black: 0, oily: 0
    }[obs.colour] ?? 4;

    /* pH scoring — healthy range 6.5-8.5 */
    let phScore = 4;
    if (obs.ph !== null && obs.ph !== undefined) {
      if (obs.ph >= 6.5 && obs.ph <= 8.5) phScore = 4;
      else if (obs.ph >= 6 && obs.ph <= 9) phScore = 3;
      else if (obs.ph >= 5 && obs.ph <= 9.5) phScore = 2;
      else phScore = 1;
    }

    /* Wildlife bonus */
    const wildlifeBonus = (obs.wildlife || []).length >= 3 ? 0.5 : 0;

    /* Overall water health score (0-100) */
    const avgScore = (clarityScore + litterScore + smellScore + colourScore + phScore) / 5;
    const waterHealthPercent = Math.min(100, Math.round((avgScore / 4) * 100 + wildlifeBonus * 10));

    let waterGrade;
    if (waterHealthPercent >= 85) waterGrade = 'excellent';
    else if (waterHealthPercent >= 65) waterGrade = 'good';
    else if (waterHealthPercent >= 45) waterGrade = 'moderate';
    else if (waterHealthPercent >= 25) waterGrade = 'poor';
    else waterGrade = 'critical';

    /* ------ Human health risk ------ */
    let humanRisk = 'Low';
    let humanRiskLevel = 'low';
    const riskFactors = [];

    if (obs.smell === 'foul' || obs.smell === 'strong') {
      riskFactors.push('Unpleasant odour suggests bacterial contamination');
    }
    if (obs.colour === 'black' || obs.colour === 'oily') {
      riskFactors.push('Unusual colour may indicate chemical pollution');
    }
    if (obs.litter === 'heavy' || obs.litter === 'severe') {
      riskFactors.push('Heavy litter can harbour pathogens');
    }
    if (obs.ph !== null && obs.ph !== undefined && (obs.ph < 5.5 || obs.ph > 9)) {
      riskFactors.push('Extreme pH affects water safety');
    }

    if (riskFactors.length >= 3) {
      humanRisk = 'Elevated';
      humanRiskLevel = 'high';
    } else if (riskFactors.length >= 1) {
      humanRisk = 'Moderate';
      humanRiskLevel = 'medium';
    }

    /* ------ Ecosystem impact ------ */
    let ecosystemImpact = 'Thriving';
    let ecosystemLevel = 'low';

    const hasWildlife = (obs.wildlife || []).length > 0;

    if (waterGrade === 'poor' || waterGrade === 'critical') {
      ecosystemImpact = hasWildlife
        ? 'Under stress'
        : 'At risk — no wildlife observed';
      ecosystemLevel = 'high';
    } else if (waterGrade === 'moderate') {
      ecosystemImpact = hasWildlife
        ? 'Stressed but stable'
        : 'Wildlife may be declining';
      ecosystemLevel = 'medium';
    } else {
      ecosystemImpact = hasWildlife
        ? 'Healthy — wildlife present'
        : 'Healthy water, wildlife not observed';
      ecosystemLevel = 'low';
    }

    /* ------ Recommended action ------ */
    let recommendation = '';

    if (waterGrade === 'excellent' || waterGrade === 'good') {
      recommendation = 'Continue weekly monitoring to maintain the trend.';
    } else if (waterGrade === 'moderate') {
      recommendation = 'Increase monitoring frequency. Consider a community cleanup.';
    } else if (waterGrade === 'poor') {
      recommendation = 'Report this site. Organize a community action.';
    } else {
      recommendation = 'Report urgently. This waterbody needs immediate attention.';
    }

    /* ------ Return insight object ------ */
    return {
      waterGrade,
      waterHealthPercent,
      humanRisk,
      humanRiskLevel,
      ecosystemImpact,
      ecosystemLevel,
      recommendation,
      riskFactors
    };
  },

  /* ============================================================ */
  /* 13. RENDER — One Health Insight Card                          */
  /* ============================================================ */
  renderOneHealthInsightCard(obs) {
    const insight = this.computeOneHealthInsight(obs);
    if (!insight) return '';

    /* Grade styling */
    const gradeStyles = {
      excellent: { color: '#10B981', bg: 'rgba(16, 185, 129, 0.1)', label: 'Excellent' },
      good:      { color: '#22C55E', bg: 'rgba(34, 197, 94, 0.1)',  label: 'Good' },
      moderate:  { color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.1)', label: 'Moderate' },
      poor:      { color: '#F97316', bg: 'rgba(249, 115, 22, 0.1)', label: 'Poor' },
      critical:  { color: '#EF4444', bg: 'rgba(239, 68, 68, 0.1)',  label: 'Critical' }
    };

    const style = gradeStyles[insight.waterGrade] || gradeStyles.moderate;

    /* Risk styling */
    const riskColors = {
      low:    { color: '#10B981', icon: 'fa-shield-halved' },
      medium: { color: '#F59E0B', icon: 'fa-triangle-exclamation' },
      high:   { color: '#EF4444', icon: 'fa-circle-exclamation' }
    };

    const humanRiskStyle = riskColors[insight.humanRiskLevel] || riskColors.low;
    const ecoRiskStyle = riskColors[insight.ecosystemLevel] || riskColors.low;

    return `
      <div class="one-health-insight-card" style="border-left-color: ${style.color};">

        <div class="one-health-header">
          <span class="one-health-icon" style="background: ${style.bg}; color: ${style.color};">
            <i class="fas fa-heart-pulse"></i>
          </span>
          <div>
            <p class="one-health-title">One Health Insight</p>
            <p class="one-health-sub">Water · Human · Ecosystem connection</p>
          </div>
        </div>

        <div class="one-health-grid">

          <div class="one-health-item">
            <p class="one-health-label">Water Health</p>
            <p class="one-health-value" style="color: ${style.color};">
              ${style.label}
            </p>
          </div>

          <div class="one-health-item">
            <p class="one-health-label">Human Health Risk</p>
            <p class="one-health-value" style="color: ${humanRiskStyle.color};">
              <i class="fas ${humanRiskStyle.icon}"></i> ${insight.humanRisk}
            </p>
          </div>

          <div class="one-health-item one-health-item-wide">
            <p class="one-health-label">Ecosystem Impact</p>
            <p class="one-health-value" style="color: ${ecoRiskStyle.color};">
              <i class="fas fa-fish"></i> ${insight.ecosystemImpact}
            </p>
          </div>

        </div>

        <div class="one-health-recommendation">
          <i class="fas fa-lightbulb"></i>
          <p>${insight.recommendation}</p>
        </div>

      </div>
    `;
  }
};

/* ============================================================ */
/* 14. OBSERVATION DETAIL MODAL                                  */
/* ============================================================ */
function openObservationDetail(observationId) {
  const obs = Observations.getById(observationId);
  if (!obs) {
    showToast('Observation not found');
    return;
  }

  const site = getSiteById(obs.siteId);
  const modal = document.getElementById('quickViewModal');
  if (!modal) return;

  const clarityColor = Observations.clarityColor(obs.clarity);

  modal.querySelector('.modal-content').innerHTML = `
    <button class="close-modal" onclick="closeModal('quickViewModal')">
      <i class="fas fa-times"></i>
    </button>

    ${obs.photo ? `
      <div class="obs-detail-photo">
        <img src="${obs.photo}" alt="" onerror="this.style.opacity='0'">
      </div>
    ` : ''}

    <div class="obs-detail-header">
      <div class="obs-detail-reporter">
        <div class="obs-detail-avatar">
          ${obs.reporterAvatar
            ? `<img src="${obs.reporterAvatar}" alt="" onerror="this.style.display='none'; this.parentElement.textContent='${(obs.reporterName || 'U').charAt(0).toUpperCase()}'">`
            : (obs.reporterName || 'U').charAt(0).toUpperCase()
          }
        </div>
        <div>
          <p class="obs-detail-reporter-name">${escapeHtml(obs.reporterName || 'Anonymous')}</p>
          <p class="obs-detail-time">${timeAgo(obs.date)}</p>
        </div>
      </div>
      ${site ? `
        <button class="obs-detail-site-chip" onclick="closeModal('quickViewModal'); setTimeout(()=>openSiteDetail('${site.id}'), 200);">
          <i class="fas ${getSiteTypeIcon(site.type)}"></i> ${escapeHtml(site.name)}
        </button>
      ` : ''}
    </div>

    <!-- ⭐ ONE HEALTH INSIGHT CARD -->
    ${Observations.renderOneHealthInsightCard(obs)}

    <div class="obs-detail-indicators">
      <div class="obs-detail-indicator">
        <div class="obs-detail-indicator-icon" style="background:${clarityColor}20; color:${clarityColor};">
          <i class="fas fa-eye"></i>
        </div>
        <div>
          <p class="obs-detail-indicator-label">Clarity</p>
          <p class="obs-detail-indicator-value" style="color:${clarityColor};">
            ${Observations.clarityLabel(obs.clarity)}
          </p>
        </div>
      </div>

      <div class="obs-detail-indicator">
        <div class="obs-detail-indicator-icon" style="background:var(--pc-warning-soft); color:var(--pc-warning);">
          <i class="fas ${Observations.litterIcon(obs.litter)}"></i>
        </div>
        <div>
          <p class="obs-detail-indicator-label">Litter</p>
          <p class="obs-detail-indicator-value">${Observations.litterLabel(obs.litter)}</p>
        </div>
      </div>

      <div class="obs-detail-indicator">
        <div class="obs-detail-indicator-icon" style="background:var(--pc-purple-soft); color:var(--pc-purple);">
          <i class="fas ${Observations.smellIcon(obs.smell)}"></i>
        </div>
        <div>
          <p class="obs-detail-indicator-label">Smell</p>
          <p class="obs-detail-indicator-value">${Observations.smellLabel(obs.smell)}</p>
        </div>
      </div>

      <div class="obs-detail-indicator">
        <div class="obs-detail-indicator-icon" style="background:var(--pc-info-soft); color:var(--pc-info);">
          <i class="fas ${Observations.colourIcon(obs.colour)}"></i>
        </div>
        <div>
          <p class="obs-detail-indicator-label">Colour</p>
          <p class="obs-detail-indicator-value">${Observations.colourLabel(obs.colour)}</p>
        </div>
      </div>
    </div>

    ${obs.wildlife && obs.wildlife.length ? `
      <div class="obs-detail-section">
        <p class="obs-detail-section-title">
          <i class="fas fa-fish"></i> Wildlife Observed
        </p>
        <div class="obs-detail-wildlife-row">
          ${obs.wildlife.map(w => `
            <span class="obs-detail-wildlife-chip">
              <i class="fas ${Observations.wildlifeIcon(w)}"></i>
              ${Observations.wildlifeLabel(w)}
            </span>
          `).join('')}
        </div>
      </div>
    ` : ''}

    ${(obs.ph || obs.turbidity || obs.temperature) ? `
      <div class="obs-detail-section">
        <p class="obs-detail-section-title">
          <i class="fas fa-flask"></i> Advanced Readings
        </p>
        <div class="obs-detail-advanced-grid">
          ${obs.ph ? `
            <div class="obs-detail-advanced-item">
              <p class="obs-detail-advanced-label">pH</p>
              <p class="obs-detail-advanced-value">${obs.ph}</p>
            </div>
          ` : ''}
          ${obs.turbidity ? `
            <div class="obs-detail-advanced-item">
              <p class="obs-detail-advanced-label">Turbidity</p>
              <p class="obs-detail-advanced-value">${obs.turbidity} <span style="font-size:10px; opacity:0.7;">NTU</span></p>
            </div>
          ` : ''}
          ${obs.temperature ? `
            <div class="obs-detail-advanced-item">
              <p class="obs-detail-advanced-label">Temperature</p>
              <p class="obs-detail-advanced-value">${obs.temperature}°C</p>
            </div>
          ` : ''}
        </div>
      </div>
    ` : ''}

    ${obs.note ? `
      <div class="obs-detail-section">
        <p class="obs-detail-section-title">
          <i class="fas fa-note-sticky"></i> Notes
        </p>
        <p class="obs-detail-note">${escapeHtml(obs.note)}</p>
      </div>
    ` : ''}

    <div class="obs-detail-actions">
      <button class="obs-detail-action" onclick="confirmObservation('${obs.id}')">
        <i class="fas fa-check-circle"></i>
        <span>Confirm</span>
      </button>
      <button class="obs-detail-action" onclick="shareObservation('${obs.id}')">
        <i class="fas fa-share-alt"></i>
        <span>Share</span>
      </button>
      ${(obs.reporterId === 'user_self' || obs.reporterId === (APP.user?.id || '')) ? `
        <button class="obs-detail-action obs-detail-action-danger" onclick="deleteObservation('${obs.id}')">
          <i class="fas fa-trash"></i>
          <span>Delete</span>
        </button>
      ` : ''}
    </div>
  `;

  openModal('quickViewModal');
}

function confirmObservation(obsId) {
  const obs = Observations.getById(obsId);
  if (!obs) return;

  const user = APP.user || { name: 'You' };
  obs.confirmedBy = obs.confirmedBy || [];

  if (obs.confirmedBy.includes(user.name)) {
    showToast('Already confirmed');
    return;
  }

  obs.confirmedBy.push(user.name);
  Storage.set(APP.KEYS.OBSERVATIONS, APP.observations);

  if (typeof Gamification !== 'undefined' && Gamification.award) {
    Gamification.award(2, 'Observation confirmed');
  }

  showToast('Confirmation added');
  openObservationDetail(obsId);
}

function shareObservation(obsId) {
  const obs = Observations.getById(obsId);
  if (!obs) return;

  const site = getSiteById(obs.siteId);
  const data = {
    title: `Water observation at ${site?.name || 'a waterbody'}`,
    text: obs.note || `Clarity: ${Observations.clarityLabel(obs.clarity)}, Litter: ${Observations.litterLabel(obs.litter)}`,
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

function deleteObservation(obsId) {
  if (!confirm('Delete this observation permanently?')) return;

  Observations.delete(obsId);
  closeModal('quickViewModal');
  showToast('Observation deleted');

  setTimeout(() => {
    if (APP.currentPage === 'home') renderHome();
    if (APP.currentPage === 'sites') renderSites();
    if (APP.currentPage === 'site-detail') renderSiteDetail();
    if (APP.currentPage === 'profile') renderProfile();
    if (APP.currentPage === 'feed') renderFeed();
  }, 250);
}

/* ============================================================ */
/* 15. EXPORTS                                                   */
/* ============================================================ */
window.Observations = Observations;
window.openObservationDetail = openObservationDetail;
window.confirmObservation = confirmObservation;
window.shareObservation = shareObservation;
window.deleteObservation = deleteObservation;

console.log('[AquaQuest] Observations CRUD loaded');