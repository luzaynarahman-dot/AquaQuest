/* ============================================================ */
/* AQUAQUEST — MY IMPACT (PROFILE)                               */
/* Complete · Fresh · No duplicate headings · Real empty states  */
/* ============================================================ */

let profileState = {
  pickedAvatar: null,
  pickedCover: null
};

/* ============================================================ */
/* 1. MAIN RENDER                                                */
/* ============================================================ */
function renderProfile() {
  const page = document.getElementById('page-profile');
  if (!page) return;

  /* ---------- Guest State ---------- */
  if (!isLoggedIn()) {
    page.innerHTML = renderGuestProfile();
    return;
  }

  const user = APP.user || {};
  if (user.bio === undefined) user.bio = '';

  const myObs = Observations.getMine();
  const myReports = (APP.reports || []).filter(r =>
    r.reporterId === 'user_self' ||
    r.reporterId === 'user_demo' ||
    r.reporterId === user.id
  );
  const myStories = (APP.stories || []).filter(s =>
    s.authorId === 'user_self' ||
    s.authorId === user.id ||
    s.authorName === user.name
  ).sort((a, b) => new Date(b.date) - new Date(a.date));

  const joinedActions = (APP.joinedActions || []).length;
  const completedActions = (APP.completedActions || []).length;
  const uniqueSites = new Set(myObs.map(o => o.siteId)).size;

  /* ---------- Real follower/following counts ---------- */
  const myId = user.id || 'user_self';
  const realFollowersCount = (typeof Social !== 'undefined' && Social.getTotalFollowers)
    ? Social.getTotalFollowers(myId)
    : (user.followers || 0);
  const realFollowingCount = (typeof Social !== 'undefined' && Social.getFollowingCount)
    ? Social.getFollowingCount(myId)
    : (user.following || 0);

  const badges = Gamification.getBadges();
  const points = Gamification.getPoints();
  const levelData = Gamification.getLevelData();
  const nextLevel = Gamification.getNextLevel();
  const progress = Gamification.getProgressToNext();
  const streak = Gamification.getStreak();

  const initial = (user.name || 'U').charAt(0).toUpperCase();

  page.innerHTML = `
    <div class="page-container my-profile-page">

      ${renderProfileHero(user, initial, levelData, uniqueSites, myObs.length, realFollowersCount, realFollowingCount)}

      ${renderGettingStartedChecklist(myObs.length, myStories.length, myReports.length, joinedActions, badges.length)}

      ${renderImpactSection(points, streak, badges.length, myReports.length, completedActions, joinedActions, levelData, nextLevel, progress)}

      ${renderMyWatersSection(myObs)}

      ${renderMyPostsSection(myStories)}

      ${renderBadgesSection(badges)}

      ${renderRecentObservationsSection(myObs)}

      ${renderQuickLinks()}

      ${renderSettingsSection()}

    </div>
  `;
}

