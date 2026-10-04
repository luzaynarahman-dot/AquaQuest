/* ============================================================ */
/* AQUAQUEST — SKELETON LOADERS                                  */
/* Loading placeholders for all pages                            */
/* ============================================================ */

/* ---------- EXPLORE (HOME) ---------- */
function skeletonHome() {
  return `
    <div class="page-container">

      <section class="skeleton-card" style="min-height:140px;">
        <div class="skeleton-hero">
          <div class="skeleton-hero-text">
            <div class="skeleton skeleton-line long" style="height:24px; margin-bottom:12px;"></div>
            <div class="skeleton skeleton-line medium" style="margin-bottom:20px;"></div>
            <div class="skeleton skeleton-pill" style="width:140px; height:38px;"></div>
          </div>
          <div class="skeleton skeleton-rect skeleton-hero-image"></div>
        </div>
      </section>

      <section class="skeleton-card" style="min-height:100px;">
        <div class="skeleton-hero">
          <div class="skeleton-hero-text">
            <div class="skeleton skeleton-line short" style="height:12px; margin-bottom:8px;"></div>
            <div class="skeleton skeleton-line long" style="height:18px;"></div>
          </div>
          <div class="skeleton skeleton-circle" style="width:60px; height:60px;"></div>
        </div>
      </section>

      <div style="display:grid; grid-template-columns:repeat(4,1fr); gap:8px; margin-bottom:20px;">
        <div class="skeleton skeleton-rect" style="height:80px;"></div>
        <div class="skeleton skeleton-rect" style="height:80px;"></div>
        <div class="skeleton skeleton-rect" style="height:80px;"></div>
        <div class="skeleton skeleton-rect" style="height:80px;"></div>
      </div>

      <div class="skeleton skeleton-line short" style="height:18px; margin-bottom:14px;"></div>
      <div style="display:flex; gap:12px; margin-bottom:24px; overflow:hidden;">
        <div class="skeleton skeleton-rect" style="min-width:220px; height:180px;"></div>
        <div class="skeleton skeleton-rect" style="min-width:220px; height:180px;"></div>
        <div class="skeleton skeleton-rect" style="min-width:220px; height:180px;"></div>
      </div>

      <div class="skeleton skeleton-line short" style="height:18px; margin-bottom:14px;"></div>
      <div class="skeleton-list-item">
        <div class="skeleton skeleton-rect" style="width:76px; height:76px; border-radius:12px;"></div>
        <div class="skeleton-list-info">
          <div class="skeleton skeleton-line short" style="height:13px; margin-bottom:8px;"></div>
          <div class="skeleton skeleton-line long" style="margin-bottom:6px;"></div>
          <div class="skeleton skeleton-line medium"></div>
        </div>
      </div>
      <div class="skeleton-list-item">
        <div class="skeleton skeleton-rect" style="width:76px; height:76px; border-radius:12px;"></div>
        <div class="skeleton-list-info">
          <div class="skeleton skeleton-line short" style="height:13px; margin-bottom:8px;"></div>
          <div class="skeleton skeleton-line long" style="margin-bottom:6px;"></div>
          <div class="skeleton skeleton-line medium"></div>
        </div>
      </div>

    </div>
  `;
}

/* ---------- SITES ---------- */
function skeletonSites() {
  return `
    <div class="page-container">
      <section class="skeleton-card" style="min-height:100px;">
        <div class="skeleton skeleton-line medium" style="height:20px; margin-bottom:10px;"></div>
        <div class="skeleton skeleton-line long"></div>
      </section>

      <div class="skeleton skeleton-pill" style="width:100%; height:48px; margin:16px 0;"></div>

      <div class="skeleton skeleton-line short" style="height:18px; margin-bottom:14px;"></div>
      <div style="display:flex; gap:12px; overflow:hidden; margin-bottom:20px;">
        <div class="skeleton skeleton-rect" style="min-width:220px; height:180px;"></div>
        <div class="skeleton skeleton-rect" style="min-width:220px; height:180px;"></div>
      </div>
    </div>
  `;
}

