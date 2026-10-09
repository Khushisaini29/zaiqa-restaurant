/* ==========================================================================
   ZAIQA — cart.js · order page: items, quantities, promo, checkout
   ========================================================================== */
(function () {
  'use strict';
  const { $, $$ } = window.Z;
  const fullWrap = $('#cartFull');
  if (!fullWrap) return;

  const GST = 0.05, FEE = 49, FREE_ABOVE = 999;
  let mode = 'delivery';       // 'delivery' | 'pickup'
  let promo = 0;               // 0 or 0.20

  const entries = () => Object.entries(window.Z.getCart())
    .map(([id, qty]) => ({ dish: window.dishById(id), qty }))
    .filter(x => x.dish);

  /* ---------------- render line items ---------------- */
  function render() {
    const items = entries();
    $('#cartEmpty').style.display = items.length ? 'none' : 'block';
    fullWrap.style.display = items.length ? 'grid' : 'none';
    $('#recoWrap').style.display = items.length ? 'block' : 'none';

    $('#cartList').innerHTML = items.map(({ dish, qty }) => `
      <div class="cart-item">
        <img src="${dish.img}" alt="${window.Z.esc(dish.name)}">
        <div>
          <div class="ci-name"><span class="veg-dot ${dish.veg ? '' : 'nonveg'}"></span>${window.Z.esc(dish.name)}</div>
          <div class="ci-unit">${window.Z.fmt(dish.price)} each · ${dish.cat}</div>
          <div class="ci-row2">
            <span class="qty">
              <button data-q="${dish.id}|-1" aria-label="Decrease quantity">−</button>
              <b>${qty}</b>
              <button data-q="${dish.id}|1" aria-label="Increase quantity">+</button>
            </span>
            <button class="ci-remove" data-rm="${dish.id}">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>Remove
            </button>
          </div>
        </div>
        <div class="ci-total">${window.Z.fmt(dish.price * qty)}</div>
      </div>`).join('');

    updateSummary(items);

    /* recommendations — dishes not yet in the cart */
    const inCart = new Set(items.map(x => x.dish.id));
    const reco = window.MENU.filter(d => !inCart.has(d.id))
      .sort((a, b) => (b.tags.includes('popular') - a.tags.includes('popular')) || b.rating - a.rating)
      .slice(0, 4);
    $('#recoGrid').innerHTML = reco.map(d => `
      <article class="dish-card">
        <div class="dish-media"><img src="${d.img}" alt="${window.Z.esc(d.name)}" loading="lazy"><span class="dish-rating">★ ${d.rating.toFixed(1)}</span></div>
        <div class="dish-body">
          <div class="dish-top"><span class="veg-dot ${d.veg ? '' : 'nonveg'}"></span><span class="dish-cat">${d.cat}</span></div>
          <h3 class="dish-name">${window.Z.esc(d.name)}</h3>
          <div class="dish-foot">
            <span class="dish-price">${window.Z.fmt(d.price)}</span>
            <button class="add-btn" data-add="${d.id}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>Add</button>
          </div>
        </div>
      </article>`).join('');
  }

  /* ---------------- totals ---------------- */
  function updateSummary(items) {
    const sub = items.reduce((s, x) => s + x.dish.price * x.qty, 0);
    const disc = Math.round(sub * promo);
    const taxable = sub - disc;
    const gst = Math.round(taxable * GST);
    const fee = mode === 'pickup' ? 0 : (taxable >= FREE_ABOVE ? 0 : FEE);
    const total = taxable + gst + fee;

    $('#sumSub').textContent = window.Z.fmt(sub);
    $('#discRow').style.display = disc ? 'flex' : 'none';
    $('#sumDisc').textContent = '− ' + window.Z.fmt(disc);
    $('#sumGst').textContent = window.Z.fmt(gst);
    $('#sumFee').innerHTML = mode === 'pickup' ? 'Pickup' : (fee === 0 ? '<s style="opacity:.55">₹49</s> FREE' : window.Z.fmt(fee));
    $('#feeRow').classList.toggle('free', fee === 0);
    $('#sumTotal').textContent = window.Z.fmt(total);

    const hint = $('#freeHint');
    if (mode === 'delivery' && taxable > 0 && taxable < FREE_ABOVE && fee > 0) {
      hint.style.display = 'block';
      hint.textContent = 'Add ' + window.Z.fmt(FREE_ABOVE - taxable) + ' more for free delivery';
    } else hint.style.display = 'none';

    $('#checkoutBtn').disabled = !items.length;
    return total;
  }

  /* ---------------- interactions ---------------- */
  $('#cartList').addEventListener('click', e => {
    const q = e.target.closest('[data-q]'), rm = e.target.closest('[data-rm]');
    const cart = window.Z.getCart();
    if (q) {
      const [id, d] = q.getAttribute('data-q').split('|');
      cart[id] = (cart[id] || 0) + parseInt(d, 10);
      if (cart[id] <= 0) delete cart[id];
      window.Z.saveCart(cart); render();
    }
    if (rm) {
      const id = rm.getAttribute('data-rm');
      const name = window.dishById(id).name;
      delete cart[id];
      window.Z.saveCart(cart); render();
      window.Z.toast('Removed', name);
    }
  });

  $$('#dlvChips button').forEach(b => b.addEventListener('click', () => {
    mode = b.getAttribute('data-mode');
    $$('#dlvChips button').forEach(x => x.classList.toggle('on', x === b));
    render();
  }));

  $('#promoBtn').addEventListener('click', () => {
    const code = $('#promoIn').value.trim().toUpperCase();
    const msg = $('#promoMsg');
    if (code === 'ZAIQA20') {
      promo = 0.20;
      msg.className = 'promo-msg ok';
      msg.textContent = 'ZAIQA20 applied — 20% off your food bill.';
      window.Z.toast('Promo applied', '20% off, just like that.');
    } else {
      promo = 0;
      msg.className = 'promo-msg bad';
      msg.textContent = code ? 'That code isn\u2019t valid. Try ZAIQA20.' : 'Enter a promo code first.';
    }
    render();
  });

  /* ---------------- checkout modal ---------------- */
  const modal = $('#orderModal');
  $('#checkoutBtn').addEventListener('click', () => {
    const items = entries();
    if (!items.length) return;
    const total = updateSummary(items);
    $('#orderId').textContent = 'ZQ-' + Math.random().toString(36).slice(2, 8).toUpperCase();
    $('#orderTotal').textContent = window.Z.fmt(total);
    modal.classList.add('open');
    document.body.classList.add('no-scroll');
  });
  $('#orderDone').addEventListener('click', () => {
    window.Z.saveCart({});
    promo = 0;
    $('#promoIn').value = '';
    $('#promoMsg').textContent = '';
    modal.classList.remove('open');
    document.body.classList.remove('no-scroll');
    render();
    window.Z.toast('Order placed', 'The tandoor is already roaring.');
  });
  modal.addEventListener('click', e => { if (e.target === modal) $('#orderDone').click(); });

  /* re-render when other scripts add to cart on this page */
  document.addEventListener('click', e => {
    if (e.target.closest('[data-add]') && !e.target.closest('#cartList')) {
      setTimeout(render, 60);
    }
  });

  render();
})();
