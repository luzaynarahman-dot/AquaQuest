/* ============================================================ */
/* AQUAQUEST — SAVED POSTS PAGE                                  */
/* Replaces "Experts" with meaningful saved content              */
/* ============================================================ */

let savedState = {
  activeFilter: 'all'
};

/* ============================================================ */
/* 1. MAIN RENDER                                                */
/* ============================================================ */
function renderSaved() {
  const page = document.getElementById('page-saved');
  if (!page) return;

  const savedIds = Storage.get('aq_saved_stories', []);
  const allStories = APP.stories || [];
  const savedStories = savedIds
    .map(id => allStories.find(s => s.id === id))
    .filter(Boolean);

  const filters = [
    { id: 'all',         label: 'All',         icon: 'fa-bookmark',  count: savedStories.length },
    { id: 'observation', label: 'Observations', icon: 'fa-eye',      count: savedStories.filter(s => s.type === 'observation').length },
    { id: 'story',       label: 'Stories',     icon: 'fa-book-open', count: savedStories.filter(s => s.type === 'story').length },
    { id: 'tip',         label: 'Tips',        icon: 'fa-lightbulb', count: savedStories.filter(s => s.type === 'tip').length },
    { id: 'awareness',   label: 'Awareness',   icon: 'fa-bullhorn',  count: savedStories.filter(s => s.type === 'awareness').length },
    { id: 'question',    label: 'Questions',   icon: 'fa-question',  count: savedStories.filter(s => s.type === 'question').length }
  ];

  page.innerHTML = `
    <div class="page-container">

      ${renderBackHeader('Saved Posts', savedStories.length + ' items saved')}

      ${savedStories.length === 0 ? renderEmptySaved() : `
        <div class="site-filter-chips" id="savedFilterChips">
          ${filters.map(f => `
            <button type="button" class="site-filter-chip ${savedState.activeFilter === f.id ? 'active' : ''}"
                    data-saved-filter="${f.id}">
              <i class="fas ${f.icon}"></i> ${f.label} (${f.count})
            </button>
          `).join('')}
        </div>

        <div class="saved-list" id="savedList">
          ${renderSavedList()}
        </div>
      `}

    </div>
  `;

  attachSavedHandlers();
}

function renderEmptySaved() {
  return `
    <div class="empty-state" style="background:var(--pc-card); border-radius:16px; padding:60px 20px;">
      <i class="fas fa-bookmark" style="font-size:48px; opacity:0.4; display:block; margin-bottom:16px; color:var(--pc-accent);"></i>
      <p style="font-size:15px; font-weight:800; color:var(--pc-text); margin-bottom:8px;">
        No saved posts yet
      </p>
      <p style="font-size:12.5px; color:var(--pc-text-muted); margin-bottom:18px; max-width:280px; margin-left:auto; margin-right:auto; line-height:1.5;">
        Tap the bookmark icon on any post to save it for later reading
      </p>
      <button type="button" class="btn btn-primary btn-sm" onclick="showPage('feed')">
        <i class="fas fa-book-open"></i> Explore Stories
      </button>
    </div>
  `;
}

function renderSavedList() {
  const savedIds = Storage.get('aq_saved_stories', []);
  const allStories = APP.stories || [];

  let savedStories = savedIds
    .map(id => allStories.find(s => s.id === id))
    .filter(Boolean);

  if (savedState.activeFilter !== 'all') {
    savedStories = savedStories.filter(s => s.type === savedState.activeFilter);
  }

  if (!savedStories.length) {
    return `
      <div class="empty-state" style="background:var(--pc-card); border-radius:16px; padding:40px 20px;">
        <i class="fas fa-filter"></i>
        <p style="font-size:14px; font-weight:700; color:var(--pc-text);">No posts in this category</p>
      </div>
    `;
  }

  return savedStories.map(s => renderSavedCard(s)).join('');
}

function renderSavedCard(story) {
  const typeBadge = getStoryTypeBadge(story.type);
  const authorName = story.authorName || 'User';
  const authorInitial = authorName.charAt(0).toUpperCase();

  return `
    <article class="saved-card" onclick="openStoryDetail('${story.id}')">
      ${story.image ? `
        <div class="saved-card-image">
          <img src="${story.image}" alt="" onerror="this.style.display='none'">
        </div>
      ` : ''}

      <div class="saved-card-body">
        <div class="saved-card-header">
          <div class="saved-card-avatar">
            ${story.authorAvatar
              ? `<img src="${story.authorAvatar}" alt="" onerror="this.style.display='none'; this.parentElement.textContent='${authorInitial}'">`
              : authorInitial
            }
          </div>
          <div style="flex:1; min-width:0;">
            <p class="saved-card-author">${escapeHtml(authorName)}</p>
            <p class="saved-card-time">${timeAgo(story.date)}</p>
          </div>
          <span class="saved-card-type" style="background:${typeBadge.color}15; color:${typeBadge.color};">
            <i class="fas ${typeBadge.icon}"></i> ${typeBadge.label}
          </span>
        </div>

        ${story.title ? `<p class="saved-card-title">${escapeHtml(story.title)}</p>` : ''}
        <p class="saved-card-text">${escapeHtml((story.content || '').substring(0, 150))}${(story.content || '').length > 150 ? '…' : ''}</p>

        <div class="saved-card-footer">
          <span><i class="fas fa-heart"></i> ${story.likes || 0}</span>
          <span><i class="fas fa-comment"></i> ${(story.comments || []).length}</span>
          <button type="button" class="saved-card-remove"
                  onclick="event.stopPropagation(); removeSavedPost('${story.id}')"
                  aria-label="Remove">
            <i class="fas fa-bookmark"></i> Saved
          </button>
        </div>
      </div>
    </article>
  `;
}

/* ============================================================ */
/* 2. HANDLERS                                                   */
/* ============================================================ */
function attachSavedHandlers() {
  document.querySelectorAll('[data-saved-filter]').forEach(chip => {
    chip.addEventListener('click', () => {
      savedState.activeFilter = chip.dataset.savedFilter;

      document.querySelectorAll('[data-saved-filter]').forEach(c => {
        c.classList.toggle('active', c.dataset.savedFilter === savedState.activeFilter);
      });

      const list = document.getElementById('savedList');
      if (list) list.innerHTML = renderSavedList();
    });
  });
}

/* ============================================================ */
/* 3. REMOVE SAVED POST                                          */
/* ============================================================ */
function removeSavedPost(storyId) {
  let saved = Storage.get('aq_saved_stories', []);
  if (!Array.isArray(saved)) saved = [];

  saved = saved.filter(id => id !== storyId);
  Storage.set('aq_saved_stories', saved);

  showToast('Removed from saved');
  renderSaved();
}

/* ============================================================ */
/* 4. EXPORTS                                                    */
/* ============================================================ */
window.renderSaved = renderSaved;
window.removeSavedPost = removeSavedPost;

console.log('[AquaQuest] Saved page loaded');