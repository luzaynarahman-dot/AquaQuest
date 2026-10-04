/* ============================================================ */
/* AQUAQUEST — WATER STORIES (COMMUNITY FEED)                    */
/* Complete · Fresh · Bookmark · Author tap · Comments · Photo   */
/* + Reply · Like · Delete                                       */
/* ============================================================ */

let feedState = {
  activeFilter: 'all',
  composerPhoto: null,
  activeCommentStoryId: null,
  replyingTo: null        // ⭐ NEW — reply target comment id
};

/* ============================================================ */
/* 1. FILTERS                                                    */
/* ============================================================ */
const FEED_FILTERS = [
  { id: 'all',         label: 'All',          icon: 'fa-globe' },
  { id: 'observation', label: 'Observations', icon: 'fa-eye' },
  { id: 'story',       label: 'Stories',      icon: 'fa-book-open' },
  { id: 'tip',         label: 'Tips',         icon: 'fa-lightbulb' },
  { id: 'awareness',   label: 'Awareness',    icon: 'fa-bullhorn' },
  { id: 'sighting',    label: 'Sightings',    icon: 'fa-fish' },
  { id: 'question',    label: 'Questions',    icon: 'fa-question' }
];

/* ============================================================ */
/* 2. SAVED POSTS HELPERS                                        */
/* ============================================================ */
function isSavedStory(storyId) {
  if (!storyId) return false;
  const saved = Storage.get('aq_saved_stories', []);
  if (!Array.isArray(saved)) return false;
  return saved.includes(storyId);
}

/* ============================================================ */
/* 3. ROLE HELPERS                                               */
/* ============================================================ */
function getRoleBadgeInfo(role) {
  const map = {
    expert:     { label: 'Expert', icon: 'fa-user-tie', color: 'var(--pc-success)', avatarClass: 'vet' },
    storeOwner: { label: 'Store',  icon: 'fa-store',    color: 'var(--pc-purple)',  avatarClass: 'store' },
    member:     { label: 'Member', icon: 'fa-water',    color: 'var(--pc-accent)',  avatarClass: '' },
    petOwner:   { label: 'Member', icon: 'fa-water',    color: 'var(--pc-accent)',  avatarClass: '' }
  };
  return map[role] || map.member;
}

function getStoryTypeBadge(storyType) {
  const map = {
    observation: { icon: 'fa-eye',        label: 'Observation', color: 'var(--pc-accent)' },
    story:       { icon: 'fa-book-open',  label: 'Story',       color: 'var(--pc-purple)' },
    tip:         { icon: 'fa-lightbulb',  label: 'Tip',         color: 'var(--pc-warning)' },
    awareness:   { icon: 'fa-bullhorn',   label: 'Awareness',   color: 'var(--pc-danger)' },
    sighting:    { icon: 'fa-fish',       label: 'Sighting',    color: 'var(--pc-success)' },
    question:    { icon: 'fa-question',   label: 'Question',    color: 'var(--pc-info)' }
  };
  return map[storyType] || { icon: 'fa-circle', label: 'Post', color: 'var(--pc-text-muted)' };
}

/* ============================================================ */
/* 4. MAIN RENDER                                                */
/* ============================================================ */
function renderFeed() {
  const page = document.getElementById('page-feed');
  if (!page) return;

  page.innerHTML = `
    <div class="page-container">

      <section class="feed-hero">
        <div class="feed-hero-inner">
          <div>
            <h2 class="feed-hero-title">Water Stories</h2>
            <p class="feed-hero-sub">Community observations & voices</p>
          </div>
          <div class="feed-hero-illust">
            <img src="assets/hero-feed.jpg" alt="" onerror="this.style.opacity='0'">
          </div>
        </div>
      </section>

      <button type="button" class="story-composer" id="openStoryComposer">
        ${renderComposerAvatar()}
        <span class="story-composer-text">Share an observation, story, or question...</span>
        <i class="fas fa-camera story-composer-icon"></i>
      </button>

      <div class="feed-filters" id="feedFilters">
        ${FEED_FILTERS.map(f => `
          <button type="button"
                  class="feed-filter-chip ${feedState.activeFilter === f.id ? 'active' : ''}"
                  data-feed-filter="${f.id}">
            <i class="fas ${f.icon}"></i> ${f.label}
          </button>
        `).join('')}
      </div>

      <div class="story-feed" id="storyFeed">
        ${renderStoryFeed()}
      </div>

    </div>
  `;

  attachFeedHandlers();
}

function renderComposerAvatar() {
  const loggedIn = typeof isLoggedIn === 'function' && isLoggedIn();

  if (!loggedIn) {
    return `<div class="story-composer-avatar guest"><i class="fas fa-user"></i></div>`;
  }

  const user = APP.user || {};
  if (user.avatar) {
    return `<div class="story-composer-avatar"><img src="${user.avatar}" alt="" onerror="this.style.display='none'; this.parentElement.innerHTML='<span>${(user.name || 'U').charAt(0).toUpperCase()}</span>'"></div>`;
  }
  return `<div class="story-composer-avatar">${(user.name || 'U').charAt(0).toUpperCase()}</div>`;
}

/* ============================================================ */
/* 5. FEED RENDER                                                */
/* ============================================================ */
function renderStoryFeed() {
  let stories = (APP.stories || []).slice();

  if (feedState.activeFilter !== 'all') {
    stories = stories.filter(s => s.type === feedState.activeFilter);
  }

  stories.sort((a, b) => new Date(b.date) - new Date(a.date));

  if (!stories.length) {
    return renderEmptyFeed();
  }

  return stories.map(s => renderStoryCard(s)).join('');
}