/* ============================================================ */
/* 2. PROFILE HERO                                               */
/* ============================================================ */
function renderProfileHero(user, initial, levelData, uniqueSites, obsCount, followersCount, followingCount) {
  return `
    <section class="mp-hero-card">
      <div class="mp-cover">
        ${user.coverPhoto
          ? `<img src="${user.coverPhoto}" alt="" class="mp-cover-img" onerror="this.style.display='none'">`
          : `<div class="mp-cover-empty"><i class="fas fa-water"></i><span>Tap to add cover</span></div>`
        }
        <button type="button" class="mp-cover-edit" onclick="openCoverPicker()" aria-label="Change cover">
          <i class="fas fa-camera"></i>
        </button>
      </div>

      <div class="mp-identity">
        <button type="button" class="mp-avatar-btn" onclick="openAvatarPicker()">
          <div class="mp-avatar">
            ${user.avatar
              ? `<img src="${user.avatar}" alt="" onerror="this.style.opacity='0'">`
              : `<div class="mp-avatar-initial">${initial}</div>`
            }
          </div>
          <span class="mp-avatar-edit"><i class="fas fa-camera"></i></span>
        </button>

        <div class="mp-identity-info">
          <h2 class="mp-name">${escapeHtml(user.name || 'Explorer')}</h2>

          <div class="mp-role-chips-row">
            <span class="mp-role-chip chip-vet" style="background:${levelData.color}20; color:${levelData.color};">
              <i class="fas ${levelData.icon}"></i> ${levelData.name}
            </span>
          </div>

          ${user.location ? `
            <p class="mp-location">
              <i class="fas fa-map-marker-alt"></i> ${escapeHtml(user.location)}
            </p>
          ` : ''}

          ${user.bio ? `
            <p class="mp-tagline">"${escapeHtml(user.bio)}" <i class="far fa-heart"></i></p>
          ` : ''}
        </div>
      </div>

      <div class="mp-stats-row">
        <button type="button" class="mp-stat" onclick="scrollToProfileSites()">
          <p class="mp-stat-value">${uniqueSites}</p>
          <p class="mp-stat-label">Sites</p>
        </button>
        <button type="button" class="mp-stat" onclick="scrollToProfilePosts()">
          <p class="mp-stat-value">${obsCount}</p>
          <p class="mp-stat-label">Observations</p>
        </button>
        <button type="button" class="mp-stat" onclick="showMyFollowers()">
          <p class="mp-stat-value">${formatCount(followersCount)}</p>
          <p class="mp-stat-label">Followers</p>
        </button>
        <button type="button" class="mp-stat" onclick="showMyFollowing()">
          <p class="mp-stat-value">${formatCount(followingCount)}</p>
          <p class="mp-stat-label">Following</p>
        </button>
      </div>
    </section>
  `;
}

/* ============================================================ */
/* 3. GETTING STARTED CHECKLIST                                  */
/* ============================================================ */
function renderGettingStartedChecklist(obsCount, storyCount, reportCount, actionCount, badgeCount) {
  const steps = [
    { id: 'observe', label: 'Record your first observation', done: obsCount > 0,    action: 'quickActionObserve()',      icon: 'fa-eye' },
    { id: 'action',  label: 'Join a community action',       done: actionCount > 0, action: "showPage('actions')",       icon: 'fa-seedling' },
    { id: 'story',   label: 'Share a story',                 done: storyCount > 0,  action: 'openComposerFromProfile()', icon: 'fa-book-open' },
    { id: 'report',  label: 'Report a concern',              done: reportCount > 0, action: 'quickActionReport()',       icon: 'fa-flag' },
    { id: 'badge',   label: 'Earn your first badge',         done: badgeCount > 0,  action: 'scrollToProfileBadges()',   icon: 'fa-medal' }
  ];

  const completed = steps.filter(s => s.done).length;
  const total = steps.length;
  const percent = Math.round((completed / total) * 100);

  /* All done → hide checklist */
  if (completed === total) return '';

  return `
    <section class="mp-section-card mp-getting-started">
      <div class="mp-section-header">
        <h3><i class="fas fa-rocket"></i> Getting Started</h3>
        <span class="mp-count-badge" style="background:var(--pc-accent-soft); color:var(--pc-accent);">
          ${completed}/${total}
        </span>
      </div>

      <div class="mp-gs-progress">
        <div class="mp-gs-progress-fill" style="width:${percent}%;"></div>
      </div>

      <div class="mp-gs-list">
        ${steps.map(s => `
          <button type="button"
                  class="mp-gs-item ${s.done ? 'done' : ''}"
                  onclick="${s.done ? '' : s.action}"
                  ${s.done ? 'disabled' : ''}>
            <div class="mp-gs-icon">
              <i class="fas ${s.done ? 'fa-check' : s.icon}"></i>
            </div>
            <span class="mp-gs-label">${s.label}</span>
            ${!s.done ? '<i class="fas fa-chevron-right mp-gs-arrow"></i>' : ''}
          </button>
        `).join('')}
      </div>
    </section>
  `;
}

