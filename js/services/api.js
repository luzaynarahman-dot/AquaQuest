/* ============================================================ */
/* AQUAQUEST — MOCK API SERVICE LAYER                            */
/* Simulates backend latency + response structure                */
/* UI talks ONLY to this — never to localStorage directly        */
/* ============================================================ */

const API = {

  /* ────────────────────────────────────────────── */
  /* Config                                         */
  /* ────────────────────────────────────────────── */
  LATENCY: {
    fast:   150,
    normal: 350,
    slow:   600,
    auth:   800
  },

  _delay(ms) {
    return new Promise(r => setTimeout(r, ms));
  },

  _respond(data, latency = 'normal') {
    return this._delay(this.LATENCY[latency]).then(() => ({
      success: true,
      data,
      timestamp: Date.now()
    }));
  },

  _error(message, latency = 'normal') {
    return this._delay(this.LATENCY[latency]).then(() => ({
      success: false,
      error: message,
      timestamp: Date.now()
    }));
  },

  /* ────────────────────────────────────────────── */
  /* AUTH                                           */
  /* ────────────────────────────────────────────── */

  async login(email, password) {
    await this._delay(this.LATENCY.auth);

    // Demo account check
    if (email === 'demo@aquaquest.app' && password === 'demo1234') {
      return {
        success: true,
        data: { token: 'demo_' + Date.now(), isDemo: true },
        message: 'Welcome back, Luzayna'
      };
    }

    // Real user check
    const users = Storage.get('aq_users', []);
    const user = users.find(u => u.email === email);

    if (!user) {
      return { success: false, error: 'No account with this email' };
    }
    if (user.password !== password) {
      return { success: false, error: 'Incorrect password' };
    }

    return {
      success: true,
      data: {
        token: 'auth_' + Date.now() + '_' + user.id,
        userId: user.id
      },
      message: 'Welcome back'
    };
  },

  async signup(email, password, name) {
    await this._delay(this.LATENCY.auth);

    const users = Storage.get('aq_users', []);

    if (users.find(u => u.email === email)) {
      return { success: false, error: 'Email already registered' };
    }

    const newUser = {
      id: 'user_' + Date.now(),
      email,
      password, // ⚠️ prototype only — never do this in production
      name: name || email.split('@')[0],
      avatar: null,
      location: '',
      bio: '',
      joinedAt: new Date().toISOString(),
      isDemo: false
    };

    users.push(newUser);
    Storage.set('aq_users', users);

    return {
      success: true,
      data: {
        token: 'auth_' + Date.now() + '_' + newUser.id,
        userId: newUser.id
      },
      message: 'Account created'
    };
  },

  async getCurrentUser(userId) {
    await this._delay(this.LATENCY.fast);

    // Demo user
    if (userId === 'user_demo' && window.DEMO_DATA) {
      return { success: true, data: window.DEMO_DATA.user };
    }

    // Real user
    const users = Storage.get('aq_users', []);
    const user = users.find(u => u.id === userId);

    if (!user) return { success: false, error: 'User not found' };

    // Strip password
    const { password, ...safeUser } = user;
    return { success: true, data: safeUser };
  },

  async updateProfile(userId, updates) {
    await this._delay(this.LATENCY.normal);

    const users = Storage.get('aq_users', []);
    const idx = users.findIndex(u => u.id === userId);

    if (idx === -1) return { success: false, error: 'User not found' };

    users[idx] = { ...users[idx], ...updates };
    Storage.set('aq_users', users);

    const { password, ...safeUser } = users[idx];
    return { success: true, data: safeUser };
  },

  /* ────────────────────────────────────────────── */
  /* SITES                                          */
  /* ────────────────────────────────────────────── */

  async getSites() {
    await this._delay(this.LATENCY.normal);
    return { success: true, data: Storage.get('aq_sites', []) };
  },

  async getSite(siteId) {
    await this._delay(this.LATENCY.fast);
    const sites = Storage.get('aq_sites', []);
    const site = sites.find(s => s.id === siteId);
    return site
      ? { success: true, data: site }
      : { success: false, error: 'Site not found' };
  },

  /* ────────────────────────────────────────────── */
  /* OBSERVATIONS                                   */
  /* ────────────────────────────────────────────── */

  async getObservations(filters = {}) {
    await this._delay(this.LATENCY.normal);

    let observations = Storage.get('aq_observations', []);

    if (filters.siteId) {
      observations = observations.filter(o => o.siteId === filters.siteId);
    }
    if (filters.reporterId) {
      observations = observations.filter(o => o.reporterId === filters.reporterId);
    }

    return { success: true, data: observations };
  },

  async submitObservation(data) {
    await this._delay(this.LATENCY.slow);

    const observation = {
      id: 'obs_' + Date.now(),
      ...data,
      createdAt: new Date().toISOString(),
      syncStatus: 'synced'
    };

    const observations = Storage.get('aq_observations', []);
    observations.unshift(observation);
    Storage.set('aq_observations', observations);

    return {
      success: true,
      data: observation,
      message: 'Observation saved to community record'
    };
  },

  /* ────────────────────────────────────────────── */
  /* CONTRIBUTIONS                                  */
  /* ────────────────────────────────────────────── */

  async getContributions(filters = {}) {
    await this._delay(this.LATENCY.normal);
    let contributions = Storage.get('aq_contributions', []);

    if (filters.challengeId) {
      contributions = contributions.filter(c => c.challengeId === filters.challengeId);
    }
    if (filters.contributorId) {
      contributions = contributions.filter(c => c.contributorId === filters.contributorId);
    }

    return { success: true, data: contributions };
  },

  async submitContribution(data) {
    await this._delay(this.LATENCY.slow);

    const contribution = {
      id: 'AQ-' + String(1000 + Date.now() % 9000),
      ...data,
      submittedAt: new Date().toISOString(),
      syncStatus: 'synced',
      verified: false
    };

    const contributions = Storage.get('aq_contributions', []);
    contributions.unshift(contribution);
    Storage.set('aq_contributions', contributions);

    return {
      success: true,
      data: contribution,
      message: 'Contribution added to community record'
    };
  },

  /* ────────────────────────────────────────────── */
  /* CHALLENGES                                     */
  /* ────────────────────────────────────────────── */

  async getChallenges() {
    await this._delay(this.LATENCY.normal);
    return { success: true, data: window.CHALLENGES || [] };
  },

  async joinChallenge(challengeId, userId) {
    await this._delay(this.LATENCY.normal);

    const joined = Storage.get('aq_joinedActions', []);
    if (joined.includes(challengeId)) {
      return { success: false, error: 'Already joined' };
    }

    joined.push(challengeId);
    Storage.set('aq_joinedActions', joined);

    return {
      success: true,
      data: { challengeId, joinedAt: new Date().toISOString() },
      message: 'Joined challenge'
    };
  },

  async leaveChallenge(challengeId) {
    await this._delay(this.LATENCY.fast);

    const joined = Storage.get('aq_joinedActions', []);
    const filtered = joined.filter(id => id !== challengeId);
    Storage.set('aq_joinedActions', filtered);

    return { success: true, message: 'Left challenge' };
  },

  /* ────────────────────────────────────────────── */
  /* REPORTS                                        */
  /* ────────────────────────────────────────────── */

  async submitReport(data) {
    await this._delay(this.LATENCY.slow);

    const report = {
      id: 'rep_' + Date.now(),
      ...data,
      createdAt: new Date().toISOString(),
      status: 'reported',
      confirmations: [],
      timeline: [
        { stage: 'reported', label: 'Report Submitted', time: new Date().toISOString() }
      ]
    };

    const reports = Storage.get('aq_reports', []);
    reports.unshift(report);
    Storage.set('aq_reports', reports);

    return {
      success: true,
      data: report,
      message: 'Report submitted for review'
    };
  },

  async confirmReport(reportId, userName) {
    await this._delay(this.LATENCY.fast);

    const reports = Storage.get('aq_reports', []);
    const report = reports.find(r => r.id === reportId);
    if (!report) return { success: false, error: 'Report not found' };

    report.confirmations = report.confirmations || [];
    if (!report.confirmations.includes(userName)) {
      report.confirmations.push(userName);
    }

    if (report.confirmations.length >= 3 && report.status === 'reported') {
      report.status = 'community';
    }

    Storage.set('aq_reports', reports);
    return { success: true, data: report };
  },

  /* ────────────────────────────────────────────── */
  /* DASHBOARD (aggregated)                         */
  /* ────────────────────────────────────────────── */

  async getDashboard(userId) {
    await this._delay(this.LATENCY.normal);

    const observations = Storage.get('aq_observations', []);
    const reports = Storage.get('aq_reports', []);
    const contributions = Storage.get('aq_contributions', []);

    return {
      success: true,
      data: {
        myObservations: observations.filter(o => o.reporterId === userId),
        myReports: reports.filter(r => r.reporterId === userId),
        myContributions: contributions.filter(c => c.contributorId === userId),
        nearbySites: Storage.get('aq_sites', []).slice(0, 4)
      }
    };
  }
};

window.API = API;
console.log('[AquaQuest] Mock API service loaded');