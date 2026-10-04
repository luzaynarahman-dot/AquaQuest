/* ============================================================ */
/* AQUAQUEST — WATER SITES DATA                                  */
/* 10 Sites: 4 Rich + 6 Light                                     */
/* Observers count is DYNAMIC — calculated from observations      */
/* ============================================================ */

const SITES = [
  /* ============================================================ */
  /* 🌊 RICH DATA SITES (4) — Full observation history             */
  /* ============================================================ */
  {
    id: 'bakkhali_river',
    name: 'Bakkhali River',
    type: 'river',
    status: 'verified',
    cover: 'assets/bakkhali.jpg',
    location: {
      area: "Cox's Bazar",
      district: 'Chattogram',
      lat: 21.4272,
      lng: 92.0058
    },
    description: 'A meandering river winding through green hills and forests of Cox\'s Bazar. Home to diverse freshwater fish, birds, and otters.',
    tags: ['Freshwater', 'Biodiversity', 'Fishing', 'Heritage'],
    createdBy: 'system',
    createdAt: '2025-06-01T00:00:00.000Z'
  },
  {
    id: 'himchari_stream',
    name: 'Himchari Stream',
    type: 'stream',
    status: 'verified',
    cover: 'assets/himchari.jpg',
    location: {
      area: 'Himchari',
      district: "Cox's Bazar",
      lat: 21.3560,
      lng: 92.0210
    },
    description: 'A seasonal freshwater stream cascading from the Himchari hills into the Bay of Bengal. Cool, clear water supports rich forest biodiversity.',
    tags: ['Freshwater', 'Forest', 'Birdlife', 'Eco-tourism'],
    createdBy: 'system',
    createdAt: '2025-06-01T00:00:00.000Z'
  },
  {
    id: 'kolatoli_beach',
    name: 'Kolatoli Beach',
    type: 'beach',
    status: 'verified',
    cover: 'assets/kolatoli.jpg',
    location: {
      area: "Cox's Bazar",
      district: 'Chattogram',
      lat: 21.4180,
      lng: 92.0050
    },
    description: 'One of the world\'s longest natural sandy beaches. Marine litter and tourist pressure are growing concerns.',
    tags: ['Marine', 'Tourism', 'Shorebirds', 'Intertidal'],
    createdBy: 'system',
    createdAt: '2025-06-01T00:00:00.000Z'
  },
  {
    id: 'rumaliar_canal',
    name: 'Rumaliar Canal',
    type: 'canal',
    status: 'verified',
    cover: 'assets/rumaliar.jpg',
    location: {
      area: "Cox's Bazar",
      district: 'Chattogram',
      lat: 21.4356,
      lng: 92.0123
    },
    description: 'A coastal canal connecting inland water systems to the Bay of Bengal. Critical habitat for juvenile fish and migratory birds.',
    tags: ['Coastal', 'Tidal', 'Migratory Birds', 'Conservation'],
    createdBy: 'system',
    createdAt: '2025-06-01T00:00:00.000Z'
  },

  /* ============================================================ */
  /* 🌿 LIGHT DATA SITES (6) — Just for map richness               */
  /* ============================================================ */
  {
    id: 'inani_coast',
    name: 'Inani Coast',
    type: 'beach',
    status: 'verified',
    cover: 'assets/inani.jpg',
    location: {
      area: 'Inani',
      district: "Cox's Bazar",
      lat: 21.2260,
      lng: 92.0530
    },
    description: 'A quieter stretch of coastline south of Cox\'s Bazar. Known for rocky outcrops and cleaner waters than main tourist beaches.',
    tags: ['Marine', 'Rocky Shore', 'Quiet', 'Snorkeling'],
    createdBy: 'system',
    createdAt: '2025-06-01T00:00:00.000Z'
  },
  {
    id: 'rezu_river',
    name: 'Rezu River',
    type: 'river',
    status: 'verified',
    cover: 'assets/rezu.jpg',
    location: {
      area: 'Chakaria',
      district: "Cox's Bazar",
      lat: 21.7830,
      lng: 92.0410
    },
    description: 'A small river flowing through Chakaria region. Important local freshwater source for agriculture and fishing communities.',
    tags: ['Freshwater', 'Agriculture', 'Local Fishery'],
    createdBy: 'system',
    createdAt: '2025-06-01T00:00:00.000Z'
  },
  {
    id: 'maheshkhali_channel',
    name: 'Maheshkhali Channel',
    type: 'estuary',
    status: 'verified',
    cover: 'assets/maheshkhali.jpg',
    location: {
      area: 'Maheshkhali',
      district: "Cox's Bazar",
      lat: 21.5630,
      lng: 91.9600
    },
    description: 'A tidal channel separating Maheshkhali Island from the mainland. Rich in shellfish, crabs, and migratory waterfowl.',
    tags: ['Estuary', 'Tidal', 'Shellfish', 'Waterfowl'],
    createdBy: 'system',
    createdAt: '2025-06-01T00:00:00.000Z'
  },
  {
    id: 'local_wetland',
    name: 'Chakaria Wetland',
    type: 'wetland',
    status: 'verified',
    cover: 'assets/wetland.jpg',
    location: {
      area: 'Chakaria',
      district: "Cox's Bazar",
      lat: 21.7730,
      lng: 92.0270
    },
    description: 'A seasonal wetland supporting migratory birds and aquatic life. Critical habitat during winter months.',
    tags: ['Wetland', 'Migratory Birds', 'Seasonal', 'Biodiversity'],
    createdBy: 'system',
    createdAt: '2025-06-01T00:00:00.000Z'
  },
  {
    id: 'padma_rajshahi',
    name: 'Padma River — Rajshahi Ghat',
    type: 'river',
    status: 'verified',
    cover: 'assets/padma.jpg',
    location: {
      area: 'Rajshahi',
      district: 'Rajshahi',
      lat: 24.3745,
      lng: 88.6042
    },
    description: 'A major stretch of the Padma River near Rajshahi city. Key monitoring point for sediment and water quality.',
    tags: ['Major River', 'Sediment', 'Urban'],
    createdBy: 'system',
    createdAt: '2025-06-01T00:00:00.000Z'
  },
  {
    id: 'buriganga_sadarghat',
    name: 'Buriganga River — Sadarghat',
    type: 'river',
    status: 'verified',
    cover: 'assets/buriganga.jpg',
    location: {
      area: 'Dhaka',
      district: 'Dhaka',
      lat: 23.7083,
      lng: 90.4056
    },
    description: 'The historic Buriganga at Sadarghat — a busy river port facing severe pollution challenges. Critical urban water health monitoring site.',
    tags: ['Urban River', 'Pollution', 'Historic', 'Port'],
    createdBy: 'system',
    createdAt: '2025-06-01T00:00:00.000Z'
  }
];

