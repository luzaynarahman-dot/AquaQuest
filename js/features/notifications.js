/* ============================================================ */
/* AQUAQUEST — NOTIFICATIONS                                     */
/* ============================================================ */

function renderNotificationsModal() {
  const modal = document.getElementById('notifModal');
  if (!modal) return;

  /* ⭐ Not logged in → show sign-in prompt */
  if (typeof isLoggedIn === 'function' && !isLoggedIn()) {
    modal.querySelector('.modal-content').innerHTML = `
      <button class="close-modal" onclick="closeModal('notifModal')">
        <i class="fas fa-times"></i>
      </button>
      <h2 class="modal-title"><i class="fas fa-bell"></i> Notifications</h2>

      <div class="empty-state" style="padding:40px 20px;">
        <i class="fas fa-bell-slash"></i>
        <p style="font-size:14px; font-weight:700; color:var(--pc-text); margin-bottom:6px;">
          Sign in to see notifications
        </p>
        <p style="font-size:12px; color:var(--pc-text-muted); margin-bottom:16px;">
          We'll notify you about confirmations, badges & more
        </p>
        <button class="btn btn-primary btn-sm" onclick="closeModal('notifModal'); openModal('loginModal'); if(typeof renderLoginModal==='function') renderLoginModal();">
          <i class="fas fa-sign-in-alt"></i> Sign In
        </button>
      </div>
    `;
    openModal('notifModal');
    return;
  }

  const notifications = APP.notifications || [];
  const unread = notifications.filter(n => !n.read).length;

  modal.querySelector('.modal-content').innerHTML = `
    <button class="close-modal" onclick="closeModal('notifModal')">
      <i class="fas fa-times"></i>
    </button>
    <h2 class="modal-title">
      <i class="fas fa-bell"></i> Notifications
      ${unread > 0 ? `<span style="font-size:13px; color:var(--pc-text-muted); font-weight:600; margin-left:6px;">(${unread} new)</span>` : ''}
    </h2>

    ${notifications.length === 0 ? `
      <div class="empty-state">
        <i class="fas fa-bell-slash"></i>
        <p style="font-size:14px; font-weight:700; color:var(--pc-text); margin-bottom:4px;">No notifications yet</p>
        <p style="font-size:12px; color:var(--pc-text-muted);">We'll notify you about confirmations, badges & more</p>
      </div>
    ` : `
      <div class="notif-list">
        ${notifications.map(n => renderNotificationItem(n)).join('')}
      </div>

      ${unread > 0 ? `
        <button class="btn btn-outline w-full" style="margin-top:14px;" onclick="markAllRead()">
          <i class="fas fa-check-double"></i> Mark all as read
        </button>
      ` : ''}

      <button class="btn btn-outline w-full" style="margin-top:8px;" onclick="clearAllNotifications()">
        <i class="fas fa-trash"></i> Clear all
      </button>
    `}
  `;

  modal.querySelectorAll('[data-notif-id]').forEach(item => {
    item.addEventListener('click', () => {
      const id = item.dataset.notifId;
      markNotifRead(id);
      item.classList.remove('unread');

      const remaining = (APP.notifications || []).filter(n => !n.read).length;
      const headerCount = modal.querySelector('.modal-title span');
      if (remaining > 0) {
        if (headerCount) headerCount.textContent = `(${remaining} new)`;
      } else {
        if (headerCount) headerCount.remove();
      }
    });
  });

  openModal('notifModal');
}

function renderNotificationItem(n) {
  const iconMap = {
    confirmation: 'fa-check-circle',
    report: 'fa-flag',
    action: 'fa-seedling',
    badge: 'fa-medal',
    social: 'fa-heart',
    system: 'fa-info-circle',
    observation: 'fa-eye',
    story: 'fa-book-open',
    level: 'fa-trophy',
    reminder: 'fa-clock'
  };
  const icon = iconMap[n.type] || 'fa-bell';

  const colorMap = {
    confirmation: 'var(--pc-success)',
    report: 'var(--pc-danger)',
    action: 'var(--pc-success)',
    badge: 'var(--pc-warning)',
    social: 'var(--pc-pink)',
    system: 'var(--pc-info)',
    observation: 'var(--pc-accent)',
    story: 'var(--pc-purple)',
    level: 'var(--pc-caramel)'
  };
  const color = colorMap[n.type] || 'var(--pc-accent)';

  return `
    <div class="notif-item ${n.read ? '' : 'unread'}" data-notif-id="${n.id}">
      <div class="notif-icon-wrap" style="background:${color}15; color:${color};">
        <i class="fas ${icon}"></i>
      </div>
      <div class="notif-info">
        <p class="notif-title">${escapeHtml(n.title || 'Notification')}</p>
        <p class="notif-message">${escapeHtml(n.message || '')}</p>
        <p class="notif-time">${timeAgo(n.date)}</p>
      </div>
    </div>
  `;
}

function markNotifRead(id) {
  const notifications = APP.notifications || [];
  const n = notifications.find(x => x.id === id);
  if (!n || n.read) return;

  n.read = true;
  Storage.set(APP.KEYS.NOTIFICATIONS, notifications);
  updateNotifBadge();
  if (typeof refreshDrawer === 'function') refreshDrawer();
}

function markAllRead() {
  const notifications = APP.notifications || [];
  notifications.forEach(n => n.read = true);
  Storage.set(APP.KEYS.NOTIFICATIONS, notifications);
  updateNotifBadge();
  if (typeof refreshDrawer === 'function') refreshDrawer();
  renderNotificationsModal();
  showToast('All marked as read');
}

function clearAllNotifications() {
  if (!confirm('Clear all notifications?')) return;
  APP.notifications = [];
  Storage.set(APP.KEYS.NOTIFICATIONS, []);
  updateNotifBadge();
  if (typeof refreshDrawer === 'function') refreshDrawer();
  renderNotificationsModal();
  showToast('Notifications cleared');
}

function addNotification(type, title, message) {
  APP.notifications = APP.notifications || [];
  APP.notifications.unshift({
    id: 'notif_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
    type,
    title,
    message,
    date: new Date().toISOString(),
    read: false
  });
  Storage.set(APP.KEYS.NOTIFICATIONS, APP.notifications);
  if (typeof updateNotifBadge === 'function') updateNotifBadge();
}

window.renderNotificationsModal = renderNotificationsModal;
window.markNotifRead = markNotifRead;
window.markAllRead = markAllRead;
window.clearAllNotifications = clearAllNotifications;
window.addNotification = addNotification;

console.log('[AquaQuest] Notifications loaded');