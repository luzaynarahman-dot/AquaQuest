/* ============================================================ */
/* AQUAQUEST — SERVICE WORKER                                    */
/* Hybrid caching: static cache-first, API network-first         */
/* ============================================================ */

const SW_VERSION = 'aquaquest-v1.0.0';
const STATIC_CACHE = `${SW_VERSION}-static`;
const RUNTIME_CACHE = `${SW_VERSION}-runtime`;

/* ============================================================ */
/* 1. STATIC ASSETS TO PRECACHE                                  */
/* ============================================================ */
const PRECACHE_URLS = [
  './',
  './index.html',
  './offline.html',
  './manifest.json',

  /* CSS */
  './css/palette.css',
  './css/main.css',
  './css/pages.css',
  './css/profile.css',
  './css/profile-view.css',
  './css/skeleton.css',
  './css/onboarding.css',

  /* Core JS */
  './js/core/storage.js',
  './js/core/mode.js',
  './js/core/theme.js',
  './js/core/toast.js',
  './js/app.js',

  /* Data */
  './js/data/sites.js',
  './js/data/challenges.js',
  './js/data/learn-topics.js',

  /* Demo */
  './js/demo-data.js',
  './js/demo.js',

  /* Services */
  './js/services/api.js',

  /* UI */
  './js/ui/skeleton.js',
  './js/ui/drawer.js',
  './js/ui/onboarding.js',

  /* PWA */
  './js/pwa.js',

  /* Features */
  './js/features/observations.js',
  './js/features/contributions.js',
  './js/features/gamification.js',
  './js/features/notifications.js',
  './js/features/social.js',
  './js/features/monitoring.js',
  './js/features/site-creation.js',
  './js/features/challenge-submission.js',
  './js/features/charts.js',
  './js/features/search.js',
  './js/features/navigation.js',

  /* Pages */
  './js/pages/home.js',
  './js/pages/map.js',
  './js/pages/sites.js',
  './js/pages/site-detail.js',
  './js/pages/observe.js',
  './js/pages/feed.js',
  './js/pages/learn.js',
  './js/pages/saved.js',
  './js/pages/actions.js',
  './js/pages/challenge-detail.js',
  './js/pages/activity-flow.js',
  './js/pages/contribution-detail.js',
  './js/pages/report.js',
  './js/pages/reports.js',
  './js/pages/profile.js',
  './js/pages/profile-view.js'
];

/* ============================================================ */
/* 2. INSTALL                                                    */
/* ============================================================ */
self.addEventListener('install', (event) => {
  console.log('[SW] Installing', SW_VERSION);

  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[SW] Precaching static assets');
        /* Use addAll with individual failure tolerance */
        return Promise.allSettled(
          PRECACHE_URLS.map(url =>
            cache.add(url).catch(err => {
              console.warn('[SW] Failed to cache:', url, err.message);
            })
          )
        );
      })
      .then(() => {
        console.log('[SW] Install complete');
        return self.skipWaiting();
      })
  );
});

/* ============================================================ */
/* 3. ACTIVATE                                                   */
/* ============================================================ */
self.addEventListener('activate', (event) => {
  console.log('[SW] Activating', SW_VERSION);

  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter(name => name.startsWith('aquaquest-') && name !== STATIC_CACHE && name !== RUNTIME_CACHE)
            .map(name => {
              console.log('[SW] Deleting old cache:', name);
              return caches.delete(name);
            })
        );
      })
      .then(() => {
        console.log('[SW] Activate complete');
        return self.clients.claim();
      })
  );
});

/* ============================================================ */
/* 4. FETCH — Hybrid strategy                                    */
/* ============================================================ */
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  /* Skip non-GET requests */
  if (request.method !== 'GET') return;

  /* Skip chrome-extension and other protocols */
  if (!url.protocol.startsWith('http')) return;

  /* ============================================================ */
  /* STRATEGY A: External APIs — Network first, cache fallback     */
  /* ============================================================ */
  const isAPIRequest =
    url.hostname.includes('api.openweathermap.org') ||
    url.hostname.includes('api.open-meteo.com') ||
    url.hostname.includes('nominatim.openstreetmap.org');

  if (isAPIRequest) {
    event.respondWith(networkFirstStrategy(request));
    return;
  }

  /* ============================================================ */
  /* STRATEGY B: Tile layers — Cache first (long-lived)            */
  /* ============================================================ */
  const isTileRequest =
    url.hostname.includes('tile.openstreetmap.org') ||
    url.hostname.includes('basemaps.cartocdn.com');

  if (isTileRequest) {
    event.respondWith(cacheFirstStrategy(request, RUNTIME_CACHE));
    return;
  }

  /* ============================================================ */
  /* STRATEGY C: CDN libraries — Cache first                        */
  /* ============================================================ */
  const isCDNRequest =
    url.hostname.includes('cdnjs.cloudflare.com') ||
    url.hostname.includes('cdn.jsdelivr.net') ||
    url.hostname.includes('unpkg.com') ||
    url.hostname.includes('fonts.googleapis.com') ||
    url.hostname.includes('fonts.gstatic.com');

  if (isCDNRequest) {
    event.respondWith(cacheFirstStrategy(request, RUNTIME_CACHE));
    return;
  }

  /* ============================================================ */
  /* STRATEGY D: Local static assets — Cache first, network update  */
  /* ============================================================ */
  if (url.origin === self.location.origin) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  /* Default: network with cache fallback */
  event.respondWith(networkFirstStrategy(request));
});

/* ============================================================ */
/* 5. STRATEGIES                                                 */
/* ============================================================ */

/* ---------- Cache first (best for static assets) ---------- */
async function cacheFirstStrategy(request, cacheName) {
  try {
    const cached = await caches.match(request);
    if (cached) return cached;

    const response = await fetch(request);

    if (response && response.status === 200) {
      const cache = await caches.open(cacheName);
      cache.put(request, response.clone());
    }

    return response;
  } catch (err) {
    console.warn('[SW] Cache-first failed:', request.url, err.message);
    return new Response('Offline', { status: 503, statusText: 'Offline' });
  }
}

/* ---------- Network first (fresh data, cache fallback) ---------- */
async function networkFirstStrategy(request) {
  try {
    const response = await fetch(request);

    if (response && response.status === 200) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, response.clone());
    }

    return response;
  } catch (err) {
    const cached = await caches.match(request);
    if (cached) return cached;

    /* For navigation requests, show offline page */
    if (request.mode === 'navigate') {
      const offline = await caches.match('./offline.html');
      if (offline) return offline;
    }

    return new Response('Offline', { status: 503, statusText: 'Offline' });
  }
}

/* ---------- Stale while revalidate (local assets) ---------- */
async function staleWhileRevalidate(request) {
  const cached = await caches.match(request);

  const fetchPromise = fetch(request)
    .then((response) => {
      if (response && response.status === 200) {
        caches.open(STATIC_CACHE).then(cache => {
          cache.put(request, response.clone());
        });
      }
      return response;
    })
    .catch(() => cached);

  return cached || fetchPromise;
}

/* ============================================================ */
/* 6. MESSAGE HANDLING                                           */
/* ============================================================ */
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data && event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then(names => Promise.all(names.map(n => caches.delete(n))))
    );
  }
});

console.log('[SW] Service worker loaded');