/* ============================================================ */
/* 4. IMPACT SECTION — NO DUPLICATE HEADING                      */
/* ============================================================ */
function renderImpactSection(points, streak, badgeCount, reportsCount, completedActions, joinedActions, levelData, nextLevel, progress) {
  return `
    <section class="mp-section-card mp-impact-card">
      <div class="mp-section-header">
        <h3><i class="fas fa-chart-line"></i> Your Impact</h3>
      </div>

      <div class="impact-level-row">
        <div class="impact-level-icon" style="background:${levelData.color}25; color:${levelData.color};">
          <i class="fas ${levelData.icon}"></i>
        </div>
        <div class="impact-level-info">
          <p class="impact-level-name">${levelData.name}</p>
          <p class="impact-level-points">${points} points</p>
        </div>
        ${nextLevel ? `
          <div class="impact-next">
            <p class="impact-next-label">NEXT</p>
            <p class="impact-next-value">${nextLevel.minPoints - points} pts</p>
          </div>
        ` : `
          <div class="impact-next">
            <p class="impact-next-label">MAX</p>
            <p class="impact-next-value">🎉</p>
          </div>
        `}
      </div>

      ${nextLevel ? `
        <div class="impact-progress-bar">
          <div class="impact-progress-fill" style="width:${progress}%; background:${levelData.color};"></div>
        </div>
        <div class="impact-progress-labels">
          <span>${levelData.name}</span>
          <span>${nextLevel.name}</span>
        </div>
      ` : ''}

      <div class="impact-stat-row">
        <div class="impact-stat">
          <p class="impact-stat-value">${streak}</p>
          <p class="impact-stat-label">Day Streak 🔥</p>
        </div>
        <div class="impact-stat">
          <p class="impact-stat-value">${badgeCount}</p>
          <p class="impact-stat-label">Badges</p>
        </div>
        <div class="impact-stat">
          <p class="impact-stat-value">${reportsCount}</p>
          <p class="impact-stat-label">Reports</p>
        </div>
        <div class="impact-stat">
          <p class="impact-stat-value">${completedActions}/${joinedActions}</p>
          <p class="impact-stat-label">Actions</p>
        </div>
      </div>
    </section>
  `;
}

/* ============================================================ */
/* 5. MY WATERS                                                  */
/* ============================================================ */
function renderMyWatersSection(myObs) {
  return `
    <section class="mp-section-card" id="mpProfileSites">
      <div class="mp-section-header">
        <h3><i class="fas fa-water"></i> My Waters</h3>
        <button type="button" class="mp-see-all" onclick="showPage('sites')">
          See all <i class="fas fa-arrow-right"></i>
        </button>
      </div>
      ${renderProfileSites(myObs)}
    </section>
  `;
}

function renderProfileSites(myObs) {
  /* ⭐ My Waters = user's MONITORED sites (not observed) */
  const monitoredSites = typeof Monitoring !== 'undefined'
    ? Monitoring.getMonitoredSites()
    : [];

  if (!monitoredSites.length) {
    return `
      <div class="mp-empty-block">
        <div class="mp-empty-icon">
          <i class="fas fa-eye"></i>
        </div>
        <p class="mp-empty-title">You're not monitoring any waters yet</p>
        <p class="mp-empty-sub">
          Monitor a waterbody to keep track of its health and changes over time.
        </p>
        <button type="button" class="btn btn-primary btn-sm" onclick="showPage('sites')">
          <i class="fas fa-compass"></i> Explore Waters
        </button>
      </div>
    `;
  }

  return `
    <div class="mp-pets-scroll">
      ${monitoredSites.map(site => {
        if (!site) return '';

        const count = (APP.observations || []).filter(o => o.siteId === site.id).length;
        const stats = Observations.getSiteStats(site.id);

        return `
          <div class="mp-pet-card" onclick="openSiteDetail('${site.id}')">
            <div class="mp-pet-image">
              <img src="${site.cover}" alt="${escapeHtml(site.name)}" onerror="this.style.opacity='0'">
            </div>
            <div class="mp-pet-info">
              <div class="mp-pet-name-row">
                <span class="mp-pet-name">${escapeHtml(site.name)}</span>
              </div>
              <p class="mp-pet-breed">${count} observation${count > 1 ? 's' : ''}</p>
              <div class="mp-pet-tags">
                <span class="mp-pet-tag mp-pet-tag-healthy">
                  <i class="fas fa-heart-pulse"></i> ${capitalize(stats.health.grade)}
                </span>
              </div>
            </div>
          </div>
        `;
      }).join('')}
    </div>
  `;
}