function renderEmptyFeed() {
  return `
    <div class="feed-editorial-section">
      <div class="feed-editorial-header">
        <i class="fas fa-star" style="color: var(--pc-warning);"></i>
        <span>From AquaQuest Team</span>
      </div>

      ${renderEditorialCard({
        icon: 'fa-bullhorn',
        color: 'var(--pc-danger)',
        title: '5 signs of water pollution everyone should know',
        excerpt: 'Learn the visible warning signs — unusual colour, strong smell, foam, algae blooms, and fish kills.',
        readTime: '3 min read'
      })}

      ${renderEditorialCard({
        icon: 'fa-camera',
        color: 'var(--pc-purple)',
        title: 'How to take a good water observation photo',
        excerpt: 'Your photos are scientific data. Here\'s how to capture consistent, useful evidence.',
        readTime: '2 min read'
      })}
    </div>

    <div class="feed-community-empty">
      <div class="feed-community-empty-icon">
        <i class="fas fa-water"></i>
      </div>
      <p class="feed-community-empty-title">No community stories yet</p>
      <p class="feed-community-empty-sub">
        Be the first to share an observation, story, or question with the community.
      </p>
      <button type="button" class="btn btn-primary btn-sm" onclick="openStoryComposer()">
        <i class="fas fa-plus"></i> Share the First Story
      </button>
    </div>
  `;
}

function renderEditorialCard({ icon, color, title, excerpt, readTime }) {
  return `
    <button type="button" class="feed-editorial-card" onclick="showToast('Reading: ${escapeHtml(title)}')">
      <div class="feed-editorial-icon" style="background: ${color}15; color: ${color};">
        <i class="fas ${icon}"></i>
      </div>
      <div class="feed-editorial-info">
        <p class="feed-editorial-title">${escapeHtml(title)}</p>
        <p class="feed-editorial-excerpt">${escapeHtml(excerpt)}</p>
        <p class="feed-editorial-meta">
          <i class="far fa-clock"></i> ${readTime}
        </p>
      </div>
      <i class="fas fa-chevron-right feed-editorial-arrow"></i>
    </button>
  `;
}

function renderStoryCard(story) {
  const user = APP.user || { name: 'You' };
  const likedBy = story.likedBy || [];
  const isLiked = likedBy.includes(user.name);
  const isSaved = isSavedStory(story.id);

  const roleInfo = getRoleBadgeInfo(story.authorRole);
  const typeBadge = getStoryTypeBadge(story.type);

  const authorName = story.authorName || 'User';
  const authorInitial = authorName.charAt(0).toUpperCase();
  const authorId = story.authorId || '';

  const contentHtml = renderStoryContent(story);

  /* Total comment count including replies */
  const totalComments = countAllComments(story);

  return `
    <article class="story-card" data-story-id="${story.id}">

      <header class="story-header">
        <button type="button"
                class="story-author-avatar ${roleInfo.avatarClass}"
                onclick="event.stopPropagation(); handleAuthorTap('${authorId}')"
                aria-label="View profile">
          ${story.authorAvatar
            ? `<img src="${story.authorAvatar}" alt="" onerror="this.style.display='none'; this.parentElement.textContent='${authorInitial}'">`
            : authorInitial
          }
        </button>

        <div class="story-author-info">
          <div class="story-author-name">
            <span onclick="event.stopPropagation(); handleAuthorTap('${authorId}')"
                  style="cursor: pointer;">
              ${escapeHtml(authorName)}
            </span>
            ${roleInfo.label === 'Expert' ? '<i class="fas fa-circle-check"></i>' : ''}
          </div>
          <div class="story-author-meta">
            <span>${timeAgo(story.date)}</span>
            <span class="story-type-badge" style="background:${typeBadge.color}15; color:${typeBadge.color};">
              <i class="fas ${typeBadge.icon}"></i> ${typeBadge.label}
            </span>
          </div>
        </div>

        <button type="button" class="story-menu" data-story-menu="${story.id}" aria-label="Menu">
          <i class="fas fa-ellipsis"></i>
        </button>
      </header>

      <div class="story-body">
        ${contentHtml}
      </div>

      ${story.image ? `
        <div class="story-image" onclick="openStoryDetail('${story.id}')">
          <img src="${story.image}" alt="" onerror="this.style.opacity='0'">
        </div>
      ` : ''}

      <footer class="story-actions">
        <button type="button" class="story-action-btn ${isLiked ? 'liked' : ''}" data-story-like="${story.id}">
          <i class="${isLiked ? 'fas' : 'far'} fa-heart"></i>
          <span>${story.likes || 0}</span>
        </button>
        <button type="button" class="story-action-btn" data-story-comment="${story.id}">
          <i class="far fa-comment"></i>
          <span>${totalComments}</span>
        </button>
        <button type="button" class="story-action-btn" data-story-share="${story.id}">
          <i class="far fa-share-square"></i>
          <span>Share</span>
        </button>
        <button type="button"
                class="story-action-btn story-action-save ${isSaved ? 'saved' : ''}"
                data-story-save="${story.id}"
                aria-label="${isSaved ? 'Remove from saved' : 'Save post'}">
          <i class="${isSaved ? 'fas' : 'far'} fa-bookmark"
             style="${isSaved ? 'color: var(--pc-accent);' : ''}"></i>
        </button>
      </footer>

    </article>
  `;
}

function countAllComments(story) {
  if (!story.comments) return 0;
  let total = story.comments.length;
  story.comments.forEach(c => {
    if (c.replies && c.replies.length) {
      total += c.replies.length;
    }
  });
  return total;
}

