/* ============================================================ */
/* AQUAQUEST — ONBOARDING                                        */
/* 3-slide welcome experience with images                        */
/* ============================================================ */

const Onboarding = {

  KEY: 'aq_onboarded',
  currentSlide: 0,
  totalSlides: 3,
  _animating: false,

  /* ============================================================ */
  /* SLIDES DATA                                                   */
  /* ============================================================ */
  slides: [
    {
      image: 'assets/onboarding1.png',
      title: 'Log water observations',
      desc: 'Easily record water quality, clarity, and wildlife sightings. Your data helps scientists monitor aquatic ecosystems.'
    },
    {
      image: 'assets/onboarding2.png',
      title: 'Explore community insights',
      desc: 'Access a shared water map of user observations. Discover trends, see historical data, and identify areas that need attention.'
    },
    {
      image: 'assets/onboarding3.png',
      title: 'Protect and make an impact',
      desc: 'Participate in community cleanup actions, join local campaigns, and champion cleaner, healthier water for everyone.'
    }
  ],

  /* ============================================================ */
  /* SHOULD SHOW                                                   */
  /* ============================================================ */
  shouldShow() {
    try {
      return localStorage.getItem(this.KEY) !== 'true';
    } catch (e) {
      return true;
    }
  },

  markComplete() {
    try {
      localStorage.setItem(this.KEY, 'true');
    } catch (e) {}
  },

  /* ============================================================ */
  /* SHOW                                                          */
  /* ============================================================ */
  show() {
    const container = document.getElementById('onboardingModal');
    if (!container) return;

    this.currentSlide = 0;
    container.innerHTML = this.renderOnboarding();

    requestAnimationFrame(() => {
      container.classList.add('active');
    });

    this.attachHandlers();

    /* Lock body scroll */
    document.body.style.overflow = 'hidden';
  },

  /* ============================================================ */
  /* HIDE                                                          */
  /* ============================================================ */
  hide() {
    const container = document.getElementById('onboardingModal');
    if (!container) return;

    container.classList.remove('active');
    document.body.style.overflow = '';

    setTimeout(() => {
      container.innerHTML = '';
    }, 400);
  },

  /* ============================================================ */
  /* COMPLETE                                                      */
  /* ============================================================ */
  complete() {
    this.markComplete();
    this.hide();

    if (typeof showToast === 'function') {
      showToast('Welcome to AquaQuest');
    }
  },

  /* ============================================================ */
  /* RENDER                                                        */
  /* ============================================================ */
  renderOnboarding() {
    return `
      <div class="onboarding-slides" id="onboardingSlides">

        ${this.slides.map((slide, i) => `
          <div class="onboarding-slide ${i === 0 ? 'active' : ''}" data-slide="${i}">

            <div class="onboarding-brand">
              <img src="assets/logo-circle.jpg" alt="" onerror="this.style.display='none'">
              <span>AquaQuest</span>
            </div>

            <div class="onboarding-image-wrap">
              <img src="${slide.image}"
                   alt="${slide.title}"
                   class="onboarding-image"
                   onerror="this.style.opacity='0.3'">
            </div>

            <div class="onboarding-content">
              <h2 class="onboarding-title">${slide.title}</h2>
              <p class="onboarding-desc">${slide.desc}</p>

              ${i === this.totalSlides - 1 ? `
                <button type="button"
                        class="onboarding-btn-primary"
                        onclick="Onboarding.complete()">
                  Get Started <i class="fas fa-arrow-right"></i>
                </button>
                <button type="button"
                        class="onboarding-btn-ghost"
                        onclick="Onboarding.skipToLogin()">
                  Already a member? <strong>Log in</strong>
                </button>
              ` : `
                <button type="button"
                        class="onboarding-btn-primary"
                        onclick="Onboarding.nextSlide()">
                  Next <i class="fas fa-arrow-right"></i>
                </button>
                <button type="button"
                        class="onboarding-btn-ghost"
                        onclick="Onboarding.complete()">
                  Skip intro
                </button>
              `}
            </div>
          </div>
        `).join('')}

        <div class="onboarding-dots" id="onboardingDots">
          ${this.slides.map((_, i) => `
            <button type="button"
                    class="onboarding-dot ${i === 0 ? 'active' : ''}"
                    data-dot="${i}"
                    aria-label="Go to slide ${i + 1}"></button>
          `).join('')}
        </div>

      </div>
    `;
  },

  /* ============================================================ */
  /* HANDLERS                                                      */
  /* ============================================================ */
  attachHandlers() {
    const container = document.getElementById('onboardingModal');
    if (!container) return;

    /* Dot navigation */
    container.querySelectorAll('[data-dot]').forEach(dot => {
      dot.addEventListener('click', () => {
        const idx = parseInt(dot.dataset.dot, 10);
        if (idx === this.currentSlide) return;
        this.currentSlide = idx;
        this.updateSlide();
      });
    });

    /* Swipe support */
    let touchStartX = 0;
    let touchEndX = 0;

    container.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    container.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      this.handleSwipe(touchStartX, touchEndX);
    }, { passive: true });

    /* Keyboard */
    document.addEventListener('keydown', this._keyHandler);
  },

  _keyHandler(e) {
    const modal = document.getElementById('onboardingModal');
    if (!modal || !modal.classList.contains('active')) return;

    if (e.key === 'ArrowRight') {
      Onboarding.nextSlide();
    } else if (e.key === 'ArrowLeft') {
      Onboarding.prevSlide();
    } else if (e.key === 'Escape') {
      Onboarding.complete();
    }
  },

  handleSwipe(startX, endX) {
    if (this._animating) return;

    const diff = startX - endX;
    const threshold = 50;

    if (diff > threshold) {
      this.nextSlide();
    } else if (diff < -threshold) {
      this.prevSlide();
    }
  },

  /* ============================================================ */
  /* NAVIGATION                                                    */
  /* ============================================================ */
  nextSlide() {
    if (this._animating) return;
    if (this.currentSlide >= this.totalSlides - 1) {
      this.complete();
      return;
    }

    this.currentSlide++;
    this.updateSlide();
  },

  prevSlide() {
    if (this._animating) return;
    if (this.currentSlide <= 0) return;

    this.currentSlide--;
    this.updateSlide();
  },

  /* ============================================================ */
  /* UPDATE SLIDE                                                  */
  /* ============================================================ */
  updateSlide() {
    const slides = document.querySelectorAll('.onboarding-slide');
    const dots = document.querySelectorAll('[data-dot]');

    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === this.currentSlide);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === this.currentSlide);
    });
  },

  /* ============================================================ */
  /* SKIP TO LOGIN                                                 */
  /* ============================================================ */
  skipToLogin() {
    this.markComplete();
    this.hide();

    setTimeout(() => {
      if (typeof openModal === 'function') {
        openModal('loginModal');
        if (typeof renderLoginModal === 'function') {
          renderLoginModal();
        }
      }
    }, 350);
  }
};

/* ============================================================ */
/* AUTO-INIT                                                     */
/* ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => {
    if (Onboarding.shouldShow()) {
      Onboarding.show();
    }
  }, 600);
});

/* ============================================================ */
/* EXPORTS                                                       */
/* ============================================================ */
window.Onboarding = Onboarding;
window.showOnboarding = () => Onboarding.show();

console.log('[AquaQuest] Onboarding loaded — 3 slides with images');