/* ============================================================ */
/* 6. MY POSTS                                                   */
/* ============================================================ */
function renderMyPostsSection(myStories) {
  return `
    <section class="mp-section-card" id="mpMyPostsSection">
      <div class="mp-section-header">
        <h3><i class="fas fa-book-open"></i> My Posts</h3>
        <button type="button" class="mp-see-all" onclick="openComposerFromProfile()">
          <i class="fas fa-plus"></i> New Post
        </button>
      </div>
      ${renderMyStories(myStories)}
    </section>
  `;
}

function renderMyStories(stories) {
  if (!stories.length) {
    return `
      <div class="mp-empty-block">
        <div class="mp-empty-icon">
          <i class="fas fa-book-open"></i>
        </div>
        <p class="mp-empty-title">No posts yet</p>
        <p class="mp-empty-sub">
          Share an observation, tip, or story with the community
        </p>
        <button type="button" class="btn btn-primary btn-sm" onclick="openComposerFromProfile()">
          <i class="fas fa-plus"></i> Share Your First Story
        </button>
      </div>
    `;
  }

  return `
    <div class="mp-my-posts-feed">
      ${stories.map(s => renderMyStoryCard(s)).join('')}
    </div>
  `;
}

function renderMyStoryCard(story) {
  const typeBadge = (typeof getStoryTypeBadge === 'function')
    ? getStoryTypeBadge(story.type)
    : { icon: 'fa-circle', label: 'Post', color: 'var(--pc-accent)' };

  return `
    <article class="mp-my-post-card" onclick="openStoryDetail('${story.id}')">
      ${story.image ? `
        <div class="mp-my-post-image">
          <img src="${story.image}" alt="" onerror="this.style.opacity='0'">
        </div>
      ` : `
        <div class="mp-my-post-noimage">
          <i class="fas ${typeBadge.icon}"></i>
        </div>
      `}

      <div class="mp-my-post-body">
        <span class="mp-my-post-type" style="background:${typeBadge.color}15; color:${typeBadge.color};">
          <i class="fas ${typeBadge.icon}"></i> ${typeBadge.label}
        </span>

        ${story.title ? `<p class="mp-my-post-title">${escapeHtml(story.title)}</p>` : ''}
        <p class="mp-my-post-text">${escapeHtml((story.content || '').substring(0, 100))}${(story.content || '').length > 100 ? '…' : ''}</p>

        <div class="mp-my-post-footer">
          <span><i class="fas fa-heart"></i> ${story.likes || 0}</span>
          <span><i class="fas fa-comment"></i> ${(story.comments || []).length}</span>
          <span class="mp-my-post-time">${timeAgo(story.date)}</span>
        </div>
      </div>
    </article>
  `;
}

/* ============================================================ */
/* 7. BADGES                                                     */
/* ============================================================ */
function renderBadgesSection(badges) {
  return `
    <section class="mp-section-card" id="mpProfileBadges">
      <div class="mp-section-header">
        <h3><i class="fas fa-medal"></i> Badges</h3>
        <span class="mp-count-badge">${badges.length}/${Object.keys(BADGES).length}</span>
      </div>
      <div class="badge-grid">
        ${Gamification.renderBadgeGrid()}
      </div>
    </section>
  `;
}

/* ============================================================ */
/* 8. RECENT OBSERVATIONS                                        */
/* ============================================================ */
function renderRecentObservationsSection(myObs) {
  return `
    <section class="mp-section-card" id="mpProfileObs">
      <div class="mp-section-header">
        <h3><i class="fas fa-eye"></i> Recent Observations</h3>
        <button type="button" class="mp-see-all" onclick="quickActionObserve()">
          <i class="fas fa-plus"></i> New
        </button>
      </div>
      ${myObs.length ? `
        <div class="obs-feed">
          ${myObs.slice(0, 3).map(o => renderObservationCard(o)).join('')}
        </div>
      ` : `
        <div class="mp-empty-block">
          <div class="mp-empty-icon">
            <i class="fas fa-eye"></i>
          </div>
          <p class="mp-empty-title">No observations yet</p>
          <p class="mp-empty-sub">
            Start logging your local waterbodies to track their health over time
          </p>
          <button type="button" class="btn btn-primary btn-sm" onclick="quickActionObserve()">
            <i class="fas fa-plus"></i> Record First Observation
          </button>
        </div>
      `}
    </section>
  `;
}

