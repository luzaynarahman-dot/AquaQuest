/* ============================================================ */
/* AQUAQUEST — CHALLENGES + BADGES + LEVELS                      */
/* Community actions with activityType/evidenceType              */
/* ============================================================ */

const CHALLENGES = [
  {
    id: 'chal_cleanup_bakkhali',
    title: 'Bakkhali River Clean-up',
    type: 'cleanup',
    activityType: 'cleanup',
    evidenceType: 'before-after',
    icon: 'fa-broom',
    color: '#10B981',
    siteId: 'bakkhali_river',
    cover: 'assets/challenge-bakkhali.jpg',
    description: 'Join hands with local fishers and students to remove plastic waste from the riverbank. Every bag collected protects fish, birds, and otters.',
    goal: 50,
    contributionCount: 3,
    points: 50,
    badge: 'steward',
    activityGoal: 'Collect 50 bags of litter',
    duration: '3 hours',
    estimatedTime: '20–30 minutes',
    location: "Bakkhali River, Cox's Bazar",
    host: "Cox's Bazar River Watch",
    maxParticipants: 50,
    startDate: '2026-11-15T08:00:00.000Z',
    endDate: '2026-11-15T11:00:00.000Z',
    status: 'open',
    joined: 32,
    evidenceRequired: [
      { icon: 'fa-camera', label: 'Before photo', hint: 'Show the area before cleaning' },
      { icon: 'fa-camera', label: 'After photo', hint: 'Show the same area after' },
      { icon: 'fa-note-sticky', label: 'Activity note', hint: 'What did you collect?' }
    ]
  },

  {
    id: 'chal_observation_week',
    title: '7-Day Observation Streak',
    type: 'observation-week',
    activityType: 'observation',
    evidenceType: 'observation',
    icon: 'fa-eye',
    color: '#0891B2',
    siteId: null,
    cover: 'assets/challenge-canal.jpg',
    description: 'Observe any waterbody for 7 consecutive days. Track changes in clarity, wildlife, and litter. Your consistent data helps scientists spot trends.',
    goal: 100,
    contributionCount: 2,
    points: 250,
    badge: 'consistent_observer',
    activityGoal: 'Log 7 daily observations',
    duration: '7 days',
    estimatedTime: '5–10 minutes per day',
    location: 'Any waterbody near you',
    host: 'AquaQuest Community',
    maxParticipants: 1000,
    startDate: '2026-11-01T00:00:00.000Z',
    endDate: '2026-11-08T23:59:59.000Z',
    status: 'open',
    joined: 847,
    evidenceRequired: [
      { icon: 'fa-eye', label: 'Water observation', hint: 'Clarity, litter, smell, wildlife' },
      { icon: 'fa-camera', label: 'Photo (recommended)', hint: 'Helps document conditions' }
    ]
  },

  {
    id: 'chal_rumaliar_canal',
    title: 'Rumaliar Canal Restoration',
    type: 'restoration',
    activityType: 'restoration',
    evidenceType: 'before-after',
    icon: 'fa-seedling',
    color: '#22C55E',
    siteId: 'rumaliar_canal',
    cover: 'assets/challenge-rumaliar.jpg',
    description: 'Help plant native mangrove saplings along the canal banks. Mangroves filter water, shelter fish nurseries, and protect against erosion.',
    goal: 40,
    contributionCount: 2,
    points: 150,
    badge: 'restorer',
    activityGoal: 'Plant 200 mangrove saplings',
    duration: '4 hours',
    estimatedTime: '30–45 minutes',
    location: "Rumaliar Canal, Cox's Bazar",
    host: 'BD Marine Conservation',
    maxParticipants: 40,
    startDate: '2026-11-22T07:00:00.000Z',
    endDate: '2026-11-22T11:00:00.000Z',
    status: 'open',
    joined: 18,
    evidenceRequired: [
      { icon: 'fa-camera', label: 'Before photo', hint: 'Show the area before planting' },
      { icon: 'fa-seedling', label: 'Activity type', hint: 'What did you do?' },
      { icon: 'fa-camera', label: 'After photo', hint: 'Show your planting results' },
      { icon: 'fa-note-sticky', label: 'Activity note', hint: 'Plants, area, observations' }
    ]
  },

  {
    id: 'chal_biodiversity_watch',
    title: 'Biodiversity Watch — Himchari',
    type: 'biodiversity-watch',
    activityType: 'wildlife',
    evidenceType: 'wildlife-observation',
    icon: 'fa-fish',
    color: '#8B5CF6',
    siteId: 'himchari_waterfall',
    cover: 'assets/site-himchari.jpg',
    description: 'Spend a morning spotting and recording wildlife around the waterfall. Birds, butterflies, fish, and plants — every sighting adds to our biodiversity map.',
    goal: 30,
    contributionCount: 2,
    points: 80,
    badge: 'naturalist',
    activityGoal: 'Record 20 species sightings',
    duration: '2 hours',
    estimatedTime: '15–25 minutes',
    location: 'Himchari Waterfall',
    host: 'Himchari Eco Club',
    maxParticipants: 30,
    startDate: '2026-11-30T06:30:00.000Z',
    endDate: '2026-11-30T08:30:00.000Z',
    status: 'open',
    joined: 24,
    evidenceRequired: [
      { icon: 'fa-fish', label: 'Wildlife observed', hint: 'Species or category' },
      { icon: 'fa-camera', label: 'Photo (if possible)', hint: 'Helps verify sighting' },
      { icon: 'fa-note-sticky', label: 'Notes', hint: 'Behavior, location, count' }
    ]
  },

  {
    id: 'chal_kolatoli_marine',
    title: 'Kolatoli Beach Marine Litter Survey',
    type: 'cleanup',
    activityType: 'cleanup',
    evidenceType: 'before-after',
    icon: 'fa-umbrella-beach',
    color: '#F59E0B',
    siteId: 'kolatoli_beach',
    cover: 'assets/site-kolatoli.jpg',
    description: 'A scientific beach litter survey — count, categorize, and remove marine debris from a 100m stretch of beach. Data contributes to global marine litter research.',
    goal: 60,
    contributionCount: 1,
    points: 120,
    badge: 'marine_guardian',
    activityGoal: 'Complete 100m survey + cleanup',
    duration: '2.5 hours',
    estimatedTime: '25–40 minutes',
    location: "Kolatoli Beach, Cox's Bazar",
    host: 'Ocean Plastic Coalition',
    maxParticipants: 60,
    startDate: '2026-12-05T06:00:00.000Z',
    endDate: '2026-12-05T08:30:00.000Z',
    status: 'open',
    joined: 41,
    evidenceRequired: [
      { icon: 'fa-camera', label: 'Before photo', hint: 'Show the stretch before cleanup' },
      { icon: 'fa-camera', label: 'After photo', hint: 'Same stretch after cleanup' },
      { icon: 'fa-note-sticky', label: 'Litter note', hint: 'Count, types, observations' }
    ]
  }
];

