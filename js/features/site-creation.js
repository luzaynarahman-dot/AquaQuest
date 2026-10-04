/* ============================================================ */
/* AQUAQUEST — SITE CREATION                                     */
/* User-submitted waterbodies                                    */
/* Complete · Safe · Photo upload · Event delegation             */
/* ============================================================ */

const SiteCreation = {

  CUSTOM_KEY: 'aq_custom_sites',

  /* ============================================================ */
  /* GET CUSTOM SITES                                              */
  /* ============================================================ */
  getCustomSites() {
    try {
      const raw = localStorage.getItem(this.CUSTOM_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
      console.warn('[SiteCreation] Failed to read custom sites:', e);
      return [];
    }
  },

  /* ============================================================ */
  /* SAVE CUSTOM SITES                                             */
  /* ============================================================ */
  saveCustomSites(list) {
    try {
      localStorage.setItem(this.CUSTOM_KEY, JSON.stringify(list));
      if (typeof APP !== 'undefined') APP.customSites = list;
      return true;
    } catch (e) {
      console.warn('[SiteCreation] Failed to save custom sites:', e);
      return false;
    }
  },

  /* ============================================================ */
  /* LOAD ALL SITES (seeded + custom)                              */
  /* ============================================================ */
  loadAllSites() {
    if (typeof SITES === 'undefined' || !Array.isArray(SITES)) {
      console.warn('[SiteCreation] SITES array not ready');
      return;
    }

    const custom = this.getCustomSites();
    let added = 0;

    custom.forEach(cs => {
      if (!cs || !cs.id) return;
      const exists = SITES.find(s => s.id === cs.id);
      if (!exists) {
        SITES.push(cs);
        added++;
      }
    });

    console.log('[SiteCreation] Loaded', added, 'custom sites. Total:', SITES.length);
  },

  /* ============================================================ */
  /* CREATE                                                        */
  /* ============================================================ */
  create(data) {
    if (!data || !data.name || !data.type) {
      console.warn('[SiteCreation] Missing required fields');
      return null;
    }

    if (data.lat === null || data.lat === undefined ||
        data.lng === null || data.lng === undefined) {
      console.warn('[SiteCreation] Missing location');
      return null;
    }

    if (typeof isLoggedIn === 'function' && !isLoggedIn()) {
      if (typeof showToast === 'function') {
        showToast('Sign in to add a water site');
      }
      if (typeof openModal === 'function') {
        openModal('loginModal');
        if (typeof renderLoginModal === 'function') renderLoginModal();
      }
      return null;
    }

    const user = (typeof APP !== 'undefined' && APP.user) || { id: 'user_self', name: 'You' };

    /* Photo — user provided or null */
    const cover = data.cover || null;

    const site = {
      id: 'custom_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      name: String(data.name).trim(),
      type: data.type,
      status: 'community',
      cover: cover,
      location: {
        area: String(data.area || 'Unknown').trim(),
        district: String(data.district || data.area || '').trim(),
        lat: Number(data.lat),
        lng: Number(data.lng)
      },
      description: String(data.description || '').trim() ||
        `A community-added ${data.type} location shared by ${user.name}.`,
      tags: data.tags || ['Community Added'],
      createdBy: user.id,
      createdAt: new Date().toISOString()
    };

    const list = this.getCustomSites();
    list.push(site);
    this.saveCustomSites(list);

    if (typeof SITES !== 'undefined' && Array.isArray(SITES)) {
      SITES.push(site);
    }

    if (typeof Monitoring !== 'undefined' && Monitoring.add) {
      Monitoring.add(site.id);
    }

    if (typeof Gamification !== 'undefined' && Gamification.award) {
      Gamification.award(20, 'Site added');
    }

    if (typeof addNotification === 'function') {
      addNotification(
        'observation',
        '📍 New Water Site Added',
        `"${site.name}" added to the community map. You're now monitoring it.`
      );
    }

    console.log('[SiteCreation] Created:', site.id, site.name);
    return site;
  },

  /* ============================================================ */
  /* DELETE                                                        */
  /* ============================================================ */
  delete(siteId) {
    if (!siteId) return false;

    let list = this.getCustomSites();
    const initialLength = list.length;
    list = list.filter(s => s.id !== siteId);

    if (list.length === initialLength) return false;

    this.saveCustomSites(list);

    if (typeof SITES !== 'undefined' && Array.isArray(SITES)) {
      const idx = SITES.findIndex(s => s.id === siteId);
      if (idx !== -1) SITES.splice(idx, 1);
    }

    if (typeof Monitoring !== 'undefined' && Monitoring.remove) {
      Monitoring.remove(siteId);
    }

    return true;
  },

  /* ============================================================ */
  /* CHECK IF CUSTOM                                               */
  /* ============================================================ */
  isCustom(siteId) {
    if (!siteId || typeof siteId !== 'string') return false;
    return siteId.startsWith('custom_');
  }
};

/* ============================================================ */
/* ADD SITE FLOW — STATE                                         */
/* ============================================================ */
let addSiteState = {
  step: 1,
  data: {
    name: '',
    type: null,
    area: '',
    district: '',
    lat: null,
    lng: null,
    description: '',
    cover: null
  }
};

/* ============================================================ */
/* OPEN FLOW                                                     */
/* ============================================================ */
function openAddSiteFlow() {
  if (typeof isLoggedIn === 'function' && !isLoggedIn()) {
    if (typeof showToast === 'function') {
      showToast('Sign in to add a water site');
    }
    if (typeof openModal === 'function') {
      openModal('loginModal');
      if (typeof renderLoginModal === 'function') renderLoginModal();
    }
    return;
  }

  /* Reset state */
  addSiteState = {
    step: 1,
    data: {
      name: '',
      type: null,
      area: '',
      district: '',
      lat: null,
      lng: null,
      description: '',
      cover: null
    }
  };

  /* Safe prefill from last known location */
  if (typeof Storage !== 'undefined' && typeof Storage.get === 'function') {
    try {
      const lastLat = Storage.get('aq_userLat', null);
      const lastLng = Storage.get('aq_userLng', null);

      if (lastLat && lastLng &&
          typeof lastLat === 'number' && typeof lastLng === 'number') {
        addSiteState.data.lat = lastLat;
        addSiteState.data.lng = lastLng;
      }
    } catch (e) {
      console.warn('[AddSite] Prefill location failed:', e);
    }
  }

  /* Reset handler flag */
  const modal = document.getElementById('quickViewModal');
  if (modal) {
    const content = modal.querySelector('.modal-content');
    if (content) content.dataset.addSiteHandlersAttached = 'false';
  }

  renderAddSiteModal();
}

/* ============================================================ */
/* RENDER MODAL                                                  */
/* ============================================================ */
function renderAddSiteModal() {
  const modal = document.getElementById('quickViewModal');
  if (!modal) {
    console.warn('[AddSite] quickViewModal not found');
    return;
  }

  const content = modal.querySelector('.modal-content');
  if (!content) {
    console.warn('[AddSite] modal-content not found');
    return;
  }

  const step = addSiteState.step;
  const total = 2;

  content.innerHTML = `
    <button type="button" class="close-modal" onclick="closeModal('quickViewModal')">
      <i class="fas fa-times"></i>
    </button>

    <div class="add-site-header">
      <div class="add-site-icon">
        <i class="fas fa-water"></i>
      </div>
      <div>
        <h2 class="add-site-title">Add Water Site</h2>
        <p class="add-site-step">Step ${step} of ${total}</p>
      </div>
    </div>

    <div class="add-site-progress">
      <div class="add-site-progress-fill" style="width:${(step / total) * 100}%;"></div>
    </div>

    ${step === 1 ? renderAddSiteStep1() : renderAddSiteStep2()}
  `;

  /* Reset handler flag before attaching */
  content.dataset.addSiteHandlersAttached = 'false';

  attachAddSiteHandlers();

  if (typeof openModal === 'function') {
    openModal('quickViewModal');
  } else {
    modal.classList.add('active');
  }
}

/* ============================================================ */
/* STEP 1: BASIC INFO                                            */
/* ============================================================ */
function renderAddSiteStep1() {
  const d = addSiteState.data;

  const types = [
    { id: 'river',     label: 'River',     icon: 'fa-water' },
    { id: 'canal',     label: 'Canal',     icon: 'fa-water' },
    { id: 'stream',    label: 'Stream',    icon: 'fa-water' },
    { id: 'beach',     label: 'Beach',     icon: 'fa-umbrella-beach' },
    { id: 'lake',      label: 'Lake',      icon: 'fa-water' },
    { id: 'pond',      label: 'Pond',      icon: 'fa-circle-dot' },
    { id: 'wetland',   label: 'Wetland',   icon: 'fa-leaf' },
    { id: 'estuary',   label: 'Estuary',   icon: 'fa-water' },
    { id: 'other',     label: 'Other',     icon: 'fa-ellipsis' }
  ];

  return `
    <div class="add-site-body">

      <label class="add-site-label">Waterbody Name *</label>
      <input type="text"
             id="addSiteName"
             class="add-site-input"
             placeholder="e.g. Rahman's Pond"
             maxlength="60"
             value="${escapeHtml(d.name || '')}">

      <label class="add-site-label">Type *</label>
      <div class="add-site-type-grid">
        ${types.map(t => `
          <button type="button"
                  class="add-site-type-chip ${d.type === t.id ? 'active' : ''}"
                  data-add-site-type="${t.id}">
            <i class="fas ${t.icon}"></i>
            <span>${t.label}</span>
          </button>
        `).join('')}
      </div>

      <label class="add-site-label">Area / Locality</label>
      <input type="text"
             id="addSiteArea"
             class="add-site-input"
             placeholder="e.g. Cox's Bazar"
             maxlength="60"
             value="${escapeHtml(d.area || '')}">

      <div class="add-site-actions">
        <button type="button" class="observe-btn observe-btn-ghost" onclick="closeModal('quickViewModal')">
          Cancel
        </button>
        <button type="button" class="observe-btn observe-btn-primary" onclick="addSiteNextStep()">
          Next <i class="fas fa-arrow-right"></i>
        </button>
      </div>
    </div>
  `;
}

/* ============================================================ */
/* STEP 2: DESCRIPTION + PHOTO + LOCATION                        */
/* ============================================================ */
function renderAddSiteStep2() {
  const d = addSiteState.data;
  const hasLocation = d.lat !== null && d.lng !== null;
  const hasPhoto = !!d.cover;

  return `
    <div class="add-site-body">

      <label class="add-site-label">Photo (optional)</label>
      <label class="add-site-photo-upload ${hasPhoto ? 'has-photo' : ''}" for="addSitePhotoInput">
        ${hasPhoto ? `
          <img src="${d.cover}" alt="Site photo">
          <button type="button"
                  class="add-site-photo-remove"
                  onclick="event.preventDefault(); event.stopPropagation(); removeAddSitePhoto();">
            <i class="fas fa-times"></i>
          </button>
          <span class="add-site-photo-label">Your photo</span>
        ` : `
          <i class="fas fa-camera"></i>
          <p>Tap to add photo</p>
          <span>JPG, PNG · max 15MB</span>
        `}
      </label>
      <input type="file" id="addSitePhotoInput" accept="image/*" style="display:none;">

      <label class="add-site-label">Description</label>
      <textarea id="addSiteDescription"
                class="add-site-textarea"
                rows="3"
                maxlength="200"
                placeholder="What makes this waterbody special? Local knowledge, history, ecology...">${escapeHtml(d.description || '')}</textarea>

      <label class="add-site-label">Location *</label>

      ${hasLocation ? `
        <div class="add-site-location-set">
          <div class="add-site-location-icon">
            <i class="fas fa-map-marker-alt"></i>
          </div>
          <div class="add-site-location-info">
            <p class="add-site-location-title">Location set</p>
            <p class="add-site-location-coords">
              ${Number(d.lat).toFixed(4)}, ${Number(d.lng).toFixed(4)}
            </p>
          </div>
          <button type="button" class="add-site-location-change" onclick="pickAddSiteLocation()">
            Change
          </button>
        </div>
      ` : `
        <button type="button" class="add-site-pick-location" onclick="pickAddSiteLocation()">
          <i class="fas fa-map-pin"></i>
          <p>Pick location on map</p>
          <span>Tap to open map and choose the spot</span>
        </button>
      `}

      <div class="add-site-hint">
        <i class="fas fa-info-circle"></i>
        <p>Your site will appear as a <strong>community site</strong> on the map. Once 3+ people confirm it, it becomes verified.</p>
      </div>

      <div class="add-site-actions">
        <button type="button" class="observe-btn observe-btn-ghost" onclick="addSitePrevStep()">
          <i class="fas fa-arrow-left"></i> Back
        </button>
        <button type="button" class="observe-btn observe-btn-primary"
                ${!hasLocation ? 'disabled style="opacity:0.5; cursor:not-allowed;"' : ''}
                onclick="submitAddSite()">
          <i class="fas fa-check"></i> Add Site
        </button>
      </div>
    </div>
  `;
}

/* ============================================================ */
/* HANDLERS — Event Delegation                                   */
/* ============================================================ */
function attachAddSiteHandlers() {
  const modal = document.getElementById('quickViewModal');
  if (!modal) return;

  const content = modal.querySelector('.modal-content');
  if (!content) return;

  /* Attach delegated click listener once per content element */
  if (content.dataset.addSiteHandlersAttached !== 'true') {
    content.dataset.addSiteHandlersAttached = 'true';

    content.addEventListener('click', (e) => {
      const typeBtn = e.target.closest('[data-add-site-type]');
      if (typeBtn) {
        e.preventDefault();
        e.stopPropagation();
        captureAddSiteStep1Inputs();
        addSiteState.data.type = typeBtn.dataset.addSiteType;
        renderAddSiteModal();
      }
    });
  }

  /* Attach photo input handler (fresh each render) */
  attachAddSitePhotoInput();
}

/* ============================================================ */
/* PHOTO INPUT — attach to fresh input                           */
/* ============================================================ */
function attachAddSitePhotoInput() {
  const photoInput = document.getElementById('addSitePhotoInput');
  if (!photoInput) return;

  if (photoInput.dataset.listenerAttached === 'true') return;
  photoInput.dataset.listenerAttached = 'true';

  photoInput.addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      if (typeof showToast === 'function') showToast('Please select an image file');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      if (typeof showToast === 'function') showToast('Image too large (max 15MB)');
      return;
    }

    try {
      if (typeof showToast === 'function') showToast('Processing image...');

      /* Capture current inputs */
      captureAddSiteStep2Inputs();

      /* Compress image */
      if (typeof compressImage !== 'function') {
        throw new Error('compressImage not loaded');
      }

      const compressed = await compressImage(file, 1200, 0.75);
      addSiteState.data.cover = compressed;

      /* Re-render step 2 */
      renderAddSiteModal();

      if (typeof showToast === 'function') showToast('Photo added');
    } catch (err) {
      console.error('[AddSite] Photo compress failed:', err);
      if (typeof showToast === 'function') showToast('Could not process image');
    }
  });
}

