/* ============================================================ */
/* AQUAQUEST — CONTRIBUTIONS                                     */
/* Real activity records · Independent from challenges           */
/* ============================================================ */

const Contributions = {

  /* ============================================================ */
  /* 1. GET ALL                                                    */
  /* ============================================================ */
  getAll() {
    return APP.contributions || [];
  },

  /* ============================================================ */
  /* 2. GET BY ID                                                  */
  /* ============================================================ */
  getById(id) {
    return this.getAll().find(c => c.id === id) || null;
  },

  /* ============================================================ */
  /* 3. GET BY CHALLENGE                                           */
  /* ============================================================ */
  getByChallenge(challengeId) {
    if (!challengeId) return [];
    return this.getAll()
      .filter(c => c.challengeId === challengeId)
      .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
  },

  /* ============================================================ */
  /* 4. GET BY SITE                                                */
  /* ============================================================ */
  getBySite(siteId) {
    if (!siteId) return [];
    return this.getAll()
      .filter(c => c.siteId === siteId)
      .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
  },

  /* ============================================================ */
  /* 5. GET BY USER                                                */
  /* ============================================================ */
  getByUser(userId) {
    if (!userId) return [];
    const myId = userId === 'user_self' ? (APP.user?.id || 'user_self') : userId;
    return this.getAll()
      .filter(c => c.contributorId === userId || c.contributorId === myId)
      .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt));
  },

  /* ============================================================ */
  /* 6. GET MY CONTRIBUTIONS                                       */
  /* ============================================================ */
  getMine() {
    return this.getByUser('user_self');
  },

  /* ============================================================ */
  /* 7. GET RECENT (across all challenges)                         */
  /* ============================================================ */
  getRecent(limit = 5) {
    return this.getAll()
      .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
      .slice(0, limit);
  },

  /* ============================================================ */
  /* 8. COUNT                                                      */
  /* ============================================================ */
  countByChallenge(challengeId) {
    return this.getByChallenge(challengeId).length;
  },

  countBySite(siteId) {
    return this.getBySite(siteId).length;
  },

  countByUser(userId) {
    return this.getByUser(userId).length;
  },

  /* ============================================================ */
  /* 9. HAS USER CONTRIBUTED                                       */
  /* ============================================================ */
  hasUserContributed(challengeId, userId) {
    const myId = userId === 'user_self' ? (APP.user?.id || 'user_self') : userId;
    return this.getByChallenge(challengeId)
      .some(c => c.contributorId === myId || c.contributorId === userId);
  },

  /* ============================================================ */
  /* 10. CREATE                                                    */
  /* ============================================================ */
  create(data) {
    const user = APP.user || { id: 'user_self', name: 'Guest', avatar: null };
    const challenge = getChallengeById(data.challengeId);

    /* Generate contribution ID */
    const existingCount = this.getAll().length;
    const contribId = 'AQ-' + String(1000 + existingCount + 1).padStart(4, '0');

    const contribution = {
      id: contribId,

      /* References */
      challengeId: data.challengeId || null,
      challengeTitle: challenge ? challenge.title : null,
      contributorId: user.id || 'user_self',
      contributorName: user.name || 'Guest',
      contributorAvatar: user.avatar || null,
      siteId: data.siteId || (challenge ? challenge.siteId : null),

      /* Activity classification */
      activityType: data.activityType || (challenge ? challenge.activityType : 'observation'),
      evidenceType: data.evidenceType || (challenge ? challenge.evidenceType : 'observation'),

      /* Evidence — varies by type */
      beforePhoto: data.beforePhoto || null,
      afterPhoto: data.afterPhoto || null,
      photo: data.photo || null,
      activityNote: data.activityNote || data.note || '',
      activitySelections: data.activitySelections || [],
      quantity: data.quantity || null,

      /* Observation data (for observation/wildlife types) */
      observationData: data.observationData || null,
      wildlifeData: data.wildlifeData || null,

      /* Metadata */
      submittedAt: new Date().toISOString(),
      location: data.location || this._buildLocation(challenge),
      verified: false
    };

    /* Save */
    APP.contributions = APP.contributions || [];
    APP.contributions.unshift(contribution);
    Storage.set(APP.KEYS.CONTRIBUTIONS, APP.contributions);

    /* Award points (secondary) */
    if (typeof Gamification !== 'undefined' && Gamification.award) {
      const points = challenge ? (challenge.points || 30) : 30;
      Gamification.award(points, 'Contribution submitted');
    }

    /* Check badge */
    this._checkBadges(contribution);

    /* Add notification */
    if (typeof addNotification === 'function') {
      const site = typeof getSiteById === 'function' ? getSiteById(contribution.siteId) : null;
      addNotification(
        'observation',
        '📸 Contribution Recorded',
        `Your evidence for "${challenge ? challenge.title : 'activity'}" has been added to the community record.`
      );
    }

    return contribution;
  },

  _buildLocation(challenge) {
    const site = challenge && challenge.siteId
      ? (typeof getSiteById === 'function' ? getSiteById(challenge.siteId) : null)
      : null;

    return {
      auto: true,
      name: site ? site.name : (challenge ? challenge.location : 'Unknown'),
      area: site ? site.location.area : null,
      lat: site ? site.location.lat : null,
      lng: site ? site.location.lng : null
    };
  },

  _checkBadges(contribution) {
    if (typeof Gamification === 'undefined' || !Gamification.checkBadge) return;

    const challenge = getChallengeById(contribution.challengeId);
    if (!challenge) return;

    /* Badge per activity type */
    if (challenge.activityType === 'cleanup') {
      const cleanupCount = this.getAll()
        .filter(c => c.activityType === 'cleanup' && c.contributorId === contribution.contributorId)
        .length;
      if (cleanupCount >= 1) Gamification.checkBadge('steward');
      if (challenge.id === 'chal_kolatoli_marine') Gamification.checkBadge('marine_guardian');
    }

    if (challenge.activityType === 'restoration') {
      Gamification.checkBadge('restorer');
    }

    if (challenge.activityType === 'wildlife') {
      Gamification.checkBadge('naturalist');
    }

    if (challenge.activityType === 'observation') {
      Gamification.checkBadge('first_observation');
    }
  },

  /* ============================================================ */
  /* 11. HELPERS                                                   */
  /* ============================================================ */
  getProgress(challengeId) {
    const challenge = getChallengeById(challengeId);
    if (!challenge) return { current: 0, target: 1, percent: 0 };

    const current = this.countByChallenge(challengeId);
    const target = challenge.goal || 50;

    return {
      current,
      target,
      percent: Math.min(100, Math.round((current / target) * 100))
    };
  },

  getSummaryForSite(siteId) {
    const contributions = this.getBySite(siteId);
    return {
      total: contributions.length,
      byActivity: {
        cleanup: contributions.filter(c => c.activityType === 'cleanup').length,
        restoration: contributions.filter(c => c.activityType === 'restoration').length,
        observation: contributions.filter(c => c.activityType === 'observation').length,
        wildlife: contributions.filter(c => c.activityType === 'wildlife').length
      },
      photos: contributions.filter(c =>
        c.beforePhoto || c.afterPhoto || c.photo
      ).length
    };
  },

  /* ============================================================ */
  /* 12. FORMAT HELPERS                                            */
  /* ============================================================ */
  formatLocation(contribution) {
    if (!contribution || !contribution.location) return 'Unknown location';
    return contribution.location.name || 'Unknown';
  },

  formatDateTime(contribution) {
    if (!contribution || !contribution.submittedAt) return '';
    const d = new Date(contribution.submittedAt);
    if (isNaN(d)) return '';

    const dateStr = d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
    const timeStr = d.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit'
    });

    return `${dateStr} · ${timeStr}`;
  },

  formatRelativeTime(contribution) {
    if (!contribution || !contribution.submittedAt) return '';
    return typeof timeAgo === 'function' ? timeAgo(contribution.submittedAt) : '';
  }
};

window.Contributions = Contributions;
console.log('[AquaQuest] Contributions system loaded');
