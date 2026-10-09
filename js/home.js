/* ==========================================================================
   ZAIQA — home.js · popular dishes, testimonials slider, offer countdown
   ========================================================================== */
(function () {
  'use strict';
  const { $, $$ } = window.Z;

  const starSVG = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.9 6.26 6.6.72-4.9 4.5 1.35 6.52L12 16.77 6.05 20l1.35-6.52-4.9-4.5 6.6-.72z"/></svg>';

  /* ---------- popular dishes ---------- */
  const grid = $('#popularGrid');
  if (grid) {
    const popular = window.MENU.filter(d => d.tags.includes('popular'));
    grid.innerHTML = popular.map((d, i) => `
      <article class="dish-card" data-reveal data-delay="${i * 110}">
        <div class="dish-media">
          <img src="${d.img}" alt="${window.Z.esc(d.name)}" loading="lazy">
          <div class="dish-badges">
            ${d.tags.includes('signature') ? '<span class="dish-tag signature">Signature</span>' : ''}
            ${d.tags.includes('spicy') ? '<span class="dish-tag spicy">Spicy</span>' : ''}
          </div>
          <span class="dish-rating">★ ${d.rating.toFixed(1)}</span>
        </div>
        <div class="dish-body">
          <div class="dish-top"><span class="veg-dot ${d.veg ? '' : 'nonveg'}" title="${d.veg ? 'Veg' : 'Non-veg'}"></span><span class="dish-cat">${d.cat}</span></div>
          <h3 class="dish-name">${window.Z.esc(d.name)}</h3>
          <p class="dish-desc">${window.Z.esc(d.desc)}</p>
          <div class="dish-foot">
            <span class="dish-price">${window.Z.fmt(d.price)}</span>
            <button class="add-btn" data-add="${d.id}" aria-label="Add ${window.Z.esc(d.name)} to cart">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>Add
            </button>
          </div>
        </div>
      </article>`).join('');
    /* re-observe injected reveals */
    $$('#popularGrid [data-reveal]').forEach(el => {
      el.style.opacity = ''; el.style.transform = '';
      el.classList.add('in');
    });
  }

  /* ---------- testimonials ---------- */
  const TESTIMONIALS = [
    { text: 'The dum biryani here is a quiet masterpiece — saffron, smoke and patience in every grain. Zaiqa has ruined every other biryani for me, and I am not even upset about it.', name: 'Ananya Sharma', meta: 'Food Columnist · Delhi', stars: 5 },
    { text: 'Sixteen years of family celebrations at this table. The butter chicken tastes exactly like it did on my father\u2019s 50th — that consistency is the rarest luxury in a restaurant.', name: 'Rohan Mehta', meta: 'Guest since 2009', stars: 5 },
    { text: 'We booked for our anniversary and the team surprised us with a saffron-phirni candle plate. Impeccable service, moody lighting, and kebabs that genuinely melt.', name: 'Priya & Karan Nair', meta: 'Anniversary Dinner', stars: 5 },
    { text: 'As a chef myself, I notice the details — their tandoor is properly clay-lined, the dal actually simmers for 48 hours, and nothing on my plate was garnish-for-show. Respect.', name: 'Arjun Malhotra', meta: 'Corporate Chef', stars: 4.5 },
    { text: 'First visit, already planning the fifth. The Gulab Jamun Royale with edible gold felt extravagant and was worth every rupee. Book ahead — weekends fill fast.', name: 'Sana Qureshi', meta: 'First-time Guest', stars: 5 }
  ];

  const track = $('#tsTrack');
  if (track) {
    const dotsWrap = $('#tsDots');
    track.innerHTML = TESTIMONIALS.map(t => `
      <div class="ts-slide">
        <svg class="ts-quote" viewBox="0 0 24 24" fill="currentColor"><path d="M9.6 5C6 7.1 4 10.2 4 13.9c0 3 1.8 5.1 4.3 5.1 2.2 0 3.9-1.7 3.9-3.9 0-2.1-1.5-3.6-3.5-3.6-.4 0-.8.1-1 .1.4-2 2-4.1 3.8-5.2L9.6 5zm10 0c-3.6 2.1-5.6 5.2-5.6 8.9 0 3 1.8 5.1 4.3 5.1 2.2 0 3.9-1.7 3.9-3.9 0-2.1-1.5-3.6-3.5-3.6-.4 0-.8.1-1 .1.4-2 2-4.1 3.8-5.2L19.6 5z"/></svg>
        <p class="ts-text">“${t.text}”</p>
        <div class="stars">${starSVG.repeat(Math.floor(t.stars))}${t.stars % 1 ? '<svg viewBox="0 0 24 24"><defs><linearGradient id="half"><stop offset="50%" stop-color="currentColor"/><stop offset="50%" stop-color="rgba(0,0,0,.18)"/></linearGradient></defs><path fill="url(#half)" d="M12 2l2.9 6.26 6.6.72-4.9 4.5 1.35 6.52L12 16.77 6.05 20l1.35-6.52-4.9-4.5 6.6-.72z"/></svg>' : ''}</div>
        <div class="ts-name">${t.name}</div>
        <div class="ts-meta">${t.meta}</div>
      </div>`).join('');
    dotsWrap.innerHTML = TESTIMONIALS.map((_, i) => `<button aria-label="Go to review ${i + 1}" ${i === 0 ? 'class="on"' : ''}></button>`).join('');

    let idx = 0, timer = null;
    const go = (i) => {
      idx = (i + TESTIMONIALS.length) % TESTIMONIALS.length;
      track.style.transform = `translateX(-${idx * 100}%)`;
      $$('#tsDots button').forEach((d, k) => d.classList.toggle('on', k === idx));
    };
    const auto = () => { timer = setInterval(() => go(idx + 1), 6000); };
    const reset = () => { clearInterval(timer); auto(); };

    $('#tsPrev').addEventListener('click', () => { go(idx - 1); reset(); });
    $('#tsNext').addEventListener('click', () => { go(idx + 1); reset(); });
    $$('#tsDots button').forEach((d, i) => d.addEventListener('click', () => { go(i); reset(); }));
    const wrap = $('#tsWrap');
    wrap.addEventListener('mouseenter', () => clearInterval(timer));
    wrap.addEventListener('mouseleave', reset);

    /* basic touch swipe */
    let sx = null;
    wrap.addEventListener('touchstart', e => sx = e.touches[0].clientX, { passive: true });
    wrap.addEventListener('touchend', e => {
      if (sx === null) return;
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 42) go(idx + (dx < 0 ? 1 : -1));
      sx = null; reset();
    }, { passive: true });
    auto();
  }

  /* ---------- offer countdown (ends Sunday 23:59) ---------- */
  const cd = $('#cdDays');
  if (cd) {
    const nextSunday = () => {
      const n = new Date(), d = new Date(n);
      d.setDate(n.getDate() + ((7 - n.getDay()) % 7));
      d.setHours(23, 59, 59, 0);
      if (d <= n) d.setDate(d.getDate() + 7);
      return d;
    };
    const target = nextSunday();
    const els = { d: cd, h: $('#cdHours'), m: $('#cdMins'), s: $('#cdSecs') };
    const pad = n => String(n).padStart(2, '0');
    const tick = () => {
      let diff = Math.max(0, target - Date.now()) / 1000;
      els.d.textContent = pad(Math.floor(diff / 86400));
      els.h.textContent = pad(Math.floor(diff % 86400 / 3600));
      els.m.textContent = pad(Math.floor(diff % 3600 / 60));
      els.s.textContent = pad(Math.floor(diff % 60));
    };
    tick();
    setInterval(tick, 1000);

    /* copy promo code */
    const code = $('#promoCopy');
    if (code) code.addEventListener('click', () => {
      const txt = 'ZAIQA20';
      if (navigator.clipboard) navigator.clipboard.writeText(txt);
      window.Z.toast('Code copied', 'Use ' + txt + ' at checkout for 20% off');
    });
  }

})();