/* ============================================================ */
/* 9. QUICK LINKS                                                */
/* ============================================================ */
function renderQuickLinks() {
  return `
    <section class="mp-quick-links">
      <button type="button" class="mp-quick-link" onclick="showPage('reports')">
        <div class="mp-quick-icon icon-pink"><i class="fas fa-flag"></i></div>
        <span>My Reports</span>
      </button>
      <button type="button" class="mp-quick-link" onclick="showPage('actions')">
        <div class="mp-quick-icon icon-yellow"><i class="fas fa-seedling"></i></div>
        <span>Actions</span>
      </button>
      <button type="button" class="mp-quick-link" onclick="showPage('saved')">
        <div class="mp-quick-icon icon-green"><i class="fas fa-bookmark"></i></div>
        <span>Saved</span>
      </button>
      <button type="button" class="mp-quick-link" onclick="showPage('learn')">
        <div class="mp-quick-icon icon-blue"><i class="fas fa-graduation-cap"></i></div>
        <span>Learn</span>
      </button>
    </section>
  `;
}

/* ============================================================ */
/* 10. SETTINGS                                                  */
/* ============================================================ */
function renderSettingsSection() {
  return `
    <section class="mp-section-card">
      <div class="mp-section-header">
        <h3><i class="fas fa-cog"></i> Settings</h3>
      </div>
      <div class="mp-settings-list">
        <button type="button" class="mp-setting-row" onclick="toggleDarkModeSetting()">
          <div class="mp-setting-icon icon-moon"><i class="fas fa-moon"></i></div>
          <div class="mp-setting-info">
            <p class="mp-setting-label">Dark Mode</p>
            <p class="mp-setting-sub">${document.body.classList.contains('dark-mode') ? 'On' : 'Off'}</p>
          </div>
          <div class="mp-toggle ${document.body.classList.contains('dark-mode') ? 'on' : ''}"><div class="mp-toggle-knob"></div></div>
        </button>
        <button type="button" class="mp-setting-row" onclick="openEditProfileModal()">
          <div class="mp-setting-icon icon-info"><i class="fas fa-user-pen"></i></div>
          <div class="mp-setting-info">
            <p class="mp-setting-label">Edit Profile</p>
            <p class="mp-setting-sub">Name, bio, location</p>
          </div>
          <i class="fas fa-chevron-right mp-setting-arrow"></i>
        </button>
        <button type="button" class="mp-setting-row" onclick="openAboutModal()">
          <div class="mp-setting-icon icon-info"><i class="fas fa-info-circle"></i></div>
          <div class="mp-setting-info">
            <p class="mp-setting-label">About AquaQuest</p>
            <p class="mp-setting-sub">Version 1.0.0</p>
          </div>
          <i class="fas fa-chevron-right mp-setting-arrow"></i>
        </button>
        <button type="button" class="mp-setting-row mp-setting-danger" onclick="handleLogoutConfirm()">
          <div class="mp-setting-icon icon-danger"><i class="fas fa-sign-out-alt"></i></div>
          <div class="mp-setting-info">
            <p class="mp-setting-label">Sign Out</p>
            <p class="mp-setting-sub">Logout from this device</p>
          </div>
          <i class="fas fa-chevron-right mp-setting-arrow"></i>
        </button>
      </div>
    </section>
  `;
}