function renderStoryContent(story) {
  if (!story.title && !story.content) return '';

  let html = '';

  if (story.title) {
    html += `<p class="story-title">${escapeHtml(story.title)}</p>`;
  }

  if (story.content) {
    html += `<p class="story-content">${escapeHtml(story.content)}</p>`;
  }

  return html;
}

/* ============================================================ */
/* 6. AUTHOR TAP                                                 */
/* ============================================================ */
function handleAuthorTap(userId) {
  if (!userId) {
    showToast('Profile unavailable');
    return;
  }

  if (userId === 'user_self' || userId === (APP.user && APP.user.id)) {
    showPage('profile');
    return;
  }

  if (typeof Social !== 'undefined' && typeof Social.getUser === 'function') {
    const user = Social.getUser(userId);
    if (user) {
      if (typeof ProfileView !== 'undefined' && typeof ProfileView.open === 'function') {
        ProfileView.open(userId);
        return;
      }
    }
  }

  showToast('Profile not available');
}

function handleCommentAuthorTap(authorId) {
  if (!authorId) {
    showToast('Profile unavailable');
    return;
  }

  closeModal('commentModal');

  setTimeout(() => {
    if (authorId === 'user_self' || authorId === (APP.user && APP.user.id)) {
      showPage('profile');
      return;
    }

    if (typeof Social !== 'undefined' && typeof Social.getUser === 'function') {
      const user = Social.getUser(authorId);
      if (user) {
        if (typeof ProfileView !== 'undefined' && typeof ProfileView.open === 'function') {
          ProfileView.open(authorId);
          return;
        }
      }
    }

    showToast('Profile not available');
  }, 200);
}

/* ============================================================ */
/* 7. HANDLERS                                                   */
/* ============================================================ */
function attachFeedHandlers() {
  const page = document.getElementById('page-feed');
  if (!page) return;

  const composer = document.getElementById('openStoryComposer');
  if (composer) composer.addEventListener('click', openStoryComposer);

  const filters = document.getElementById('feedFilters');
  if (filters) {
    filters.addEventListener('click', (e) => {
      const chip = e.target.closest('[data-feed-filter]');
      if (!chip) return;
      feedState.activeFilter = chip.dataset.feedFilter;

      page.querySelectorAll('.feed-filter-chip').forEach(c => {
        c.classList.toggle('active', c.dataset.feedFilter === feedState.activeFilter);
      });

      const feed = document.getElementById('storyFeed');
      if (feed) feed.innerHTML = renderStoryFeed();
      attachFeedItemHandlers();
    });
  }

  attachFeedItemHandlers();
}

function attachFeedItemHandlers() {
  const feed = document.getElementById('storyFeed');
  if (!feed) return;

  feed.querySelectorAll('[data-story-like]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleStoryLike(btn.dataset.storyLike);
    });
  });

  feed.querySelectorAll('[data-story-comment]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openStoryComments(btn.dataset.storyComment);
    });
  });

  feed.querySelectorAll('[data-story-share]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      shareStory(btn.dataset.storyShare);
    });
  });

  feed.querySelectorAll('[data-story-save]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleStorySave(btn.dataset.storySave, btn);
    });
  });

  feed.querySelectorAll('[data-story-menu]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      openStoryMenu(btn.dataset.storyMenu);
    });
  });
}

/* ============================================================ */
/* 8. LIKE                                                       */
/* ============================================================ */
function toggleStoryLike(storyId) {
  const story = (APP.stories || []).find(s => s.id === storyId);
  if (!story) return;

  const user = APP.user || { name: 'You' };
  story.likedBy = story.likedBy || [];

  if (story.likedBy.includes(user.name)) {
    story.likedBy = story.likedBy.filter(n => n !== user.name);
    story.likes = Math.max(0, (story.likes || 0) - 1);
  } else {
    story.likedBy.push(user.name);
    story.likes = (story.likes || 0) + 1;
  }

  Storage.set(APP.KEYS.STORIES, APP.stories);

  const feed = document.getElementById('storyFeed');
  if (feed) feed.innerHTML = renderStoryFeed();
  attachFeedItemHandlers();
}

/* ============================================================ */
/* 9. SAVE                                                       */
/* ============================================================ */
function toggleStorySave(storyId, btn) {
  let saved = Storage.get('aq_saved_stories', []);
  if (!Array.isArray(saved)) saved = [];

  let nowSaved;
  if (saved.includes(storyId)) {
    saved = saved.filter(id => id !== storyId);
    nowSaved = false;
    showToast('Removed from saved');
  } else {
    saved.push(storyId);
    nowSaved = true;
    showToast('Saved to your collection');
  }

  Storage.set('aq_saved_stories', saved);

  document.querySelectorAll(`[data-story-save="${storyId}"]`).forEach(b => {
    b.classList.toggle('saved', nowSaved);
    const icon = b.querySelector('i');
    if (icon) {
      icon.className = `${nowSaved ? 'fas' : 'far'} fa-bookmark`;
      icon.style.color = nowSaved ? 'var(--pc-accent)' : '';
    }
  });
}

