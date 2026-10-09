/* ==========================================================================
   ZAIQA — main.js · shared behaviour on every page
   (header, nav, reveal animations, cart store, toasts, session)
   ========================================================================== */
(function () {
  'use strict';

  const $  = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));

  /* ---------- tiny shared helpers ---------- */
  const Z = window.Z = { $, $$ };

  Z.fmt = n => '₹' + Number(n).toLocaleString('en-IN');

  Z.esc = s => String(s).replace(/[&<>"']/g,
    ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

  /* ---------- cart store (localStorage) ---------- */
  const CART_KEY = 'zaiqa_cart';
  Z.getCart = () => {
    try { return JSON.parse(localStorage.getItem(CART_KEY)) || {}; }
    catch (e) { return {}; }
  };
  Z.saveCart = (cart) => {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    Z.refreshBadge(true);
  };
  Z.cartCount = () => Object.values(Z.getCart()).reduce((a, b) => a + b, 0);
  Z.cartTotal = () => Object.entries(Z.getCart()).reduce((sum, [id, q]) => {
    const d = window.dishById ? dishById(id) : null;
    return d ? sum + d.price * q : sum;
  }, 0);

  Z.addToCart = (id, qty = 1, silent = false) => {
    const dish = window.dishById ? dishById(id) : null;
    if (!dish) return;
    const cart = Z.getCart();
    cart[id] = (cart[id] || 0) + qty;
    Z.saveCart(cart);
    if (!silent) Z.toast('Added to your order', dish.name + ' · ' + Z.fmt(dish.price));
  };

  Z.refreshBadge = (animate) => {
    const n = Z.cartCount();
    $$('.cart-count').forEach(el => {
      el.textContent = n;
      el.classList.toggle('show', n > 0);
      if (animate && n > 0) { el.classList.remove('pop'); void el.offsetWidth; el.classList.add('pop'); }
    });
  };

  /* ---------- toasts ---------- */
  let toastWrap = null;
  Z.toast = (title, sub) => {
    if (!toastWrap) {
      toastWrap = document.createElement('div');
      toastWrap.className = 'toasts';
      document.body.appendChild(toastWrap);
    }
    const t = document.createElement('div');
    t.className = 'toast';
    t.innerHTML =
      '<span class="t-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg></span>' +
      '<div><b>' + Z.esc(title) + '</b>' + (sub ? '<span>' + Z.esc(sub) + '</span>' : '') + '</div>';
    toastWrap.appendChild(t);
    requestAnimationFrame(() => requestAnimationFrame(() => t.classList.add('in')));
    setTimeout(() => {
      t.classList.remove('in');
      t.style.opacity = '0';
      setTimeout(() => t.remove(), 450);
    }, 2400);
  };

  /* ---------- session (demo auth in localStorage) ---------- */
  const SES_KEY = 'zaiqa_session';
  Z.getUser = () => {
    try { return JSON.parse(localStorage.getItem(SES_KEY)); }
    catch (e) { return null; }
  };
  Z.setUser = u => u ? localStorage.setItem(SES_KEY, JSON.stringify(u))
                      : localStorage.removeItem(SES_KEY);

  Z.renderNavUser = () => {
    const slot = $('#navUserSlot');
    if (!slot) return;
    const u = Z.getUser();
    if (u) {
      slot.innerHTML =
        '<span class="hello">Hi, ' + Z.esc(u.name.split(' ')[0]) + '</span>' +
        '<button class="icon-btn" id="logoutBtn" title="Log out" aria-label="Log out">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>' +
        '</button>';
      $('#logoutBtn').addEventListener('click', () => {
        Z.setUser(null);
        Z.toast('Signed out', 'Come back soon for a feast!');
        setTimeout(() => location.href = 'index.html', 500);
      });
    } else {
      slot.innerHTML =
        '<a class="btn btn-ghost-light btn-sm btn-login" href="login.html">Login</a>';
    }
  };

  /* ---------- global add-to-cart delegation ---------- */
  document.addEventListener('click', (e) => {
    const btn = e.target.closest('[data-add]');
    if (!btn) return;
    Z.addToCart(btn.getAttribute('data-add'));
    const original = btn.dataset.label || btn.innerHTML;
    btn.dataset.label = original;
    btn.classList.add('added');
    btn.innerHTML = btn.innerHTML.replace(/Add(\s*to\s*Cart)?/i, 'Added ✓');
    setTimeout(() => { btn.classList.remove('added'); btn.innerHTML = btn.dataset.label; }, 1600);
  });

  /* ---------- header scroll state ---------- */
  const header = $('.site-header');
  const onScroll = () => header && header.classList.toggle('scrolled', window.scrollY > 30);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- mobile menu ---------- */
  const burger = $('.hamburger');
  if (burger) {
    burger.addEventListener('click', () => document.body.classList.toggle('menu-open'));
    $$('.nav-panel a').forEach(a => a.addEventListener('click',
      () => document.body.classList.remove('menu-open')));
  }
  /* stagger animation for panel links */
  $$('.nav-panel a.plink').forEach((a, i) => { a.style.transitionDelay = (0.12 + i * 0.06) + 's'; });

  /* ---------- active nav link ---------- */
  const here = (location.pathname.split('/').pop() || 'index.html');
  $$('.main-nav a, .nav-panel a.plink').forEach(a => {
    const href = a.getAttribute('href');
    if (href === here) a.classList.add('active');
  });

  /* ---------- reveal on scroll ---------- */
  const reveals = $$('[data-reveal]');
  if ('IntersectionObserver' in window && reveals.length) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          const d = en.target.getAttribute('data-delay');
          if (d) en.target.style.transitionDelay = d + 'ms';
          en.target.classList.add('in');
          io.unobserve(en.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    reveals.forEach(el => io.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('in'));
  }

  /* ---------- animated counters ---------- */
  const counters = $$('[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    const cio = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        const el = en.target, target = parseFloat(el.getAttribute('data-count'));
        const suffix = el.getAttribute('data-suffix') || '';
        const dec = parseInt(el.getAttribute('data-dec') || '0', 10);
        const t0 = performance.now(), dur = 1600;
        const tick = (t) => {
          const p = Math.min(1, (t - t0) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = (target * eased).toFixed(dec) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        cio.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(el => cio.observe(el));
  }

  /* ---------- footer year ---------- */
  $$('.js-year').forEach(el => el.textContent = new Date().getFullYear());

  /* ---------- footer newsletter (every page) ---------- */
  const news = document.getElementById('newsForm');
  if (news) news.addEventListener('submit', e => {
    e.preventDefault();
    const em = news.querySelector('input').value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em)) {
      Z.toast('Please check your email', 'That address doesn\u2019t look right.');
      return;
    }
    news.reset();
    Z.toast('You\u2019re on the list!', 'Secret menus & festive thalis, straight to your inbox.');
  });

  /* ---------- init ---------- */
  Z.renderNavUser();
  Z.refreshBadge(false);
})();