/* ============================================================ */
/* 11. GUEST STATE                                               */
/* ============================================================ */
function renderGuestProfile() {
  return `
    <div class="page-container my-profile-page">
      <section class="mp-guest-card">
        <div class="mp-guest-icon">
          <i class="fas fa-water"></i>
        </div>
        <h2 class="mp-guest-title">Join AquaQuest</h2>
        <p class="mp-guest-sub">
          Sign in to track your water sites, contributions, and impact.
        </p>
        <button type="button" class="mp-guest-cta" onclick="openLoginFromProfile()">
          <i class="fas fa-sign-in-alt"></i> Sign In / Register
        </button>
        <button type="button" class="mp-guest-explore" onclick="showPage('home')">
          <i class="fas fa-compass"></i> Explore as Guest
        </button>
      </section>

      <section class="mp-guest-features">
        <div class="mp-guest-feature">
          <div class="mp-guest-feature-icon icon-green"><i class="fas fa-water"></i></div>
          <p>Track Waters</p>
        </div>
        <div class="mp-guest-feature">
          <div class="mp-guest-feature-icon icon-blue"><i class="fas fa-eye"></i></div>
          <p>Log Observations</p>
        </div>
        <div class="mp-guest-feature">
          <div class="mp-guest-feature-icon icon-peach"><i class="fas fa-medal"></i></div>
          <p>Earn Badges</p>
        </div>
        <div class="mp-guest-feature">
          <div class="mp-guest-feature-icon icon-purple"><i class="fas fa-seedling"></i></div>
          <p>Join Actions</p>
        </div>
      </section>
    </div>
  `;
}

function openLoginFromProfile() {
  openModal('loginModal');
  if (typeof renderLoginModal === 'function') renderLoginModal();
}

/* ============================================================ */
/* 12. COMPOSER FROM PROFILE                                     */
/* ============================================================ */
function openComposerFromProfile() {
  if (typeof openStoryComposer === 'function') {
    openStoryComposer();
  } else {
    showToast('Composer unavailable');
  }
}

/* ============================================================ */
/* 13. EDIT PROFILE                                              */
/* ============================================================ */
function openEditProfileModal() {
  const modal = document.getElementById('editProfileModal');
  if (!modal) return;

  const user = APP.user || {};

  modal.querySelector('.modal-content').innerHTML = `
    <button type="button" class="close-modal" onclick="closeModal('editProfileModal')">
      <i class="fas fa-times"></i>
    </button>
    <h2 class="modal-title"><i class="fas fa-user-pen"></i> Edit Profile</h2>

    <form onsubmit="handleEditProfileSubmit(event)">
      <label>Full Name</label>
      <input type="text" id="editName" value="${escapeHtml(user.name || '')}" required>

      <label>Location</label>
      <input type="text" id="editLocation" value="${escapeHtml(user.location || '')}" placeholder="City, Country">

      <label>Bio</label>
      <textarea id="editBio" rows="3" maxlength="150" placeholder="Short bio...">${escapeHtml(user.bio || '')}</textarea>

      <button type="submit" class="btn btn-primary w-full" style="margin-top:14px;">
        <i class="fas fa-check"></i> Save Changes
      </button>
    </form>
  `;

  openModal('editProfileModal');
}

function handleEditProfileSubmit(e) {
  e.preventDefault();
  const name = document.getElementById('editName').value.trim();
  const location = document.getElementById('editLocation').value.trim();
  const bio = document.getElementById('editBio').value.trim();

  if (!name) {
    showToast('Name is required');
    return;
  }

  APP.user.name = name;
  APP.user.location = location;
  APP.user.bio = bio;
  localStorage.setItem(APP.KEYS.USER, JSON.stringify(APP.user));

  closeModal('editProfileModal');
  showToast('Profile updated');
  renderProfile();
  if (typeof refreshDrawer === 'function') refreshDrawer();
}

