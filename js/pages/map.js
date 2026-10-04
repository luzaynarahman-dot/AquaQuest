/* ============================================================ */
/* AQUAQUEST — COMMUNITY MAP (Leaflet)                           */
/* Interactive map with water site markers + Add Site            */
/* ============================================================ */

let mapState = {
  map: null,
  markers: [],
  activeFilter: 'all',
  activeMarkerId: null,
  userMarker: null,
  pickerMode: false,
  pickerMarker: null,
  pendingLocation: null
};

/* ============================================================ */
/* 1. MAIN RENDER                                                */
/* ============================================================ */
function renderMap() {
  const page = document.getElementById('page-map');
  if (!page) return;

  page.innerHTML = `
    <div class="map-page">

      <div class="map-controls">
        <div class="map-filters" id="mapFilters">
          <button class="map-filter-chip active" data-map-filter="all">
            <i class="fas fa-globe"></i> All
          </button>
          <button class="map-filter-chip" data-map-filter="verified">
            <i class="fas fa-check-circle"></i> Verified
          </button>
          <button class="map-filter-chip" data-map-filter="community">
            <i class="fas fa-users"></i> Community
          </button>
          <button class="map-filter-chip" data-map-filter="monitored">
            <i class="fas fa-eye"></i> Monitoring
          </button>
        </div>

        <button class="map-locate-btn" onclick="mapLocateMe()" aria-label="My location">
          <i class="fas fa-location-crosshairs"></i>
        </button>
      </div>

      <div class="map-stats-bar">
        <div class="map-stat">
          <i class="fas fa-water" style="color:var(--pc-accent);"></i>
          <span>${SITES.length} sites</span>
        </div>
        <div class="map-stat">
          <i class="fas fa-eye" style="color:var(--pc-success);"></i>
          <span>${(APP.observations || []).length} observations</span>
        </div>
        <div class="map-stat">
          <i class="fas fa-flag" style="color:var(--pc-danger);"></i>
          <span>${(APP.reports || []).filter(r => r.status !== 'resolved').length} active reports</span>
        </div>
      </div>

      <div id="aquaMap" class="aqua-map"></div>

      <button class="map-add-site-btn" onclick="openAddSiteFlow()" aria-label="Add water site">
        <i class="fas fa-plus"></i>
        <span>Add Site</span>
      </button>

      <button class="map-legend-toggle" onclick="toggleMapLegend()" aria-label="Legend">
        <i class="fas fa-list"></i>
      </button>

      <div class="map-legend" id="mapLegend">
        <p class="map-legend-title">Legend</p>
        <div class="map-legend-row">
          <span class="map-legend-dot" style="background:#10B981;"></span>
          <span>Verified Site</span>
        </div>
        <div class="map-legend-row">
          <span class="map-legend-dot" style="background:#3B82F6;"></span>
          <span>Community Site</span>
        </div>
        <div class="map-legend-row">
          <span class="map-legend-dot" style="background:#F59E0B;"></span>
          <span>You're Monitoring</span>
        </div>
        <div class="map-legend-row">
          <span class="map-legend-dot" style="background:#EF4444;"></span>
          <span>Active Report</span>
        </div>
      </div>

    </div>
  `;

  setTimeout(initAquaMap, 100);
  attachMapHandlers();
}

/* ============================================================ */
/* 2. INIT LEAFLET MAP                                           */
/* ============================================================ */
function initAquaMap() {
  const mapEl = document.getElementById('aquaMap');
  if (!mapEl) return;

  if (typeof L === 'undefined') {
    mapEl.innerHTML = `<div style="padding:40px; text-align:center; color:var(--pc-text-muted);">
      <i class="fas fa-map-location-dot" style="font-size:32px; opacity:0.4; display:block; margin-bottom:12px;"></i>
      <p style="font-size:13px; font-weight:700;">Map library loading...</p>
    </div>`;
    setTimeout(initAquaMap, 500);
    return;
  }

  if (mapState.map) {
    mapState.map.remove();
    mapState.map = null;
  }

  const center = [21.4272, 92.0058];

  mapState.map = L.map('aquaMap', {
    center,
    zoom: 11,
    zoomControl: false,
    attributionControl: false
  });

  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
  }).addTo(mapState.map);

  L.control.zoom({ position: 'bottomright' }).addTo(mapState.map);

  addMapMarkers();

  /* ⭐ Fit bounds only for Cox's Bazar region sites (primary demo area) */
