/* ============================================================ */
/* AQUAQUEST — DEMO DATA                                         */
/* Rich dataset for AquaQuest                     */
/* 11 users · 15 stories · 60+ comments · Full network           */
/* ============================================================ */

const DEMO_DATA = {

  /* ============================================================ */
  /* USERS — 11 community members                                  */
  /* ============================================================ */
  users: {
    user_demo: {
      id: 'user_demo',
      name: 'Luzayna Rahman',
      email: 'demo@aquaquest.app',
      phone: '+880 1712-345678',
      avatar: 'assets/avatar1.jpg',
      coverPhoto: 'assets/bakkhali.jpg',
      location: "Cox's Bazar, Bangladesh",
      bio: 'Marine biology student · Citizen scientist · Protecting the waterbodies I grew up with',
      role: 'member',
      joinedAt: '2026-08-15T00:00:00.000Z',
      followers: 1247,
      following: 342,
      isDemo: true
    },
    user_ayesha: {
      id: 'user_ayesha',
      name: 'Dr. Ayesha Rahman',
      avatar: 'assets/avatar-ayesha.jpg',
      coverPhoto: 'assets/bakkhali.jpg',
      bio: 'Freshwater ecologist studying the rivers of Cox\'s Bazar. Working with local communities to protect waterbodies that sustain us.',
      location: "Cox's Bazar, Bangladesh",
      role: 'expert',
      title: 'Freshwater Ecologist',
      specialization: 'River Ecology',
      experience: 12,
      verified: true,
      followers: 2340,
      following: 156
    },
    user_karim: {
      id: 'user_karim',
      name: 'Dr. Karim Ahmed',
      avatar: 'assets/avatar-karim.jpg',
      coverPhoto: 'assets/himchari.jpg',
      bio: 'Marine biologist focused on coastal ecosystems and mangrove forests. Leading the BD Marine Conservation team.',
      location: "Cox's Bazar, Bangladesh",
      role: 'expert',
      title: 'Marine Biologist',
      specialization: 'Coastal & Marine',
      experience: 15,
      verified: true,
      followers: 1892,
      following: 203
    },
    user_priya: {
      id: 'user_priya',
      name: 'Priya Sharma',
      avatar: 'assets/avatar-priya.jpg',
      coverPhoto: 'assets/kolatoli.jpg',
      bio: 'Environmental scientist specializing in water quality monitoring and public health. Training citizen scientists across Bangladesh.',
      location: 'Dhaka, Bangladesh',
      role: 'expert',
      title: 'Environmental Scientist',
      specialization: 'Water Quality',
      experience: 9,
      verified: true,
      followers: 1567,
      following: 289
    },
    user_rafiq: {
      id: 'user_rafiq',
      name: 'Dr. Rafiq Islam',
      avatar: 'assets/avatar-rafiq.jpg',
      coverPhoto: 'assets/padma.jpg',
      bio: 'Conservation biologist at the intersection of human, animal, and environmental health. One Health advisor.',
      location: 'Rajshahi, Bangladesh',
      role: 'expert',
      title: 'Conservation Biologist',
      specialization: 'One Health',
      experience: 18,
      verified: true,
      followers: 3120,
      following: 178
    },
    user_rahim: {
      id: 'user_rahim',
      name: 'Rahim Hossain',
      avatar: 'assets/avatar2.jpg',
      coverPhoto: 'assets/bakkhali.jpg',
      bio: 'Third-generation fisherman on the Bakkhali River. I know these waters better than anyone.',
      location: "Cox's Bazar, Bangladesh",
      role: 'member',
      followers: 892,
      following: 245
    },
    user_nadia: {
      id: 'user_nadia',
      name: 'Nadia Islam',
      avatar: 'assets/avatar3.jpg',
      coverPhoto: 'assets/rumaliar.jpg',
      bio: 'Student activist. Organizing cleanups and awareness campaigns across coastal communities.',
      location: "Cox's Bazar, Bangladesh",
      role: 'member',
      followers: 654,
      following: 412
    },
    user_tanvir: {
      id: 'user_tanvir',
      name: 'Tanvir Ahmed',
      avatar: 'assets/avatar4.jpg',
      coverPhoto: 'assets/wetland.jpg',
      bio: 'Mangrove restoration volunteer. Planting trees, one sapling at a time.',
      location: 'Chakaria, Bangladesh',
      role: 'member',
      followers: 423,
      following: 187
    },
    user_samiha: {
      id: 'user_samiha',
      name: 'Samiha Khan',
      avatar: 'assets/avatar5.jpg',
      coverPhoto: 'assets/himchari.jpg',
      bio: 'Wildlife photographer documenting biodiversity around Cox\'s Bazar. Every photo tells a story.',
      location: 'Himchari, Bangladesh',
      role: 'member',
      followers: 1120,
      following: 298
    },
    user_farhan: {
      id: 'user_farhan',
      name: 'Farhan Reza',
      avatar: 'assets/avatar6.jpg',
      coverPhoto: 'assets/inani.jpg',
      bio: 'Geography teacher inspiring the next generation of environmental stewards.',
      location: 'Inani, Bangladesh',
      role: 'member',
      followers: 567,
      following: 234
    },
    user_mrinmoy: {
      id: 'user_mrinmoy',
      name: 'Mrinmoy Das',
      avatar: 'assets/avatar7.jpg',
      coverPhoto: 'assets/padma.jpg',
      bio: 'Backend developer. Building tools for citizen scientists.',
      location: 'Dhaka, Bangladesh',
      role: 'member',
      followers: 345,
      following: 412
    }
  },

  /* ============================================================ */
  /* MAIN USER (for auth)                                          */
  /* ============================================================ */
  user: {
    id: 'user_demo',
    name: 'Luzayna Rahman',
    email: 'demo@aquaquest.app',
    phone: '+880 1712-345678',
    avatar: 'assets/avatar1.jpg',
    coverPhoto: 'assets/bakkhali.jpg',
    location: "Cox's Bazar, Bangladesh",
    bio: 'Marine biology student · Citizen scientist · Protecting the waterbodies I grew up with',
    joinedAt: '2026-08-15T00:00:00.000Z',
    followers: 1247,
    following: 342,
    isDemo: true
  },

  /* ============================================================ */
  /* FOLLOWS NETWORK                                               */
  /* ============================================================ */
  follows: {
    user_demo: ['user_ayesha', 'user_karim', 'user_rahim', 'user_priya', 'user_rafiq'],
    user_ayesha: ['user_demo', 'user_karim', 'user_priya', 'user_rafiq'],
    user_karim: ['user_demo', 'user_ayesha', 'user_samiha', 'user_rafiq'],
    user_priya: ['user_demo', 'user_ayesha', 'user_nadia', 'user_samiha'],
    user_rafiq: ['user_ayesha', 'user_karim', 'user_priya'],
    user_rahim: ['user_demo', 'user_ayesha'],
    user_nadia: ['user_demo', 'user_priya', 'user_rahim'],
    user_tanvir: ['user_karim', 'user_nadia'],
    user_samiha: ['user_karim', 'user_demo'],
    user_farhan: ['user_demo', 'user_priya'],
    user_mrinmoy: ['user_demo', 'user_karim']
  },

  /* ============================================================ */
  /* MONITORED SITES                                               */
  /* ============================================================ */
  monitoredSites: [
    'bakkhali_river',
    'himchari_stream',
    'kolatoli_beach',
    'rumaliar_canal'
  ],

  activeSiteId: 'bakkhali_river',

  /* ============================================================ */
  /* OBSERVATIONS — 15                                                */
  /* ============================================================ */
  observations: [
    { id: 'obs_bak_01', siteId: 'bakkhali_river', reporterId: 'user_demo', reporterName: 'Luzayna Rahman', reporterAvatar: 'assets/avatar1.jpg', date: new Date(Date.now() - 2 * 3600000).toISOString(), clarity: 'good', litter: 'little', smell: 'none', colour: 'normal', wildlife: ['fish', 'birds'], ph: 7.2, turbidity: 12, temperature: 24, photo: 'assets/bakkhali.jpg', note: 'Water looks much clearer than last week. Saw two kingfishers diving near the bend.', confirmedBy: ['user_ayesha', 'user_karim'], verified: true },
    { id: 'obs_bak_02', siteId: 'bakkhali_river', reporterId: 'user_demo', reporterName: 'Luzayna Rahman', reporterAvatar: 'assets/avatar1.jpg', date: new Date(Date.now() - 3 * 86400000).toISOString(), clarity: 'moderate', litter: 'moderate', smell: 'mild', colour: 'brown', wildlife: ['fish'], ph: 6.8, turbidity: 28, temperature: 26, photo: null, note: 'Heavy rain yesterday — water is brown and murky.', confirmedBy: [], verified: false },
    { id: 'obs_bak_03', siteId: 'bakkhali_river', reporterId: 'user_ayesha', reporterName: 'Dr. Ayesha Rahman', reporterAvatar: 'assets/avatar-ayesha.jpg', date: new Date(Date.now() - 5 * 86400000).toISOString(), clarity: 'good', litter: 'little', smell: 'none', colour: 'normal', wildlife: ['fish', 'birds', 'plants'], ph: 7.1, turbidity: 15, temperature: 25, photo: null, note: 'Baseline survey. Water quality good for the season.', confirmedBy: ['user_demo'], verified: true },
    { id: 'obs_bak_04', siteId: 'bakkhali_river', reporterId: 'user_karim', reporterName: 'Dr. Karim Ahmed', reporterAvatar: 'assets/avatar-karim.jpg', date: new Date(Date.now() - 8 * 86400000).toISOString(), clarity: 'moderate', litter: 'moderate', smell: 'mild', colour: 'brown', wildlife: ['fish'], ph: 6.9, turbidity: 24, temperature: 27, photo: null, note: 'Sediment load increased after upstream construction.', confirmedBy: ['user_demo'], verified: true },
    { id: 'obs_bak_05', siteId: 'bakkhali_river', reporterId: 'user_demo', reporterName: 'Luzayna Rahman', reporterAvatar: 'assets/avatar1.jpg', date: new Date(Date.now() - 12 * 86400000).toISOString(), clarity: 'excellent', litter: 'none', smell: 'none', colour: 'normal', wildlife: ['fish', 'birds', 'crabs'], ph: 7.4, turbidity: 8, temperature: 23, photo: null, note: 'Best water quality I have seen here this year.', confirmedBy: ['user_ayesha'], verified: true },
    { id: 'obs_him_01', siteId: 'himchari_stream', reporterId: 'user_karim', reporterName: 'Dr. Karim Ahmed', reporterAvatar: 'assets/avatar-karim.jpg', date: new Date(Date.now() - 1 * 86400000).toISOString(), clarity: 'excellent', litter: 'none', smell: 'none', colour: 'normal', wildlife: ['fish', 'birds'], ph: 7.3, turbidity: 5, temperature: 22, photo: 'assets/himchari.jpg', note: 'Crystal clear mountain stream. Spotted two otters near the pool.', confirmedBy: ['user_demo', 'user_ayesha'], verified: true },
    { id: 'obs_him_02', siteId: 'himchari_stream', reporterId: 'user_demo', reporterName: 'Luzayna Rahman', reporterAvatar: 'assets/avatar1.jpg', date: new Date(Date.now() - 6 * 86400000).toISOString(), clarity: 'good', litter: 'little', smell: 'none', colour: 'normal', wildlife: ['fish', 'birds', 'butterflies'], ph: 7.0, turbidity: 10, temperature: 23, photo: null, note: 'Some plastic litter near the tourist picnic area.', confirmedBy: ['user_karim'], verified: true },
    { id: 'obs_him_03', siteId: 'himchari_stream', reporterId: 'user_ayesha', reporterName: 'Dr. Ayesha Rahman', reporterAvatar: 'assets/avatar-ayesha.jpg', date: new Date(Date.now() - 10 * 86400000).toISOString(), clarity: 'excellent', litter: 'none', smell: 'none', colour: 'normal', wildlife: ['fish', 'insects', 'plants'], ph: 7.2, turbidity: 6, temperature: 21, photo: null, note: 'Excellent biodiversity. Good reference stream.', confirmedBy: ['user_demo'], verified: true },
    { id: 'obs_him_04', siteId: 'himchari_stream', reporterId: 'user_priya', reporterName: 'Priya Sharma', reporterAvatar: 'assets/avatar-priya.jpg', date: new Date(Date.now() - 15 * 86400000).toISOString(), clarity: 'good', litter: 'none', smell: 'none', colour: 'normal', wildlife: ['fish', 'birds'], ph: 7.1, turbidity: 9, temperature: 22, photo: null, note: 'Healthy stream, minimal human impact.', confirmedBy: [], verified: true },
    { id: 'obs_kol_01', siteId: 'kolatoli_beach', reporterId: 'user_demo', reporterName: 'Luzayna Rahman', reporterAvatar: 'assets/avatar1.jpg', date: new Date(Date.now() - 5 * 3600000).toISOString(), clarity: 'good', litter: 'moderate', smell: 'none', colour: 'normal', wildlife: ['birds'], ph: null, turbidity: null, temperature: 27, photo: 'assets/kolatoli.jpg', note: 'Beautiful morning light. Lots of tourists — plastic bottles washing ashore.', confirmedBy: ['user_karim'], verified: true },
    { id: 'obs_kol_02', siteId: 'kolatoli_beach', reporterId: 'user_priya', reporterName: 'Priya Sharma', reporterAvatar: 'assets/avatar-priya.jpg', date: new Date(Date.now() - 2 * 86400000).toISOString(), clarity: 'moderate', litter: 'heavy', smell: 'mild', colour: 'brown', wildlife: ['birds', 'shells'], ph: null, turbidity: 35, temperature: 28, photo: null, note: 'Post-weekend litter surge. Needs urgent cleanup.', confirmedBy: ['user_demo', 'user_karim'], verified: true },
    { id: 'obs_kol_03', siteId: 'kolatoli_beach', reporterId: 'user_karim', reporterName: 'Dr. Karim Ahmed', reporterAvatar: 'assets/avatar-karim.jpg', date: new Date(Date.now() - 7 * 86400000).toISOString(), clarity: 'good', litter: 'little', smell: 'none', colour: 'normal', wildlife: ['birds', 'crabs', 'shells'], ph: null, turbidity: 18, temperature: 26, photo: null, note: 'Intertidal life abundant. Shorebirds active.', confirmedBy: [], verified: true },
    { id: 'obs_rum_01', siteId: 'rumaliar_canal', reporterId: 'user_demo', reporterName: 'Luzayna Rahman', reporterAvatar: 'assets/avatar1.jpg', date: new Date(Date.now() - 1 * 86400000).toISOString(), clarity: 'moderate', litter: 'moderate', smell: 'mild', colour: 'brown', wildlife: ['fish', 'birds'], ph: 6.9, turbidity: 25, temperature: 25, photo: 'assets/rumaliar.jpg', note: 'Tide is low. Small fish visible in shallows.', confirmedBy: ['user_ayesha'], verified: true },
    { id: 'obs_rum_02', siteId: 'rumaliar_canal', reporterId: 'user_ayesha', reporterName: 'Dr. Ayesha Rahman', reporterAvatar: 'assets/avatar-ayesha.jpg', date: new Date(Date.now() - 4 * 86400000).toISOString(), clarity: 'poor', litter: 'heavy', smell: 'strong', colour: 'black', wildlife: [], ph: 6.4, turbidity: 45, temperature: 27, photo: null, note: 'Wastewater discharge visible near the old bridge. Reported.', confirmedBy: ['user_demo', 'user_karim', 'user_priya'], verified: true },
    { id: 'obs_rum_03', siteId: 'rumaliar_canal', reporterId: 'user_karim', reporterName: 'Dr. Karim Ahmed', reporterAvatar: 'assets/avatar-karim.jpg', date: new Date(Date.now() - 9 * 86400000).toISOString(), clarity: 'moderate', litter: 'moderate', smell: 'mild', colour: 'brown', wildlife: ['fish'], ph: 6.7, turbidity: 30, temperature: 26, photo: null, note: 'Chronic pollution issue. Needs sustained monitoring.', confirmedBy: ['user_demo'], verified: true }
  ],

  /* ============================================================ */
  /* STORIES — 15 with rich comments + replies                     */
  /* ============================================================ */
  stories: [
    {
      id: 'story_001',
      authorId: 'user_demo',
      authorName: 'Luzayna Rahman',
      authorAvatar: 'assets/avatar1.jpg',
      authorRole: 'member',
      type: 'observation',
      title: 'Otters return to Bakkhali River!',
      content: 'Spotted two otters swimming near the far bank this morning. This is the first sighting in our community records since March. Otters are indicator species — their return means the ecosystem is recovering.',
      image: 'assets/bakkhali.jpg',
      siteId: 'bakkhali_river',
      date: new Date(Date.now() - 7 * 86400000).toISOString(),
      likes: 234,
      likedBy: ['Dr. Ayesha Rahman', 'Dr. Karim Ahmed', 'Priya Sharma', 'Rahim Hossain'],
      confirmations: ['user_ayesha', 'user_karim'],
      comments: [
        {
          id: 'c_001',
          authorId: 'user_ayesha',
          authorName: 'Dr. Ayesha Rahman',
          authorAvatar: 'assets/avatar-ayesha.jpg',
          authorRole: 'expert',
          text: 'This is fantastic news! Otters are indicator species — their return means the ecosystem is recovering. Please log this as a wildlife observation too.',
          date: new Date(Date.now() - 6.5 * 86400000).toISOString(),
          likes: 24,
          likedBy: ['Luzayna Rahman', 'Rahim Hossain'],
          replies: [
            {
              id: 'c_001_r1',
              authorId: 'user_demo',
              authorName: 'Luzayna Rahman',
              authorAvatar: 'assets/avatar1.jpg',
              text: 'Thank you Dr. Ayesha! Just logged it as a wildlife observation. So excited!',
              date: new Date(Date.now() - 6.3 * 86400000).toISOString(),
              likes: 8,
              likedBy: []
            },
            {
              id: 'c_001_r2',
              authorId: 'user_karim',
              authorName: 'Dr. Karim Ahmed',
              authorAvatar: 'assets/avatar-karim.jpg',
              authorRole: 'expert',
              text: 'Adding to our biodiversity log. Great find, Luzayna!',
              date: new Date(Date.now() - 6 * 86400000).toISOString(),
              likes: 12,
              likedBy: []
            }
          ]
        },
        {
          id: 'c_002',
          authorId: 'user_priya',
          authorName: 'Priya Sharma',
          authorAvatar: 'assets/avatar-priya.jpg',
          authorRole: 'expert',
          text: 'Do you have photos? We would love to add this to our research documentation. Even blurry shots help.',
          date: new Date(Date.now() - 6.4 * 86400000).toISOString(),
          likes: 15,
          likedBy: ['Luzayna Rahman'],
          replies: [
            {
              id: 'c_002_r1',
              authorId: 'user_demo',
              authorName: 'Luzayna Rahman',
              authorAvatar: 'assets/avatar1.jpg',
              text: 'Yes! I managed to get a few shots before they disappeared. Uploading soon.',
              date: new Date(Date.now() - 6.2 * 86400000).toISOString(),
              likes: 6,
              likedBy: []
            },
            {
              id: 'c_002_r2',
              authorId: 'user_samiha',
              authorName: 'Samiha Khan',
              authorAvatar: 'assets/avatar5.jpg',
              text: 'I can help with photography next time! I have a long lens for this.',
              date: new Date(Date.now() - 5.5 * 86400000).toISOString(),
              likes: 14,
              likedBy: []
            }
          ]
        },
        {
          id: 'c_003',
          authorId: 'user_rahim',
          authorName: 'Rahim Hossain',
          authorAvatar: 'assets/avatar2.jpg',
          text: 'My grandfather used to see them every day when he fished here 30 years ago. So glad they are coming back!',
          date: new Date(Date.now() - 5 * 86400000).toISOString(),
          likes: 45,
          likedBy: ['Luzayna Rahman', 'Nadia Islam'],
          replies: []
        },
        {
          id: 'c_004',
          authorId: 'user_nadia',
          authorName: 'Nadia Islam',
          authorAvatar: 'assets/avatar3.jpg',
          text: 'This gives me so much hope. Maybe our cleanups are actually working!',
          date: new Date(Date.now() - 4 * 86400000).toISOString(),
          likes: 18,
          likedBy: [],
          replies: [
            {
              id: 'c_004_r1',
              authorId: 'user_demo',
              authorName: 'Luzayna Rahman',
              authorAvatar: 'assets/avatar1.jpg',
              text: 'They definitely are, Nadia. Every bag counts!',
              date: new Date(Date.now() - 3.8 * 86400000).toISOString(),
              likes: 10,
              likedBy: []
            }
          ]
        }
      ]
    },

    {
      id: 'story_002',
      authorId: 'user_ayesha',
      authorName: 'Dr. Ayesha Rahman',
      authorAvatar: 'assets/avatar-ayesha.jpg',
      authorRole: 'expert',
      type: 'awareness',
      title: '5 signs of water pollution everyone should know',
      content: '1. Unusual colour (grey, black, or bright green)\n2. Strong chemical or sewage smell\n3. Sudden fish kills\n4. Foam or oily sheen on surface\n5. Excessive algae growth\n\nIf you notice ANY of these, report it immediately. Early detection saves ecosystems.',
      image: null,
      siteId: null,
      date: new Date(Date.now() - 3 * 86400000).toISOString(),
      likes: 456,
      likedBy: ['Luzayna Rahman', 'Priya Sharma', 'Dr. Karim Ahmed', 'Nadia Islam', 'Rahim Hossain'],
      confirmations: [],
      comments: [
        {
          id: 'c_005',
          authorId: 'user_farhan',
          authorName: 'Farhan Reza',
          authorAvatar: 'assets/avatar6.jpg',
          text: 'Sharing this with my students tomorrow. Perfect teaching material!',
          date: new Date(Date.now() - 2.5 * 86400000).toISOString(),
          likes: 32,
          likedBy: ['Dr. Ayesha Rahman'],
          replies: [
            {
              id: 'c_005_r1',
              authorId: 'user_ayesha',
              authorName: 'Dr. Ayesha Rahman',
              authorAvatar: 'assets/avatar-ayesha.jpg',
              authorRole: 'expert',
              text: 'Would love to hear how it goes! Let me know if you need printable slides.',
              date: new Date(Date.now() - 2.3 * 86400000).toISOString(),
              likes: 22,
              likedBy: []
            }
          ]
        },
        {
          id: 'c_006',
          authorId: 'user_nadia',
          authorName: 'Nadia Islam',
          authorAvatar: 'assets/avatar3.jpg',
          text: 'We saw #4 at Rumaliar last week. Already reported through the app.',
          date: new Date(Date.now() - 2 * 86400000).toISOString(),
          likes: 24,
          likedBy: [],
          replies: [
            {
              id: 'c_006_r1',
              authorId: 'user_ayesha',
              authorName: 'Dr. Ayesha Rahman',
              authorAvatar: 'assets/avatar-ayesha.jpg',
              authorRole: 'expert',
              text: 'Excellent! I reviewed your report. Added to the monitoring list.',
              date: new Date(Date.now() - 1.8 * 86400000).toISOString(),
              likes: 18,
              likedBy: []
            }
          ]
        },
        {
          id: 'c_007',
          authorId: 'user_mrinmoy',
          authorName: 'Mrinmoy Das',
          authorAvatar: 'assets/avatar7.jpg',
          text: 'Could we add a "6th sign" — unusual plant growth on the banks?',
          date: new Date(Date.now() - 1 * 86400000).toISOString(),
          likes: 12,
          likedBy: [],
          replies: [
            {
              id: 'c_007_r1',
              authorId: 'user_ayesha',
              authorName: 'Dr. Ayesha Rahman',
              authorAvatar: 'assets/avatar-ayesha.jpg',
              authorRole: 'expert',
              text: 'Great addition. Invasive plant species can indicate nutrient imbalance.',
              date: new Date(Date.now() - 22 * 3600000).toISOString(),
              likes: 15,
              likedBy: []
            }
          ]
        }
      ]
    },

    {
      id: 'story_003',
      authorId: 'user_demo',
      authorName: 'Luzayna Rahman',
      authorAvatar: 'assets/avatar1.jpg',
      authorRole: 'member',
      type: 'story',
      title: 'My first month as a citizen scientist',
      content: 'One month ago I downloaded AquaQuest "just to try". Today I have 32 observations across 3 waterbodies, 687 points, and 7 badges. But most importantly — I understand my local waters now. I know when they are healthy, when they are stressed, and what to do about it.',
      image: null,
      siteId: null,
      date: new Date(Date.now() - 5 * 86400000).toISOString(),
      likes: 189,
      likedBy: ['Dr. Ayesha Rahman', 'Priya Sharma', 'Rahim Hossain', 'Nadia Islam'],
      confirmations: [],
      comments: [
        {
          id: 'c_008',
          authorId: 'user_priya',
          authorName: 'Priya Sharma',
          authorAvatar: 'assets/avatar-priya.jpg',
          authorRole: 'expert',
          text: 'This is exactly what citizen science is about. Thank you for sharing your journey!',
          date: new Date(Date.now() - 4.5 * 86400000).toISOString(),
          likes: 28,
          likedBy: ['Luzayna Rahman'],
          replies: []
        },
        {
          id: 'c_009',
          authorId: 'user_mrinmoy',
          authorName: 'Mrinmoy Das',
          authorAvatar: 'assets/avatar7.jpg',
          text: 'Inspiring! Just signed up. Any tips for a beginner?',
          date: new Date(Date.now() - 4 * 86400000).toISOString(),
          likes: 16,
          likedBy: [],
          replies: [
            {
              id: 'c_009_r1',
              authorId: 'user_demo',
              authorName: 'Luzayna Rahman',
              authorAvatar: 'assets/avatar1.jpg',
              text: 'Start with one waterbody near you. Observe it weekly at the same time. Consistency beats complexity!',
              date: new Date(Date.now() - 3.8 * 86400000).toISOString(),
              likes: 22,
              likedBy: []
            },
            {
              id: 'c_009_r2',
              authorId: 'user_ayesha',
              authorName: 'Dr. Ayesha Rahman',
              authorAvatar: 'assets/avatar-ayesha.jpg',
              authorRole: 'expert',
              text: 'Great advice. Also: keep a small notebook for field notes. Digital is great but paper never dies.',
              date: new Date(Date.now() - 3.5 * 86400000).toISOString(),
              likes: 31,
              likedBy: []
            }
          ]
        }
      ]
    },

    {
      id: 'story_004',
      authorId: 'user_priya',
      authorName: 'Priya Sharma',
      authorAvatar: 'assets/avatar-priya.jpg',
      authorRole: 'expert',
      type: 'tip',
      title: 'How to take a good water photo',
      content: 'Your photos are scientific data. Here is how to make them count:\n\n1. Photograph from the SAME spot each time\n2. Include something for scale (a coin, a hand)\n3. Avoid filters and editing\n4. Capture at the same time of day\n5. Take wide shots AND close-ups\n\nConsistent photos reveal trends over time.',
      image: null,
      siteId: null,
      date: new Date(Date.now() - 2 * 86400000).toISOString(),
      likes: 312,
      likedBy: ['Luzayna Rahman', 'Samiha Khan', 'Dr. Karim Ahmed'],
      confirmations: [],
      comments: [
        {
          id: 'c_010',
          authorId: 'user_samiha',
          authorName: 'Samiha Khan',
          authorAvatar: 'assets/avatar5.jpg',
          text: 'As a photographer, I love this. Consistency truly matters more than gear!',
          date: new Date(Date.now() - 1.5 * 86400000).toISOString(),
          likes: 34,
          likedBy: ['Priya Sharma'],
          replies: []
        },
        {
          id: 'c_011',
          authorId: 'user_farhan',
          authorName: 'Farhan Reza',
          authorAvatar: 'assets/avatar6.jpg',
          text: 'The scale reference tip is brilliant. I always forget this.',
          date: new Date(Date.now() - 1 * 86400000).toISOString(),
          likes: 18,
          likedBy: [],
          replies: []
        },
        {
          id: 'c_012',
          authorId: 'user_tanvir',
          authorName: 'Tanvir Ahmed',
          authorAvatar: 'assets/avatar4.jpg',
          text: 'Adding these to our volunteer training manual!',
          date: new Date(Date.now() - 20 * 3600000).toISOString(),
          likes: 24,
          likedBy: [],
          replies: []
        }
      ]
    },

    {
      id: 'story_005',
      authorId: 'user_demo',
      authorName: 'Luzayna Rahman',
      authorAvatar: 'assets/avatar1.jpg',
      authorRole: 'member',
      type: 'sighting',
      title: 'Kingfisher family at Kolatoli',
      content: 'Watched a family of three kingfishers hunt along the shoreline this evening. Birds are the best indicators of healthy fish populations. If the kingfishers are here, the fish are here.',
      image: 'assets/kolatoli.jpg',
      siteId: 'kolatoli_beach',
      date: new Date(Date.now() - 10 * 86400000).toISOString(),
      likes: 167,
      likedBy: ['Dr. Ayesha Rahman', 'Samiha Khan'],
      confirmations: [],
      comments: [
        {
          id: 'c_013',
          authorId: 'user_karim',
          authorName: 'Dr. Karim Ahmed',
          authorAvatar: 'assets/avatar-karim.jpg',
          authorRole: 'expert',
          text: 'Beautiful. Which species? Common kingfisher or the larger stork-billed?',
          date: new Date(Date.now() - 9.5 * 86400000).toISOString(),
          likes: 14,
          likedBy: [],
          replies: [
            {
              id: 'c_013_r1',
              authorId: 'user_demo',
              authorName: 'Luzayna Rahman',
              authorAvatar: 'assets/avatar1.jpg',
              text: 'Common kingfishers! Small, bright blue. At least three — possibly parents + juvenile.',
              date: new Date(Date.now() - 9 * 86400000).toISOString(),
              likes: 12,
              likedBy: []
            },
            {
              id: 'c_013_r2',
              authorId: 'user_karim',
              authorName: 'Dr. Karim Ahmed',
              authorAvatar: 'assets/avatar-karim.jpg',
              authorRole: 'expert',
              text: 'Perfect. That sounds like a breeding pair. Log them as "family sighting" — we track breeding success.',
              date: new Date(Date.now() - 8.8 * 86400000).toISOString(),
              likes: 18,
              likedBy: []
            }
          ]
        },
        {
          id: 'c_014',
          authorId: 'user_samiha',
          authorName: 'Samiha Khan',
          authorAvatar: 'assets/avatar5.jpg',
          text: 'They are such beautiful birds. I will try to photograph them next time.',
          date: new Date(Date.now() - 8 * 86400000).toISOString(),
          likes: 16,
          likedBy: [],
          replies: [
            {
              id: 'c_014_r1',
              authorId: 'user_demo',
              authorName: 'Luzayna Rahman',
              authorAvatar: 'assets/avatar1.jpg',
              text: 'Please do! Would love to see them through your lens.',
              date: new Date(Date.now() - 7.5 * 86400000).toISOString(),
              likes: 8,
              likedBy: []
            }
          ]
        }
      ]
    },

    {
      id: 'story_006',
      authorId: 'user_ayesha',
      authorName: 'Dr. Ayesha Rahman',
      authorAvatar: 'assets/avatar-ayesha.jpg',
      authorRole: 'expert',
      type: 'story',
      title: 'River cleanup results — 47 bags collected!',
      content: 'Amazing turnout at Bakkhali this weekend. 32 volunteers, 47 bags of plastic removed, and 3 hours of community spirit. Special thanks to everyone who joined — especially the kids who counted every bottle. Our river is cleaner because of you.',
      image: 'assets/challenge-bakkhali.jpg',
      siteId: 'bakkhali_river',
      date: new Date(Date.now() - 4 * 86400000).toISOString(),
      likes: 523,
      likedBy: ['Luzayna Rahman', 'Nadia Islam', 'Rahim Hossain', 'Tanvir Ahmed', 'Priya Sharma'],
      confirmations: [],
      comments: [
        {
          id: 'c_015',
          authorId: 'user_nadia',
          authorName: 'Nadia Islam',
          authorAvatar: 'assets/avatar3.jpg',
          text: 'So proud of our community! Next cleanup scheduled for Rumaliar canal.',
          date: new Date(Date.now() - 3.5 * 86400000).toISOString(),
          likes: 42,
          likedBy: ['Dr. Ayesha Rahman'],
          replies: []
        },
        {
          id: 'c_016',
          authorId: 'user_rahim',
          authorName: 'Rahim Hossain',
          authorAvatar: 'assets/avatar2.jpg',
          text: 'I brought my boat to help — glad we could reach the far bank too.',
          date: new Date(Date.now() - 3 * 86400000).toISOString(),
          likes: 56,
          likedBy: [],
          replies: [
            {
              id: 'c_016_r1',
              authorId: 'user_ayesha',
              authorName: 'Dr. Ayesha Rahman',
              authorAvatar: 'assets/avatar-ayesha.jpg',
              authorRole: 'expert',
              text: 'Your boat was a game-changer, Rahim. Could not have done it without you.',
              date: new Date(Date.now() - 2.8 * 86400000).toISOString(),
              likes: 38,
              likedBy: []
            }
          ]
        },
        
        {
        id: 'c_017',
       authorIdd: 'user_demo',
        authorName: 'Luzayna Rahman',
        authorAvatar: 'assets/avatar1.jpg',
        text: 'The kids were amazing! My little cousin counted 87 plastic bottles by himself.',
        date: new Date(Date.now() - 2.5 * 86400000).toISOString(),
        likes: 38,
        likedBy: [],
        replies: [
          {
            id: 'c_017_r1',
            authorId: 'user_ayesha',
            authorName: 'Dr. Ayesha Rahman',
            authorAvatar: 'assets/avatar-ayesha.jpg',
            authorRole: 'expert',
            text: 'Future scientists in the making. Please bring him to the next one!',
            date: new Date(Date.now() - 2.3 * 86400000).toISOString(),
            likes: 28,
            likedBy: []
          }
        ]
      }
      ]
    },

    {
      id: 'story_007',
      authorId: 'user_karim',
      authorName: 'Dr. Karim Ahmed',
      authorAvatar: 'assets/avatar-karim.jpg',
      authorRole: 'expert',
      type: 'sighting',
      title: 'Sea turtle nest spotted at Inani',
      content: 'A green sea turtle nest was discovered this morning at Inani beach. Estimated 80-100 eggs. Local volunteers are monitoring 24/7. This is the 4th nest this season — up from 2 last year. Conservation efforts are working.',
      image: 'assets/inani.jpg',
      siteId: 'inani_coast',
      date: new Date(Date.now() - 8 * 86400000).toISOString(),
      likes: 678,
      likedBy: ['Luzayna Rahman', 'Dr. Ayesha Rahman', 'Samiha Khan', 'Priya Sharma'],
      confirmations: [],
      comments: [
        {
          id: 'c_018',
          authorId: 'user_samiha',
          authorName: 'Samiha Khan',
          authorAvatar: 'assets/avatar5.jpg',
          text: 'Photos coming soon — but respecting the nest perimeter, of course.',
          date: new Date(Date.now() - 7.5 * 86400000).toISOString(),
          likes: 28,
          likedBy: [],
          replies: []
        },
        {
          id: 'c_019',
          authorId: 'user_rafiq',
          authorName: 'Dr. Rafiq Islam',
          authorAvatar: 'assets/avatar-rafiq.jpg',
          authorRole: 'expert',
          text: 'This is what One Health looks like. Healthy beaches → healthy turtles → healthy ecosystems.',
          date: new Date(Date.now() - 7 * 86400000).toISOString(),
          likes: 64,
          likedBy: ['Dr. Karim Ahmed'],
          replies: [
            {
              id: 'c_019_r1',
              authorId: 'user_karim',
              authorName: 'Dr. Karim Ahmed',
              authorAvatar: 'assets/avatar-karim.jpg',
              authorRole: 'expert',
              text: 'Absolutely. Every turtle nest is a sign our beaches are recovering.',
              date: new Date(Date.now() - 6.8 * 86400000).toISOString(),
              likes: 42,
              likedBy: []
            }
          ]
        }
      ]
    },

    {
      id: 'story_008',
      authorId: 'user_ayesha',
      authorName: 'Dr. Ayesha Rahman',
      authorAvatar: 'assets/avatar-ayesha.jpg',
      authorRole: 'expert',
      type: 'tip',
      title: 'Why pH matters more than you think',
      content: 'pH is the silent indicator of water health.\n\nHealthy freshwater: 6.5 - 8.5\nFish stress zone: below 6 or above 9\nDeadly zone: below 5 or above 10\n\npH shifts can come from acid rain, industrial waste, or algal blooms. Test with simple strips — takes 30 seconds. Log it every time.',
      image: null,
      siteId: null,
      date: new Date(Date.now() - 6 * 86400000).toISOString(),
      likes: 289,
      likedBy: ['Luzayna Rahman', 'Farhan Reza', 'Mrinmoy Das'],
      confirmations: [],
      comments: [
        {
          id: 'c_020',
          authorId: 'user_mrinmoy',
          authorName: 'Mrinmoy Das',
          authorAvatar: 'assets/avatar7.jpg',
          text: 'Where can I buy pH strips? Any recommendations?',
          date: new Date(Date.now() - 5.5 * 86400000).toISOString(),
          likes: 12,
          likedBy: [],
          replies: [
            {
              id: 'c_020_r1',
              authorId: 'user_ayesha',
              authorName: 'Dr. Ayesha Rahman',
              authorAvatar: 'assets/avatar-ayesha.jpg',
              authorRole: 'expert',
              text: 'Any aquarium shop. Look for "wide range" strips (0-14). Cheap and accurate enough for citizen science.',
              date: new Date(Date.now() - 5 * 86400000).toISOString(),
              likes: 24,
              likedBy: []
            }
          ]
        },
        {
          id: 'c_021',
          authorId: 'user_farhan',
          authorName: 'Farhan Reza',
          authorAvatar: 'assets/avatar6.jpg',
          text: 'I tested pH at 3 different spots last week — huge variation! 6.2 to 7.8 within 1km.',
          date: new Date(Date.now() - 4 * 86400000).toISOString(),
          likes: 18,
          likedBy: [],
          replies: [
            {
              id: 'c_021_r1',
              authorId: 'user_ayesha',
              authorName: 'Dr. Ayesha Rahman',
              authorAvatar: 'assets/avatar-ayesha.jpg',
              authorRole: 'expert',
              text: 'Great observation! Local variations matter. Where did you test?',
              date: new Date(Date.now() - 3.8 * 86400000).toISOString(),
              likes: 16,
              likedBy: []
            },
            {
              id: 'c_021_r2',
              authorId: 'user_farhan',
              authorName: 'Farhan Reza',
              authorAvatar: 'assets/avatar6.jpg',
              text: 'Near Inani — at the lagoon entrance, the main beach, and a small stream. Big differences!',
              date: new Date(Date.now() - 3.5 * 86400000).toISOString(),
              likes: 14,
              likedBy: []
            }
          ]
        }
      ]
    },

    {
      id: 'story_009',
      authorId: 'user_nadia',
      authorName: 'Nadia Islam',
      authorAvatar: 'assets/avatar3.jpg',
      authorRole: 'member',
      type: 'awareness',
      title: 'Rumaliar canal — we need action',
      content: 'I walked along Rumaliar canal today. The smell was unbearable. Black water. No fish. Foam near the bridge. We have reported this multiple times but nothing changes. Who else is seeing this? We need to organize.',
      image: 'assets/rumaliar.jpg',
      siteId: 'rumaliar_canal',
      date: new Date(Date.now() - 3 * 86400000).toISOString(),
      likes: 234,
      likedBy: ['Luzayna Rahman', 'Dr. Ayesha Rahman', 'Rahim Hossain'],
      confirmations: [],
      comments: [
        {
          id: 'c_022',
          authorId: 'user_demo',
          authorName: 'Luzayna Rahman',
          authorAvatar: 'assets/avatar1.jpg',
          text: 'I saw the same last week. Already submitted a report through the app.',
          date: new Date(Date.now() - 2.8 * 86400000).toISOString(),
          likes: 18,
          likedBy: [],
          replies: []
        },
        {
          id: 'c_023',
          authorId: 'user_rahim',
          authorName: 'Rahim Hossain',
          authorAvatar: 'assets/avatar2.jpg',
          text: 'My father fished here for 40 years. Now nothing survives. We must act.',
          date: new Date(Date.now() - 2.5 * 86400000).toISOString(),
          likes: 42,
          likedBy: ['Nadia Islam'],
          replies: []
        },
        {
          id: 'c_024',
          authorId: 'user_ayesha',
          authorName: 'Dr. Ayesha Rahman',
          authorAvatar: 'assets/avatar-ayesha.jpg',
          authorRole: 'expert',
          text: 'I have contacted the district environmental office. Your reports are helping build the case. Keep documenting.',
          date: new Date(Date.now() - 2 * 86400000).toISOString(),
          likes: 56,
          likedBy: ['Nadia Islam', 'Luzayna Rahman'],
          replies: [
            {
              id: 'c_024_r1',
              authorId: 'user_nadia',
              authorName: 'Nadia Islam',
              authorAvatar: 'assets/avatar3.jpg',
              text: 'Thank you Dr. Ayesha! This gives us hope.',
              date: new Date(Date.now() - 1.5 * 86400000).toISOString(),
              likes: 24,
              likedBy: []
            }
          ]
        }
      ]
    },

    {
      id: 'story_010',
      authorId: 'user_tanvir',
      authorName: 'Tanvir Ahmed',
      authorAvatar: 'assets/avatar4.jpg',
      authorRole: 'member',
      type: 'story',
      title: '200 mangrove saplings planted!',
      content: 'Six volunteers, four hours, 200 mangrove saplings. These will grow into a natural barrier against erosion, filter water, and shelter fish nurseries. Mangroves are the unsung heroes of coastal protection.',
      image: 'assets/wetland.jpg',
      siteId: 'local_wetland',
      date: new Date(Date.now() - 5 * 86400000).toISOString(),
      likes: 412,
      likedBy: ['Dr. Karim Ahmed', 'Nadia Islam', 'Samiha Khan'],
      confirmations: [],
      comments: [
        {
          id: 'c_025',
          authorId: 'user_karim',
          authorName: 'Dr. Karim Ahmed',
          authorAvatar: 'assets/avatar-karim.jpg',
          authorRole: 'expert',
          text: 'Fantastic work. Which species did you plant?',
          date: new Date(Date.now() - 4.5 * 86400000).toISOString(),
          likes: 20,
          likedBy: [],
          replies: [
            {
              id: 'c_025_r1',
              authorId: 'user_tanvir',
              authorName: 'Tanvir Ahmed',
              authorAvatar: 'assets/avatar4.jpg',
              text: 'Mostly Sundari and Keora — the native ones. Got them from the forest department.',
              date: new Date(Date.now() - 4 * 86400000).toISOString(),
              likes: 18,
              likedBy: []
            }
          ]
        },
        {
          id: 'c_026',
          authorId: 'user_rafiq',
          authorName: 'Dr. Rafiq Islam',
          authorAvatar: 'assets/avatar-rafiq.jpg',
          authorRole: 'expert',
          text: 'Mangroves absorb up to 4x more carbon than rainforests. Your 200 saplings are a climate action too.',
          date: new Date(Date.now() - 3.5 * 86400000).toISOString(),
          likes: 48,
          likedBy: [],
          replies: [
            {
              id: 'c_026_r1',
              authorId: 'user_tanvir',
              authorName: 'Tanvir Ahmed',
              authorAvatar: 'assets/avatar4.jpg',
              text: 'Never thought of it that way. Makes the work even more meaningful!',
              date: new Date(Date.now() - 3 * 86400000).toISOString(),
              likes: 22,
              likedBy: []
            }
          ]
        }
      ]
    },

    {
      id: 'story_011',
      authorId: 'user_samiha',
      authorName: 'Samiha Khan',
      authorAvatar: 'assets/avatar5.jpg',
      authorRole: 'member',
      type: 'sighting',
      title: 'Dragonfly swarm signals healthy water',
      content: 'A massive dragonfly swarm at Himchari stream this morning — at least 30 individuals. Dragonflies need clean, oxygen-rich water for their larvae. This is nature\'s own water quality certificate.',
      image: 'assets/himchari.jpg',
      siteId: 'himchari_stream',
      date: new Date(Date.now() - 2 * 86400000).toISOString(),
      likes: 178,
      likedBy: ['Dr. Karim Ahmed', 'Luzayna Rahman'],
      confirmations: [],
      comments: [
        {
          id: 'c_027',
          authorId: 'user_karim',
          authorName: 'Dr. Karim Ahmed',
          authorAvatar: 'assets/avatar-karim.jpg',
          authorRole: 'expert',
          text: 'Excellent indicator species! Please log as an insect observation.',
          date: new Date(Date.now() - 1.8 * 86400000).toISOString(),
          likes: 22,
          likedBy: [],
          replies: [
            {
              id: 'c_027_r1',
              authorId: 'user_samiha',
              authorName: 'Samiha Khan',
              authorAvatar: 'assets/avatar5.jpg',
              text: 'Just logged it! With photo — got a nice one of the swarm.',
              date: new Date(Date.now() - 1.5 * 86400000).toISOString(),
              likes: 18,
              likedBy: []
            }
          ]
        },
        {
          id: 'c_028',
          authorId: 'user_priya',
          authorName: 'Priya Sharma',
          authorAvatar: 'assets/avatar-priya.jpg',
          authorRole: 'expert',
          text: 'Perfect example of using biodiversity as a water quality indicator.',
          date: new Date(Date.now() - 1.5 * 86400000).toISOString(),
          likes: 18,
          likedBy: [],
          replies: []
        }
      ]
    },

    {
      id: 'story_012',
      authorId: 'user_farhan',
      authorName: 'Farhan Reza',
      authorAvatar: 'assets/avatar6.jpg',
      authorRole: 'member',
      type: 'question',
      title: 'How to test turbidity at home?',
      content: 'I want to test turbidity at my local pond but I do not have a Secchi disk. Any DIY methods that work? I am thinking a clear bottle + a white card, but not sure about accuracy.',
      image: null,
      siteId: null,
      date: new Date(Date.now() - 1 * 86400000).toISOString(),
      likes: 67,
      likedBy: ['Luzayna Rahman'],
      confirmations: [],
      comments: [
        {
          id: 'c_029',
          authorId: 'user_priya',
          authorName: 'Priya Sharma',
          authorAvatar: 'assets/avatar-priya.jpg',
          authorRole: 'expert',
          text: 'Great question! Your bottle method works. Here is how: fill a tall glass jar with water. Slowly lower a white disk (or coin) into it. Note the depth at which it disappears. That is your turbidity estimate.',
          date: new Date(Date.now() - 22 * 3600000).toISOString(),
          likes: 42,
          likedBy: ['Farhan Reza'],
          replies: [
            {
              id: 'c_029_r1',
              authorId: 'user_farhan',
              authorName: 'Farhan Reza',
              authorAvatar: 'assets/avatar6.jpg',
              text: 'Perfect! Trying this tomorrow. Thanks!',
              date: new Date(Date.now() - 20 * 3600000).toISOString(),
              likes: 12,
              likedBy: []
            },
            {
              id: 'c_029_r2',
              authorId: 'user_priya',
              authorName: 'Priya Sharma',
              authorAvatar: 'assets/avatar-priya.jpg',
              authorRole: 'expert',
              text: 'Share your results! Would love to compare with the Secchi readings from that area.',
              date: new Date(Date.now() - 18 * 3600000).toISOString(),
              likes: 18,
              likedBy: []
            }
          ]
        },
        {
          id: 'c_030',
          authorId: 'user_demo',
          authorName: 'Luzayna Rahman',
          authorAvatar: 'assets/avatar1.jpg',
          text: 'I use the same method! Works great. Consistency in your tool matters more than precision.',
          date: new Date(Date.now() - 18 * 3600000).toISOString(),
          likes: 18,
          likedBy: [],
          replies: []
        }
      ]
    },

    {
      id: 'story_013',
      authorId: 'user_rahim',
      authorName: 'Rahim Hossain',
      authorAvatar: 'assets/avatar2.jpg',
      authorRole: 'member',
      type: 'story',
      title: 'Traditional fishing wisdom for citizen scientists',
      content: 'My grandfather taught me to read the river:\n\n"If the water smells sweet, the fish are happy."\n"When the birds dive, the fish are running."\n"When the water is black, leave it alone."\n\nOur ancestors were citizen scientists long before the term existed.',
      image: 'assets/bakkhali.jpg',
      siteId: 'bakkhali_river',
      date: new Date(Date.now() - 6 * 86400000).toISOString(),
      likes: 892,
      likedBy: ['Luzayna Rahman', 'Dr. Ayesha Rahman', 'Dr. Karim Ahmed', 'Priya Sharma', 'Nadia Islam'],
      confirmations: [],
      comments: [
        {
          id: 'c_031',
          authorId: 'user_ayesha',
          authorName: 'Dr. Ayesha Rahman',
          authorAvatar: 'assets/avatar-ayesha.jpg',
          authorRole: 'expert',
          text: 'This is beautiful and scientifically sound. Indigenous knowledge should be part of every water monitoring program.',
          date: new Date(Date.now() - 5.5 * 86400000).toISOString(),
          likes: 87,
          likedBy: ['Rahim Hossain'],
          replies: []
        },
        {
          id: 'c_032',
          authorId: 'user_rafiq',
          authorName: 'Dr. Rafiq Islam',
          authorAvatar: 'assets/avatar-rafiq.jpg',
          authorRole: 'expert',
          text: 'This is the heart of One Health — traditional wisdom meets modern science. Thank you for sharing.',
          date: new Date(Date.now() - 5 * 86400000).toISOString(),
          likes: 102,
          likedBy: ['Rahim Hossain', 'Luzayna Rahman'],
          replies: []
        },
        {
          id: 'c_033',
          authorId: 'user_nadia',
          authorName: 'Nadia Islam',
          authorAvatar: 'assets/avatar3.jpg',
          text: 'I am saving this post. So much wisdom.',
          date: new Date(Date.now() - 4 * 86400000).toISOString(),
          likes: 34,
          likedBy: [],
          replies: []
        }
      ]
    },

    {
      id: 'story_014',
      authorId: 'user_rafiq',
      authorName: 'Dr. Rafiq Islam',
      authorAvatar: 'assets/avatar-rafiq.jpg',
      authorRole: 'expert',
      type: 'awareness',
      title: 'What is One Health, really?',
      content: 'One Health is not a buzzword. It is a framework.\n\nWhen water is polluted:\n- Fish absorb toxins → birds eat fish → humans eat birds\n- Cholera spreads through contaminated water → human disease\n- Algal blooms deplete oxygen → fish die → food sources collapse\n\nHuman health, animal health, and environmental health are ONE thing. Protect water = protect ourselves.',
      image: null,
      siteId: null,
      date: new Date(Date.now() - 4 * 86400000).toISOString(),
      likes: 567,
      likedBy: ['Luzayna Rahman', 'Dr. Ayesha Rahman', 'Priya Sharma', 'Nadia Islam', 'Farhan Reza'],
      confirmations: [],
      comments: [
        {
          id: 'c_034',
          authorId: 'user_priya',
          authorName: 'Priya Sharma',
          authorAvatar: 'assets/avatar-priya.jpg',
          authorRole: 'expert',
          text: 'Perfect explanation. Sharing this with every workshop I run.',
          date: new Date(Date.now() - 3.8 * 86400000).toISOString(),
          likes: 42,
          likedBy: [],
          replies: []
        },
        {
          id: 'c_035',
          authorId: 'user_demo',
          authorName: 'Luzayna Rahman',
          authorAvatar: 'assets/avatar1.jpg',
          text: 'This made me see the app in a completely new way. Every observation I make is a One Health observation.',
          date: new Date(Date.now() - 3 * 86400000).toISOString(),
          likes: 56,
          likedBy: ['Dr. Rafiq Islam'],
          replies: [
            {
              id: 'c_035_r1',
              authorId: 'user_rafiq',
              authorName: 'Dr. Rafiq Islam',
              authorAvatar: 'assets/avatar-rafiq.jpg',
              authorRole: 'expert',
              text: 'Exactly! You are not just a citizen scientist — you are a One Health guardian.',
              date: new Date(Date.now() - 2.5 * 86400000).toISOString(),
              likes: 78,
              likedBy: []
            }
          ]
        },
        {
          id: 'c_036',
          authorId: 'user_mrinmoy',
          authorName: 'Mrinmoy Das',
          authorAvatar: 'assets/avatar7.jpg',
          text: 'This is why I joined AquaQuest. Every data point has meaning.',
          date: new Date(Date.now() - 2 * 86400000).toISOString(),
          likes: 24,
          likedBy: [],
          replies: []
        }
      ]
    },

    {
      id: 'story_015',
      authorId: 'user_demo',
      authorName: 'Luzayna Rahman',
      authorAvatar: 'assets/avatar1.jpg',
      authorRole: 'member',
      type: 'story',
      title: 'Sunrise at Kolatoli — a reminder',
      content: 'Woke up at 5am to observe at first light. The beach was empty except for a few fishermen. The water was calm, the sky pink, and for a moment, everything felt right. This is why we do what we do. Not for points. Not for badges. But because these places deserve to be protected.',
      image: 'assets/kolatoli.jpg',
      siteId: 'kolatoli_beach',
      date: new Date(Date.now() - 12 * 3600000).toISOString(),
      likes: 456,
      likedBy: ['Dr. Ayesha Rahman', 'Samiha Khan', 'Rahim Hossain', 'Priya Sharma'],
      confirmations: [],
      comments: [
        {
          id: 'c_037',
          authorId: 'user_samiha',
          authorName: 'Samiha Khan',
          authorAvatar: 'assets/avatar5.jpg',
          text: 'Beautiful words. And beautiful photo!',
          date: new Date(Date.now() - 10 * 3600000).toISOString(),
          likes: 32,
          likedBy: [],
          replies: []
        },
        {
          id: 'c_038',
          authorId: 'user_ayesha',
          authorName: 'Dr. Ayesha Rahman',
          authorAvatar: 'assets/avatar-ayesha.jpg',
          authorRole: 'expert',
          text: 'This is the emotional heart of citizen science. Thank you for putting it into words.',
          date: new Date(Date.now() - 8 * 3600000).toISOString(),
          likes: 56,
          likedBy: [],
          replies: []
        },
        {
          id: 'c_039',
          authorId: 'user_rahim',
          authorName: 'Rahim Hossain',
          authorAvatar: 'assets/avatar2.jpg',
          text: 'As a fisherman, I see this every morning. But today I saw it through your eyes.',
          date: new Date(Date.now() - 5 * 3600000).toISOString(),
          likes: 78,
          likedBy: ['Luzayna Rahman'],
          replies: []
        }
      ]
    }
  ],

  /* ============================================================ */
  /* REPORTS                                                       */
  /* ============================================================ */
  reports: [
    {
      id: 'rep_001',
      type: 'wastewater',
      siteId: 'rumaliar_canal',
      reporterId: 'user_demo',
      reporterName: 'Luzayna Rahman',
      reporterAvatar: 'assets/avatar1.jpg',
      date: new Date(Date.now() - 5 * 86400000).toISOString(),
      description: 'Strong sewage smell near the old bridge. Grey water flowing in from upstream.',
      photo: 'assets/rumaliar.jpg',
      location: 'Rumaliar Canal, near old bridge',
      status: 'action',
      confirmations: ['user_karim', 'user_priya', 'user_ayesha'],
      timeline: [
        { stage: 'reported', label: 'Report Submitted', time: new Date(Date.now() - 5 * 86400000).toISOString() },
        { stage: 'community', label: 'Community Confirmed (3)', time: new Date(Date.now() - 4 * 86400000).toISOString() },
        { stage: 'action', label: 'Action Initiated', time: new Date(Date.now() - 2 * 86400000).toISOString() }
      ]
    }
  ],

  /* ============================================================ */
  /* NOTIFICATIONS                                                 */
  /* ============================================================ */
  notifications: [
    { id: 'notif_001', type: 'social', title: 'Dr. Ayesha Rahman commented on your post', message: '"This is fantastic news! Otters are indicator species..."', date: new Date(Date.now() - 30 * 60000).toISOString(), read: false },
    { id: 'notif_002', type: 'social', title: 'Rahim Hossain started following you', message: 'Local fisherman from Bakkhali River', date: new Date(Date.now() - 2 * 3600000).toISOString(), read: false },
    { id: 'notif_003', type: 'confirmation', title: 'Observation Confirmed', message: 'Dr. Karim Ahmed confirmed your Rumaliar canal observation.', date: new Date(Date.now() - 4 * 3600000).toISOString(), read: false },
    { id: 'notif_004', type: 'report', title: 'Report Status Updated', message: 'Your Rumaliar Canal concern is now under action.', date: new Date(Date.now() - 8 * 3600000).toISOString(), read: false },
    { id: 'notif_005', type: 'social', title: 'Priya Sharma liked your sunrise post', message: 'Sunrise at Kolatoli — a reminder', date: new Date(Date.now() - 1 * 86400000).toISOString(), read: false },
    { id: 'notif_006', type: 'badge', title: 'New Badge Earned', message: 'You earned the "Consistent Observer" badge for your 7-day streak.', date: new Date(Date.now() - 2 * 86400000).toISOString(), read: true },
    { id: 'notif_007', type: 'action', title: 'Challenge Progress', message: 'Your community reached 47 bags collected at Bakkhali cleanup!', date: new Date(Date.now() - 3 * 86400000).toISOString(), read: true },
    { id: 'notif_008', type: 'system', title: 'Welcome to AquaQuest', message: 'You are now a citizen scientist. Start by observing a waterbody near you.', date: new Date(Date.now() - 15 * 86400000).toISOString(), read: true }
  ],

  /* ============================================================ */
  /* GAMIFICATION                                                  */
  /* ============================================================ */
  gamification: {
    points: 687,
    level: 'Gold Guardian',
    badges: ['first_observation', 'photographer', 'explorer', 'scientist', 'watchdog', 'steward', 'consistent_observer'],
    streak: 12,
    lastObserveDate: new Date().toISOString().slice(0, 10)
  },

  joinedActions: ['chal_cleanup_bakkhali', 'chal_observation_week'],
  completedActions: ['chal_cleanup_bakkhali'],

  savedStories: ['story_013', 'story_014'],
  likedStories: ['story_002', 'story_006'],

  customSites: [],

  /* ============================================================ */
  /* CONTRIBUTIONS                                                 */
  /* ============================================================ */
  contributions: [
    { id: 'AQ-1001', challengeId: 'chal_cleanup_bakkhali', challengeTitle: 'Bakkhali River Clean-up', contributorId: 'user_ayesha', contributorName: 'Dr. Ayesha Rahman', contributorAvatar: 'assets/avatar-ayesha.jpg', siteId: 'bakkhali_river', activityType: 'cleanup', evidenceType: 'before-after', beforePhoto: 'assets/bakkhali.jpg', afterPhoto: 'assets/bakkhali.jpg', photo: null, activityNote: 'Removed plastic packaging, bottles, and discarded fishing line from about 30m of riverbank near the bridge.', activitySelections: ['Removed litter', 'Sorted waste'], quantity: '1-2 bags', observationData: null, wildlifeData: null, submittedAt: new Date(Date.now() - 18 * 60 * 1000).toISOString(), location: { auto: true, name: 'Bakkhali River', area: "Cox's Bazar", lat: 21.4272, lng: 92.0058 }, verified: true },
    { id: 'AQ-1002', challengeId: 'chal_cleanup_bakkhali', challengeTitle: 'Bakkhali River Clean-up', contributorId: 'user_rahim', contributorName: 'Rahim Hossain', contributorAvatar: 'assets/avatar2.jpg', siteId: 'bakkhali_river', activityType: 'cleanup', evidenceType: 'before-after', beforePhoto: 'assets/bakkhali.jpg', afterPhoto: 'assets/bakkhali.jpg', photo: null, activityNote: 'Collected bottles and food packaging from the fishing boat docking area.', activitySelections: ['Removed litter'], quantity: '1-2 bags', submittedAt: new Date(Date.now() - 1 * 3600000).toISOString(), location: { auto: true, name: 'Bakkhali River', area: "Cox's Bazar", lat: 21.4272, lng: 92.0058 }, verified: false },
    { id: 'AQ-1003', challengeId: 'chal_rumaliar_canal', challengeTitle: 'Rumaliar Canal Restoration', contributorId: 'user_tanvir', contributorName: 'Tanvir Ahmed', contributorAvatar: 'assets/avatar4.jpg', siteId: 'rumaliar_canal', activityType: 'restoration', evidenceType: 'before-after', beforePhoto: 'assets/rumaliar.jpg', afterPhoto: 'assets/wetland.jpg', photo: null, activityNote: 'Planted 15 mangrove saplings along the canal edge.', activitySelections: ['Planted saplings'], quantity: null, submittedAt: new Date(Date.now() - 5 * 3600000).toISOString(), location: { auto: true, name: 'Rumaliar Canal', area: "Cox's Bazar", lat: 21.4356, lng: 92.0123 }, verified: true },
    { id: 'AQ-1004', challengeId: 'chal_observation_week', challengeTitle: '7-Day Observation Streak', contributorId: 'user_farhan', contributorName: 'Farhan Reza', contributorAvatar: 'assets/avatar6.jpg', siteId: 'bakkhali_river', activityType: 'observation', evidenceType: 'observation', photo: 'assets/bakkhali.jpg', activityNote: 'Water is significantly clearer this morning compared to yesterday.', observationData: { clarity: 'good', litter: 'little', smell: 'none', colour: 'normal', wildlife: ['fish', 'birds'], ph: 7.1, temperature: 24, turbidity: 14 }, submittedAt: new Date(Date.now() - 2 * 3600000).toISOString(), location: { auto: true, name: 'Bakkhali River', area: "Cox's Bazar", lat: 21.4272, lng: 92.0058 }, verified: true },
    { id: 'AQ-1005', challengeId: 'chal_biodiversity_watch', challengeTitle: 'Biodiversity Watch — Himchari', contributorId: 'user_karim', contributorName: 'Dr. Karim Ahmed', contributorAvatar: 'assets/avatar-karim.jpg', siteId: 'himchari_stream', activityType: 'wildlife', evidenceType: 'wildlife-observation', photo: 'assets/himchari.jpg', activityNote: 'Spotted two kingfishers hunting near the pool below the waterfall.', wildlifeData: { category: 'birds', species: 'Kingfisher (likely common)', count: 2, behavior: 'Hunting near water', confidence: 'confident' }, submittedAt: new Date(Date.now() - 4 * 3600000).toISOString(), location: { auto: true, name: 'Himchari Stream', area: 'Himchari', lat: 21.3560, lng: 92.0210 }, verified: true }
  ]
};

window.DEMO_DATA = DEMO_DATA;
console.log('[AquaQuest] Rich demo data loaded —', Object.keys(DEMO_DATA.users).length, 'users ·', DEMO_DATA.stories.length, 'stories ·', DEMO_DATA.observations.length, 'observations');