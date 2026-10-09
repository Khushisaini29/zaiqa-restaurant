/* ==========================================================================
   ZAIQA — contact.js · reservation form validation + success state
   ========================================================================== */
(function () {
  'use strict';
  const { $ } = window.Z;
  const form = $('#reserveForm');
  if (!form) return;

  /* date can only be today or later */
  const dateEl = $('#cDate');
  dateEl.min = new Date().toISOString().split('T')[0];

  const rules = {
    cName:   v => v.trim().length >= 3        || 'Please tell us your full name.',
    cEmail:  v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) || 'Enter a valid email address.',
    cPhone:  v => /^(\+91[\s-]?)?[6-9]\d{9}$/.test(v.replace(/\s/g, '')) || 'Enter a valid 10-digit Indian mobile number.',
    cDate:   v => !!v                         || 'Pick a date for your visit.',
    cTime:   v => !!v                         || 'Choose a time slot.',
    cGuests: v => (v >= 1 && v <= 20)         || 'Between 1 and 20 guests.'
  };

  function check(id) {
    const input = document.getElementById(id);
    if (!input || !rules[id]) return true;
    const res = rules[id](input.value);
    const field = input.closest('.field');
    const msg = field.querySelector('.f-msg');
    if (res !== true) {
      field.classList.add('err');
      msg.textContent = res;
      return false;
    }
    field.classList.remove('err');
    msg.textContent = '';
    return true;
  }

  Object.keys(rules).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('blur', () => check(id));
    if (el) el.addEventListener('input', () => { if (el.closest('.field').classList.contains('err')) check(id); });
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    const ok = Object.keys(rules).map(check).every(Boolean);
    if (!ok) {
      const firstErr = form.querySelector('.field.err input, .field.err select');
      if (firstErr) firstErr.focus();
      window.Z.toast('A few details are missing', 'Please review the highlighted fields.');
      return;
    }
    /* success state */
    const name = $('#cName').value.trim().split(' ')[0];
    const when = new Date($('#cDate').value).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' });
    form.style.display = 'none';
    const okBox = $('#reserveOk');
    okBox.style.display = 'block';
    $('#okSummary').innerHTML =
      'Table for <b>' + window.Z.esc($('#cGuests').value) + '</b> · ' + window.Z.esc($('#cTime').value) +
      ' · ' + when;
    $('#okName').textContent = 'Shukriya, ' + window.Z.esc(name) + '!';
    window.Z.toast('Reservation received', 'We\u2019ve sent a confirmation to your email.');
    okBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
  });

  $('#bookAgain').addEventListener('click', () => {
    form.reset();
    form.style.display = '';
    $('#reserveOk').style.display = 'none';
  });
})();
