/* ============================================================ */
/* AQUAQUEST — GAMIFICATION                                      */
/* Points · Levels · Badges · Streaks                            */
/* ============================================================ */

const Gamification = {

  POINTS: {
    OBSERVATION: 10,
    OBSERVATION_WITH_PHOTO: 15,
    NEW_SITE: 20,
    STORY: 15,
    REPORT: 25,
    CONFIRMATION: 2,
    ACTION_JOINED: 30,
    BADGE_EARNED: 25
  },

  getPoints() { return APP.points || 0; },
  getLevel() { return APP.level || 'Bronze Guardian'; },
  getLevelData() { return getLevelForPoints(this.getPoints()); },
  getNextLevel() { return getNextLevel(this.getPoints()); },
  getBadges() { return APP.badges || []; },
  getStreak() { return APP.streak || 0; },

  getProgressToNext() {
    const current = this.getPoints();
    const next = this.getNextLevel();
    if (!next) return 100;
    const currentLevelData = this.getLevelData();
    const range = next.minPoints - currentLevelData.minPoints;
    const progress = current - currentLevelData.minPoints;
    return Math.min(100, Math.round((progress / range) * 100));
  },

  award(amount, reason) {
    if (!amount || amount <= 0) return;
    APP.points = (APP.points || 0) + amount;
    Storage.set(APP.KEYS.POINTS, APP.points);

    const newLevelData = getLevelForPoints(APP.points);
    if (newLevelData.name !== APP.level) {
      APP.level = newLevelData.name;
      Storage.set(APP.KEYS.LEVEL, APP.level);
      this.onLevelUp(newLevelData);
    }

    if (reason && typeof showToast === 'function') {
      showToast(`+${amount} points · ${reason}`);
    }
  },

  awardForObservation(obs) {
    let points = this.POINTS.OBSERVATION;
    if (obs.photo) points = this.POINTS.OBSERVATION_WITH_PHOTO;

    const existing = Observations.getBySite(obs.siteId).filter(o => o.id !== obs.id);
    if (!existing.length) {
      points += this.POINTS.NEW_SITE;
      this.checkBadge('explorer');
    }

    this.award(points, 'Observation logged');

    const myObs = Observations.getMine();
    if (myObs.length >= 1) this.checkBadge('first_observation');
    if (myObs.filter(o => o.photo).length >= 10) this.checkBadge('photographer');
    if (myObs.filter(o => o.ph).length >= 10) this.checkBadge('scientist');

    if (this.getStreak() >= 7) this.checkBadge('consistent_observer');
    if (this.getStreak() >= 30) this.checkBadge('streak_30');

    const uniqueSites = new Set(myObs.map(o => o.siteId));
    if (uniqueSites.size >= 5) this.checkBadge('explorer');
  },

  awardForReport() {
    this.award(this.POINTS.REPORT, 'Concern reported');
    const myReports = (APP.reports || []).filter(r =>
      r.reporterId === 'user_self' || r.reporterId === (APP.user?.id || '')
    );
    if (myReports.length >= 5) this.checkBadge('watchdog');
  },

  awardForStory() {
    this.award(this.POINTS.STORY, 'Story shared');
  },

  awardForAction(action) {
    this.award(this.POINTS.ACTION_JOINED, 'Action joined');
    if (action.badge) {
      this.checkBadge(action.badge);
    }
  },

  checkBadge(badgeId) {
    if (!badgeId) return;
    APP.badges = APP.badges || [];
    if (APP.badges.includes(badgeId)) return;

    const badge = getBadgeById(badgeId);
    if (!badge) return;

    APP.badges.push(badgeId);
    Storage.set(APP.KEYS.BADGES, APP.badges);

    APP.points = (APP.points || 0) + this.POINTS.BADGE_EARNED;
    Storage.set(APP.KEYS.POINTS, APP.points);

    if (typeof showToast === 'function') {
      showToast(`🏅 Badge earned: ${badge.label}`);
    }

    if (typeof confetti === 'function') {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#FBBF24', '#22D3EE', '#0891B2']
      });
    }

    APP.notifications = APP.notifications || [];
    APP.notifications.unshift({
      id: 'notif_' + Date.now(),
      type: 'badge',
      title: '🏅 New Badge!',
      message: `You earned the "${badge.label}" badge.`,
      date: new Date().toISOString(),
      read: false
    });
    Storage.set(APP.KEYS.NOTIFICATIONS, APP.notifications);

    if (typeof updateNotifBadge === 'function') updateNotifBadge();
  },

  onLevelUp(levelData) {
    if (typeof showToast === 'function') {
      showToast(`🎉 Level Up! You're now a ${levelData.name}`);
    }
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 150,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#FBBF24', '#22D3EE', '#0891B2', '#10B981']
      });
    }
    APP.notifications = APP.notifications || [];
    APP.notifications.unshift({
      id: 'notif_' + Date.now(),
      type: 'level',
      title: '🎉 Level Up!',
      message: `You've reached ${levelData.name}.`,
      date: new Date().toISOString(),
      read: false
    });
    Storage.set(APP.KEYS.NOTIFICATIONS, APP.notifications);
    if (typeof updateNotifBadge === 'function') updateNotifBadge();
  },

  /* ============================================================ */
  /* BADGE GRID — with click handler                               */
  /* ============================================================ */
  renderBadgeGrid() {
    const earned = this.getBadges();
    const allBadges = Object.values(BADGES);

    return allBadges.map(badge => {
      const has = earned.includes(badge.id);
      return `
        <button type="button"
                class="badge-item ${has ? 'earned' : 'locked'}"
                onclick="openBadgeDetail('${badge.id}')"
                aria-label="${badge.label}">
          <div class="badge-icon" style="background: ${has ? badge.color + '20' : 'var(--pc-paper)'}; color: ${has ? badge.color : 'var(--pc-text-muted)'};">
            <i class="fas ${badge.icon}"></i>
          </div>
          <p class="badge-label">${badge.label}</p>
        </button>
      `;
    }).join('');
  },

  /* ============================================================ */
  /* BADGE PROGRESS — how close user is                            */
  /* ============================================================ */
  getBadgeProgress(badgeId) {
    const myObs = Observations.getMine();
    const myReports = (APP.reports || []).filter(r =>
      r.reporterId === 'user_self' || r.reporterId === (APP.user?.id || '')
    );

    switch (badgeId) {
      case 'first_observation':
        return { current: Math.min(myObs.length, 1), target: 1 };

      case 'photographer':
        return { current: myObs.filter(o => o.photo).length, target: 10 };

      case 'explorer':
        return { current: new Set(myObs.map(o => o.siteId)).size, target: 5 };

      case 'scientist':
        return { current: myObs.filter(o => o.ph).length, target: 10 };

      case 'watchdog':
        return { current: myReports.length, target: 5 };

      case 'steward':
        return {
          current: (APP.completedActions || []).length >= 1 ? 1 : 0,
          target: 1
        };

      case 'restorer':
        const restorer = (APP.completedActions || []).filter(id => {
          const c = CHALLENGES.find(x => x.id === id);
          return c && c.type === 'restoration';
        }).length;
        return { current: restorer >= 1 ? 1 : 0, target: 1 };

      case 'naturalist':
        const naturalist = (APP.completedActions || []).filter(id => {
          const c = CHALLENGES.find(x => x.id === id);
          return c && c.type === 'biodiversity-watch';
        }).length;
        return { current: naturalist >= 1 ? 1 : 0, target: 1 };

      case 'marine_guardian':
        const marine = (APP.completedActions || []).filter(id => {
          const c = CHALLENGES.find(x => x.id === id);
          return c && (c.type === 'cleanup' && c.siteId === 'kolatoli_beach');
        }).length;
        return { current: marine >= 1 ? 1 : 0, target: 1 };

      case 'consistent_observer':
        return { current: Math.min(this.getStreak(), 7), target: 7 };

      case 'streak_30':
        return { current: Math.min(this.getStreak(), 30), target: 30 };

      case 'aqua_guardian':
        const maxLevel = LEVELS[LEVELS.length - 1];
        return { current: Math.min(this.getPoints(), maxLevel.minPoints), target: maxLevel.minPoints };

      default:
        return { current: 0, target: 1 };
    }
  },

  /* ============================================================ */
  /* BADGE UNLOCKED DATE — from notifications                      */
  /* ============================================================ */
  getBadgeUnlockedDate(badgeId) {
    const badge = getBadgeById(badgeId);
    if (!badge) return null;

    const notifications = APP.notifications || [];
    const notif = notifications.find(n =>
      n.type === 'badge' &&
      n.message && n.message.includes(badge.label)
    );

    return notif ? notif.date : null;
  }
};