/* ============================================================ */
/* 10. SHARE                                                     */
/* ============================================================ */
function shareStory(storyId) {
  const story = (APP.stories || []).find(s => s.id === storyId);
  if (!story) return;

  const data = {
    title: story.title || 'Water Story',
    text: story.content || '',
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
/* 11. STORY MENU                                                */
/* ============================================================ */
function openStoryMenu(storyId) {
  const story = (APP.stories || []).find(s => s.id === storyId);
  if (!story) return;

  const isOwn = story.authorId === 'user_self' ||
                story.authorId === (APP.user && APP.user.id);

  const isSaved = isSavedStory(storyId);

  const modal = document.getElementById('quickViewModal');
  if (!modal) return;

  modal.querySelector('.modal-content').innerHTML = `
    <button type="button" class="close-modal" onclick="closeModal('quickViewModal')">
      <i class="fas fa-times"></i>
    </button>
    <h2 class="modal-title"><i class="fas fa-ellipsis"></i> Options</h2>
    <div style="display:flex; flex-direction:column; gap:8px;">
      <button type="button" class="btn btn-outline w-full" onclick="closeModal('quickViewModal'); shareStory('${storyId}');">
        <i class="fas fa-share"></i> Share Story
      </button>
      <button type="button" class="btn btn-outline w-full" onclick="closeModal('quickViewModal'); toggleStorySave('${storyId}');">
        <i class="${isSaved ? 'fas' : 'far'} fa-bookmark"></i>
        ${isSaved ? 'Remove from Saved' : 'Save Story'}
      </button>
      ${isOwn ? `
        <button type="button" class="btn btn-danger w-full" onclick="closeModal('quickViewModal'); confirmDeleteStory('${storyId}');">
          <i class="fas fa-trash"></i> Delete Story
        </button>
      ` : ''}
    </div>
  `;

  openModal('quickViewModal');
}

function confirmDeleteStory(storyId) {
  if (!confirm('Delete this story permanently?')) return;

  APP.stories = (APP.stories || []).filter(s => s.id !== storyId);
  Storage.set(APP.KEYS.STORIES, APP.stories);

  let saved = Storage.get('aq_saved_stories', []);
  if (Array.isArray(saved)) {
    saved = saved.filter(id => id !== storyId);
    Storage.set('aq_saved_stories', saved);
  }

  showToast('Story deleted');

  const feed = document.getElementById('storyFeed');
  if (feed) feed.innerHTML = renderStoryFeed();
  attachFeedItemHandlers();
}

/* ============================================================ */
/* 12. COMPOSER                                                  */
/* ============================================================ */
function openStoryComposer(preservePhoto = false) {
  if (!isLoggedIn()) {
    showToast('Sign in to share a story');
    openModal('loginModal');
    if (typeof renderLoginModal === 'function') renderLoginModal();
    return;
  }

  if (!preservePhoto) {
  feedState.composerPhoto = null;
}

  const modal = document.getElementById('storyModal');
  if (!modal) return;

  const user = APP.user || {};
  const initial = (user.name || 'U').charAt(0).toUpperCase();

  modal.querySelector('.modal-content').innerHTML = `
    <button type="button" class="close-modal" onclick="closeModal('storyModal')">
      <i class="fas fa-times"></i>
    </button>
    <h2 class="modal-title"><i class="fas fa-book-open"></i> Share a Story</h2>

    <div class="composer-author">
      <div class="composer-author-avatar">
        ${user.avatar
          ? `<img src="${user.avatar}" alt="" onerror="this.style.display='none'; this.parentElement.textContent='${initial}'">`
          : initial
        }
      </div>
      <div>
        <p class="composer-author-name">${escapeHtml(user.name || 'You')}</p>
        <p class="composer-author-sub">Posting publicly</p>
      </div>
    </div>

    <form id="storyComposerForm">
      <label>Type of post</label>
      <select id="storyType" required>
        <option value="observation">Observation — what you saw</option>
        <option value="story">Story — a moment worth sharing</option>
        <option value="sighting">Wildlife Sighting</option>
        <option value="tip">Tip — help the community</option>
        <option value="awareness">Awareness — spread the word</option>
        <option value="question">Question — ask for help</option>
      </select>

      <label>Title (optional)</label>
      <input type="text" id="storyTitle" placeholder="Give your story a title" maxlength="80">

      <label>What's on your mind? *</label>
      <textarea id="storyContent" rows="5" placeholder="Share your observation, story, or question..." required maxlength="600"></textarea>

      <label>Add a photo (optional)</label>
      <label class="composer-photo-upload ${feedState.composerPhoto ? 'has-photo' : ''}" for="storyPhotoInput">
        ${feedState.composerPhoto
          ? `<img src="${feedState.composerPhoto}" alt="">
             <button type="button" class="composer-photo-remove" onclick="event.preventDefault(); event.stopPropagation(); removeComposerPhoto();">
               <i class="fas fa-times"></i>
             </button>`
          : `<i class="fas fa-camera"></i>
             <p>Tap to add photo</p>
             <span>JPG, PNG · max 15MB</span>`
        }
      </label>
      <input type="file" id="storyPhotoInput" accept="image/*" style="display:none;">

      <label>Link to water site (optional)</label>
      <select id="storySite">
        <option value="">None</option>
        ${SITES.map(s => `<option value="${s.id}">${escapeHtml(s.name)}</option>`).join('')}
      </select>

      <button type="submit" class="btn btn-primary w-full" style="margin-top:14px;">
        <i class="fas fa-paper-plane"></i> Publish Story
      </button>
    </form>
  `;

  const photoInput = document.getElementById('storyPhotoInput');
  if (photoInput && !photoInput.dataset.listenerAttached) {
    photoInput.dataset.listenerAttached = 'true';
    photoInput.addEventListener('change', async (e) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        showToast('Please select an image file');
        return;
      }

      if (file.size > 15 * 1024 * 1024) {
        showToast('Image too large (max 15MB)');
        return;
      }

      try {
        showToast('Processing image...');
        const compressed = await compressImage(file, 1200, 0.75);
        feedState.composerPhoto = compressed;
        openStoryComposer(true);
        showToast('Photo added');
      } catch (err) {
        console.error('[Feed] Photo compress failed:', err);
        showToast('Could not process image');
      }
    });
  }

  const form = document.getElementById('storyComposerForm');
  if (form) form.addEventListener('submit', handleStorySubmit);

  openModal('storyModal');
}