const cxbSites = SITES.filter(s =>
  s.location.district === "Cox's Bazar" ||
  s.location.area === "Cox's Bazar" ||
  s.location.area === "Himchari" ||
  s.location.area === "Chakaria" ||
  s.location.area === "Maheshkhali" ||
  s.location.area === "Inani"
);

  if (cxbSites.length > 0 && mapState.map) {
    const cxbCoords = cxbSites.map(s => [s.location.lat, s.location.lng]);
    const group = L.featureGroup(cxbCoords.map(c => L.marker(c)));
    mapState.map.fitBounds(group.getBounds().pad(0.2));
  }
}

/* ============================================================ */
/* 3. ADD MARKERS                                                */
/* ============================================================ */
function addMapMarkers() {
  if (!mapState.map) return;

  mapState.markers.forEach(m => {
    if (mapState.map && m.marker) mapState.map.removeLayer(m.marker);
  });
  mapState.markers = [];

  const filter = mapState.activeFilter;

  /* -------- Sites -------- */
  SITES.forEach(site => {
    /* Filter logic */
    if (filter === 'verified' && site.status !== 'verified') return;
    if (filter === 'community' && site.status !== 'community') return;
    if (filter === 'monitored' && !Monitoring.isMonitored(site.id)) return;

    const stats = Observations.getSiteStats(site.id);
    const healthColor = {
      excellent: '#10B981',
      good: '#22C55E',
      moderate: '#F59E0B',
      poor: '#F97316',
      critical: '#EF4444'
    }[stats.health.grade] || '#0891B2';

    /* Pin color based on status */
    const isMonitored = Monitoring.isMonitored(site.id);
    const isCommunity = site.status === 'community';

    let pinColor = healthColor;
    let pinIcon = getSiteTypeIcon(site.type);

    if (isCommunity) {
      pinColor = '#3B82F6';
    } else if (isMonitored) {
      pinColor = '#F59E0B';
    }

    const icon = L.divIcon({
      className: 'aqua-map-marker',
      html: `
        <div style="
          position: relative;
          width: 40px;
          height: 40px;
        ">
          <div style="
            width: 40px;
            height: 40px;
            background: ${pinColor};
            border: 3px solid #fff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            font-size: 16px;
            box-shadow: 0 4px 14px rgba(0,0,0,0.3);
          ">
            <i class="fas ${pinIcon}"></i>
          </div>
          ${isMonitored ? `
            <div style="
              position: absolute;
              top: -4px;
              right: -4px;
              width: 18px;
              height: 18px;
              background: #F59E0B;
              border: 2px solid #fff;
              border-radius: 50%;
              display: flex;
              align-items: center;
              justify-content: center;
              color: #fff;
              font-size: 9px;
            ">
              <i class="fas fa-eye"></i>
            </div>
          ` : ''}
        </div>
      `,
      iconSize: [40, 40],
      iconAnchor: [20, 20]
    });

    const marker = L.marker([site.location.lat, site.location.lng], { icon })
      .addTo(mapState.map)
      .on('click', () => showMapPopup(site, stats));

    mapState.markers.push({ id: site.id, type: 'site', marker });
  });

  /* -------- Reports -------- */
  if (filter === 'all') {
    (APP.reports || []).forEach(report => {
      if (report.status === 'resolved') return;

      const site = getSiteById(report.siteId);
      if (!site) return;

      const icon = L.divIcon({
        className: 'aqua-map-marker',
        html: `
          <div style="
            width: 34px;
            height: 34px;
            background: #EF4444;
            border: 3px solid #fff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            font-size: 14px;
            box-shadow: 0 4px 14px rgba(239,68,68,0.5);
          ">
            <i class="fas fa-flag"></i>
          </div>
        `,
        iconSize: [34, 34],
        iconAnchor: [17, 17]
      });

      const marker = L.marker(
        [site.location.lat + 0.008, site.location.lng + 0.008],
        { icon }
      ).addTo(mapState.map);

      marker.on('click', () => showReportPopup(report, site));

      mapState.markers.push({ id: report.id, type: 'report', marker });
    });
  }
}