/* ============================================================ */
/* BADGE DETAIL MODAL                                            */
/* ============================================================ */
function openBadgeDetail(badgeId) {
  const badge = getBadgeById(badgeId);
  if (!badge) return;

  const modal = document.getElementById('quickViewModal');
  if (!modal) return;

  const earned = Gamification.getBadges().includes(badgeId);
  const progress = Gamification.getBadgeProgress(badgeId);
  const unlockedDate = Gamification.getBadgeUnlockedDate(badgeId);
  const percent = Math.round((progress.current / progress.target) * 100);

  const progressColor = earned ? badge.color : 'var(--pc-text-muted)';

  modal.querySelector('.modal-content').innerHTML = `
    <button type="button" class="close-modal" onclick="closeModal('quickViewModal')">
      <i class="fas fa-times"></i>
    </button>

    <div class="badge-detail-hero">
      <div class="badge-detail-icon ${earned ? 'earned' : 'locked'}"
           style="background: ${earned ? badge.color + '25' : 'var(--pc-paper)'}; color: ${earned ? badge.color : 'var(--pc-text-muted)'};">
        <i class="fas ${earned ? badge.icon : 'fa-lock'}"></i>
      </div>

      <h2 class="badge-detail-title">${badge.label}</h2>

      <p class="badge-detail-desc">${badge.description}</p>
    </div>

    ${earned ? `
      <div class="badge-detail-status earned">
        <i class="fas fa-check-circle"></i>
        <div>
          <p class="badge-detail-status-title">UNLOCKED</p>
          ${unlockedDate ? `
            <p class="badge-detail-status-date">Earned ${formatDate(unlockedDate)}</p>
          ` : `
            <p class="badge-detail-status-date">Achievement unlocked</p>
          `}
        </div>
      </div>
    ` : `
      <div class="badge-detail-status locked">
        <i class="fas fa-lock"></i>
        <div>
          <p class="badge-detail-status-title">LOCKED</p>
          <p class="badge-detail-status-date">Complete the goal to unlock</p>
        </div>
      </div>
    `}

    <div class="badge-detail-progress">
      <div class="badge-detail-progress-header">
        <span>Progress</span>
        <span class="badge-detail-progress-value" style="color:${progressColor};">
          ${progress.current} / ${progress.target}
        </span>
      </div>
      <div class="badge-detail-progress-bar">
        <div class="badge-detail-progress-fill"
             style="width: ${percent}%; background: ${progressColor};"></div>
      </div>
      <p class="badge-detail-progress-percent">${percent}% complete</p>
    </div>

    ${!earned && progress.current < progress.target ? `
      <div class="badge-detail-tip">
        <i class="fas fa-lightbulb"></i>
        <p>
          ${getBadgeTip(badgeId, progress)}
        </p>
      </div>
    ` : ''}

    <button type="button" class="btn btn-primary w-full" style="margin-top:16px;" onclick="closeModal('quickViewModal')">
      <i class="fas fa-check"></i> Got it
    </button>
  `;

  openModal('quickViewModal');
}