function removeComposerPhoto() {
  feedState.composerPhoto = null;
  openStoryComposer();
}

function handleStorySubmit(e) {
  e.preventDefault();

  const type = document.getElementById('storyType').value;
  const title = document.getElementById('storyTitle').value.trim();
  const content = document.getElementById('storyContent').value.trim();
  const siteId = document.getElementById('storySite').value || null;

  if (!content) {
    showToast('Please write something');
    return;
  }

  const user = APP.user || { name: 'You', avatar: null };

  const story = {
    id: 'story_' + Date.now(),
    authorId: 'user_self',
    authorName: user.name,
    authorAvatar: user.avatar,
    authorRole: 'member',
    type,
    title: title || (content.length > 60 ? content.substring(0, 60) + '…' : content),
    content,
    image: feedState.composerPhoto || null,
    siteId,
    date: new Date().toISOString(),
    likes: 0,
    likedBy: [],
    comments: []
  };

  APP.stories = APP.stories || [];
  APP.stories.unshift(story);
  Storage.set(APP.KEYS.STORIES, APP.stories);

  if (typeof Gamification !== 'undefined' && Gamification.awardForStory) {
    Gamification.awardForStory();
  }

  closeModal('storyModal');
  showToast('Story published!');

  if (typeof confetti === 'function') {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#22D3EE', '#0891B2', '#10B981']
    });
  }

  const feed = document.getElementById('storyFeed');
  if (feed) feed.innerHTML = renderStoryFeed();
  attachFeedItemHandlers();
}

/* ============================================================ */
/* 13. STORY DETAIL MODAL                                        */
/* ============================================================ */
function openStoryDetail(storyId) {
  const story = (APP.stories || []).find(s => s.id === storyId);
  if (!story) return;

  const modal = document.getElementById('quickViewModal');
  if (!modal) return;

  const user = APP.user || { name: 'You' };
  const likedBy = story.likedBy || [];
  const isLiked = likedBy.includes(user.name);
  const isSaved = isSavedStory(storyId);

  const roleInfo = getRoleBadgeInfo(story.authorRole);
  const authorName = story.authorName || 'User';
  const authorInitial = authorName.charAt(0).toUpperCase();
  const authorId = story.authorId || '';

  const totalComments = countAllComments(story);

  modal.querySelector('.modal-content').innerHTML = `
    <button type="button" class="close-modal" onclick="closeModal('quickViewModal')">
      <i class="fas fa-times"></i>
    </button>

    <header class="story-detail-header">
      <button type="button"
              class="story-author-avatar ${roleInfo.avatarClass}"
              onclick="event.stopPropagation(); closeModal('quickViewModal'); setTimeout(()=>handleAuthorTap('${authorId}'), 200);"
              aria-label="View profile">
        ${story.authorAvatar
          ? `<img src="${story.authorAvatar}" alt="" onerror="this.style.display='none'; this.parentElement.textContent='${authorInitial}'">`
          : authorInitial
        }
      </button>
      <div class="story-author-info">
        <div class="story-author-name">
          <span onclick="closeModal('quickViewModal'); setTimeout(()=>handleAuthorTap('${authorId}'), 200);" style="cursor: pointer;">
            ${escapeHtml(authorName)}
          </span>
          ${roleInfo.label === 'Expert' ? '<i class="fas fa-circle-check"></i>' : ''}
        </div>
        <p class="story-author-meta-simple">${timeAgo(story.date)}</p>
      </div>
    </header>

    ${story.title ? `<h2 class="story-detail-title">${escapeHtml(story.title)}</h2>` : ''}
    <p class="story-detail-content">${escapeHtml(story.content)}</p>

    ${story.image ? `
      <div class="story-detail-image">
        <img src="${story.image}" alt="" onerror="this.style.opacity='0'">
      </div>
    ` : ''}

    ${story.siteId ? `
      <button type="button" class="story-site-tag" onclick="closeModal('quickViewModal'); setTimeout(()=>openSiteDetail('${story.siteId}'), 200);">
        <i class="fas fa-water"></i> ${escapeHtml(getSiteById(story.siteId)?.name || 'Site')}
      </button>
    ` : ''}

    <footer class="story-detail-actions">
      <button type="button" class="story-action-btn ${isLiked ? 'liked' : ''}" onclick="toggleStoryLike('${storyId}'); closeModal('quickViewModal'); setTimeout(()=>openStoryDetail('${storyId}'), 100);">
        <i class="${isLiked ? 'fas' : 'far'} fa-heart"></i>
        <span>${story.likes || 0}</span>
      </button>
      <button type="button" class="story-action-btn" onclick="closeModal('quickViewModal'); setTimeout(()=>openStoryComments('${storyId}'), 200);">
        <i class="far fa-comment"></i>
        <span>${totalComments}</span>
      </button>
      <button type="button" class="story-action-btn" onclick="shareStory('${storyId}')">
        <i class="far fa-share-square"></i>
        <span>Share</span>
      </button>
      <button type="button" class="story-action-btn story-action-save ${isSaved ? 'saved' : ''}"
              onclick="event.stopPropagation(); toggleStorySave('${storyId}'); closeModal('quickViewModal'); setTimeout(()=>openStoryDetail('${storyId}'), 100);">
        <i class="${isSaved ? 'fas' : 'far'} fa-bookmark"
           style="${isSaved ? 'color: var(--pc-accent);' : ''}"></i>
      </button>
    </footer>

    ${(story.comments || []).length ? `
      <div class="story-detail-comments">
        <p class="story-detail-comments-title">Comments (${totalComments})</p>
        ${story.comments.slice(0, 3).map(c => `
          <div class="story-detail-comment">
            <div class="story-detail-comment-avatar">${(c.authorName || 'U').charAt(0).toUpperCase()}</div>
            <div>
              <p class="story-detail-comment-name">${escapeHtml(c.authorName)}</p>
              <p class="story-detail-comment-text">${escapeHtml(c.text)}</p>
              ${c.replies && c.replies.length ? `
                <p style="font-size:11px; color:var(--pc-accent); font-weight:700; margin-top:4px;">
                  <i class="fas fa-reply"></i> ${c.replies.length} ${c.replies.length === 1 ? 'reply' : 'replies'}
                </p>
              ` : ''}
            </div>
          </div>
        `).join('')}
        ${story.comments.length > 3 ? `
          <button type="button" class="btn btn-outline w-full btn-sm" style="margin-top:10px;"
                  onclick="closeModal('quickViewModal'); setTimeout(()=>openStoryComments('${storyId}'), 200);">
            View all ${totalComments} comments
          </button>
        ` : ''}
      </div>
    ` : ''}
  `;

  openModal('quickViewModal');
}

