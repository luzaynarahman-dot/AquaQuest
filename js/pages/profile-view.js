/* ============================================================ */
/* AQUAQUEST — PUBLIC PROFILE VIEW                               */
/* Full page profile for any user (expert or regular)            */
/* With follow system · Real stats · Tabs                        */
/* ============================================================ */

const ProfileView = {
  state: {
    userId: null,
    activeTab: 'posts'
  },

  /* ============================================================ */
  /* OPEN                                                          */
  /* ============================================================ */
  open(userId) {
    if (!userId) {
      showToast('User not found');
      return;
    }

    if (userId === 'user_self') {
      showPage('profile');
      return;
    }

    const user = Social.getUser(userId);
    if (!user) {
      showToast('Profile not available');
      return;
    }

    this.state.userId = userId;
    this.state.activeTab = 'posts';

    showPage('user-profile');
    this.render();
  },

  close() {
    this.state.userId = null;
    showPage('feed');
  },

  /* ============================================================ */
  /* MAIN RENDER                                                   */
  /* ============================================================ */
  render() {
    const page = document.getElementById('page-user-profile');
    if (!page) return;

    const userId = this.state.userId;
    const user = Social.getUser(userId);
    if (!user) return;

    const isSelf = user.isSelf || userId === (APP.user && APP.user.id);

    if (isSelf) {
      showPage('profile');
      return;
    }

    const posts = this.getUserPosts(userId);
    const followersCount = Social.getTotalFollowers(userId);
    const followingCount = Social.getFollowingCount(userId);
    const isFollowing = Social.isFollowing(userId);

    page.innerHTML = `
      <div class="page-container user-profile-page">

        ${this.renderHeroCard(user, isSelf, isFollowing, posts.length, followersCount, followingCount)}
        ${this.renderTabs()}
        <div id="profileTabContent" class="prof-tab-content">
          ${this.renderTabContent(user, posts)}
        </div>

      </div>
    `;

    this.attachHandlers();
  },

  /* ============================================================ */
  /* HERO CARD                                                     */
  /* ============================================================ */
  renderHeroCard(user, isSelf, isFollowing, postsCount, followersCount, followingCount) {
    const coverGradient = user.coverPhoto
      ? `background-image: url('${user.coverPhoto}'); background-size: cover; background-position: center;`
      : 'background: linear-gradient(135deg, #0E3A4C, #0891B2);';

    return `
      <section class="prof-hero-card">
        <div class="prof-cover" style="${coverGradient}">
          <button class="prof-back-btn" onclick="ProfileView.close()" aria-label="Back">
            <i class="fas fa-arrow-left"></i>
          </button>
        </div>

        <div class="prof-identity">
          <div class="prof-avatar-wrap">
            <div class="prof-avatar">
              ${user.avatar
                ? `<img src="${user.avatar}" alt="${escapeHtml(user.name)}" onerror="this.style.display='none'; this.parentElement.innerHTML='<div class=\\'prof-avatar-initial\\'>${user.name.charAt(0).toUpperCase()}</div>'">`
                : `<div class="prof-avatar-initial">${user.name.charAt(0).toUpperCase()}</div>`
              }
            </div>
            ${user.verified ? `
              <span class="prof-verified-chip">
                <i class="fas fa-circle-check"></i> Verified
              </span>
            ` : ''}
          </div>

          <div class="prof-identity-info">
            <h2 class="prof-name">
              ${escapeHtml(user.name)}
              ${user.verified ? '<i class="fas fa-circle-check prof-name-tick"></i>' : ''}
            </h2>

            <div class="prof-role-chips">
              ${this.renderRoleChip(user)}
            </div>

            ${user.location ? `
              <div class="prof-meta-row">
                <span class="prof-meta-item">
                  <i class="fas fa-map-marker-alt"></i> ${escapeHtml(user.location)}
                </span>
              </div>
            ` : ''}

            ${user.title ? `
              <p class="prof-title-line">${escapeHtml(user.title)}</p>
            ` : ''}

            ${user.bio ? `
              <p class="prof-tagline">"${escapeHtml(user.bio.substring(0, 120))}${user.bio.length > 120 ? '…' : ''}" <i class="far fa-heart"></i></p>
            ` : ''}
          </div>
        </div>

        <div class="prof-stats-row">
          <div class="prof-stat">
            <p class="prof-stat-value">${postsCount}</p>
            <p class="prof-stat-label">Posts</p>
          </div>
          <button class="prof-stat prof-stat-clickable" onclick="ProfileView.showFollowers()">
            <p class="prof-stat-value">${formatCount(followersCount)}</p>
            <p class="prof-stat-label">Followers</p>
          </button>
          <button class="prof-stat prof-stat-clickable" onclick="ProfileView.showFollowing()">
            <p class="prof-stat-value">${formatCount(followingCount)}</p>
            <p class="prof-stat-label">Following</p>
          </button>
          ${user.role === 'expert' ? `
            <div class="prof-stat">
              <p class="prof-stat-value">${user.experience || '—'}<span style="font-size:11px;">y</span></p>
              <p class="prof-stat-label">Experience</p>
            </div>
          ` : `
            <div class="prof-stat">
              <p class="prof-stat-value">${user.rating ? user.rating : '—'}</p>
              <p class="prof-stat-label">${user.role === 'expert' ? 'Rating' : 'Rep'}</p>
            </div>
          `}
        </div>

        ${!isSelf ? `
          <div class="prof-action-row">
            <button type="button"
                    class="prof-follow-btn ${isFollowing ? 'following' : ''}"
                    id="profFollowBtn"
                    onclick="ProfileView.handleFollowTap('${user.id}')">
              <i class="fas ${isFollowing ? 'fa-check' : 'fa-user-plus'}"></i>
              <span>${isFollowing ? 'Following' : 'Follow'}</span>
            </button>
          </div>
        ` : ''}
      </section>
    `;
  },

  renderRoleChip(user) {
    if (user.role === 'expert') {
      return `<span class="prof-role-chip chip-vet"><i class="fas fa-user-md"></i> Expert</span>`;
    }
    if (user.role === 'storeOwner') {
      return `<span class="prof-role-chip chip-store"><i class="fas fa-store"></i> Store Owner</span>`;
    }
    return `<span class="prof-role-chip chip-owner"><i class="fas fa-user"></i> Community</span>`;
  },

  /* ============================================================ */
  /* TABS                                                          */
  /* ============================================================ */
  renderTabs() {
    const tabs = [
      { id: 'posts', label: 'Posts', icon: 'fa-th' },
      { id: 'about', label: 'About', icon: 'fa-info-circle' }
    ];

    return `
      <div class="prof-tabs" id="profileTabs" role="tablist">
        ${tabs.map(t => `
          <button class="prof-tab ${this.state.activeTab === t.id ? 'active' : ''}"
                  data-profile-tab="${t.id}"
                  role="tab">
            <i class="fas ${t.icon}"></i>
            <span>${t.label}</span>
          </button>
        `).join('')}
      </div>
    `;
  },

  renderTabContent(user, posts) {
    switch (this.state.activeTab) {
      case 'posts':   return this.renderPostsTab(user, posts);
      case 'about':   return this.renderAboutTab(user);
      default:        return this.renderPostsTab(user, posts);
    }
  },

  /* ============================================================ */
  /* POSTS TAB                                                     */
  /* ============================================================ */
  renderPostsTab(user, posts) {
    if (!posts.length) {
      return `
        <div class="prof-section-card">
          <div class="prof-section-header">
            <h3><i class="fas fa-book-open"></i> Posts</h3>
          </div>
          <div class="prof-empty">
            <i class="fas fa-book-open"></i>
            <p>No posts yet</p>
          </div>
        </div>
      `;
    }

    return `
      <div class="prof-section-card">
        <div class="prof-section-header">
          <h3><i class="fas fa-book-open"></i> Posts</h3>
          <span class="prof-section-count">${posts.length}</span>
        </div>
        <div class="prof-posts-feed">
          ${posts.map(p => this.renderPostCard(p, user)).join('')}
        </div>
      </div>
    `;
  },

  renderPostCard(post, user) {
    const timeText = typeof timeAgo === 'function' ? timeAgo(post.date) : '';
    const likes = post.likes || 0;
    const comments = (post.comments || []).length;

    return `
      <article class="prof-post-card" onclick="ProfileView.openPostDetail('${post.id}')">
        <header class="prof-post-head">
          <div class="prof-post-author">
            <div class="prof-post-avatar">
              ${user.avatar
                ? `<img src="${user.avatar}" alt="" onerror="this.style.display='none'; this.parentElement.textContent='${user.name.charAt(0).toUpperCase()}'">`
                : user.name.charAt(0).toUpperCase()
              }
            </div>
            <div class="prof-post-author-info">
              <p class="prof-post-author-name">
                ${escapeHtml(user.name)}
                ${user.verified ? '<i class="fas fa-circle-check"></i>' : ''}
              </p>
              <p class="prof-post-author-time">${timeText}</p>
            </div>
          </div>
        </header>

        <div class="prof-post-body">
          ${post.title ? `<p class="prof-post-title">${escapeHtml(post.title)}</p>` : ''}
          <p class="prof-post-text">
            ${escapeHtml((post.content || '').substring(0, 180))}${(post.content || '').length > 180 ? '…' : ''}
          </p>
        </div>

        ${post.image && typeof post.image === 'string' && post.image.trim().length > 0 ? `
          <div class="prof-post-image">
            <img src="${post.image}" alt="" loading="lazy" onerror="this.parentElement.remove()">
          </div>
        ` : ''}

        <footer class="prof-post-actions">
          <span class="prof-post-stat">
            <i class="fas fa-heart"></i> ${likes}
          </span>
          <span class="prof-post-stat">
            <i class="fas fa-comment"></i> ${comments}
          </span>
        </footer>
      </article>
    `;
  },

  /* ============================================================ */
  /* ABOUT TAB                                                     */
  /* ============================================================ */
  renderAboutTab(user) {
    return `
      <div class="prof-section-card">
        <div class="prof-section-header">
          <h3><i class="fas fa-info-circle"></i> About</h3>
        </div>

        ${user.bio ? `
          <div class="prof-about-text">
            <p>${escapeHtml(user.bio)}</p>
          </div>
        ` : ''}

        <div class="prof-about-grid">
          ${user.location ? `
            <div class="prof-about-item">
              <i class="fas fa-map-marker-alt"></i>
              <div>
                <p class="prof-about-key">Location</p>
                <p class="prof-about-val">${escapeHtml(user.location)}</p>
              </div>
            </div>
          ` : ''}

          ${user.specialization ? `
            <div class="prof-about-item">
              <i class="fas fa-stethoscope"></i>
              <div>
                <p class="prof-about-key">Specialization</p>
                <p class="prof-about-val">${escapeHtml(user.specialization)}</p>
              </div>
            </div>
          ` : ''}

          ${user.experience ? `
            <div class="prof-about-item">
              <i class="fas fa-briefcase"></i>
              <div>
                <p class="prof-about-key">Experience</p>
                <p class="prof-about-val">${user.experience}+ years</p>
              </div>
            </div>
          ` : ''}

          ${user.rating ? `
            <div class="prof-about-item">
              <i class="fas fa-star"></i>
              <div>
                <p class="prof-about-key">Rating</p>
                <p class="prof-about-val">${user.rating} / 5</p>
              </div>
            </div>
          ` : ''}

          ${user.consultations ? `
            <div class="prof-about-item">
              <i class="fas fa-comments"></i>
              <div>
                <p class="prof-about-key">Consultations</p>
                <p class="prof-about-val">${formatCount(user.consultations)}</p>
              </div>
            </div>
          ` : ''}
        </div>

        ${user.expertise && user.expertise.length ? `
          <div class="prof-specializations">
            <p class="prof-about-key">Expertise</p>
            <div class="prof-spec-tags">
              ${user.expertise.map(t => `<span class="prof-spec-tag">${escapeHtml(t)}</span>`).join('')}
            </div>
          </div>
        ` : ''}

        ${user.credentials && user.credentials.length ? `
          <div class="prof-specializations">
            <p class="prof-about-key">Credentials</p>
            <ul class="prof-credentials-list">
              ${user.credentials.map(c => `
                <li>
                  <i class="fas fa-check-circle"></i>
                  <span>${escapeHtml(c)}</span>
                </li>
              `).join('')}
            </ul>
          </div>
        ` : ''}
      </div>
    `;
  },

  /* ============================================================ */
  /* HELPERS                                                       */
  /* ============================================================ */
  getUserPosts(userId) {
    const stories = APP.stories || [];
    return stories
      .filter(s => s.authorId === userId)
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  },

  /* ============================================================ */
  /* HANDLERS                                                      */
  /* ============================================================ */
  attachHandlers() {
    const page = document.getElementById('page-user-profile');
    if (!page) return;

    page.querySelectorAll('[data-profile-tab]').forEach(tab => {
      tab.addEventListener('click', () => {
        this.state.activeTab = tab.dataset.profileTab;

        page.querySelectorAll('[data-profile-tab]').forEach(t => {
          t.classList.toggle('active', t.dataset.profileTab === this.state.activeTab);
        });

        const content = document.getElementById('profileTabContent');
        if (content) {
          const user = Social.getUser(this.state.userId);
          const posts = this.getUserPosts(this.state.userId);
          content.innerHTML = this.renderTabContent(user, posts);
        }
      });
    });
  },

  /* ============================================================ */
  /* FOLLOW                                                        */
  /* ============================================================ */
  handleFollowTap(userId) {
    if (!isLoggedIn()) {
      showToast('Sign in to follow');
      openModal('loginModal');
      if (typeof renderLoginModal === 'function') renderLoginModal();
      return;
    }

    const nowFollowing = Social.toggleFollow(userId);

    /* Update button */
    const btn = document.getElementById('profFollowBtn');
    if (btn) {
      btn.classList.toggle('following', nowFollowing);
      const icon = btn.querySelector('i');
      const label = btn.querySelector('span');
      if (icon) icon.className = nowFollowing ? 'fas fa-check' : 'fas fa-user-plus';
      if (label) label.textContent = nowFollowing ? 'Following' : 'Follow';

      btn.classList.add('just-tapped');
      setTimeout(() => btn.classList.remove('just-tapped'), 400);
    }

    /* Update followers count */
    const newCount = Social.getTotalFollowers(userId);
    const followerEls = document.querySelectorAll('.prof-stats-row .prof-stat:nth-child(2) .prof-stat-value');
    followerEls.forEach(el => el.textContent = formatCount(newCount));

    showToast(nowFollowing ? 'Now following!' : 'Unfollowed');
  },

  /* ============================================================ */
  /* FOLLOWERS / FOLLOWING MODALS                                  */
  /* ============================================================ */
  showFollowers() {
    const userId = this.state.userId;
    const followers = Social.getFollowers(userId);

    this._openListModal({
      title: 'Followers',
      icon: 'fa-user-group',
      emptyMessage: 'No followers yet',
      userIds: followers,
      count: Social.getTotalFollowers(userId)
    });
  },

  showFollowing() {
    const userId = this.state.userId;
    const following = Social.getFollowing(userId);

    this._openListModal({
      title: 'Following',
      icon: 'fa-user-plus',
      emptyMessage: 'Not following anyone yet',
      userIds: following,
      count: following.length
    });
  },

  _openListModal({ title, icon, emptyMessage, userIds, count }) {
    const modal = document.getElementById('quickViewModal');
    if (!modal) return;

    modal.querySelector('.modal-content').innerHTML = `
      <button type="button" class="close-modal" onclick="closeModal('quickViewModal')">
        <i class="fas fa-times"></i>
      </button>
      <h2 class="modal-title">
        <i class="fas ${icon}"></i> ${title}
        <span style="font-size:13px; color:var(--pc-text-muted); font-weight:600; margin-left:6px;">
          (${count})
        </span>
      </h2>

      ${userIds.length ? `
        <div class="follow-list">
          ${userIds.map(u => this._renderFollowListItem(u)).join('')}
        </div>
      ` : `
        <div class="follow-list-empty">
          <i class="fas ${icon}"></i>
          <p>${emptyMessage}</p>
        </div>
      `}
    `;

    /* Attach handlers */
    modal.querySelectorAll('[data-follow-user]').forEach(item => {
      item.addEventListener('click', (e) => {
        if (e.target.closest('[data-follow-toggle]')) return;
        const uid = item.dataset.followUser;
        closeModal('quickViewModal');
        setTimeout(() => this.open(uid), 200);
      });
    });

    modal.querySelectorAll('[data-follow-toggle]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!isLoggedIn()) {
          showToast('Sign in to follow');
          return;
        }
        const uid = btn.dataset.followToggle;
        const nowFollowing = Social.toggleFollow(uid);
        btn.textContent = nowFollowing ? 'Following' : 'Follow';
        btn.classList.toggle('following', nowFollowing);
      });
    });

    openModal('quickViewModal');
  },

  _renderFollowListItem(user) {
    const isFollowing = Social.isFollowing(user.id);
    const roleClass = user.role === 'expert' ? 'vet' : (user.role === 'storeOwner' ? 'store' : '');
    const roleLabel = user.role === 'expert' ? 'Veterinarian' : (user.role === 'storeOwner' ? 'Store Owner' : 'Community');

    return `
      <button class="follow-list-item" data-follow-user="${user.id}">
        <div class="follow-list-avatar ${roleClass}">
          ${user.avatar
            ? `<img src="${user.avatar}" alt="" onerror="this.style.display='none'; this.parentElement.textContent='${user.name.charAt(0).toUpperCase()}'">`
            : user.name.charAt(0).toUpperCase()
          }
        </div>
        <div class="follow-list-info">
          <div class="follow-list-name">
            ${escapeHtml(user.name)}
            ${user.verified ? '<i class="fas fa-circle-check"></i>' : ''}
          </div>
          <div class="follow-list-role">${roleLabel}</div>
        </div>
        <span class="follow-list-btn ${isFollowing ? 'following' : ''}" data-follow-toggle="${user.id}">
          ${isFollowing ? 'Following' : 'Follow'}
        </span>
      </button>
    `;
  },

  /* ============================================================ */
  /* POST DETAIL                                                   */
  /* ============================================================ */
  openPostDetail(postId) {
    const post = (APP.stories || []).find(s => s.id === postId);
    if (!post) return;

    if (typeof openStoryDetail === 'function') {
      openStoryDetail(postId);
    }
  }
};

window.ProfileView = ProfileView;
window.openUserProfile = (id) => ProfileView.open(id);

console.log('[AquaQuest] Profile view loaded');