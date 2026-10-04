/* ============================================================ */
/* AQUAQUEST — TOAST + MODAL SYSTEM                              */
/* Toast notifications · Modals with simple stable scroll lock   */
/* ============================================================ */

/* ============================================================ */
/* 1. TOAST                                                      */
/* ============================================================ */
let __toastTimeout = null;

function showToast(message, duration = 2500) {
  const toast = document.getElementById('toast');
  const msg = document.getElementById('toastMessage');
  if (!toast || !msg) return;

  msg.textContent = message;
  toast.classList.add('show');

  clearTimeout(__toastTimeout);
  __toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

/* ============================================================ */
/* 2. MODAL SYSTEM — simple stable scroll lock                   */
/* Only uses overflow: hidden. No position:fixed tricks.         */
/* Scroll position stays exactly where it was.                   */
/* ============================================================ */

let __modalScrollLocked = false;

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  /* Lock scroll only once, even if multiple modals stacked */
  if (!__modalScrollLocked) {
    document.body.classList.add('modal-open');
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    __modalScrollLocked = true;
  }

  modal.classList.add('active');
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  modal.classList.remove('active');

  /* Unlock only if no other modal is still open */
  setTimeout(() => {
    const anyOpen = document.querySelector('.modal.active');
    if (!anyOpen) {
      unlockBodyScroll();
    }
  }, 50);
}

function closeAllModals() {
  document.querySelectorAll('.modal').forEach(m => m.classList.remove('active'));

  setTimeout(() => {
    const anyOpen = document.querySelector('.modal.active');
    if (!anyOpen) {
      unlockBodyScroll();
    }
  }, 50);
}

function unlockBodyScroll() {
  document.body.classList.remove('modal-open');
  document.documentElement.style.overflow = '';
  document.body.style.overflow = '';
  __modalScrollLocked = false;
}

/* ============================================================ */
/* 3. GLOBAL CLICK HANDLER — backdrop + close buttons            */
/* ============================================================ */
document.addEventListener('click', (e) => {
  /* Direct click on modal backdrop */
  if (e.target.classList && e.target.classList.contains('modal')) {
    e.target.classList.remove('active');

    setTimeout(() => {
      const anyOpen = document.querySelector('.modal.active');
      if (!anyOpen) unlockBodyScroll();
    }, 50);
    return;
  }

  /* Click on close button */
  const closeBtn = e.target.closest('.close-modal, [data-close-modal]');
  if (closeBtn) {
    e.preventDefault();
    e.stopPropagation();

    const modal = closeBtn.closest('.modal');
    if (modal) {
      modal.classList.remove('active');

      setTimeout(() => {
        const anyOpen = document.querySelector('.modal.active');
        if (!anyOpen) unlockBodyScroll();
      }, 50);
    }
  }
});

/* ============================================================ */
/* 4. ESCAPE KEY — closes modals                                 */
/* ============================================================ */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    const activeModals = document.querySelectorAll('.modal.active');
    if (activeModals.length > 0) {
      const last = activeModals[activeModals.length - 1];
      last.classList.remove('active');

      setTimeout(() => {
        const anyOpen = document.querySelector('.modal.active');
        if (!anyOpen) unlockBodyScroll();
      }, 50);
    }
  }
});

/* ============================================================ */
/* 5. PAGESHOW SAFETY — recovery on mobile back button           */
/* ============================================================ */
window.addEventListener('pageshow', () => {
  setTimeout(() => {
    const anyOpen = document.querySelector('.modal.active');
    if (!anyOpen && __modalScrollLocked) {
      unlockBodyScroll();
    }

    /* Reset stray inline styles just in case */
    document.querySelectorAll('.modal').forEach(m => {
      if (!m.classList.contains('active')) {
        m.style.pointerEvents = '';
        m.style.opacity = '';
        m.style.visibility = '';
      }
    });
  }, 100);
});

/* ============================================================ */
/* 6. UTILITIES                                                  */
/* ============================================================ */
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function generateId(prefix = 'id') {
  return prefix + '_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
}

function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  if (isNaN(d)) return '';
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function formatTime(date) {
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit'
  });
}

function timeAgo(date) {
  if (!date) return '';
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return minutes + 'm ago';
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return hours + 'h ago';
  const days = Math.floor(hours / 24);
  if (days < 7) return days + 'd ago';
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return weeks + 'w ago';
  return formatDate(date);
}

function formatCount(n) {
  if (!n && n !== 0) return '0';
  if (n >= 1000000) return (n / 1000000).toFixed(1).replace('.0', '') + 'M';
  if (n >= 1000) return (n / 1000).toFixed(1).replace('.0', '') + 'k';
  return String(n);
}

function capitalize(s) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : '';
}

/* ============================================================ */
/* 7. EXPORTS                                                    */
/* ============================================================ */
window.showToast = showToast;
window.openModal = openModal;
window.closeModal = closeModal;
window.closeAllModals = closeAllModals;
window.unlockBodyScroll = unlockBodyScroll;
window.escapeHtml = escapeHtml;
window.generateId = generateId;
window.formatDate = formatDate;
window.formatTime = formatTime;
window.timeAgo = timeAgo;
window.formatCount = formatCount;
window.capitalize = capitalize;

console.log('[AquaQuest] Toast + Modal loaded');