/* ============================================================ */
/* HELPERS                                                       */
/* ============================================================ */
function getSiteById(id) {
  return SITES.find(s => s.id === id) || null;
}

function getAllSites() {
  return SITES;
}

function getSiteType(siteId) {
  const site = getSiteById(siteId);
  return site ? site.type : 'waterbody';
}

function getSiteTypeIcon(type) {
  const icons = {
    river: 'fa-water',
    canal: 'fa-water',
    stream: 'fa-water',
    beach: 'fa-umbrella-beach',
    waterfall: 'fa-mountain-sun',
    pond: 'fa-circle-dot',
    lake: 'fa-water',
    wetland: 'fa-leaf',
    estuary: 'fa-water'
  };
  return icons[type] || 'fa-water';
}

function getSiteTypeLabel(type) {
  const labels = {
    river: 'River',
    canal: 'Canal',
    stream: 'Stream',
    beach: 'Beach',
    waterfall: 'Waterfall',
    pond: 'Pond',
    lake: 'Lake',
    wetland: 'Wetland',
    estuary: 'Estuary'
  };
  return labels[type] || 'Waterbody';
}

/* ============================================================ */
/* OBSERVERS — DYNAMIC count                                     */
/* ============================================================ */
function getObserversCount(siteId) {
  if (!siteId) return 0;
  const observations = (APP.observations || []).filter(o => o.siteId === siteId);
  const uniqueReporterIds = new Set(observations.map(o => o.reporterId).filter(Boolean));
  return uniqueReporterIds.size;
}

/* ============================================================ */
/* EXPORTS                                                       */
/* ============================================================ */
window.SITES = SITES;
window.getSiteById = getSiteById;
window.getAllSites = getAllSites;
window.getSiteType = getSiteType;
window.getSiteTypeIcon = getSiteTypeIcon;
window.getSiteTypeLabel = getSiteTypeLabel;
window.getObserversCount = getObserversCount;

console.log('[AquaQuest] Sites loaded —', SITES.length, 'sites');