/* ============================================================ */
/* REMOVE PHOTO                                                  */
/* ============================================================ */
function removeAddSitePhoto() {
  captureAddSiteStep2Inputs();
  addSiteState.data.cover = null;
  renderAddSiteModal();
}

/* ============================================================ */
/* CAPTURE INPUTS                                                */
/* ============================================================ */
function captureAddSiteStep1Inputs() {
  const name = document.getElementById('addSiteName');
  const area = document.getElementById('addSiteArea');
  if (name) addSiteState.data.name = name.value.trim();
  if (area) addSiteState.data.area = area.value.trim();
}

function captureAddSiteStep2Inputs() {
  const desc = document.getElementById('addSiteDescription');
  if (desc) addSiteState.data.description = desc.value.trim();
}

/* ============================================================ */
/* NAVIGATION                                                    */
/* ============================================================ */
function addSiteNextStep() {
  captureAddSiteStep1Inputs();

  const d = addSiteState.data;

  if (!d.name || d.name.length < 2) {
    if (typeof showToast === 'function') showToast('Please enter a name (min 2 characters)');
    return;
  }

  if (!d.type) {
    if (typeof showToast === 'function') showToast('Please select a type');
    return;
  }

  addSiteState.step = 2;
  renderAddSiteModal();
}

function addSitePrevStep() {
  captureAddSiteStep2Inputs();
  addSiteState.step = 1;
  renderAddSiteModal();
}