/* ============================================================ */
/* BADGE TIPS                                                    */
/* ============================================================ */
function getBadgeTip(badgeId, progress) {
  const remaining = progress.target - progress.current;

  const tips = {
    first_observation: 'Log your very first water observation to unlock this badge.',
    photographer: `Add photos to ${remaining} more observation${remaining > 1 ? 's' : ''} to unlock.`,
    explorer: `Explore ${remaining} more waterbod${remaining > 1 ? 'ies' : 'y'} to unlock.`,
    scientist: `Record pH readings in ${remaining} more observation${remaining > 1 ? 's' : ''}.`,
    watchdog: `Report ${remaining} more concern${remaining > 1 ? 's' : ''} to unlock.`,
    steward: 'Join a community cleanup action to unlock.',
    restorer: 'Complete a restoration action to unlock.',
    naturalist: 'Complete a biodiversity watch to unlock.',
    marine_guardian: 'Complete a marine litter survey at Kolatoli Beach.',
    consistent_observer: `Maintain your streak for ${remaining} more day${remaining > 1 ? 's' : ''}.`,
    streak_30: `Keep observing for ${remaining} more day${remaining > 1 ? 's' : ''} to unlock.`,
    aqua_guardian: `Earn ${remaining} more points to reach the highest level.`
  };

  return tips[badgeId] || 'Keep contributing to unlock this badge.';
}

/* ============================================================ */
/* EXPORTS                                                       */
/* ============================================================ */
window.Gamification = Gamification;
window.openBadgeDetail = openBadgeDetail;
window.getBadgeTip = getBadgeTip;

console.log('[AquaQuest] Gamification loaded');