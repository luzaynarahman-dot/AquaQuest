/* ============================================================ */
/* AQUAQUEST — SOCIAL SYSTEM                                     */
/* Follow · Observers count · User lookup                        */
/* Unified user system — no separate "expert" layer              */
/* ============================================================ */

const Social = {

  /* ============================================================ */
  /* 1. FOLLOW / UNFOLLOW                                          */
  /* ============================================================ */
  isFollowing(userId) {
    if (!userId || !APP.user) return false;
    const myId = APP.user.id || 'user_self';
    const map = this._getFollowingMap();
    const myFollowing = map[myId] || [];
    return Array.isArray(myFollowing) && myFollowing.includes(userId);
  },

  follow(userId) {
    if (!userId || !APP.user) return false;
    if (userId === 'user_self' || userId === APP.user.id) return false;

    const myId = APP.user.id || 'user_self';
    const map = this._getFollowingMap();

    if (!Array.isArray(map[myId])) map[myId] = [];
    if (map[myId].includes(userId)) return false;

    map[myId].push(userId);
    this._saveFollowingMap(map);
    return true;
  },

  unfollow(userId) {
    if (!userId || !APP.user) return false;

    const myId = APP.user.id || 'user_self';
    const map = this._getFollowingMap();

    if (!Array.isArray(map[myId])) return false;
    const idx = map[myId].indexOf(userId);
    if (idx === -1) return false;

    map[myId].splice(idx, 1);
    this._saveFollowingMap(map);
    return true;
  },

  toggleFollow(userId) {
    if (this.isFollowing(userId)) {
      this.unfollow(userId);
      return false;
    }
    this.follow(userId);
    return true;
  },

  /* ============================================================ */
  /* 2. GET FOLLOWERS / FOLLOWING                                  */
  /* ============================================================ */
  getFollowersCount(userId) {
    return this.getFollowers(userId).length;
  },

  getFollowingCount(userId) {
    return this.getFollowing(userId).length;
  },

  getFollowers(userId) {
    if (!userId) return [];
    const map = this._getFollowingMap();

    const followerIds = Object.entries(map)
      .filter(([_, followingList]) => {
        return Array.isArray(followingList) && followingList.includes(userId);
      })
      .map(([followerId]) => followerId);

    return followerIds
      .map(id => this.getUser(id))
      .filter(Boolean);
  },

  getFollowing(userId) {
    if (!userId) return [];
    const map = this._getFollowingMap();
    const followingIds = map[userId] || [];
    if (!Array.isArray(followingIds)) return [];

    return followingIds
      .map(id => this.getUser(id))
      .filter(Boolean);
  },

  /* Total followers = base + live */
  getTotalFollowers(userId) {
    const base = this.getBaseFollowerCount(userId);
    const live = this.getFollowersCount(userId);
    return base + live;
  },

  getBaseFollowerCount(userId) {
    if (!userId) return 0;

    const bases = {
      'user_ayesha': 1240,
      'user_karim': 892,
      'user_priya': 1567,
      'user_rafiq': 645,
      'user_milos_mum': 342,
      'user_tanzim': 156,
      'user_kimi': 412,
      'user_pretty_pet': 567
    };

    if (bases[userId]) return bases[userId];

    if (userId === 'user_self') {
      return (APP.user && APP.user.followers) || 0;
    }

    if (userId === 'user_demo') {
      return 1247;
    }

    return 0;
  },

  /* ============================================================ */
  /* 3. GET USER — unified lookup                                  */
  /* ============================================================ */
  getUser(userId) {
    if (!userId) return null;

    /* Self */
    if (userId === 'user_self') {
      if (!APP.user) return null;
      return this._buildProfileUser(APP.user);
    }

    /* Demo user (main) */
    if (typeof DEMO_DATA !== 'undefined' && DEMO_DATA.user) {
      if (userId === DEMO_DATA.user.id) {
        return this._buildProfileUser(DEMO_DATA.user);
      }
    }

    /* Try demo stories for regular users */
    const stories = APP.stories || [];
    const storyAuthor = stories.find(s => s.authorId === userId);
    if (storyAuthor) {
      return {
        id: storyAuthor.authorId,
        name: storyAuthor.authorName,
        avatar: storyAuthor.authorAvatar,
        coverPhoto: null,
        bio: this._getDefaultBio(userId),
        location: "Cox's Bazar, Bangladesh",
        role: storyAuthor.authorRole || 'petOwner',
        title: this._getDefaultTitle(userId),
        verified: this._isDefaultVerified(userId),
        isSelf: false
      };
    }

    /* Try known users */
    const known = this._getKnownUsers();
    if (known[userId]) {
      return this._buildProfileUser(known[userId]);
    }

    return null;
  },

  /* ============================================================ */
  /* 4. KNOWN USERS — the water app team                          */
  /* ============================================================ */
  _getKnownUsers() {
    return {
      'user_ayesha': {
        id: 'user_ayesha',
        name: 'Dr. Ayesha Rahman',
        avatar: 'assets/avatar-ayesha.jpg',
        coverPhoto: 'assets/site-bakkhali.jpg',
        bio: 'Freshwater ecologist studying the rivers of Cox\'s Bazar. Working with local communities to protect the waterbodies that sustain us.',
        location: "Cox's Bazar, Bangladesh",
        role: 'expert',
        title: 'Freshwater Ecologist',
        specialization: 'River Ecology',
        experience: 12,
        expertise: [
          'River Ecology',
          'Freshwater Fish',
          'Water Quality',
          'Community Science'
        ],
        credentials: [
          'PhD in Freshwater Ecology',
          'University of Chittagong',
          'Published 24 research papers'
        ],
        verified: true,
        isSelf: false
      },
      'user_karim': {
        id: 'user_karim',
        name: 'Dr. Karim Ahmed',
        avatar: 'assets/avatar-karim.jpg',
        coverPhoto: 'assets/site-rumaliar.jpg',
        bio: 'Marine biologist focused on coastal ecosystems and mangrove forests. Leading the BD Marine Conservation team.',
        location: "Cox's Bazar, Bangladesh",
        role: 'expert',
        title: 'Marine Biologist',
        specialization: 'Coastal & Marine',
        experience: 15,
        expertise: [
          'Coastal Ecology',
          'Mangrove Systems',
          'Marine Litter',
          'Sea Turtles'
        ],
        credentials: [
          'PhD in Marine Biology',
          'James Cook University',
          'Lead Scientist, BD Marine Conservation'
        ],
        verified: true,
        isSelf: false
      },
      'user_priya': {
        id: 'user_priya',
        name: 'Priya Sharma',
        avatar: 'assets/avatar-priya.jpg',
        coverPhoto: 'assets/site-kolatoli.jpg',
        bio: 'Environmental scientist specializing in water quality monitoring and public health. Training citizen scientists across Bangladesh.',
        location: 'Dhaka, Bangladesh',
        role: 'expert',
        title: 'Environmental Scientist',
        specialization: 'Water Quality',
        experience: 9,
        expertise: [
          'Water Quality',
          'Public Health',
          'Citizen Science Training',
          'Data Analysis'
        ],
        credentials: [
          'MSc Environmental Science',
          'BUET',
          'Citizen Science Program Lead'
        ],
        verified: true,
        isSelf: false
      },
      'user_rafiq': {
        id: 'user_rafiq',
        name: 'Dr. Rafiq Islam',
        avatar: 'assets/avatar-rafiq.jpg',
        coverPhoto: 'assets/site-himchari.jpg',
        bio: 'Conservation biologist working at the intersection of human, animal, and environmental health. One Health advisor.',
        location: "Cox's Bazar, Bangladesh",
        role: 'expert',
        title: 'Conservation Biologist',
        specialization: 'One Health',
        experience: 18,
        expertise: [
          'One Health',
          'Wildlife Health',
          'Conservation',
          'Policy & Advocacy'
        ],
        credentials: [
          'PhD in Conservation Biology',
          'Wildlife Trust of Bangladesh',
          'One Health Advisor'
        ],
        verified: true,
        isSelf: false
      },
      'user_milos_mum': {
        id: 'user_milos_mum',
        name: "Milo's Mum",
        avatar: 'assets/avatar-milos-mum.jpg',
        coverPhoto: 'assets/site-bakkhali.jpg',
        bio: 'Cat mom. Coffee lover. Sharing my journey with Milo and learning from other pet parents.',
        location: "Cox's Bazar, Bangladesh",
        role: 'petOwner',
        title: '',
        verified: false,
        isSelf: false
      },
      'user_kimi': {
        id: 'user_kimi',
        name: 'Kimi Kawai',
        avatar: 'assets/avatar-kimi.jpg',
        coverPhoto: 'assets/site-kolatoli.jpg',
        bio: 'Your all-in-one pet store with everything your pet needs.',
        location: "Cox's Bazar, Bangladesh",
        role: 'storeOwner',
        title: 'Store Owner',
        verified: false,
        isSelf: false
      }
    };
  },

  _buildProfileUser(raw) {
    const known = this._getKnownUsers()[raw.id];
    return {
      id: raw.id,
      name: raw.name,
      avatar: raw.avatar,
      coverPhoto: raw.coverPhoto,
      bio: raw.bio,
      location: raw.location,
      role: raw.role || 'petOwner',
      title: raw.title || (known ? known.title : ''),
      specialization: raw.specialization || (known ? known.specialization : ''),
      experience: raw.experience || (known ? known.experience : null),
      expertise: raw.expertise || (known ? known.expertise : []),
      credentials: raw.credentials || (known ? known.credentials : []),
      verified: raw.verified !== undefined ? raw.verified : (known ? known.verified : false),
      isSelf: raw.id === (APP.user && APP.user.id) || raw.id === 'user_self'
    };
  },

  _getDefaultBio(userId) {
    const bios = {
      'user_ayesha': 'Freshwater ecologist studying the rivers of Cox\'s Bazar.',
      'user_karim': 'Marine biologist focused on coastal ecosystems.',
      'user_priya': 'Environmental scientist specializing in water quality.',
      'user_rafiq': 'Conservation biologist at the intersection of One Health.',
      'user_milos_mum': 'Cat mom. Sharing my journey with Milo.',
      'user_kimi': 'Your all-in-one pet store.'
    };
    return bios[userId] || '';
  },

  _getDefaultTitle(userId) {
    const titles = {
      'user_ayesha': 'Freshwater Ecologist',
      'user_karim': 'Marine Biologist',
      'user_priya': 'Environmental Scientist',
      'user_rafiq': 'Conservation Biologist',
      'user_kimi': 'Store Owner'
    };
    return titles[userId] || '';
  },

  _isDefaultVerified(userId) {
    return ['user_ayesha', 'user_karim', 'user_priya', 'user_rafiq'].includes(userId);
  },

  /* ============================================================ */
  /* 5. OBSERVERS — real logic                                     */
  /* ============================================================ */
  getObserversCount(siteId) {
    if (!siteId) return 0;
    const observations = (APP.observations || []).filter(o => o.siteId === siteId);
    const uniqueReporterIds = new Set(observations.map(o => o.reporterId).filter(Boolean));
    return uniqueReporterIds.size;
  },

  /* ============================================================ */
  /* 6. STORAGE                                                    */
  /* ============================================================ */
  _getFollowingMap() {
    try {
      const raw = localStorage.getItem('aq_following_map');
      if (!raw) {
        return this._getDefaultFollowingMap();
      }
      return JSON.parse(raw);
    } catch (e) {
      return this._getDefaultFollowingMap();
    }
  },

  _saveFollowingMap(map) {
    try {
      localStorage.setItem('aq_following_map', JSON.stringify(map));
    } catch (e) {
      console.warn('[Social] Could not save following map');
    }
  },

  _getDefaultFollowingMap() {
    const map = {
      'user_demo': ['user_ayesha', 'user_karim', 'user_milos_mum'],
      'user_self': []
    };
    try {
      localStorage.setItem('aq_following_map', JSON.stringify(map));
    } catch (e) {}
    return map;
  }
};

window.Social = Social;
console.log('[AquaQuest] Social loaded');