/* ============================================================ */
/* LOCATION PICKER                                               */
/* ============================================================ */
function pickAddSiteLocation() {
  captureAddSiteStep2Inputs();

  const modal = document.getElementById('quickViewModal');
  if (modal) modal.classList.remove('active');

  if (typeof showPage === 'function') {
    showPage('map');
  }

  if (typeof mapState !== 'undefined') {
    mapState.pickerMode = true;
  }

  setTimeout(() => {
    attachMapPicker();
    if (typeof showToast === 'function') {
      showToast('Tap on the map to set the location');
    }
    showPickerCancelButton();
  }, 400);
}

function attachMapPicker() {
  if (typeof mapState === 'undefined' || !mapState.map) return;

  if (mapState.pickerMarker) {
    mapState.map.removeLayer(mapState.pickerMarker);
    mapState.pickerMarker = null;
  }

  const mapEl = document.getElementById('aquaMap');
  if (mapEl) mapEl.style.cursor = 'crosshair';

  if (typeof handleMapPickerClick === 'function') {
    mapState.map.off('click', handleMapPickerClick);
  }

  mapState.map.on('click', handleMapPickerClick);
}

function handleMapPickerClick(e) {
  if (typeof mapState === 'undefined' || !mapState.pickerMode) return;

  const { lat, lng } = e.latlng;

  if (mapState.pickerMarker) {
    mapState.map.removeLayer(mapState.pickerMarker);
  }

  const icon = L.divIcon({
    className: 'picker-marker',
    html: `
      <div style="
        width: 40px;
        height: 40px;
        background: #0891B2;
        border: 3px solid #fff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        color: #fff;
        font-size: 16px;
        box-shadow: 0 4px 20px rgba(8,145,178,0.5);
      ">
        <i class="fas fa-map-pin"></i>
      </div>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 40]
  });

  mapState.pickerMarker = L.marker([lat, lng], { icon }).addTo(mapState.map);

  addSiteState.data.lat = lat;
  addSiteState.data.lng = lng;

  showPickerConfirmButton(lat, lng);
}

function showPickerCancelButton() {
  let bar = document.getElementById('pickerActionBar');
  if (bar) bar.remove();

  bar = document.createElement('div');
  bar.id = 'pickerActionBar';
  bar.className = 'picker-action-bar';

  bar.innerHTML = `
    <div class="picker-instruction">
      <i class="fas fa-map-pin"></i>
      <span>Tap the map to set your waterbody location</span>
    </div>
    <button type="button" class="picker-cancel-btn" onclick="cancelPicker()">
      Cancel
    </button>
  `;

  document.body.appendChild(bar);
}

function showPickerConfirmButton(lat, lng) {
  let bar = document.getElementById('pickerActionBar');
  if (bar) bar.remove();

  bar = document.createElement('div');
  bar.id = 'pickerActionBar';
  bar.className = 'picker-action-bar';

  bar.innerHTML = `
    <div class="picker-instruction">
      <i class="fas fa-check-circle" style="color:var(--pc-success);"></i>
      <span>${Number(lat).toFixed(4)}, ${Number(lng).toFixed(4)}</span>
    </div>
    <button type="button" class="picker-cancel-btn" onclick="cancelPicker()">
      Cancel
    </button>
    <button type="button" class="picker-confirm-btn" onclick="confirmPicker()">
      <i class="fas fa-check"></i> Confirm
    </button>
  `;

  document.body.appendChild(bar);
}

function confirmPicker() {
  if (addSiteState.data.lat === null || addSiteState.data.lng === null) {
    if (typeof showToast === 'function') showToast('Please tap on the map first');
    return;
  }

  cleanupPicker();

  setTimeout(() => {
    addSiteState.step = 2;
    renderAddSiteModal();
  }, 300);
}

function cancelPicker() {
  cleanupPicker();

  setTimeout(() => {
    addSiteState.step = 2;
    renderAddSiteModal();
  }, 300);
}

function cleanupPicker() {
  if (typeof mapState !== 'undefined') {
    mapState.pickerMode = false;

    if (mapState.map) {
      if (typeof handleMapPickerClick === 'function') {
        mapState.map.off('click', handleMapPickerClick);
      }

      if (mapState.pickerMarker) {
        mapState.map.removeLayer(mapState.pickerMarker);
        mapState.pickerMarker = null;
      }
    }
  }

  const mapEl = document.getElementById('aquaMap');
  if (mapEl) mapEl.style.cursor = '';

  const bar = document.getElementById('pickerActionBar');
  if (bar) bar.remove();
}

/* ============================================================ */
/* SUBMIT                                                        */
/* ============================================================ */
function submitAddSite() {
  captureAddSiteStep1Inputs();
  captureAddSiteStep2Inputs();

  const d = addSiteState.data;

  if (!d.name || !d.type) {
    if (typeof showToast === 'function') showToast('Missing name or type');
    return;
  }

  if (d.lat === null || d.lng === null) {
    if (typeof showToast === 'function') showToast('Please pick a location on the map');
    return;
  }

  const site = SiteCreation.create({
    name: d.name,
    type: d.type,
    area: d.area,
    district: d.area,
    lat: d.lat,
    lng: d.lng,
    description: d.description,
    cover: d.cover
  });

  if (!site) {
    if (typeof showToast === 'function') showToast('Could not create site');
    return;
  }

  if (typeof closeModal === 'function') {
    closeModal('quickViewModal');
  }

  if (typeof showToast === 'function') {
    showToast('💙 Water site added & added to My Waters');
  }

  if (typeof confetti === 'function') {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#22D3EE', '#0891B2', '#3B82F6', '#10B981']
    });
  }

  setTimeout(() => {
    if (typeof APP !== 'undefined' && APP.currentPage === 'map' &&
        typeof addMapMarkers === 'function') {
      addMapMarkers();
    }
  }, 300);

  if (typeof refreshDrawer === 'function') refreshDrawer();

  setTimeout(() => {
    if (typeof openSiteDetail === 'function') {
      openSiteDetail(site.id);
    }
  }, 700);
}

/* ============================================================ */
/* EXPORTS                                                       */
/* ============================================================ */
window.SiteCreation = SiteCreation;
window.openAddSiteFlow = openAddSiteFlow;
window.renderAddSiteModal = renderAddSiteModal;
window.addSiteNextStep = addSiteNextStep;
window.addSitePrevStep = addSitePrevStep;
window.submitAddSite = submitAddSite;
window.pickAddSiteLocation = pickAddSiteLocation;
window.confirmPicker = confirmPicker;
window.cancelPicker = cancelPicker;
window.removeAddSitePhoto = removeAddSitePhoto;

console.log('[AquaQuest] Site creation loaded');