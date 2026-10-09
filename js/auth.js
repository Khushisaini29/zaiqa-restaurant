/* ==========================================================================
   ZAIQA — auth.js · demo login / register against localStorage
   ========================================================================== */
(function () {
  'use strict';
  const { $, $$ } = window.Z;
  const USERS_KEY = 'zaiqa_users';

  /* seed the demo account once */
  const getUsers = () => { try { return JSON.parse(localStorage.getItem(USERS_KEY)) || []; } catch (e) { return []; } };
  const saveUsers = u => localStorage.setItem(USERS_KEY, JSON.stringify(u));
  if (!localStorage.getItem(USERS_KEY)) {
    saveUsers([{ name: 'Demo Guest', email: 'demo@zaiqa.in', phone: '9812045678', pass: 'zaiqa123' }]);
  }

  const next = () => new URLSearchParams(location.search).get('next') || 'index.html';

  /* ---------- password eye toggles ---------- */
  $$('.pw-eye').forEach(btn => btn.addEventListener('click', () => {
    const inp = btn.parentElement.querySelector('input');
    const show = inp.type === 'password';
    inp.type = show ? 'text' : 'password';
    btn.style.opacity = show ? '1' : '.6';
    btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
  }));

  /* ---------- field helpers ---------- */
  const setState = (input, msg) => {
    const field = input.closest('.field');
    const box = field.querySelector('.f-msg');
    if (msg) { field.classList.add('err'); box.textContent = msg; return false; }
    field.classList.remove('err'); box.textContent = ''; return true;
  };
  const emailOK = v => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim());

  /* ============================ LOGIN ============================ */
  const loginForm = $('#loginForm');
  if (loginForm) {
    /* demo autofill */
    $('#demoFill').addEventListener('click', () => {
      $('#lEmail').value = 'demo@zaiqa.in';
      $('#lPass').value = 'zaiqa123';
      ['lEmail', 'lPass'].forEach(id => setState(document.getElementById(id)));
    });

    loginForm.addEventListener('submit', e => {
      e.preventDefault();
      const em = $('#lEmail'), pw = $('#lPass');
      let ok = setState(em, em.value.trim() ? (emailOK(em.value) ? '' : 'Enter a valid email address.') : 'Email is required.');
      ok = setState(pw, pw.value ? '' : 'Password is required.') && ok;
      if (!ok) return;

      const user = getUsers().find(u => u.email.toLowerCase() === em.value.trim().toLowerCase() && u.pass === pw.value);
      if (!user) {
        setState(pw, 'Invalid email or password. Try the demo account below.');
        window.Z.toast('Login failed', 'Those credentials don\u2019t match our records.');
        return;
      }
      window.Z.setUser({ name: user.name, email: user.email });
      window.Z.toast('Welcome back, ' + user.name.split(' ')[0] + '!', 'Your table is waiting.');
      setTimeout(() => location.href = next(), 650);
    });
  }

  /* ========================== REGISTER ========================== */
  const regForm = $('#regForm');
  if (regForm) {
    /* live strength meter */
    const bars = $$('#pwBars i');
    $('#rPass').addEventListener('input', e => {
      const v = e.target.value;
      let s = 0;
      if (v.length >= 6) s++;
      if (v.length >= 10) s++;
      if (/[A-Z]/.test(v) && /[a-z]/.test(v)) s++;
      if (/\d/.test(v) || /[^A-Za-z0-9]/.test(v)) s++;
      bars.forEach((b, i) => { b.className = i < s ? 's' + Math.min(s, 4) : ''; });
      $('#pwHint').textContent = ['Too weak', 'Getting there', 'Good password', 'Strong password'][Math.max(0, s - 1)] || 'Use 6+ characters with a mix of cases & numbers.';
    });

    regForm.addEventListener('submit', e => {
      e.preventDefault();
      const name = $('#rName'), em = $('#rEmail'), ph = $('#rPhone'), pw = $('#rPass'), pw2 = $('#rPass2'), tm = $('#rTerms');

      let ok = setState(name, name.value.trim().length >= 3 ? '' : 'Please enter your full name.');
      ok = setState(em, emailOK(em.value) ? '' : 'Enter a valid email address.') && ok;
      ok = setState(ph, ph.value.trim() === '' || /^(\+91[\s-]?)?[6-9]\d{9}$/.test(ph.value.replace(/\s/g, '')) ? '' : 'Enter a valid 10-digit mobile number.') && ok;
      ok = setState(pw, pw.value.length >= 6 ? '' : 'Password must be at least 6 characters.') && ok;
      ok = setState(pw2, pw2.value === pw.value && pw2.value ? '' : 'Passwords do not match.') && ok;
      ok = setState(tm.closest('.check-row').querySelector('input') || tm, tm.checked ? '' : 'Please accept the terms to continue.') && ok;

      if (!ok) { window.Z.toast('Almost there', 'Please review the highlighted fields.'); return; }

      const users = getUsers();
      if (users.some(u => u.email.toLowerCase() === em.value.trim().toLowerCase())) {
        setState(em, 'This email is already registered — try logging in.');
        return;
      }
      const user = { name: name.value.trim(), email: em.value.trim(), phone: ph.value.trim(), pass: pw.value };
      users.push(user);
      saveUsers(users);
      window.Z.setUser({ name: user.name, email: user.email });
      window.Z.toast('Account created!', 'Welcome to the Zaiqa family, ' + user.name.split(' ')[0] + '.');
      setTimeout(() => location.href = next(), 700);
    });
  }
})();