/* ============================================================ */
/* BADGE DEFINITIONS                                             */
/* ============================================================ */
const BADGES = {
  first_observation: {
    id: 'first_observation',
    label: 'First Observation',
    icon: 'fa-eye',
    color: '#0891B2',
    description: 'Logged your very first water observation'
  },
  photographer: {
    id: 'photographer',
    label: 'Photographer',
    icon: 'fa-camera',
    color: '#8B5CF6',
    description: 'Shared 10 observations with photos'
  },
  explorer: {
    id: 'explorer',
    label: 'Explorer',
    icon: 'fa-compass',
    color: '#22C55E',
    description: 'Observed 5 different waterbodies'
  },
  scientist: {
    id: 'scientist',
    label: 'Scientist',
    icon: 'fa-flask',
    color: '#3B82F6',
    description: 'Recorded 10 observations with pH readings'
  },
  watchdog: {
    id: 'watchdog',
    label: 'Watchdog',
    icon: 'fa-shield-halved',
    color: '#EF4444',
    description: 'Reported 5 water concerns'
  },
  steward: {
    id: 'steward',
    label: 'Steward',
    icon: 'fa-seedling',
    color: '#10B981',
    description: 'Joined a community cleanup action'
  },
  restorer: {
    id: 'restorer',
    label: 'Restorer',
    icon: 'fa-tree',
    color: '#22C55E',
    description: 'Participated in a restoration action'
  },
  naturalist: {
    id: 'naturalist',
    label: 'Naturalist',
    icon: 'fa-fish',
    color: '#F59E0B',
    description: 'Completed a biodiversity watch'
  },
  marine_guardian: {
    id: 'marine_guardian',
    label: 'Marine Guardian',
    icon: 'fa-water',
    color: '#0284C7',
    description: 'Completed a marine litter survey'
  },
  consistent_observer: {
    id: 'consistent_observer',
    label: 'Consistent Observer',
    icon: 'fa-calendar-check',
    color: '#8B5CF6',
    description: 'Maintained a 7-day observation streak'
  },
  streak_30: {
    id: 'streak_30',
    label: 'Dedicated',
    icon: 'fa-fire',
    color: '#F97316',
    description: '30-day observation streak'
  },
  aqua_guardian: {
    id: 'aqua_guardian',
    label: 'Aqua Guardian',
    icon: 'fa-crown',
    color: '#FBBF24',
    description: 'Reached the highest guardian level'
  }
};

