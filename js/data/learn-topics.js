/* ============================================================ */
/* AQUAQUEST — LEARN TOPICS                                      */
/* Educational content about water, ecosystems & One Health      */
/* ============================================================ */

const LEARN_CATEGORIES = [
  { id: 'all',           label: 'All',              icon: 'fa-border-all',       color: '#0891B2' },
  { id: 'water-health',  label: 'Water Health',     icon: 'fa-droplet',          color: '#22D3EE' },
  { id: 'biodiversity',  label: 'Biodiversity',     icon: 'fa-fish',             color: '#10B981' },
  { id: 'one-health',    label: 'One Health',       icon: 'fa-heart-pulse',      color: '#EF4444' },
  { id: 'ecosystems',    label: 'Ecosystems',       icon: 'fa-tree',             color: '#22C55E' },
  { id: 'citizen-sci',   label: 'Citizen Science',  icon: 'fa-microscope',       color: '#8B5CF6' },
  { id: 'human-impact',  label: 'Human Impact',     icon: 'fa-industry',         color: '#F59E0B' }
];

const LEARN_TOPICS = [
  {
    id: 'learn_001',
    category: 'water-health',
    title: 'What is pH and why does it matter?',
    subtitle: 'Understand the scale that decides if water is safe',
    readTime: '3 min',
    level: 'Beginner',
    icon: 'fa-flask',
    color: '#22D3EE',
    summary: 'pH tells you how acidic or alkaline water is. Most freshwater life thrives between 6.5 and 8.5. When pH drops below 6 or rises above 9, fish struggle to breathe and plants die off.',
    key_points: [
      'pH scale goes from 0 (very acidic) to 14 (very alkaline)',
      'Healthy freshwater sits between 6.5 and 8.5',
      'Acid rain, industrial waste, and algae blooms shift pH',
      'You can test pH with simple strips in seconds'
    ],
    action: 'Test pH at your local waterbody this week and log it in AquaQuest.'
  },
  {
    id: 'learn_002',
    category: 'water-health',
    title: 'Reading water clarity',
    subtitle: 'The 4 levels every citizen scientist should know',
    readTime: '2 min',
    level: 'Beginner',
    icon: 'fa-eye',
    color: '#0891B2',
    summary: 'Clarity is the fastest indicator of water health. It tells you how much sediment, algae, or pollution is suspended in the water — and what that means for life below.',
    key_points: [
      'Excellent: see 3+ meters down — usually safe',
      'Good: see about 1-2 meters — normal',
      'Moderate: murky — algae or sediment present',
      'Poor: very cloudy — needs investigation'
    ],
    action: 'Compare clarity at two different times of day — morning vs evening.'
  },
  {
    id: 'learn_003',
    category: 'biodiversity',
    title: 'Fish as water quality indicators',
    subtitle: 'Why some species tell us more than any sensor',
    readTime: '4 min',
    level: 'Intermediate',
    icon: 'fa-fish',
    color: '#10B981',
    summary: 'Different fish species tolerate different levels of pollution. When sensitive species disappear, it\'s an early warning sign that water quality is declining.',
    key_points: [
      'Trout and loach need pristine, oxygen-rich water',
      'Tilapia and carp tolerate murky, low-oxygen water',
      'Fish kills usually follow pollution events',
      'Recording fish species helps scientists track water health over time'
    ],
    action: 'Log fish species you observe in your next AquaQuest observation.'
  },
  {
    id: 'learn_004',
    category: 'biodiversity',
    title: 'Birds of the wetlands',
    subtitle: 'Your feathered water quality inspectors',
    readTime: '3 min',
    level: 'Beginner',
    icon: 'fa-dove',
    color: '#22C55E',
    summary: 'Waterbirds depend on healthy wetlands for food and nesting. Their presence, absence, and behavior can tell us a lot about the state of our water.',
    key_points: [
      'Herons and egrets need clean water with fish',
      'Kingfishers signal healthy fish populations',
      'Migratory birds avoid polluted wetlands',
      'Bird counts are a powerful citizen science tool'
    ],
    action: 'Bring binoculars next time — count and log bird species.'
  },
  {
    id: 'learn_005',
    category: 'one-health',
    title: 'One Health — the big picture',
    subtitle: 'How human, animal, and environmental health connect',
    readTime: '5 min',
    level: 'Intermediate',
    icon: 'fa-heart-pulse',
    color: '#EF4444',
    summary: 'One Health is a framework that recognizes human health, animal health, and environmental health as deeply interconnected. When water is polluted, everything downstream suffers — including us.',
    key_points: [
      '70% of emerging human diseases come from animals',
      'Polluted water spreads cholera, typhoid, and hepatitis',
      'Healthy ecosystems buffer against disease outbreaks',
      'Citizen science plays a role in early detection'
    ],
    action: 'Read the WHO One Health framework — share key insights with your community.'
  },
  {
    id: 'learn_006',
    category: 'one-health',
    title: 'Waterborne diseases: what to watch for',
    subtitle: 'The link between water quality and public health',
    readTime: '4 min',
    level: 'Advanced',
    icon: 'fa-bacteria',
    color: '#EF4444',
    summary: 'Contaminated water carries bacteria, viruses, and parasites that cause serious illness. Understanding this link helps communities take action before outbreaks occur.',
    key_points: [
      'Cholera thrives in warm, contaminated water',
      'Typhoid spreads through fecal-contaminated water',
      'Leptospirosis risks rise after flooding',
      'Early detection = fewer cases'
    ],
    action: 'Learn about the water-quality alerts in your district.'
  },
  {
    id: 'learn_007',
    category: 'ecosystems',
    title: 'Why mangroves matter',
    subtitle: 'The superheroes of our coastlines',
    readTime: '3 min',
    level: 'Beginner',
    icon: 'fa-tree',
    color: '#22C55E',
    summary: 'Mangroves are coastal forests that act as nurseries for fish, barriers against storms, and powerful carbon sinks. Losing them means losing coastal protection and fisheries.',
    key_points: [
      'Mangroves shelter 75% of tropical commercial fish at some life stage',
      'They absorb up to 4x more carbon than rainforests',
      'Their roots filter pollution from runoff',
      'They protect coasts from cyclones and erosion'
    ],
    action: 'Join a mangrove restoration action near you.'
  },
  {
    id: 'learn_008',
    category: 'ecosystems',
    title: 'The river continuum concept',
    subtitle: 'How rivers work from source to sea',
    readTime: '5 min',
    level: 'Advanced',
    icon: 'fa-water',
    color: '#0891B2',
    summary: 'Rivers are not just flowing water — they\'re dynamic systems where chemistry, biology, and physics change from headwaters to estuary. Understanding this helps us see the whole picture.',
    key_points: [
      'Headwaters are cool, fast, and oxygen-rich',
      'Mid-rivers are wider, warmer, and more productive',
      'Lower reaches are slow, deep, and nutrient-rich',
      'Every stretch supports different life'
    ],
    action: 'Observe the same river at two different points — compare.'
  },
  {
    id: 'learn_009',
    category: 'citizen-sci',
    title: 'How to take an excellent observation',
    subtitle: 'The 5 essential elements of citizen science data',
    readTime: '4 min',
    level: 'Beginner',
    icon: 'fa-camera',
    color: '#8B5CF6',
    summary: 'Citizen science is powerful — but only when data is consistent. Here\'s how to make every observation count.',
    key_points: [
      'Always include date, time, and location',
      'Take photos — even of "nothing unusual"',
      'Note weather and recent conditions',
      'Use consistent vocabulary',
      'Repeat observations at the same spot'
    ],
    action: 'Complete your next observation using all 5 elements.'
  },
  {
    id: 'learn_010',
    category: 'citizen-sci',
    title: 'Data ethics for citizen scientists',
    subtitle: 'Respecting privacy, culture, and ecosystems',
    readTime: '3 min',
    level: 'Intermediate',
    icon: 'fa-shield-heart',
    color: '#8B5CF6',
    summary: 'Good citizen science respects people, places, and wildlife. Learn the ethical principles that guide responsible data collection.',
    key_points: [
      'Never share locations of endangered species publicly',
      'Ask permission before photographing people',
      'Avoid disturbing wildlife for a photo',
      'Respect local cultural practices at water sites'
    ],
    action: 'Review the ethical guidelines before your next observation.'
  },
  {
    id: 'learn_011',
    category: 'human-impact',
    title: 'Plastic pollution in freshwater',
    subtitle: 'The invisible crisis in our rivers',
    readTime: '4 min',
    level: 'Intermediate',
    icon: 'fa-trash',
    color: '#F59E0B',
    summary: 'Plastic doesn\'t just litter our beaches — it breaks down into microplastics that enter the food chain. Freshwater is a major pathway.',
    key_points: [
      'Rivers carry 80% of plastic entering oceans',
      'Microplastics are now found in fish tissue',
      'Single-use plastics are the biggest culprit',
      'Every bag removed = hundreds of microplastics prevented'
    ],
    action: 'Join a community cleanup and log the litter you collect.'
  },
  {
    id: 'learn_012',
    category: 'human-impact',
    title: 'Agriculture and water quality',
    subtitle: 'The double-edged sword of farming',
    readTime: '5 min',
    level: 'Advanced',
    icon: 'fa-seedling',
    color: '#F59E0B',
    summary: 'Agriculture feeds us — but runoff from farms can devastate water ecosystems. Pesticides, fertilizers, and sediment all end up in our rivers.',
    key_points: [
      'Fertilizer runoff causes algal blooms',
      'Algal blooms deplete oxygen — fish suffocate',
      'Pesticides bioaccumulate in the food chain',
      'Buffer strips along rivers reduce impact by 70%'
    ],
    action: 'Talk to a local farmer about their water practices.'
  }
];