/* ============================================================ */
/* 4. POPUPS                                                     */
/* ============================================================ */
function showMapPopup(site, stats) {
  if (!mapState.map) return;

  const healthLabel = capitalize(stats.health.grade);
  const healthColor = {
    excellent: '#10B981',
    good: '#22C55E',
    moderate: '#F59E0B',
    poor: '#F97316',
    critical: '#EF4444'
  }[stats.health.grade] || '#0891B2';

  const isMonitored = Monitoring.isMonitored(site.id);
  const isCommunity = site.status === 'community';

  const popupContent = `
    <div style="min-width: 220px; font-family: 'Inter', sans-serif;">
      <img src="${site.cover}" style="width:100%; height:100px; object-fit:cover; border-radius:10px; margin-bottom:10px;" onerror="this.style.display='none'">
      <p style="font-size:14px; font-weight:800; color:#0C2D3E; margin:0 0 4px;">${escapeHtml(site.name)}</p>
      <p style="font-size:11px; color:#7FA3B5; margin:0 0 8px;">${escapeHtml(site.location.area)}</p>
      <div style="display:flex; gap:6px; align-items:center; margin-bottom:10px; flex-wrap:wrap;">
        <span style="display:inline-flex; align-items:center; gap:4px; padding:3px 8px; background:${healthColor}20; color:${healthColor}; border-radius:20px; font-size:10px; font-weight:800; text-transform:uppercase;">
          <i class="fas fa-circle" style="font-size:6px;"></i> ${healthLabel}
        </span>
        ${isCommunity ? `
          <span style="display:inline-flex; align-items:center; gap:4px; padding:3px 8px; background:#3B82F620; color:#3B82F6; border-radius:20px; font-size:10px; font-weight:800; text-transform:uppercase;">
            <i class="fas fa-users"></i> Community
          </span>
        ` : ''}
        ${isMonitored ? `
          <span style="display:inline-flex; align-items:center; gap:4px; padding:3px 8px; background:#F59E0B20; color:#F59E0B; border-radius:20px; font-size:10px; font-weight:800; text-transform:uppercase;">
            <i class="fas fa-eye"></i> Monitoring
          </span>
        ` : ''}
      </div>
      <button onclick="closeMapPopup(); setTimeout(()=>openSiteDetail('${site.id}'), 150);" style="width:100%; padding:8px; background:#0891B2; color:#fff; border:none; border-radius:8px; font-size:12px; font-weight:800; cursor:pointer;">
        View Site →
      </button>
    </div>
  `;

  L.popup({
    closeButton: true,
    maxWidth: 260,
    className: 'aqua-map-popup'
  })
  .setLatLng([site.location.lat, site.location.lng])
  .setContent(popupContent)
  .openOn(mapState.map);
}

