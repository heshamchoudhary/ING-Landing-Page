/* ==========================================================================
   Inspire Netball Group — 2026 Selection Days
   ========================================================================== */

/* --------------------------------------------------------------------------
   REGISTRATION FORM LINKS
   Paste each form URL between the quotes. Any link left empty shows a
   "coming soon" message instead of opening a blank page.
   -------------------------------------------------------------------------- */
const REGISTRATION_LINKS = {
  // Emerging Talent Academy
  sandringham_eta_11_12: '',
  sandringham_eta_13_14: '',
  oakleigh_11_12:    '',
  oakleigh_13_14:    '',
  fawkner_11_12:     '',
  fawkner_13_14:     '',
  ballarat_11_12:    '',
  ballarat_13_14:    '',
  sale_11_12:        '',
  sale_13_14:        '',
  geelong_11_12:     '',
  geelong_13_14:     '',
  priestdale_11_12:  '',
  priestdale_13_14:  '',
  qld2_interest:     '',

  // Goal Shooters Academy (Sandringham — open registrations)
  sandringham_11_12: '',
  sandringham_13_14: '',
  boxhill_interest:  ''
};

const SOCIAL_LINKS = {
  instagram: '',
  facebook:  ''
};

(function () {
  'use strict';

  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  /* ---------- Toast ---------- */
  const toast = $('.toast');
  let toastTimer;
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 3600);
  }

  /* ---------- Links ---------- */
  $$('[data-form]').forEach((a) => {
    const url = (REGISTRATION_LINKS[a.dataset.form] || '').trim();
    if (url) {
      a.href = url;
      return;
    }
    a.removeAttribute('target');
    a.addEventListener('click', (e) => {
      e.preventDefault();
      const name = a.closest('.loc-card').querySelector('h5').textContent;
      showToast('Registration for ' + name + ' opens very soon — please check back shortly.');
    });
  });

  $$('[data-social]').forEach((a) => {
    const url = (SOCIAL_LINKS[a.dataset.social] || '').trim();
    if (url) {
      a.href = url;
      a.target = '_blank';
      a.rel = 'noopener';
    }
  });

  /* ---------- Page-load entrance ---------- */
  function markLoaded() {
    requestAnimationFrame(() => root.classList.add('is-loaded'));
  }
  const fontsReady = document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve();
  Promise.race([fontsReady, new Promise((r) => setTimeout(r, 900))]).then(markLoaded);

  // Hero headline: stagger each word
  $$('.hero__title .w > span').forEach((el, i) => {
    el.style.transitionDelay = (0.3 + i * 0.06).toFixed(2) + 's';
  });

  /* ---------- Scroll reveal ---------- */
  const revealEls = $$('[data-reveal]');
  revealEls.forEach((el) => {
    if (el.dataset.reveal === 'stagger') {
      Array.from(el.children).forEach((c, i) => c.style.setProperty('--i', i));
    }
  });

  function reveal(el) {
    el.classList.add('is-in');
    if (el.dataset.reveal === 'stagger') {
      // Hand control back to hover styles once the entrance has played
      const wait = el.children.length * 90 + 1500;
      setTimeout(() => { el.dataset.reveal = 'done'; }, wait);
    }
  }

  if ('IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        reveal(entry.target);
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach(reveal);
  }

  /* ---------- Count-up stat ---------- */
  $$('[data-count]').forEach((el) => {
    const target = parseInt(el.dataset.count, 10);
    const fmt = (n) => n.toLocaleString('en-AU');
    if (reduceMotion || !('IntersectionObserver' in window)) {
      el.textContent = fmt(target);
      return;
    }
    el.textContent = '0';
    const io = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const dur = 2000;
      const tick = (now) => {
        const t = Math.min(1, (now - start) / dur);
        const eased = t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
        el.textContent = fmt(Math.round(target * eased));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, { threshold: 0.6 });
    io.observe(el);
  });

  /* ---------- Locations: reveal + filter ---------- */
  const groups = $$('.loc-group');
  const subs = $$('.loc-sub');
  const cards = $$('.loc-card');
  const emptyState = $('.loc-empty');
  const countEl = $('[data-result-count]');
  const state = { program: 'All', region: 'All' };
  let locationsRevealed = reduceMotion;

  function showCards(list) {
    list.forEach((c, i) => {
      c.classList.remove('is-shown', 'is-settled', 'is-leaving');
      c.style.setProperty('--i', i);
    });
    void document.body.offsetWidth; // restart transitions
    list.forEach((c) => c.classList.add('is-shown'));
    setTimeout(() => list.forEach((c) => c.classList.add('is-settled')), list.length * 70 + 900);
  }

  if ('IntersectionObserver' in window && !reduceMotion) {
    const gio = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        gio.unobserve(entry.target);
        entry.target.classList.add('is-in');
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    groups.forEach((g) => gio.observe(g));

    // Cards enter as they scroll into view; cards arriving together are staggered
    const cio = new IntersectionObserver((entries) => {
      let arriving = entries.filter((e) => e.isIntersecting).map((e) => e.target);
      arriving.forEach((c) => cio.unobserve(c));
      if (!arriving.length) return;
      locationsRevealed = true;
      // A filter change may already have brought some of these in
      arriving = arriving.filter((c) => !c.classList.contains('is-shown'));
      if (!arriving.length) return;
      showCards(arriving);
    }, { rootMargin: '0px 0px -8% 0px' });
    cards.forEach((c) => cio.observe(c));
  } else {
    groups.forEach((g) => g.classList.add('is-in'));
    cards.forEach((c) => c.classList.add('is-shown', 'is-settled'));
  }

  const matches = (c) =>
    (state.program === 'All' || c.dataset.program === state.program) &&
    (state.region === 'All' || c.dataset.region === state.region);

  function syncChips() {
    $$('.chip').forEach((chip) => {
      const on = state[chip.dataset.filter] === chip.dataset.value;
      chip.classList.toggle('is-active', on);
      chip.setAttribute('aria-pressed', String(on));
    });
  }

  function applyFilters(animate) {
    syncChips();
    const visible = cards.filter(matches);
    const leaving = cards.filter((c) => !c.hidden && !matches(c));
    const leavingGroups = groups.concat(subs).filter((g) => !g.hidden && !visible.some((c) => g.contains(c)));

    const commit = () => {
      cards.forEach((c) => { c.hidden = !matches(c); c.classList.remove('is-leaving'); });
      groups.forEach((g) => {
        g.hidden = !visible.some((c) => g.contains(c));
        g.classList.remove('is-leaving');
        if (!g.hidden) g.classList.add('is-in');
      });
      subs.forEach((sub) => {
        sub.hidden = !visible.some((c) => sub.contains(c));
        sub.classList.remove('is-leaving');
      });
      emptyState.hidden = visible.length > 0;
      emptyState.classList.toggle('is-shown', visible.length === 0);

      countEl.textContent = visible.length;
      countEl.classList.remove('is-bump');
      void countEl.offsetWidth;
      countEl.classList.add('is-bump');

      if (reduceMotion || !('IntersectionObserver' in window)) {
        visible.forEach((c) => c.classList.add('is-shown', 'is-settled'));
      } else if (!locationsRevealed) {
        // Not scrolled into view yet — the card observer will animate them in
      } else {
        showCards(visible);
      }
    };

    if (animate && !reduceMotion && (leaving.length || leavingGroups.length)) {
      leaving.forEach((c) => c.classList.add('is-leaving'));
      leavingGroups.forEach((g) => g.classList.add('is-leaving'));
      setTimeout(commit, 230);
    } else {
      commit();
    }
  }

  $$('.chip').forEach((chip) => {
    chip.addEventListener('click', () => {
      if (state[chip.dataset.filter] === chip.dataset.value) return;
      state[chip.dataset.filter] = chip.dataset.value;
      applyFilters(true);
    });
  });

  const resetBtn = $('[data-reset-filters]');
  if (resetBtn) resetBtn.addEventListener('click', () => {
    state.program = 'All';
    state.region = 'All';
    applyFilters(true);
  });

  // "Select your location below" pre-filters to that academy
  $$('[data-set-program]').forEach((link) => {
    link.addEventListener('click', () => {
      state.program = link.dataset.setProgram;
      state.region = 'All';
      applyFilters(false);
    });
  });

  /* ---------- FAQ accordion ---------- */
  $$('.faq__q').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq__item');
      const open = !item.classList.contains('is-open');
      item.classList.toggle('is-open', open);
      btn.setAttribute('aria-expanded', String(open));
    });
  });

  /* ---------- Scroll-driven effects ---------- */
  const header = $('.site-header');
  const progress = $('.scroll-progress');
  const sticky = $('.sticky-cta');
  const stickyLink = sticky ? $('a', sticky) : null;
  const locations = $('#locations');
  const parallaxEls = reduceMotion ? [] : $$('[data-parallax]').map((el) => ({
    el,
    img: $('img', el),
    speed: parseFloat(el.dataset.parallax) || 0,
    rotate: parseFloat(el.dataset.rotate) || 0,
    host: el.parentElement
  }));

  let locationsInView = false;
  if (locations && 'IntersectionObserver' in window) {
    new IntersectionObserver((entries) => {
      locationsInView = entries[0].isIntersecting;
      onScroll();
    }, { threshold: 0.15 }).observe(locations);
  }

  let ticking = false;
  let scrolled = false;
  function update() {
    ticking = false;
    const y = window.scrollY;
    const vh = window.innerHeight;
    const max = document.documentElement.scrollHeight - vh;

    // Header state with hysteresis so it never flickers at the threshold
    if (!scrolled && y > 40) { scrolled = true; header.classList.add('is-scrolled'); }
    else if (scrolled && y < 10) { scrolled = false; header.classList.remove('is-scrolled'); }

    progress.style.setProperty('--progress', max > 0 ? (y / max).toFixed(4) : 0);

    if (sticky) {
      const show = y > 520 && !locationsInView;
      sticky.classList.toggle('is-visible', show);
      sticky.setAttribute('aria-hidden', String(!show));
      if (stickyLink) stickyLink.tabIndex = show ? 0 : -1;
    }

    parallaxEls.forEach((p) => {
      const r = p.host.getBoundingClientRect();
      if (r.bottom < -100 || r.top > vh + 100) return;
      // Offset from the host section's centre relative to the viewport centre
      const offset = (r.top + r.height / 2) - vh / 2;
      const ty = -offset * p.speed;
      const rot = p.rotate ? ' rotate(' + (y * p.rotate).toFixed(2) + 'deg)' : '';
      p.img.style.transform = 'translate3d(0,' + ty.toFixed(1) + 'px,0)' + rot;
    });
  }
  function onScroll() {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  update();

  /* ---------- Hero image tilt (desktop pointers only) ---------- */
  const frame = $('[data-tilt]');
  if (frame && finePointer && !reduceMotion) {
    const media = frame.parentElement;
    media.addEventListener('pointermove', (e) => {
      const r = media.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      frame.style.transform = 'perspective(1100px) rotateY(' + (px * 5).toFixed(2) + 'deg) rotateX(' + (-py * 5).toFixed(2) + 'deg)';
    });
    media.addEventListener('pointerleave', () => { frame.style.transform = ''; });
  }
})();