/* ============================================================ */
/* 14. COMMENTS MODAL — with REPLY, LIKE, DELETE                 */
/* ============================================================ */
function openStoryComments(storyId) {
  const story = (APP.stories || []).find(s => s.id === storyId);
  if (!story) return;

  feedState.activeCommentStoryId = storyId;
  feedState.replyingTo = null;

  const modal = document.getElementById('commentModal');
  if (!modal) return;

  renderCommentModal(story, modal);
  openModal('commentModal');
}

function renderCommentModal(story, modal) {
  const totalComments = countAllComments(story);
  const replyingTo = feedState.replyingTo;

  let replyBanner = '';
  if (replyingTo) {
    const target = findCommentById(story, replyingTo);
    if (target) {
      replyBanner = `
        <div class="comment-reply-banner">
          <i class="fas fa-reply"></i>
          <span>Replying to <strong>${escapeHtml(target.authorName)}</strong></span>
          <button type="button" class="comment-reply-cancel" onclick="cancelCommentReply()" aria-label="Cancel reply">
            <i class="fas fa-times"></i>
          </button>
        </div>
      `;
    }
  }

  modal.querySelector('.modal-content').innerHTML = `
    <button type="button" class="close-modal" onclick="closeModal('commentModal')">
      <i class="fas fa-times"></i>
    </button>
    <h2 class="modal-title">
      <i class="fas fa-comments"></i> Comments
      <span style="font-size:13px; color:var(--pc-text-muted); font-weight:600; margin-left:4px;">
        (${totalComments})
      </span>
    </h2>

    <div class="comment-list" id="commentList">
      ${renderCommentsList(story)}
    </div>

    ${replyBanner}

    <form class="comment-form" id="commentForm">
      <input type="text"
             id="commentInput"
             placeholder="${replyingTo ? 'Write a reply...' : 'Write a comment...'}"
             required
             autocomplete="off">
      <button type="submit" aria-label="Send">
        <i class="fas fa-paper-plane"></i>
      </button>
    </form>
  `;

  /* Attach submit handler */
  const form = document.getElementById('commentForm');
  if (form) form.addEventListener('submit', handleCommentSubmit);

  /* Attach comment action handlers */
  attachCommentActionHandlers();
}

/* ---------- Render Comments List (nested) ---------- */
function renderCommentsList(story) {
  const comments = story.comments || [];

  if (!comments.length) {
    return `<p class="empty-state">No comments yet. Be the first!</p>`;
  }

  return comments.map(c => renderCommentItem(c, story)).join('');
}

function renderCommentItem(comment, story) {
  const user = APP.user || { name: 'You' };
  const likedBy = comment.likedBy || [];
  const isLiked = likedBy.includes(user.name);
  const isOwn = comment.authorId === 'user_self' ||
                comment.authorId === (APP.user && APP.user.id);

  const cRole = getRoleBadgeInfo(comment.authorRole || 'member');
  const cName = comment.authorName || 'User';
  const cInit = cName.charAt(0).toUpperCase();
  const cAuthorId = comment.authorId || '';

  const replyCount = (comment.replies || []).length;

  return `
    <div class="comment-item" data-comment-id="${comment.id}">
      <button type="button"
              class="comment-avatar ${cRole.avatarClass}"
              onclick="handleCommentAuthorTap('${cAuthorId}')"
              aria-label="View profile">
        ${comment.authorAvatar
          ? `<img src="${comment.authorAvatar}" alt="" onerror="this.style.display='none'; this.parentElement.textContent='${cInit}'">`
          : cInit
        }
      </button>
      <div class="comment-body">
        <div class="comment-author-row">
          <p class="comment-author">
            <span onclick="handleCommentAuthorTap('${cAuthorId}')"
                  class="comment-author-name-link">
              ${escapeHtml(cName)}
            </span>
            ${comment.authorRole === 'expert' ? '<i class="fas fa-circle-check comment-verified" title="Expert"></i>' : ''}
          </p>
          ${isOwn ? `
            <button type="button" class="comment-delete-btn"
                    onclick="deleteComment('${comment.id}')"
                    aria-label="Delete comment">
              <i class="fas fa-trash"></i>
            </button>
          ` : ''}
        </div>
        <p class="comment-text">${escapeHtml(comment.text)}</p>
        <div class="comment-meta-row">
          <span class="comment-time">${timeAgo(comment.date)}</span>
          <button type="button"
                  class="comment-action-btn ${isLiked ? 'liked' : ''}"
                  data-comment-like="${comment.id}"
                  aria-label="Like">
            <i class="${isLiked ? 'fas' : 'far'} fa-heart"></i>
            <span>${comment.likes || 0}</span>
          </button>
          <button type="button"
                  class="comment-action-btn"
                  data-comment-reply="${comment.id}"
                  aria-label="Reply">
            <i class="far fa-comment"></i>
            <span>Reply</span>
          </button>
        </div>

        ${replyCount > 0 ? `
          <button type="button"
                  class="comment-view-replies"
                  onclick="toggleCommentReplies('${comment.id}')">
            <i class="fas fa-chevron-down"></i>
            <span>View ${replyCount} ${replyCount === 1 ? 'reply' : 'replies'}</span>
          </button>
          <div class="comment-replies" data-replies-for="${comment.id}" style="display:none;">
            ${(comment.replies || []).map(r => renderReplyItem(r)).join('')}
          </div>
        ` : ''}
      </div>
    </div>
  `;
}