function showReportPopup(report, site) {
  if (!mapState.map) return;

  const popupContent = `
    <div style="min-width: 220px; font-family: 'Inter', sans-serif;">
      <div style="display:flex; align-items:center; gap:6px; margin-bottom:8px;">
        <span style="width:26px; height:26px; background:#EF4444; color:#fff; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:11px;">
          <i class="fas fa-flag"></i>
        </span>
        <p style="font-size:13px; font-weight:800; color:#0C2D3E; margin:0;">${capitalize(report.type)}</p>
      </div>
      <p style="font-size:11px; color:#7FA3B5; margin:0 0 6px;">${escapeHtml(site.name)} · ${timeAgo(report.date)}</p>
      <p style="font-size:12px; color:#3B6479; line-height:1.4; margin:0 0 10px;">${escapeHtml(report.description.substring(0, 100))}${report.description.length > 100 ? '…' : ''}</p>
      <button onclick="closeMapPopup(); setTimeout(()=>openReportDetail('${report.id}'), 150);" style="width:100%; padding:7px; background:#EF4444; color:#fff; border:none; border-radius:6px; font-size:11px; font-weight:800; cursor:pointer;">
        View Report
      </button>
    </div>
  `;

  L.popup({
    closeButton: true,
    maxWidth: 260,
    className: 'aqua-map-popup'
  })
  .setLatLng([site.location.lat + 0.008, site.location.lng + 0.008])
  .setContent(popupContent)
  .openOn(mapState.map);
}

function closeMapPopup() {
  if (mapState.map) mapState.map.closePopup();
}

/* ============================================================ */
/* 5. HANDLERS                                                   */
/* ============================================================ */
function attachMapHandlers() {
  const filters = document.getElementById('mapFilters');
  if (filters) {
    filters.addEventListener('click', (e) => {
      const chip = e.target.closest('[data-map-filter]');
      if (!chip) return;

      mapState.activeFilter = chip.dataset.mapFilter;

      filters.querySelectorAll('.map-filter-chip').forEach(c => {
        c.classList.toggle('active', c.dataset.mapFilter === mapState.activeFilter);
      });

      addMapMarkers();
    });
  }
}

/* ============================================================ */
/* 6. LOCATE ME                                                  */
/* ============================================================ */
function mapLocateMe() {
  if (!mapState.map) {
    showToast('Map not ready');
    return;
  }

  if (!navigator.geolocation) {
    showToast('Geolocation not supported');
    return;
  }

  showToast('Finding your location...');

  const timeout = setTimeout(() => {
    showToast('Location request timed out');
  }, 10000);

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      clearTimeout(timeout);
      const { latitude, longitude } = pos.coords;

      mapState.map.flyTo([latitude, longitude], 15, { duration: 1.5 });

      if (mapState.userMarker) {
        mapState.map.removeLayer(mapState.userMarker);
      }

      const icon = L.divIcon({
        className: 'user-location-marker',
        html: `
          <div style="
            width: 20px;
            height: 20px;
            background: #0891B2;
            border: 3px solid #fff;
            border-radius: 50%;
            box-shadow: 0 0 0 8px rgba(8, 145, 178, 0.2), 0 4px 14px rgba(0, 0, 0, 0.3);
          "></div>
        `,
        iconSize: [20, 20],
        iconAnchor: [10, 10]
      });

      mapState.userMarker = L.marker([latitude, longitude], { icon }).addTo(mapState.map);

      showToast('Location found');

      Storage.set('aq_userLat', latitude);
      Storage.set('aq_userLng', longitude);
    },
    (err) => {
      clearTimeout(timeout);
      console.warn('[Map] Geolocation error:', err);

      mapState.map.flyTo([21.4272, 92.0058], 11, { duration: 1.5 });
      showToast('Showing Cox\'s Bazar area');
    },
    {
      enableHighAccuracy: true,
      timeout: 8000,
      maximumAge: 60000
    }
  );
}

/* ============================================================ */
/* 7. LEGEND TOGGLE                                              */
/* ============================================================ */
function toggleMapLegend() {
  const legend = document.getElementById('mapLegend');
  if (legend) legend.classList.toggle('active');
}

/* ============================================================ */
/* 8. EXPORTS                                                    */
/* ============================================================ */
window.renderMap = renderMap;
window.initAquaMap = initAquaMap;
window.mapLocateMe = mapLocateMe;
window.toggleMapLegend = toggleMapLegend;
window.closeMapPopup = closeMapPopup;
window.addMapMarkers = addMapMarkers;

console.log('[AquaQuest] Map loaded');