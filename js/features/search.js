/* ============================================================ */
/* AQUAQUEST — SEARCH SYSTEM                                     */
/* Search sites, stories, users                                  */
/* ============================================================ */

let searchState = {
  isOpen: false,
  query: '',
  results: {
    sites: [],
    stories: [],
    users: [],
    tags: []
  }
};

/* ============================================================ */
/* 1. OPEN / CLOSE                                               */
/* ============================================================ */
function openNavSearch() {
  const nav = document.getElementById('topNav');
  const input = document.getElementById('navSearchInput');
  if (!nav) return;

  searchState.isOpen = true;
  nav.classList.add('search-mode');

  setTimeout(() => {
    if (input) {
      input.value = '';
      input.focus();
    }
  }, 100);
}

function closeNavSearch() {
  const nav = document.getElementById('topNav');
  const input = document.getElementById('navSearchInput');
  const clear = document.getElementById('navSearchClear');

  searchState.isOpen = false;
  searchState.query = '';
  searchState.results = { sites: [], stories: [], users: [], tags: [] };

  if (nav) nav.classList.remove('search-mode');
  if (input) input.value = '';
  if (clear) clear.classList.remove('visible');

  hideSearchOverlay();
  if (input) input.blur();
}

/* ============================================================ */
/* 2. HANDLERS                                                   */
/* ============================================================ */
function initSearchHandlers() {
  const searchIcon = document.getElementById('searchIcon');
  const backBtn = document.getElementById('navSearchBack');
  const input = document.getElementById('navSearchInput');
  const clearBtn = document.getElementById('navSearchClear');

  if (searchIcon) searchIcon.addEventListener('click', openNavSearch);
  if (backBtn) backBtn.addEventListener('click', closeNavSearch);

  if (input) {
    input.addEventListener('input', handleSearchInput);
    input.addEventListener('focus', () => {
      if (searchState.query.length >= 1) showSearchOverlay();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (input) {
        input.value = '';
        input.focus();
      }
      searchState.query = '';
      clearBtn.classList.remove('visible');
      hideSearchOverlay();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchState.isOpen) closeNavSearch();
  });
}

function handleSearchInput(e) {
  const query = e.target.value.trim().toLowerCase();
  searchState.query = query;

  const clearBtn = document.getElementById('navSearchClear');
  if (query.length > 0) {
    if (clearBtn) clearBtn.classList.add('visible');
  } else {
    if (clearBtn) clearBtn.classList.remove('visible');
    hideSearchOverlay();
    return;
  }

  if (query.length >= 1) {
    performSearch(query);
    showSearchOverlay();
  }
}

/* ============================================================ */
/* 3. SEARCH LOGIC                                               */
/* ============================================================ */
function performSearch(query) {
  searchState.results = {
    sites: searchSites(query).slice(0, 3),
    stories: searchStories(query).slice(0, 4),
    users: searchUsers(query).slice(0, 3),
    tags: searchTags(query).slice(0, 4)
  };
}

function searchSites(query) {
  return (SITES || []).filter(s =>
    s.name.toLowerCase().includes(query) ||
    s.type.toLowerCase().includes(query) ||
    (s.location.area || '').toLowerCase().includes(query) ||
    (s.tags || []).some(t => t.toLowerCase().includes(query))
  ).map(s => ({
    id: s.id,
    name: s.name,
    type: s.type,
    cover: s.cover,
    location: s.location.area
  }));
}

function searchStories(query) {
  return (APP.stories || []).filter(s =>
    (s.title || '').toLowerCase().includes(query) ||
    (s.content || '').toLowerCase().includes(query) ||
    (s.authorName || '').toLowerCase().includes(query)
  ).map(s => ({
    id: s.id,
    title: s.title || (s.content || '').substring(0, 50),
    authorName: s.authorName,
    image: s.image
  }));
}

function searchUsers(query) {
  const results = [];

  /* Real users */
  if (typeof EXPERTS !== 'undefined') {
    EXPERTS.forEach(e => {
      if (e.name.toLowerCase().includes(query) || e.specialization.toLowerCase().includes(query)) {
        results.push({
          id: e.id,
          name: e.name,
          avatar: e.avatar,
          role: 'expert',
          title: e.title
        });
      }
    });
  }

  /* Self */
  if (APP.user && APP.user.name && APP.user.name.toLowerCase().includes(query)) {
    results.unshift({
      id: 'user_self',
      name: APP.user.name,
      avatar: APP.user.avatar,
      role: 'self',
      title: 'You'
    });
  }

  return results;
}

function searchTags(query) {
  const tags = [
    { id: 'observation', label: 'Observations', icon: 'fa-eye' },
    { id: 'story', label: 'Stories', icon: 'fa-book-open' },
    { id: 'tip', label: 'Tips', icon: 'fa-lightbulb' },
    { id: 'awareness', label: 'Awareness', icon: 'fa-bullhorn' },
    { id: 'sighting', label: 'Sightings', icon: 'fa-fish' },
    { id: 'question', label: 'Questions', icon: 'fa-question' }
  ];

  return tags.filter(t =>
    t.label.toLowerCase().includes(query) ||
    t.id.toLowerCase().includes(query)
  );
}