function renderReplyItem(reply) {
  const user = APP.user || { name: 'You' };
  const likedBy = reply.likedBy || [];
  const isLiked = likedBy.includes(user.name);
  const isOwn = reply.authorId === 'user_self' ||
                reply.authorId === (APP.user && APP.user.id);

  const rRole = getRoleBadgeInfo(reply.authorRole || 'member');
  const rName = reply.authorName || 'User';
  const rInit = rName.charAt(0).toUpperCase();
  const rAuthorId = reply.authorId || '';

  return `
    <div class="comment-reply-item" data-comment-id="${reply.id}">
      <button type="button"
              class="comment-avatar comment-avatar-sm ${rRole.avatarClass}"
              onclick="handleCommentAuthorTap('${rAuthorId}')"
              aria-label="View profile">
        ${reply.authorAvatar
          ? `<img src="${reply.authorAvatar}" alt="" onerror="this.style.display='none'; this.parentElement.textContent='${rInit}'">`
          : rInit
        }
      </button>
      <div class="comment-body">
        <div class="comment-author-row">
          <p class="comment-author">
            <span onclick="handleCommentAuthorTap('${rAuthorId}')"
                  class="comment-author-name-link">
              ${escapeHtml(rName)}
            </span>
            ${reply.authorRole === 'expert' ? '<i class="fas fa-circle-check comment-verified" title="Expert"></i>' : ''}
          </p>
          ${isOwn ? `
            <button type="button" class="comment-delete-btn"
                    onclick="deleteComment('${reply.id}', true)"
                    aria-label="Delete reply">
              <i class="fas fa-trash"></i>
            </button>
          ` : ''}
        </div>
        <p class="comment-text">${escapeHtml(reply.text)}</p>
        <div class="comment-meta-row">
          <span class="comment-time">${timeAgo(reply.date)}</span>
          <button type="button"
                  class="comment-action-btn ${isLiked ? 'liked' : ''}"
                  data-comment-like="${reply.id}"
                  aria-label="Like">
            <i class="${isLiked ? 'fas' : 'far'} fa-heart"></i>
            <span>${reply.likes || 0}</span>
          </button>
        </div>
      </div>
    </div>
  `;
}

/* ---------- Attach Comment Action Handlers ---------- */
function attachCommentActionHandlers() {
  const modal = document.getElementById('commentModal');
  if (!modal) return;

  /* Reply buttons */
  modal.querySelectorAll('[data-comment-reply]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      startCommentReply(btn.dataset.commentReply);
    });
  });

  /* Like buttons */
  modal.querySelectorAll('[data-comment-like]').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleCommentLike(btn.dataset.commentLike);
    });
  });
}

/* ---------- START REPLY ---------- */
function startCommentReply(commentId) {
  if (!isLoggedIn()) {
    showToast('Sign in to reply');
    return;
  }

  feedState.replyingTo = commentId;

  const story = (APP.stories || []).find(s => s.id === feedState.activeCommentStoryId);
  const modal = document.getElementById('commentModal');
  if (!story || !modal) return;

  renderCommentModal(story, modal);

  /* Focus input */
  setTimeout(() => {
    const input = document.getElementById('commentInput');
    if (input) input.focus();
  }, 100);
}

function cancelCommentReply() {
  feedState.replyingTo = null;

  const story = (APP.stories || []).find(s => s.id === feedState.activeCommentStoryId);
  const modal = document.getElementById('commentModal');
  if (!story || !modal) return;

  renderCommentModal(story, modal);
}

/* ---------- TOGGLE REPLIES ---------- */
function toggleCommentReplies(commentId) {
  const container = document.querySelector(`[data-replies-for="${commentId}"]`);
  const btn = document.querySelector(`[data-comment-reply="${commentId}"]`)
    ?.closest('.comment-item')
    ?.querySelector('.comment-view-replies');

  if (!container || !btn) return;

  const isHidden = container.style.display === 'none' || !container.style.display;
  container.style.display = isHidden ? 'block' : 'none';

  const icon = btn.querySelector('i');
  const span = btn.querySelector('span');
  if (icon) icon.className = isHidden ? 'fas fa-chevron-up' : 'fas fa-chevron-down';
  if (span) {
    const count = container.children.length;
    span.textContent = `${isHidden ? 'Hide' : 'View'} ${count} ${count === 1 ? 'reply' : 'replies'}`;
  }
}

