/* ============================================================ */
/* AQUAQUEST — CHARTS                                            */
/* Chart.js wrappers for water quality trends                    */
/* ============================================================ */

const Charts = {

  activeCharts: {},

  /* ============================================================ */
  /* 1. CLARITY + LITTER TREND                                     */
  /* ============================================================ */
  renderSiteTrend(canvasId, siteId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || typeof Chart === 'undefined') return;

    /* Destroy existing */
    if (this.activeCharts[canvasId]) {
      this.activeCharts[canvasId].destroy();
    }

    const stats = Observations.getSiteStats(siteId);
    const data = stats.trendData;

    if (!data.length) {
      this.showEmptyState(canvas, 'No observation data yet');
      return;
    }

    this.hideEmptyState(canvas);

    const labels = data.map(d => {
      const date = new Date(d.date);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });

    const clarityData = data.map(d => d.clarity);
    const litterData = data.map(d => d.litter);

    const isDark = document.body.classList.contains('dark-mode');
    const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(14,58,76,0.06)';
    const textColor = isDark ? '#A8D5E2' : '#3B6479';

    this.activeCharts[canvasId] = new Chart(canvas, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Clarity',
            data: clarityData,
            borderColor: '#0891B2',
            backgroundColor: 'rgba(8,145,178,0.12)',
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#0891B2',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7,
            borderWidth: 2.5
          },
          {
            label: 'Litter (inverted)',
            data: litterData,
            borderColor: '#F59E0B',
            backgroundColor: 'rgba(245,158,11,0.08)',
            tension: 0.4,
            fill: true,
            pointBackgroundColor: '#F59E0B',
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 5,
            pointHoverRadius: 7,
            borderWidth: 2.5,
            borderDash: [6, 4]
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              boxWidth: 12,
              padding: 12,
              font: { size: 11, weight: '600' },
              color: textColor,
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            backgroundColor: 'rgba(6, 30, 42, 0.95)',
            titleColor: '#fff',
            bodyColor: '#E0F7FA',
            padding: 10,
            cornerRadius: 8,
            displayColors: true,
            callbacks: {
              label: (ctx) => {
                const val = ctx.parsed.y;
                const map = { 4: 'Excellent', 3: 'Good', 2: 'Moderate', 1: 'Poor', 0: 'Critical' };
                return ctx.dataset.label + ': ' + (map[val] || val);
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            max: 4,
            ticks: {
              stepSize: 1,
              font: { size: 10, weight: '600' },
              color: textColor,
              callback: (v) => ['Critical', 'Poor', 'Mod', 'Good', 'Exc'][v] || ''
            },
            grid: { color: gridColor, drawBorder: false }
          },
          x: {
            ticks: {
              font: { size: 10, weight: '600' },
              color: textColor,
              maxRotation: 0,
              autoSkip: true,
              maxTicksLimit: 6
            },
            grid: { display: false }
          }
        }
      }
    });
  },

  /* ============================================================ */
  /* 2. pH TREND (if data available)                               */
  /* ============================================================ */
  renderPhTrend(canvasId, siteId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || typeof Chart === 'undefined') return;

    if (this.activeCharts[canvasId]) {
      this.activeCharts[canvasId].destroy();
    }

    const obs = Observations.getBySite(siteId).filter(o => o.ph !== null && o.ph !== undefined);

    if (!obs.length) {
      this.showEmptyState(canvas, 'No pH readings logged yet');
      return;
    }

    this.hideEmptyState(canvas);

    const sorted = obs.slice().reverse();
    const labels = sorted.map(o => {
      const d = new Date(o.date);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
    const data = sorted.map(o => o.ph);

    const isDark = document.body.classList.contains('dark-mode');
    const gridColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(14,58,76,0.06)';
    const textColor = isDark ? '#A8D5E2' : '#3B6479';

    this.activeCharts[canvasId] = new Chart(canvas, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'pH',
          data,
          borderColor: '#8B5CF6',
          backgroundColor: 'rgba(139,92,246,0.12)',
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#8B5CF6',
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 5,
          borderWidth: 2.5
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: 'rgba(6, 30, 42, 0.95)',
            callbacks: {
              label: (ctx) => `pH ${ctx.parsed.y.toFixed(1)}`
            }
          }
        },
        scales: {
          y: {
            min: 5,
            max: 10,
            ticks: {
              stepSize: 1,
              font: { size: 10, weight: '600' },
              color: textColor
            },
            grid: { color: gridColor, drawBorder: false }
          },
          x: {
            ticks: {
              font: { size: 10, weight: '600' },
              color: textColor,
              maxRotation: 0,
              autoSkip: true,
              maxTicksLimit: 6
            },
            grid: { display: false }
          }
        }
      }
    });
  },

  /* ============================================================ */
  /* 3. WILDLIFE BREAKDOWN (doughnut)                              */
  /* ============================================================ */
  renderWildlife(canvasId, siteId) {
    const canvas = document.getElementById(canvasId);
    if (!canvas || typeof Chart === 'undefined') return;

    if (this.activeCharts[canvasId]) {
      this.activeCharts[canvasId].destroy();
    }

    const stats = Observations.getSiteStats(siteId);
    const wildlife = stats.wildlifeCount;

    const entries = Object.entries(wildlife);

    if (!entries.length) {
      this.showEmptyState(canvas, 'No wildlife recorded yet');
      return;
    }

    this.hideEmptyState(canvas);

    const labels = entries.map(([k]) => Observations.wildlifeLabel(k));
    const data = entries.map(([, v]) => v);

    const colors = ['#0891B2', '#10B981', '#F59E0B', '#8B5CF6', '#EF4444', '#0284C7', '#22C55E', '#EC4899'];

    this.activeCharts[canvasId] = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: colors.slice(0, labels.length),
          borderWidth: 3,
          borderColor: document.body.classList.contains('dark-mode') ? '#0E2E40' : '#FFFFFF'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '68%',
        plugins: {
          legend: {
            position: 'right',
            labels: {
              boxWidth: 10,
              padding: 10,
              font: { size: 11, weight: '600' },
              color: document.body.classList.contains('dark-mode') ? '#A8D5E2' : '#3B6479',
              usePointStyle: true,
              pointStyle: 'circle'
            }
          }
        }
      }
    });
  },

  /* ============================================================ */
  /* 4. HELPER: empty state                                        */
  /* ============================================================ */
  showEmptyState(canvas, text) {
    canvas.style.display = 'none';
    const wrap = canvas.parentElement;
    if (!wrap) return;

    let empty = wrap.querySelector('.chart-empty');
    if (!empty) {
      empty = document.createElement('div');
      empty.className = 'chart-empty';
      empty.style.cssText = `
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: 100%;
        min-height: 160px;
        color: var(--pc-text-muted);
        font-size: 12.5px;
        font-weight: 600;
        text-align: center;
        padding: 20px;
      `;
      empty.innerHTML = `
        <i class="fas fa-chart-line" style="font-size: 28px; opacity: 0.4; margin-bottom: 10px; color: var(--pc-accent);"></i>
        <span>${text}</span>
      `;
      wrap.appendChild(empty);
    } else {
      empty.querySelector('span').textContent = text;
      empty.style.display = 'flex';
    }
  },

  hideEmptyState(canvas) {
    canvas.style.display = 'block';
    const wrap = canvas.parentElement;
    if (!wrap) return;
    const empty = wrap.querySelector('.chart-empty');
    if (empty) empty.style.display = 'none';
  },

  /* ============================================================ */
  /* 5. DESTROY ALL                                                */
  /* ============================================================ */
  destroyAll() {
    Object.keys(this.activeCharts).forEach(key => {
      if (this.activeCharts[key]) {
        this.activeCharts[key].destroy();
        delete this.activeCharts[key];
      }
    });
  }
};

window.Charts = Charts;
console.log('[AquaQuest] Charts loaded');