/* ============================================================ */
/* 14. AVATAR PICKER                                             */
/* ============================================================ */
function openAvatarPicker() {
  const modal = document.getElementById('quickViewModal');
  if (!modal) return;

  const avatarOptions = [
    'assets/avatar1.jpg',
    'assets/avatar2.jpg',
    'assets/avatar3.jpg',
    'assets/avatar4.jpg',
    'assets/avatar5.jpg',
    'assets/avatar6.jpg',
    'assets/avatar7.jpg'
  ];

  modal.querySelector('.modal-content').innerHTML = `
    <button type="button" class="close-modal" onclick="closeModal('quickViewModal')">
      <i class="fas fa-times"></i>
    </button>
    <h2 class="modal-title"><i class="fas fa-user-circle"></i> Change Avatar</h2>

    <label class="avatar-upload-zone" for="avatarUploadInput">
      <i class="fas fa-cloud-arrow-up"></i>
      <p>Upload from gallery</p>
      <span>JPG, PNG · max 5MB</span>
    </label>
    <input type="file" id="avatarUploadInput" accept="image/*" style="display:none;" onchange="handleAvatarUpload(event)">

    <p style="text-align:center; font-size:12px; color:var(--pc-text-muted); margin:18px 0 10px;">or choose from below</p>

    <div class="avatar-grid-picker">
      ${avatarOptions.map(a => `
        <button type="button" class="avatar-pick-item ${APP.user.avatar === a ? 'active' : ''}" onclick="pickAvatar('${a}')">
          <img src="${a}" alt="" onerror="this.parentElement.style.display='none'">
        </button>
      `).join('')}
    </div>

    ${APP.user.avatar ? `
      <button type="button" class="btn btn-outline w-full" style="margin-top:14px;" onclick="removeAvatar()">
        <i class="fas fa-trash"></i> Remove Current Photo
      </button>
    ` : ''}
  `;

  openModal('quickViewModal');
}

function pickAvatar(url) {
  APP.user.avatar = url;
  localStorage.setItem(APP.KEYS.USER, JSON.stringify(APP.user));
  closeModal('quickViewModal');
  showToast('Avatar updated');
  renderProfile();
  if (typeof refreshDrawer === 'function') refreshDrawer();
}

async function handleAvatarUpload(e) {
  const file = e.target.files?.[0];
  if (!file) return;

  if (file.size > 15 * 1024 * 1024) {
    showToast('Image too large (max 15MB)');
    return;
  }

  try {
    showToast('Processing...');
    const compressed = await compressImage(file, 400, 0.85);
    APP.user.avatar = compressed;
    localStorage.setItem(APP.KEYS.USER, JSON.stringify(APP.user));
    closeModal('quickViewModal');
    showToast('Avatar updated');
    renderProfile();
    if (typeof refreshDrawer === 'function') refreshDrawer();
  } catch (err) {
    console.error('[Avatar] Upload failed:', err);
    showToast('Could not process image');
  }
}

function removeAvatar() {
  if (!confirm('Remove profile photo?')) return;
  delete APP.user.avatar;
  localStorage.setItem(APP.KEYS.USER, JSON.stringify(APP.user));
  closeModal('quickViewModal');
  showToast('Photo removed');
  renderProfile();
  if (typeof refreshDrawer === 'function') refreshDrawer();
}

/* ============================================================ */
/* 15. COVER PICKER                                              */
/* ============================================================ */
function openCoverPicker() {
  const modal = document.getElementById('quickViewModal');
  if (!modal) return;

  const coverOptions = [
    { id: 'site-bakkhali', url: 'assets/site-bakkhali.jpg' },
    { id: 'site-rumaliar', url: 'assets/site-rumaliar.jpg' },
    { id: 'site-kolatoli', url: 'assets/site-kolatoli.jpg' },
    { id: 'site-himchari', url: 'assets/site-himchari.jpg' },
    { id: 'hero-feed', url: 'assets/hero-feed.jpg' },
    { id: 'hero-welcome', url: 'assets/hero-welcome.jpg' }
  ];

  modal.querySelector('.modal-content').innerHTML = `
    <button type="button" class="close-modal" onclick="closeModal('quickViewModal')">
      <i class="fas fa-times"></i>
    </button>
    <h2 class="modal-title"><i class="fas fa-image"></i> Change Cover</h2>

    <div class="cover-grid-picker">
      ${coverOptions.map(c => `
        <button type="button" class="cover-pick-item ${APP.user.coverPhoto === c.url ? 'active' : ''}" onclick="pickCover('${c.url}')">
          <img src="${c.url}" alt="" onerror="this.style.opacity='0'">
        </button>
      `).join('')}
    </div>

    <label class="avatar-upload-zone" for="coverUploadInput" style="margin-top:14px;">
      <i class="fas fa-cloud-arrow-up"></i>
      <p>Upload from gallery</p>
      <span>JPG, PNG · max 8MB</span>
    </label>
    <input type="file" id="coverUploadInput" accept="image/*" style="display:none;" onchange="handleCoverUpload(event)">

    ${APP.user.coverPhoto ? `
      <button type="button" class="btn btn-outline w-full" style="margin-top:14px;" onclick="removeCover()">
        <i class="fas fa-trash"></i> Remove Cover
      </button>
    ` : ''}
  `;

  openModal('quickViewModal');
}