/* ---------- LIKE COMMENT ---------- */
function toggleCommentLike(commentId) {
  const story = (APP.stories || []).find(s => s.id === feedState.activeCommentStoryId);
  if (!story) return;

  const target = findCommentById(story, commentId);
  if (!target) return;

  const user = APP.user || { name: 'You' };
  target.likedBy = target.likedBy || [];

  if (target.likedBy.includes(user.name)) {
    target.likedBy = target.likedBy.filter(n => n !== user.name);
    target.likes = Math.max(0, (target.likes || 0) - 1);
  } else {
    target.likedBy.push(user.name);
    target.likes = (target.likes || 0) + 1;
  }

  Storage.set(APP.KEYS.STORIES, APP.stories);

  /* Update UI in place */
  const btn = document.querySelector(`[data-comment-like="${commentId}"]`);
  if (btn) {
    btn.classList.toggle('liked', target.likedBy.includes(user.name));
    const icon = btn.querySelector('i');
    const span = btn.querySelector('span');
    if (icon) icon.className = target.likedBy.includes(user.name) ? 'fas fa-heart' : 'far fa-heart';
    if (span) span.textContent = target.likes;
  }
}

/* ---------- DELETE COMMENT ---------- */
function deleteComment(commentId, isReply = false) {
  if (!confirm('Delete this ' + (isReply ? 'reply' : 'comment') + '?')) return;

  const story = (APP.stories || []).find(s => s.id === feedState.activeCommentStoryId);
  if (!story) return;

  if (isReply) {
    /* Remove from parent's replies */
    story.comments.forEach(c => {
      if (c.replies) {
        c.replies = c.replies.filter(r => r.id !== commentId);
      }
    });
  } else {
    /* Remove top-level comment */
    story.comments = story.comments.filter(c => c.id !== commentId);
  }

  Storage.set(APP.KEYS.STORIES, APP.stories);

  showToast('Deleted');

  /* Re-render modal */
  const modal = document.getElementById('commentModal');
  if (modal) renderCommentModal(story, modal);

  /* Re-render feed for updated count */
  const feed = document.getElementById('storyFeed');
  if (feed) feed.innerHTML = renderStoryFeed();
  attachFeedItemHandlers();
}

/* ---------- FIND COMMENT BY ID ---------- */
function findCommentById(story, commentId) {
  if (!story || !story.comments) return null;

  for (const c of story.comments) {
    if (c.id === commentId) return c;
    if (c.replies) {
      for (const r of c.replies) {
        if (r.id === commentId) return r;
      }
    }
  }
  return null;
}

/* ---------- SUBMIT COMMENT OR REPLY ---------- */
function handleCommentSubmit(e) {
  e.preventDefault();

  if (!isLoggedIn()) {
    showToast('Sign in to comment');
    return;
  }

  const story = (APP.stories || []).find(s => s.id === feedState.activeCommentStoryId);
  if (!story) return;

  const input = document.getElementById('commentInput');
  const text = input?.value?.trim();
  if (!text) return;

  const user = APP.user || { name: 'You', avatar: null };

  const newComment = {
    id: 'c_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
    authorId: 'user_self',
    authorName: user.name,
    authorAvatar: user.avatar,
    authorRole: 'member',
    text,
    date: new Date().toISOString(),
    likes: 0,
    likedBy: []
  };

  if (feedState.replyingTo) {
    /* Add as reply */
    const parent = findCommentById(story, feedState.replyingTo);
    if (parent) {
      parent.replies = parent.replies || [];
      parent.replies.push(newComment);
    }
    feedState.replyingTo = null;
    showToast('Reply posted');
  } else {
    /* Add as top-level comment */
    story.comments = story.comments || [];
    story.comments.push(newComment);
    showToast('Comment posted');
  }

  Storage.set(APP.KEYS.STORIES, APP.stories);

  input.value = '';

  /* Re-render modal */
  const modal = document.getElementById('commentModal');
  if (modal) renderCommentModal(story, modal);

  /* Re-render feed for updated count */
  const feed = document.getElementById('storyFeed');
  if (feed) feed.innerHTML = renderStoryFeed();
  attachFeedItemHandlers();
}

/* ============================================================ */
/* 15. EXPORTS                                                   */
/* ============================================================ */
window.renderFeed = renderFeed;
window.renderStoryFeed = renderStoryFeed;
window.isSavedStory = isSavedStory;
window.handleAuthorTap = handleAuthorTap;
window.handleCommentAuthorTap = handleCommentAuthorTap;
window.openStoryComposer = openStoryComposer;
window.handleStorySubmit = handleStorySubmit;
window.removeComposerPhoto = removeComposerPhoto;
window.toggleStoryLike = toggleStoryLike;
window.toggleStorySave = toggleStorySave;
window.shareStory = shareStory;
window.openStoryMenu = openStoryMenu;
window.confirmDeleteStory = confirmDeleteStory;
window.openStoryDetail = openStoryDetail;
window.openStoryComments = openStoryComments;
window.handleCommentSubmit = handleCommentSubmit;
window.attachFeedHandlers = attachFeedHandlers;
window.attachFeedItemHandlers = attachFeedItemHandlers;

/* Comment system */
window.startCommentReply = startCommentReply;
window.cancelCommentReply = cancelCommentReply;
window.toggleCommentReplies = toggleCommentReplies;
window.toggleCommentLike = toggleCommentLike;
window.deleteComment = deleteComment;

console.log('[AquaQuest] Feed loaded — with comment reply/like/delete');