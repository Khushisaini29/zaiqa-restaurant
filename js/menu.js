/* ==========================================================================
   ZAIQA — menu.js · menu grid, category filter, search, veg toggle
   ========================================================================== */
(function () {
  'use strict';
  const { $, $$ } = window.Z;

  const grid = $('#menuGrid');
  if (!grid) return;

  const state = { cat: 'all', q: '', veg: false };

  /* build category pills */
  const pillsWrap = $('#menuPills');
  pillsWrap.innerHTML = window.CATEGORIES.map(c =>
    `<button class="pill ${c.id === 'all' ? 'on' : ''}" data-cat="${c.id}">${c.label}</button>`).join('');

  function cardHTML(d, i) {
    return `
      <article class="dish-card" style="animation:cardin .55s ${i * 45}ms var(--ease) backwards">
        <div class="dish-media">
          <img src="${d.img}" alt="${window.Z.esc(d.name)}" loading="lazy">
          <div class="dish-badges">
            ${d.tags.includes('signature') ? '<span class="dish-tag signature">Chef\u2019s Signature</span>' : ''}
            ${d.tags.includes('spicy') ? '<span class="dish-tag spicy">Spicy</span>' : ''}
          </div>
          <span class="dish-rating">★ ${d.rating.toFixed(1)}</span>
        </div>
        <div class="dish-body">
          <div class="dish-top"><span class="veg-dot ${d.veg ? '' : 'nonveg'}"></span><span class="dish-cat">${d.cat}</span></div>
          <h3 class="dish-name">${window.Z.esc(d.name)}</h3>
          <p class="dish-desc">${window.Z.esc(d.desc)}</p>
          <div class="dish-foot">
            <span class="dish-price">${window.Z.fmt(d.price)}</span>
            <button class="add-btn" data-add="${d.id}" aria-label="Add ${window.Z.esc(d.name)} to cart">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>Add
            </button>
          </div>
        </div>
      </article>`;
  }

  function render() {
    const list = window.MENU.filter(d =>
      (state.cat === 'all' || d.cat === state.cat) &&
      (!state.veg || d.veg) &&
      (state.q === '' || (d.name + ' ' + d.desc).toLowerCase().includes(state.q))
    );

    $('#menuCount').innerHTML = list.length
      ? `Showing <b>${list.length}</b> ${list.length === 1 ? 'dish' : 'dishes'}${state.cat !== 'all' ? ' · ' + state.cat : ''}${state.veg ? ' · pure veg' : ''}`
      : '';

    grid.innerHTML = list.length
      ? list.map(cardHTML).join('')
      : `<div class="menu-empty">
           <b>Nothing on the pass right now</b>
           Try another search word or switch the category / veg filter off.
         </div>`;
  }

  /* events */
  pillsWrap.addEventListener('click', e => {
    const b = e.target.closest('[data-cat]');
    if (!b) return;
    state.cat = b.getAttribute('data-cat');
    $$('#menuPills .pill').forEach(p => p.classList.toggle('on', p === b));
    render();
  });

  let deb;
  $('#menuSearch').addEventListener('input', e => {
    clearTimeout(deb);
    deb = setTimeout(() => { state.q = e.target.value.trim().toLowerCase(); render(); }, 180);
  });

  $('#vegOnly').addEventListener('change', e => { state.veg = e.target.checked; render(); });

  render();
})();