/* ============================================================ */
/* 4. OVERLAY                                                    */
/* ============================================================ */
function showSearchOverlay() {
  let backdrop = document.getElementById('searchBackdrop');
  let panel = document.getElementById('searchResultsPanel');

  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.id = 'searchBackdrop';
    backdrop.className = 'search-overlay-backdrop';
    backdrop.addEventListener('click', () => {
      hideSearchOverlay();
      const input = document.getElementById('navSearchInput');
      if (input) input.blur();
    });
    document.body.appendChild(backdrop);
  }

  if (!panel) {
    panel = document.createElement('div');
    panel.id = 'searchResultsPanel';
    panel.className = 'search-results-panel';
    document.body.appendChild(panel);
  }

  renderSearchResults();

  requestAnimationFrame(() => {
    backdrop.classList.add('active');
    panel.classList.add('active');
  });
}

function hideSearchOverlay() {
  const backdrop = document.getElementById('searchBackdrop');
  const panel = document.getElementById('searchResultsPanel');
  if (backdrop) backdrop.classList.remove('active');
  if (panel) panel.classList.remove('active');
}

/* ============================================================ */
/* 5. RENDER RESULTS                                             */
/* ============================================================ */
function renderSearchResults() {
  const panel = document.getElementById('searchResultsPanel');
  if (!panel) return;

  const { sites, stories, users, tags } = searchState.results;
  const hasResults = sites.length || stories.length || users.length || tags.length;

  if (!hasResults) {
    panel.innerHTML = `
      <div class="search-empty">
        <i class="fas fa-search"></i>
        <p>No results for "${escapeHtml(searchState.query)}"</p>
      </div>
    `;
    return;
  }

  let html = '';

  if (sites.length) {
    html += `
      <div class="search-section">
        <p class="search-section-label"><i class="fas fa-water"></i> Water Sites</p>
        ${sites.map(s => `
          <button class="search-result-item" onclick="closeNavSearch(); setTimeout(()=>openSiteDetail('${s.id}'), 200);">
            <div class="search-result-thumb">
              ${s.cover ? `<img src="${s.cover}" alt="" onerror="this.style.display='none'">` : '<i class="fas fa-water"></i>'}
            </div>
            <div class="search-result-info">
              <p class="search-result-title">${escapeHtml(s.name)}</p>
              <p class="search-result-sub">${escapeHtml(s.location)} · ${capitalize(s.type)}</p>
            </div>
          </button>
        `).join('')}
      </div>
    `;
  }

  if (stories.length) {
    html += `
      <div class="search-section">
        <p class="search-section-label"><i class="fas fa-book-open"></i> Stories</p>
        ${stories.map(s => `
          <button class="search-result-item" onclick="closeNavSearch(); setTimeout(()=>openStoryDetail('${s.id}'), 200);">
            <div class="search-result-thumb">
              ${s.image ? `<img src="${s.image}" alt="" onerror="this.style.display='none'">` : '<i class="fas fa-book-open"></i>'}
            </div>
            <div class="search-result-info">
              <p class="search-result-title">${escapeHtml(s.title)}</p>
              <p class="search-result-sub">by ${escapeHtml(s.authorName)}</p>
            </div>
          </button>
        `).join('')}
      </div>
    `;
  }

  if (users.length) {
    html += `
      <div class="search-section">
        <p class="search-section-label"><i class="fas fa-user"></i> People</p>
        ${users.map(u => `
          <button class="search-result-item" onclick="closeNavSearch(); setTimeout(()=>handleUserResultTap('${u.id}', '${u.role}'), 200);">
            <div class="search-result-avatar ${u.role === 'expert' ? 'vet' : ''}">
              ${u.avatar
                ? `<img src="${u.avatar}" alt="" onerror="this.style.display='none'; this.parentElement.textContent='${u.name.charAt(0).toUpperCase()}'">`
                : u.name.charAt(0).toUpperCase()
              }
            </div>
            <div class="search-result-info">
              <p class="search-result-title">${escapeHtml(u.name)}</p>
              <p class="search-result-sub">${escapeHtml(u.title || '')}</p>
            </div>
          </button>
        `).join('')}
      </div>
    `;
  }

  if (tags.length) {
    html += `
      <div class="search-section">
        <p class="search-section-label"><i class="fas fa-hashtag"></i> Topics</p>
        <div class="search-hints-row">
          ${tags.map(t => `
            <button class="search-hint-item" onclick="handleSearchTagClick('${t.id}')">
              <i class="fas ${t.icon}"></i> ${t.label}
            </button>
          `).join('')}
        </div>
      </div>
    `;
  }

  panel.innerHTML = html;
}

function handleUserResultTap(userId, role) {
  if (userId === 'user_self') {
    showPage('profile');
    return;
  }
  if (role === 'expert' && typeof openExpertProfile === 'function') {
    openExpertProfile(userId);
    return;
  }
  showToast('Profile view coming soon');
}

function handleSearchTagClick(tagId) {
  hideSearchOverlay();
  closeNavSearch();

  setTimeout(() => {
    showPage('feed');
    setTimeout(() => {
      if (typeof feedState !== 'undefined') {
        feedState.activeFilter = tagId;
        const feed = document.getElementById('storyFeed');
        if (feed && typeof renderStoryFeed === 'function') {
          feed.innerHTML = renderStoryFeed();
          if (typeof attachFeedHandlers === 'function') attachFeedHandlers();
        }
      }
    }, 200);
  }, 200);
}

/* ============================================================ */
/* 6. INIT                                                       */
/* ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(initSearchHandlers, 150);
});

window.openNavSearch = openNavSearch;
window.closeNavSearch = closeNavSearch;
window.handleUserResultTap = handleUserResultTap;
window.handleSearchTagClick = handleSearchTagClick;

console.log('[AquaQuest] Search loaded');