/* ============================================================ */
/* HELPERS                                                       */
/* ============================================================ */
function getLearnTopicById(id) {
  return LEARN_TOPICS.find(t => t.id === id) || null;
}

function getLearnTopicsByCategory(catId) {
  if (catId === 'all') return LEARN_TOPICS;
  return LEARN_TOPICS.filter(t => t.category === catId);
}

function getLearnCategoryLabel(catId) {
  const cat = LEARN_CATEGORIES.find(c => c.id === catId);
  return cat ? cat.label : 'All';
}

function getLearnCategoryIcon(catId) {
  const cat = LEARN_CATEGORIES.find(c => c.id === catId);
  return cat ? cat.icon : 'fa-book';
}

/* ============================================================ */
/* EXPORTS                                                       */
/* ============================================================ */
window.LEARN_CATEGORIES = LEARN_CATEGORIES;
window.LEARN_TOPICS = LEARN_TOPICS;
window.getLearnTopicById = getLearnTopicById;
window.getLearnTopicsByCategory = getLearnTopicsByCategory;
window.getLearnCategoryLabel = getLearnCategoryLabel;
window.getLearnCategoryIcon = getLearnCategoryIcon;

console.log('[AquaQuest] Learn topics loaded —', LEARN_TOPICS.length, 'topics');