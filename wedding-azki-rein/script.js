/**
 * ══════════════════════════════════════════════
 *  Wedding Azki & Rein — Interactive Script
 *  Vanilla JS · No Dependencies
 * ══════════════════════════════════════════════
 */
document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  /* ──────────────────────────────────────────────
     0. UTILITIES
  ────────────────────────────────────────────── */
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  function esc(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

  /* ──────────────────────────────────────────────
     1. GUEST NAME
  ────────────────────────────────────────────── */
  const params = new URLSearchParams(location.search);
  const guestParam = params.get('untuk') || params.get('to') || '';
  if (guestParam) document.getElementById('guestName').textContent = decodeURIComponent(guestParam);

  /* ──────────────────────────────────────────────
     2. API
  ────────────────────────────────────────────── */
  const API = 'https://script.google.com/macros/s/AKfycbzy9tiym46a0FFCV6M3iFYU9GoGKdXceIuwHTr9LygUBg_DYIdlRW7lnxpfyDThcl9NMw/exec';

  /* ──────────────────────────────────────────────
     3. SCROLL PROGRESS BAR
  ────────────────────────────────────────────── */
  function updateScrollProgress() {
    const el = document.getElementById('scroll-progress');
    if (!el) return;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    const pct = h > 0 ? (window.scrollY / h) * 100 : 0;
    el.style.width = pct + '%';
  }

  /* ──────────────────────────────────────────────
     4. DEEP PARALLAX
  ────────────────────────────────────────────── */
  function updateParallax() {
    const sy = window.scrollY;
    document.querySelectorAll('.sec-bg').forEach(bg => {
      const speed = parseFloat(bg.dataset.speed) || 0.2;
      bg.style.transform = 'translateY(' + (sy * speed) + 'px)';
    });
  }

  /* ──────────────────────────────────────────────
     5. TIME CORRIDOR (Scroll-Locked 3D)
  ────────────────────────────────────────────── */
  function updateTimeCorridor() {
    const wrapper = document.getElementById('time-corridor');
    if (!wrapper) return;
    const rect = wrapper.getBoundingClientRect();
    const wrapperH = wrapper.offsetHeight;
    const viewportH = window.innerHeight;
    const scrolled = -rect.top;
    const maxScroll = wrapperH - viewportH;
    if (maxScroll <= 0) return;
    const progress = Math.max(0, Math.min(1, scrolled / maxScroll));
    const cameraZ = progress * -3600;

    wrapper.querySelectorAll('[data-z]').forEach(el => {
      const elZ = parseFloat(el.dataset.z);
      const relZ = elZ - cameraZ;
      
      let opacity = 1;
      if (relZ > 200) {
        opacity = 0;
      } else if (relZ > 0) {
        opacity = 1 - (relZ / 200);
      } else if (relZ < -1000) {
        opacity = Math.max(0, 1 + (relZ + 1000) / 500);
      }

      const scale = 800 / (800 - relZ);
      let translateVal = 'translate(-50%, -50%)';

      if (el.classList.contains('polaroid')) {
        const side = el.dataset.side === 'left' ? -1 : 1;
        const xOffset = side * (120 + Math.abs(relZ) * 0.15);
        translateVal = `translate(calc(-50% + ${xOffset}px), -50%)`;
      }

      el.style.transform = `${translateVal} scale(${Math.max(0, scale).toFixed(4)})`;
      el.style.opacity = Math.max(0, Math.min(1, opacity)).toFixed(3);
    });
  }

  /* ──────────────────────────────────────────────
     6. BUKA UNDANGAN
  ────────────────────────────────────────────── */
  window.bukaUndangan = function() {
    const card = document.querySelector('.cover-inner');
    if (card) card.classList.add('open-card');
    const gate = document.querySelector('.gate-wrapper');
    if (gate) gate.classList.add('open-gate');
    setTimeout(() => { document.getElementById('cover').classList.add('hidden'); }, 300);
    const m = document.getElementById('main');
    m.style.display = 'block';
    void m.offsetHeight;
    setTimeout(() => {
      m.style.opacity = '1';
      document.getElementById('fnav').style.display = 'flex';
      setTimeout(initReveal, 420);
      setTimeout(initTimelineReveal, 500);
      startCountdown();
      const bgm = document.getElementById('bgm');
      bgm.volume = 0.35;
      bgm.play().catch(() => {});
      document.getElementById('mp').classList.add('vis');
      document.getElementById('disc').classList.add('spin');
      initParticles();
      loadWishes();
      initTimelineCards();
      initYearScrubber();
      initSmoothScroll();
      initHaptic();
    }, 160);
  };

  /* ──────────────────────────────────────────────
     7. SCROLL REVEAL (existing .rv system)
  ────────────────────────────────────────────── */
  function initReveal() {
    const els = document.querySelectorAll('.rv,.rv-l,.rv-r,.rv-s');
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); } });
    }, { threshold: 0.07, rootMargin: '0px 0px -30px 0px' });
    els.forEach(el => io.observe(el));
  }

  /* ──────────────────────────────────────────────
     8. TIMELINE REVEAL (.reveal system)
  ────────────────────────────────────────────── */
  function initTimelineReveal() {
    const els = document.querySelectorAll('.reveal');
    const ro = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target); } });
    }, { threshold: 0.15 });
    els.forEach(el => ro.observe(el));
  }

  /* ──────────────────────────────────────────────
     9. COUNTDOWN
  ────────────────────────────────────────────── */
  function startCountdown() {
    const tgt = new Date('2026-11-28T08:00:00+07:00').getTime();
    function tick() {
      const d = Math.max(0, tgt - Date.now());
      setN('cd-days', Math.floor(d / 864e5));
      setN('cd-hours', Math.floor((d % 864e5) / 36e5));
      setN('cd-mins', Math.floor((d % 36e5) / 6e4));
      setN('cd-secs', Math.floor((d % 6e4) / 1e3));
    }
    tick(); setInterval(tick, 1000);
  }
  function setN(id, v) {
    const el = document.getElementById(id), s = String(v).padStart(2, '0');
    if (el && el.textContent !== s) {
      el.style.transform = 'translateY(-4px)'; el.style.opacity = '.4';
      setTimeout(() => { el.textContent = s; el.style.transform = ''; el.style.opacity = ''; }, 170);
    }
  }

  /* ──────────────────────────────────────────────
     10. RSVP
  ────────────────────────────────────────────── */
  let attendVal = 'y';
  window.setAttend = function(v) {
    attendVal = v;
    document.getElementById('optY').classList.toggle('sel', v === 'y');
    document.getElementById('optN').classList.toggle('sel', v === 'n');
    document.getElementById('jmlGrp').style.display = v === 'y' ? 'block' : 'none';
  };
  window.submitRSVP = async function() {
    const nameEl = document.getElementById('rn');
    const name = nameEl.value.trim();
    if (!name) { nameEl.style.borderColor = 'var(--marun)'; nameEl.focus(); setTimeout(() => nameEl.style.borderColor = '', 2200); return; }
    const count = attendVal === 'y' ? (document.getElementById('rcount').value || 1) : 0;
    const msg = document.getElementById('rmsg').value.trim();
    const btn = document.getElementById('submitBtn');
    btn.classList.add('loading'); btn.querySelector('span').textContent = 'Mengirim…';
    const sp = new URLSearchParams({ action:'submit', nama:name, kehadiran:attendVal==='y'?'Hadir':'Tidak Hadir', jumlah:count, pesan:msg });
    try { await fetch(`${API}?${sp}`, { method:'GET', mode:'no-cors' }); } catch(e) { console.warn('RSVP:', e); }
    if (msg) {
      const c = document.createElement('div'); c.className = 'wish-card'; c.style.animation = 'rsvpIn .6s cubic-bezier(.215,.61,.355,1)';
      c.innerHTML = `<p class="wish-name">${esc(name)}</p><p class="wish-msg">${esc(msg)}</p><p class="wish-time">Baru saja</p>`;
      document.getElementById('wishList').prepend(c);
    }
    document.querySelector('.rsvp-form').style.display = 'none';
    document.getElementById('rsvp-success').style.display = 'block';
    setTimeout(loadWishes, 3000);
  };

  /* ──────────────────────────────────────────────
     11. LOAD WISHES
  ────────────────────────────────────────────── */
  async function loadWishes() {
    const box = document.getElementById('wishList');
    try {
      const res = await fetch(`${API}?action=getWishes`); const data = await res.json();
      if (Array.isArray(data)) {
        if (!data.length) { box.innerHTML = '<p style="text-align:center;color:var(--muted);font-style:italic;padding:2rem 0;font-family:\'Cormorant Garamond\',serif">Belum ada ucapan. Jadilah yang pertama!</p>'; return; }
        box.innerHTML = '';
        data.forEach(w => { const c = document.createElement('div'); c.className = 'wish-card'; c.innerHTML = `<p class="wish-name">${esc(w.nama)}</p><p class="wish-msg">${esc(w.pesan)}</p><p class="wish-time">${esc(w.waktu)}</p>`; box.appendChild(c); });
      }
    } catch(e) { console.warn('Wishes:', e); box.innerHTML = '<p style="text-align:center;color:var(--muted);font-style:italic;padding:2rem 0">Gagal memuat ucapan.</p>'; }
  }

  /* ──────────────────────────────────────────────
     12. MUSIC
  ────────────────────────────────────────────── */
  window.toggleMusic = function() {
    const b = document.getElementById('bgm'), d = document.getElementById('disc');
    if (b.paused) { b.play(); d.classList.add('spin'); } else { b.pause(); d.classList.remove('spin'); }
  };

  /* ──────────────────────────────────────────────
     13. COPY & TOAST
  ────────────────────────────────────────────── */
  window.copyAcc = function(n) {
    if (navigator.clipboard) navigator.clipboard.writeText(n).then(showCopyToast).catch(() => fbCopy(n));
    else fbCopy(n);
  };
  function fbCopy(n) { const t = document.createElement('textarea'); t.value = n; document.body.appendChild(t); t.select(); document.execCommand('copy'); document.body.removeChild(t); showCopyToast(); }
  function showCopyToast() { const t = document.getElementById('copyToast'); t.classList.add('show'); setTimeout(() => t.classList.remove('show'), 2500); }

  function showGlobalToast(msg) {
    const t = document.getElementById('toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3000);
  }

  /* ──────────────────────────────────────────────
     14. PARTICLES
  ────────────────────────────────────────────── */
  const CV = document.getElementById('pc'), CX = CV.getContext('2d');
  let pts = [], ptOn = false;
  function rcv() { CV.width = innerWidth; CV.height = innerHeight; }
  addEventListener('resize', rcv); rcv();
  class Pt {
    constructor() { this.reset(); }
    reset() {
      this.x = Math.random() * CV.width; this.y = CV.height + 8;
      this.r = Math.random() * 2 + 0.6; this.vy = -(Math.random() * 0.55 + 0.18);
      this.vx = (Math.random() - 0.5) * 0.35; this.op = Math.random() * 0.38 + 0.1;
      this.fade = Math.random() * 0.0018 + 0.0007; this.w = Math.random() * Math.PI * 2;
      this.ws = Math.random() * 0.014 + 0.007;
      const rn = Math.random(); this.c = rn < 0.6 ? [184,150,62] : rn < 0.85 ? [123,94,167] : [232,125,94];
    }
    step() { this.y += this.vy; this.w += this.ws; this.x += this.vx + Math.sin(this.w) * 0.22; this.op -= this.fade; if (this.op <= 0 || this.y < -8) this.reset(); }
    draw() {
      const [r,g,b] = this.c;
      CX.beginPath(); CX.arc(this.x, this.y, this.r, 0, Math.PI * 2); CX.fillStyle = `rgba(${r},${g},${b},${this.op})`; CX.fill();
      CX.beginPath(); CX.arc(this.x, this.y, this.r * 2.2, 0, Math.PI * 2); CX.fillStyle = `rgba(${r},${g},${b},${this.op * 0.1})`; CX.fill();
    }
  }
  function initParticles() {
    if (ptOn) return;
    const n = Math.min(innerWidth < 480 ? 22 : 50, Math.floor(innerWidth / 18));
    pts = []; for (let i = 0; i < n; i++) { const p = new Pt(); p.y = Math.random() * CV.height; pts.push(p); }
    ptOn = true; animP();
  }
  function animP() { if (!ptOn) return; CX.clearRect(0, 0, CV.width, CV.height); pts.forEach(p => { p.step(); p.draw(); }); requestAnimationFrame(animP); }
  document.addEventListener('visibilitychange', () => { ptOn = !document.hidden; if (ptOn) animP(); });

  /* ──────────────────────────────────────────────
     15. CONFETTI SYSTEM
  ────────────────────────────────────────────── */
  class Confetto {
    constructor(canvas) {
      this.x = Math.random() * canvas.width; this.y = -20;
      this.w = Math.random() * 10 + 5; this.h = Math.random() * 6 + 3;
      this.color = ['#B8963E','#D4AF6A','#7B5EA7','#E87D5E','#4ade80','#F09E86'][Math.floor(Math.random() * 6)];
      this.vy = Math.random() * 3 + 2; this.vx = (Math.random() - 0.5) * 4;
      this.rot = Math.random() * 360; this.rotS = (Math.random() - 0.5) * 10;
      this.life = 1; this.decay = Math.random() * 0.004 + 0.002;
    }
    step() { this.y += this.vy; this.x += this.vx; this.rot += this.rotS; this.vy += 0.05; this.life -= this.decay; }
    draw(ctx) {
      if (this.life <= 0) return;
      ctx.save(); ctx.translate(this.x, this.y); ctx.rotate(this.rot * Math.PI / 180);
      ctx.globalAlpha = this.life; ctx.fillStyle = this.color;
      ctx.fillRect(-this.w / 2, -this.h / 2, this.w, this.h);
      ctx.restore();
    }
  }
  function fireConfetti(duration) {
    duration = duration || 3000;
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width = innerWidth; canvas.height = innerHeight;
    let confetti = []; const t0 = Date.now();
    function anim() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (Date.now() - t0 < duration) for (let i = 0; i < 5; i++) confetti.push(new Confetto(canvas));
      confetti = confetti.filter(c => c.life > 0);
      confetti.forEach(c => { c.step(); c.draw(ctx); });
      if (confetti.length > 0) requestAnimationFrame(anim);
    }
    anim();
  }

  /* ──────────────────────────────────────────────
     16. VANTA BIRDS
  ────────────────────────────────────────────── */
  let vantaEffect = null;
  try {
    if (typeof VANTA !== 'undefined' && typeof THREE !== 'undefined') {
      vantaEffect = VANTA.BIRDS({
        el: '#vanta-bg', THREE: THREE,
        mouseControls: true, touchControls: true, gyroControls: true,
        minHeight: 200, minWidth: 200, scale: 1.0, scaleMobile: 1.0, backgroundAlpha: 0.0,
        color1: 0xd4af37, color2: 0xffffff, colorMode: 'variance',
        birdSize: 1.2, wingSpan: 18.0, speedLimit: 3.0, separation: 50.0, alignment: 20.0, cohesion: 20.0, quantity: 5.0
      });
    }
  } catch(e) { console.warn('Vanta:', e); }
  const coverEl = document.getElementById('cover');
  if (coverEl) {
    const co = new MutationObserver(ms => {
      ms.forEach(m => { if (m.target.classList.contains('hidden') && vantaEffect) { vantaEffect.destroy(); vantaEffect = null; co.disconnect(); } });
    });
    co.observe(coverEl, { attributes: true, attributeFilter: ['class'] });
  }

  /* ──────────────────────────────────────────────
     17. TIMELINE CARD EFFECTS
  ────────────────────────────────────────────── */
  function initTimelineCards() {
    const cards = document.querySelectorAll('.tl-card');
    // Border glow on scroll
    const glowObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('glow-active');
        else e.target.classList.remove('glow-active');
      });
    }, { threshold: 0.15 });
    cards.forEach(c => glowObs.observe(c));

    // Spotlight + 3D tilt
    cards.forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const spotlight = card.querySelector('.card-spotlight');
        if (spotlight) spotlight.style.background = `radial-gradient(400px circle at ${x}px ${y}px, rgba(184,150,62,0.08), transparent 60%)`;
        if (!prefersReducedMotion) {
          const cx = rect.width / 2, cy = rect.height / 2;
          const tiltX = ((y - cy) / cy) * -5;
          const tiltY = ((x - cx) / cx) * 5;
          card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateY(-6px)`;
        }
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
        const sl = card.querySelector('.card-spotlight');
        if (sl) sl.style.background = '';
      });
    });
  }

  /* ──────────────────────────────────────────────
     18. YEAR SCRUBBER
  ────────────────────────────────────────────── */
  function initYearScrubber() {
    document.querySelectorAll('.year-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.year-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const year = btn.dataset.year;
        const target = document.querySelector(`.tl-card[data-year="${year}"]`);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        if (navigator.vibrate) navigator.vibrate(10);
      });
    });
  }
  function updateYearScrubber() {
    const cards = document.querySelectorAll('.tl-card[data-year]');
    let closestYear = null, closestDist = Infinity;
    const mid = window.innerHeight / 2;
    cards.forEach(c => {
      const r = c.getBoundingClientRect();
      const dist = Math.abs(r.top + r.height / 2 - mid);
      if (dist < closestDist) { closestDist = dist; closestYear = c.dataset.year; }
    });
    if (closestYear) {
      document.querySelectorAll('.year-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.year === closestYear);
      });
    }
  }

  /* ──────────────────────────────────────────────
     19. SMOOTH SCROLL
  ────────────────────────────────────────────── */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(a.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
      });
    });
  }

  /* ──────────────────────────────────────────────
     20. HAPTIC FEEDBACK
  ────────────────────────────────────────────── */
  function initHaptic() {
    document.querySelectorAll('button, .tl-card, .f-nav-btn, .btn-open, .card, .gift-card, .event-card').forEach(el => {
      el.addEventListener('touchstart', () => {
        if (navigator.vibrate) navigator.vibrate(10);
      }, { passive: true });
    });
  }

  /* ──────────────────────────────────────────────
     21. PULL-TO-REFRESH EASTER EGG
  ────────────────────────────────────────────── */
  let pullStartY = 0, pullCooldown = false;
  document.addEventListener('touchstart', e => {
    if (window.scrollY === 0) pullStartY = e.touches[0].clientY;
  }, { passive: true });
  document.addEventListener('touchmove', e => {
    // tracked in touchend
  }, { passive: true });
  document.addEventListener('touchend', e => {
    if (pullCooldown || window.scrollY !== 0) return;
    const endY = e.changedTouches[0].clientY;
    const pulled = endY - pullStartY;
    if (pulled > 120) {
      fireConfetti(3000);
      showGlobalToast('Thanks for visiting! 🎉');
      pullCooldown = true;
      setTimeout(() => { pullCooldown = false; }, 10000);
    }
    pullStartY = 0;
  }, { passive: true });

  /* ──────────────────────────────────────────────
     22. CENTRALIZED SCROLL HANDLER
  ────────────────────────────────────────────── */
  let ticking = false;
  function onScroll() {
    if (!ticking) {
      requestAnimationFrame(() => {
        updateParallax();
        updateScrollProgress();
        updateTimeCorridor();
        updateYearScrubber();
        ticking = false;
      });
      ticking = true;
    }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ──────────────────────────────────────────────
     23. REDUCED MOTION FALLBACK
  ────────────────────────────────────────────── */
  if (prefersReducedMotion) {
    document.querySelectorAll('.rv,.rv-l,.rv-r,.rv-s').forEach(el => el.classList.add('on'));
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible'));
  }

}); // END DOMContentLoaded