/* ---------- FEED / STORIES ---------- */
function skeletonFeed() {
  const posts = Array(3).fill(`
    <div class="skeleton-post">
      <div class="skeleton-post-header">
        <div class="skeleton skeleton-circle" style="width:42px; height:42px;"></div>
        <div style="flex:1;">
          <div class="skeleton skeleton-line short" style="height:13px; margin-bottom:6px;"></div>
          <div class="skeleton skeleton-line" style="width:30%; height:10px;"></div>
        </div>
      </div>
      <div class="skeleton skeleton-line long" style="height:14px; margin-bottom:10px;"></div>
      <div class="skeleton skeleton-line full" style="margin-bottom:8px;"></div>
      <div class="skeleton skeleton-line short"></div>
      <div class="skeleton skeleton-rect" style="width:100%; aspect-ratio:16/10; margin-top:12px;"></div>
    </div>
  `).join('');

  return `
    <div class="page-container">
      <section class="skeleton-card" style="min-height:100px;">
        <div class="skeleton skeleton-line long" style="height:20px; margin-bottom:10px;"></div>
        <div class="skeleton skeleton-line medium"></div>
      </section>
      <div class="skeleton skeleton-pill" style="width:100%; height:56px; margin-bottom:16px;"></div>
      <div style="display:flex; gap:8px; margin-bottom:16px; overflow:hidden;">
        <div class="skeleton skeleton-pill" style="width:70px; height:34px;"></div>
        <div class="skeleton skeleton-pill" style="width:90px; height:34px;"></div>
        <div class="skeleton skeleton-pill" style="width:80px; height:34px;"></div>
      </div>
      ${posts}
    </div>
  `;
}

/* ---------- PROFILE ---------- */
function skeletonProfile() {
  return `
    <div class="page-container">
      <section class="skeleton-card" style="min-height:180px;">
        <div style="display:flex; gap:14px; margin-bottom:16px;">
          <div class="skeleton skeleton-circle" style="width:80px; height:80px;"></div>
          <div style="flex:1;">
            <div class="skeleton skeleton-line medium" style="height:18px; margin-bottom:10px;"></div>
            <div class="skeleton skeleton-line short" style="margin-bottom:8px;"></div>
            <div class="skeleton skeleton-line long"></div>
          </div>
        </div>
        <div style="display:grid; grid-template-columns:repeat(4,1fr); gap:8px;">
          <div class="skeleton skeleton-rect" style="height:50px;"></div>
          <div class="skeleton skeleton-rect" style="height:50px;"></div>
          <div class="skeleton skeleton-rect" style="height:50px;"></div>
          <div class="skeleton skeleton-rect" style="height:50px;"></div>
        </div>
      </section>
      <section class="skeleton-card" style="min-height:200px;">
        <div class="skeleton skeleton-line short" style="height:18px; margin-bottom:14px;"></div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px;">
          <div class="skeleton skeleton-rect" style="aspect-ratio:1;"></div>
          <div class="skeleton skeleton-rect" style="aspect-ratio:1;"></div>
        </div>
      </section>
    </div>
  `;
}

/* ---------- MAP ---------- */
function skeletonMap() {
  return `
    <div class="page-container">
      <div class="skeleton skeleton-rect" style="width:100%; height:70vh; border-radius:20px;"></div>
    </div>
  `;
}

/* ---------- OBSERVE ---------- */
function skeletonObserve() {
  return `
    <div class="page-container">
      <section class="skeleton-card" style="min-height:100px;">
        <div class="skeleton skeleton-line long" style="height:20px; margin-bottom:10px;"></div>
        <div class="skeleton skeleton-line medium"></div>
      </section>
      <div style="display:flex; flex-direction:column; gap:12px;">
        <div class="skeleton skeleton-rect" style="height:80px;"></div>
        <div class="skeleton skeleton-rect" style="height:80px;"></div>
        <div class="skeleton skeleton-rect" style="height:80px;"></div>
        <div class="skeleton skeleton-rect" style="height:80px;"></div>
      </div>
    </div>
  `;
}

/* ---------- GENERIC ---------- */
function skeletonGeneric() {
  return `
    <div class="page-container">
      <section class="skeleton-card">
        <div class="skeleton skeleton-line long" style="height:20px; margin-bottom:16px;"></div>
        <div class="skeleton skeleton-line medium" style="margin-bottom:10px;"></div>
        <div class="skeleton skeleton-line full" style="margin-bottom:10px;"></div>
        <div class="skeleton skeleton-line short"></div>
      </section>
    </div>
  `;
}

/* ---------- ROUTER ---------- */
function showSkeleton(pageName) {
  const page = document.getElementById('page-' + pageName);
  if (!page) return;

  let html = '';
  switch (pageName) {
    case 'home':         html = skeletonHome();         break;
    case 'map':          html = skeletonMap();          break;
    case 'sites':        html = skeletonSites();        break;
    case 'site-detail':  html = skeletonGeneric();      break;
    case 'observe':      html = skeletonObserve();      break;
    case 'feed':         html = skeletonFeed();         break;
    case 'learn':        html = skeletonGeneric();      break;
    case 'experts':      html = skeletonGeneric();      break;
    case 'actions':      html = skeletonSites();        break;
    case 'profile':      html = skeletonProfile();      break;
    case 'user-profile': html = skeletonProfile();      break;
    case 'reports':      html = skeletonGeneric();      break;
    default:             html = skeletonGeneric();
  }

  page.innerHTML = html;
}

window.showSkeleton = showSkeleton;
console.log('[AquaQuest] Skeleton loaded');