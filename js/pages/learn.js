/* ============================================================ */
/* AQUAQUEST — LEARN PAGE                                        */
/* Educational content on water, biodiversity, One Health        */
/* ============================================================ */

let learnState = {
  activeCategory: 'all'
};

/* ============================================================ */
/* 1. MAIN RENDER                                                */
/* ============================================================ */
function renderLearn() {
  const page = document.getElementById('page-learn');
  if (!page) return;

  page.innerHTML = `
    <div class="page-container">

      <section class="explore-hero" style="min-height:auto; padding:18px 20px;">
        <div class="explore-hero-inner">
          <div>
            <h2 class="explore-greeting" style="font-size:1.7rem;">Learn</h2>
            <p class="explore-sub" style="margin-bottom:0;">
              Understand water, protect life
            </p>
          </div>
          <div class="explore-illustration" style="width:80px; height:80px;">
            <img src="assets/hero-welcome.jpg" alt="" onerror="this.style.opacity='0'">
          </div>
        </div>
      </section>

      <div class="learn-cat-chips" id="learnCatChips">
        ${renderLearnCategoryChips()}
      </div>

      <div class="learn-topics-list" id="learnTopicsList">
        ${renderLearnTopics()}
      </div>

    </div>
  `;

  attachLearnHandlers();
}

/* ============================================================ */
/* 2. CATEGORY CHIPS                                             */
/* ============================================================ */
function renderLearnCategoryChips() {
  return LEARN_CATEGORIES.map(c => {
    const count = c.id === 'all'
      ? LEARN_TOPICS.length
      : LEARN_TOPICS.filter(t => t.category === c.id).length;

    return `
      <button class="learn-cat-chip ${learnState.activeCategory === c.id ? 'active' : ''}"
              data-learn-cat="${c.id}">
        <i class="fas ${c.icon}"></i>
        ${c.label} (${count})
      </button>
    `;
  }).join('');
}

/* ============================================================ */
/* 3. TOPICS LIST                                                */
/* ============================================================ */
function renderLearnTopics() {
  const topics = learnState.activeCategory === 'all'
    ? LEARN_TOPICS
    : LEARN_TOPICS.filter(t => t.category === learnState.activeCategory);

  if (!topics.length) {
    return `
      <div class="empty-state" style="background:var(--pc-card); border-radius:16px; padding:40px 20px;">
        <i class="fas fa-graduation-cap"></i>
        <p style="font-size:14px; font-weight:700; color:var(--pc-text);">No topics here</p>
      </div>
    `;
  }

  return topics.map(t => renderLearnTopicCard(t)).join('');
}

function renderLearnTopicCard(topic) {
  const catIcon = getLearnCategoryIcon(topic.category);
  const catLabel = getLearnCategoryLabel(topic.category);

  const levelColors = {
    'Beginner': { bg: 'var(--pc-success-soft)', color: 'var(--pc-success)' },
    'Intermediate': { bg: 'var(--pc-warning-soft)', color: 'var(--pc-warning)' },
    'Advanced': { bg: 'var(--pc-danger-soft)', color: 'var(--pc-danger)' }
  };
  const level = levelColors[topic.level] || levelColors.Beginner;

  return `
    <button class="learn-topic-card" onclick="openLearnTopic('${topic.id}')">
      <div class="learn-topic-icon" style="background:${topic.color}15; color:${topic.color};">
        <i class="fas ${topic.icon}"></i>
      </div>
      <div class="learn-topic-info">
        <div class="learn-topic-top">
          <span class="learn-topic-cat">
            <i class="fas ${catIcon}"></i> ${catLabel}
          </span>
          <span class="learn-topic-level" style="background:${level.bg}; color:${level.color};">
            ${topic.level}
          </span>
        </div>
        <p class="learn-topic-title">${escapeHtml(topic.title)}</p>
        <p class="learn-topic-summary">${escapeHtml(topic.summary.substring(0, 110))}${topic.summary.length > 110 ? '…' : ''}</p>
        <div class="learn-topic-meta">
          <span><i class="far fa-clock"></i> ${topic.readTime}</span>
        </div>
      </div>
      <i class="fas fa-chevron-right learn-topic-arrow"></i>
    </button>
  `;
}

/* ============================================================ */
/* 4. HANDLERS                                                   */
/* ============================================================ */
function attachLearnHandlers() {
  document.querySelectorAll('[data-learn-cat]').forEach(chip => {
    chip.addEventListener('click', () => {
      learnState.activeCategory = chip.dataset.learnCat;

      document.querySelectorAll('[data-learn-cat]').forEach(c => {
        c.classList.toggle('active', c.dataset.learnCat === learnState.activeCategory);
      });

      const list = document.getElementById('learnTopicsList');
      if (list) list.innerHTML = renderLearnTopics();
    });
  });
}

/* ============================================================ */
/* 5. TOPIC DETAIL MODAL                                         */
/* ============================================================ */
function openLearnTopic(topicId) {
  const topic = getLearnTopicById(topicId);
  if (!topic) return;

  const modal = document.getElementById('learnArticleModal');
  if (!modal) return;

  const catIcon = getLearnCategoryIcon(topic.category);
  const catLabel = getLearnCategoryLabel(topic.category);

  modal.querySelector('.modal-content').innerHTML = `
    <button class="close-modal" onclick="closeModal('learnArticleModal')">
      <i class="fas fa-times"></i>
    </button>

    <div class="learn-detail-hero" style="background:linear-gradient(135deg, ${topic.color}15, ${topic.color}05);">
      <div class="learn-detail-icon" style="background:${topic.color}20; color:${topic.color};">
        <i class="fas ${topic.icon}"></i>
      </div>
      <span class="learn-detail-cat" style="background:${topic.color}20; color:${topic.color};">
        <i class="fas ${catIcon}"></i> ${catLabel}
      </span>
      <h2 class="learn-detail-title">${escapeHtml(topic.title)}</h2>
      <p class="learn-detail-sub">${escapeHtml(topic.subtitle)}</p>
      <div class="learn-detail-meta">
        <span><i class="far fa-clock"></i> ${topic.readTime}</span>
        <span>·</span>
        <span><i class="fas fa-signal"></i> ${topic.level}</span>
      </div>
    </div>

    <div class="learn-detail-summary">
      <p>${escapeHtml(topic.summary)}</p>
    </div>

    <p class="learn-detail-section-title">
      <i class="fas fa-list-check"></i> Key Points
    </p>
    <ul class="learn-detail-points">
      ${topic.key_points.map(p => `
        <li>
          <i class="fas fa-check"></i>
          <span>${escapeHtml(p)}</span>
        </li>
      `).join('')}
    </ul>

    <div class="learn-detail-action">
      <div class="learn-detail-action-icon">
        <i class="fas fa-bullseye"></i>
      </div>
      <div>
        <p class="learn-detail-action-label">Take Action</p>
        <p class="learn-detail-action-text">${escapeHtml(topic.action)}</p>
      </div>
    </div>

    <button class="btn btn-primary w-full" style="margin-top:16px;" onclick="closeModal('learnArticleModal'); showToast('Keep learning! 🌊')">
      <i class="fas fa-check"></i> Got it
    </button>
  `;

  openModal('learnArticleModal');

  /* Award points for reading */
  if (typeof Gamification !== 'undefined' && Gamification.award) {
    Gamification.award(2, 'Lesson read');
  }
}

/* ============================================================ */
/* 6. EXPORTS                                                    */
/* ============================================================ */
window.renderLearn = renderLearn;
window.openLearnTopic = openLearnTopic;

console.log('[AquaQuest] Learn page loaded');