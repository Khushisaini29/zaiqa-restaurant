/* ==========================================================================
   ZAIQA — gallery.js · masonry grid, category filter, lightbox
   ========================================================================== */
(function () {
  'use strict';
  const { $, $$ } = window.Z;

  const wrap = $('#masonry');
  if (!wrap) return;

  const ITEMS = [
    { src: 'assets/img/butter-chicken.jpg',   cap: 'Butter chicken, finished with ghee at the table', cat: 'food' },
    { src: 'assets/img/interior-brass.jpg',   cap: 'The brass room — our quietest corner',            cat: 'ambience' },
    { src: 'assets/img/chef.jpg',             cap: 'Skewers over live charcoal',                      cat: 'kitchen' },
    { src: 'assets/img/biryani.jpg',          cap: 'Hyderabadi dum biryani, sealed on dum',           cat: 'food' },
    { src: 'assets/img/interior-lights.jpg',  cap: 'Main dining hall at dusk',                        cat: 'ambience' },
    { src: 'assets/img/spices.jpg',           cap: 'The masala dabba, ground fresh every morning',    cat: 'kitchen' },
    { src: 'assets/img/tandoori.jpg',         cap: 'Tandoori murgh, twelve-hour marinade',            cat: 'food' },
    { src: 'assets/img/kitchen-action.jpg',   cap: 'Naan against the tandoor wall',                   cat: 'kitchen' },
    { src: 'assets/img/dessert-gulab.jpg',    cap: 'Gulab Jamun Royale, edible gold leaf',            cat: 'food' },
    { src: 'assets/img/spread-table.jpg',     cap: 'A weekend spread for the table to share',         cat: 'food' },
    { src: 'assets/img/interior-bar.jpg',     cap: 'The copper bar — shikanji & zero-proof sours',    cat: 'ambience' },
    { src: 'assets/img/kitchen-pan.jpg',      cap: 'Onions caramelising for the makhani base',        cat: 'kitchen' },
    { src: 'assets/img/rasmalai.jpg',         cap: 'Kesar rasmalai, soaked overnight',                cat: 'food' },
    { src: 'assets/img/palak-paneer.jpg',     cap: 'Palak paneer with smoky garlic tadka',            cat: 'food' },
    { src: 'assets/img/spices-table.jpg',     cap: 'Whole spices awaiting the morning grind',         cat: 'kitchen' },
    { src: 'assets/img/paneer-tikka.jpg',     cap: 'Angara paneer tikka, straight off the skewer',    cat: 'food' },
    { src: 'assets/img/lassi.jpg',            cap: 'Alphonso mango lassi, churned to order',          cat: 'food' },
    { src: 'assets/img/spread-feast.jpg',     cap: 'The Zaiqa dawat — our festive feast',             cat: 'food' }
  ];

  let filtered = ITEMS.slice();

  function render() {
    wrap.innerHTML = filtered.map((it, i) => `
      <figure class="m-item" data-i="${i}" style="animation:cardin .5s ${i * 40}ms var(--ease) backwards">
        <img src="${it.src}" alt="${window.Z.esc(it.cap)}" loading="lazy">
        <figcaption><span>${it.cat}</span><b>${window.Z.esc(it.cap)}</b></figcaption>
      </figure>`).join('');
  }

  $$('#galTabs .pill').forEach(b => b.addEventListener('click', () => {
    $$('#galTabs .pill').forEach(p => p.classList.toggle('on', p === b));
    const f = b.getAttribute('data-f');
    filtered = f === 'all' ? ITEMS.slice() : ITEMS.filter(it => it.cat === f);
    render();
  }));

  /* ---------- lightbox ---------- */
  const lb = $('#lightbox');
  const lbImg = $('#lbImg'), lbCap = $('#lbCap'), lbCount = $('#lbCount');
  let cur = 0;

  function show(i) {
    cur = (i + filtered.length) % filtered.length;
    lbImg.src = filtered[cur].src;
    lbImg.alt = filtered[cur].cap;
    lbCap.innerHTML = '<b>' + window.Z.esc(filtered[cur].cap) + '</b>' + filtered[cur].cat.toUpperCase();
    lbCount.textContent = String(cur + 1).padStart(2, '0') + ' / ' + String(filtered.length).padStart(2, '0');
  }
  function open(i) { show(i); lb.classList.add('open'); document.body.classList.add('no-scroll'); }
  function close() { lb.classList.remove('open'); document.body.classList.remove('no-scroll'); }

  wrap.addEventListener('click', e => {
    const fig = e.target.closest('.m-item');
    if (fig) open(parseInt(fig.getAttribute('data-i'), 10));
  });
  $('#lbClose').addEventListener('click', close);
  $('#lbPrev').addEventListener('click', () => show(cur - 1));
  $('#lbNext').addEventListener('click', () => show(cur + 1));
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(cur - 1);
    if (e.key === 'ArrowRight') show(cur + 1);
  });

  render();
})();
