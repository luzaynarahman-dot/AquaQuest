/* ============================================================ */
/* AQUAQUEST — STORAGE HELPERS                                   */
/* Wraps localStorage with JSON + error handling                 */
/* ============================================================ */

const Storage = {
  get(key, fallback = null) {
    try {
      const raw = localStorage.getItem(key);
      if (raw === null) return fallback;
      return JSON.parse(raw);
    } catch (e) {
      console.warn('[Storage] get failed for', key, e);
      return fallback;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.warn('[Storage] set failed for', key, e);
      return false;
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      return false;
    }
  },

  clear() {
    try {
      localStorage.clear();
      return true;
    } catch (e) {
      return false;
    }
  }
};

/* ============================================================ */
/* IMAGE COMPRESSION — robust version (ONLY ONE DEFINITION)      */
/* Uses URL.createObjectURL (more reliable than FileReader)      */
/* ============================================================ */
function compressImage(file, maxWidth = 1200, quality = 0.75) {
  return new Promise((resolve, reject) => {

    /* ---------- Validate input ---------- */
    if (!file) {
      reject(new Error('No file provided'));
      return;
    }

    if (!file.type || !file.type.startsWith('image/')) {
      reject(new Error('Not an image file'));
      return;
    }

    /* ---------- Create object URL ---------- */
    let objectUrl;
    try {
      objectUrl = URL.createObjectURL(file);
    } catch (err) {
      reject(new Error('Could not create URL: ' + err.message));
      return;
    }

    /* ---------- Load image ---------- */
    const img = new Image();

    img.onload = function() {
      try {
        const canvas = document.createElement('canvas');
        let width = img.naturalWidth || img.width;
        let height = img.naturalHeight || img.height;

        if (!width || !height) {
          throw new Error('Image has no dimensions');
        }

        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          throw new Error('Canvas context unavailable');
        }

        /* Fill white background (for PNG transparency) */
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        const compressed = canvas.toDataURL('image/jpeg', quality);

        /* Cleanup */
        URL.revokeObjectURL(objectUrl);

        if (!compressed || compressed === 'data:,') {
          reject(new Error('Compression returned empty'));
          return;
        }

        resolve(compressed);

      } catch (err) {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Canvas draw failed: ' + err.message));
      }
    };

    img.onerror = function() {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('Image load failed — try a different photo'));
    };

    img.src = objectUrl;
  });
}

/* ============================================================ */
/* EXPORTS                                                       */
/* ============================================================ */
window.Storage = Storage;
window.compressImage = compressImage;

console.log('[AquaQuest] Storage loaded — Storage + compressImage ready');