function pickCover(url) {
  APP.user.coverPhoto = url;
  localStorage.setItem(APP.KEYS.USER, JSON.stringify(APP.user));
  closeModal('quickViewModal');
  showToast('Cover updated');
  renderProfile();
}

async function handleCoverUpload(e) {
  const file = e.target.files?.[0];
  if (!file) return;

  if (file.size > 15 * 1024 * 1024) {
    showToast('Image too large (max 15MB)');
    return;
  }

  try {
    showToast('Processing...');
    const compressed = await compressImage(file, 1200, 0.8);
    APP.user.coverPhoto = compressed;
    localStorage.setItem(APP.KEYS.USER, JSON.stringify(APP.user));
    closeModal('quickViewModal');
    showToast('Cover updated');
    renderProfile();
  } catch (err) {
    console.error('[Cover] Upload failed:', err);
    showToast('Could not process image');
  }
}

function removeCover() {
  if (!confirm('Remove cover photo?')) return;
  delete APP.user.coverPhoto;
  localStorage.setItem(APP.KEYS.USER, JSON.stringify(APP.user));
  closeModal('quickViewModal');
  showToast('Cover removed');
  renderProfile();
}

/* ============================================================ */
/* 16. SETTINGS                                                  */
/* ============================================================ */
function toggleDarkModeSetting() {
  const isDark = document.body.classList.contains('dark-mode');
  toggleTheme(!isDark);
  renderProfile();
}

function handleLogoutConfirm() {
  if (!isLoggedIn()) return;
  if (confirm('Sign out of AquaQuest?')) logout();
}

function scrollToProfileSites() {
  const el = document.getElementById('mpProfileSites');
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function scrollToProfilePosts() {
  const el = document.getElementById('mpMyPostsSection');
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function scrollToProfileBadges() {
  const el = document.getElementById('mpProfileBadges');
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/* ============================================================ */
/* 17. MY FOLLOWERS / FOLLOWING                                  */
/* ============================================================ */
function showMyFollowers() {
  if (typeof Social === 'undefined' || typeof ProfileView === 'undefined') return;
  const myId = APP.user?.id || 'user_self';
  ProfileView.state.userId = myId;
  ProfileView.showFollowers();
}

function showMyFollowing() {
  if (typeof Social === 'undefined' || typeof ProfileView === 'undefined') return;
  const myId = APP.user?.id || 'user_self';
  ProfileView.state.userId = myId;
  ProfileView.showFollowing();
}

/* ============================================================ */
/* 18. EXPORTS                                                   */
/* ============================================================ */
window.renderProfile = renderProfile;
window.renderMyStories = renderMyStories;
window.renderMyStoryCard = renderMyStoryCard;
window.openComposerFromProfile = openComposerFromProfile;
window.openEditProfileModal = openEditProfileModal;
window.handleEditProfileSubmit = handleEditProfileSubmit;
window.openAvatarPicker = openAvatarPicker;
window.pickAvatar = pickAvatar;
window.handleAvatarUpload = handleAvatarUpload;
window.removeAvatar = removeAvatar;
window.openCoverPicker = openCoverPicker;
window.pickCover = pickCover;
window.handleCoverUpload = handleCoverUpload;
window.removeCover = removeCover;
window.toggleDarkModeSetting = toggleDarkModeSetting;
window.handleLogoutConfirm = handleLogoutConfirm;
window.openLoginFromProfile = openLoginFromProfile;
window.scrollToProfileSites = scrollToProfileSites;
window.scrollToProfilePosts = scrollToProfilePosts;
window.scrollToProfileBadges = scrollToProfileBadges;
window.showMyFollowers = showMyFollowers;
window.showMyFollowing = showMyFollowing;

console.log('[AquaQuest] Profile loaded');