/* ============================================================ */
/* LEVEL SYSTEM                                                  */
/* ============================================================ */
const LEVELS = [
  { name: 'Bronze Guardian',   minPoints: 0,     icon: 'fa-medal',      color: '#CD7F32' },
  { name: 'Silver Guardian',   minPoints: 100,   icon: 'fa-medal',      color: '#C0C0C0' },
  { name: 'Gold Guardian',     minPoints: 500,   icon: 'fa-medal',      color: '#FFD700' },
  { name: 'Platinum Guardian', minPoints: 1500,  icon: 'fa-crown',      color: '#E5E4E2' },
  { name: 'Aqua Guardian',     minPoints: 5000,  icon: 'fa-crown',      color: '#22D3EE' }
];

/* ============================================================ */
/* ACTIVITY TYPE HELPERS                                         */
/* ============================================================ */
function getActivityTypeLabel(activityType) {
  const labels = {
    cleanup: 'Cleanup',
    restoration: 'Restoration',
    observation: 'Observation',
    wildlife: 'Wildlife Watch',
    measurement: 'Water Measurement'
  };
  return labels[activityType] || 'Activity';
}

function getActivityTypeIcon(activityType) {
  const icons = {
    cleanup: 'fa-broom',
    restoration: 'fa-seedling',
    observation: 'fa-eye',
    wildlife: 'fa-fish',
    measurement: 'fa-flask'
  };
  return icons[activityType] || 'fa-clipboard';
}

function getActivityTypeColor(activityType) {
  const colors = {
    cleanup: '#10B981',
    restoration: '#22C55E',
    observation: '#0891B2',
    wildlife: '#8B5CF6',
    measurement: '#F59E0B'
  };
  return colors[activityType] || '#0891B2';
}

/* ============================================================ */
/* HELPERS                                                       */
/* ============================================================ */
function getChallengeById(id) {
  return CHALLENGES.find(c => c.id === id) || null;
}

function getChallengesForSite(siteId) {
  return CHALLENGES.filter(c => c.siteId === siteId || c.siteId === null);
}

function getBadgeById(id) {
  return BADGES[id] || null;
}

function getLevelForPoints(points) {
  let current = LEVELS[0];
  for (const level of LEVELS) {
    if (points >= level.minPoints) current = level;
  }
  return current;
}

function getNextLevel(points) {
  for (const level of LEVELS) {
    if (points < level.minPoints) return level;
  }
  return null;
}

/* ============================================================ */
/* EXPORTS                                                       */
/* ============================================================ */
window.CHALLENGES = CHALLENGES;
window.BADGES = BADGES;
window.LEVELS = LEVELS;
window.getChallengeById = getChallengeById;
window.getChallengesForSite = getChallengesForSite;
window.getBadgeById = getBadgeById;
window.getLevelForPoints = getLevelForPoints;
window.getNextLevel = getNextLevel;
window.getActivityTypeLabel = getActivityTypeLabel;
window.getActivityTypeIcon = getActivityTypeIcon;
window.getActivityTypeColor = getActivityTypeColor;

console.log('[AquaQuest] Challenges loaded —', CHALLENGES.length, 'challenges');