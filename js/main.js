(function () {
  'use strict';
  var CFG = window.SITE_CONFIG || {};
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  /* ---------- year ---------- */
  var y = $('#year'); if (y) y.textContent = new Date().getFullYear();

  /* ---------- header on scroll ---------- */
  var nav = $('#top-nav');
  function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 30); }
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ---------- mobile menu ---------- */
  var menuBtn = $('#menu-btn'), menu = $('#mobile-menu');
  menuBtn.addEventListener('click', function () {
    var open = menu.classList.toggle('hidden') === false;
    menuBtn.setAttribute('aria-expanded', String(open));
    if (open) nav.classList.add('scrolled');
  });
  $$('#mobile-menu a').forEach(function (a) {
    a.addEventListener('click', function () { menu.classList.add('hidden'); menuBtn.setAttribute('aria-expanded', 'false'); });
  });

  /* ---------- active nav link ---------- */
  var links = $$('.nav-link');
  if ('IntersectionObserver' in window) {
    var secObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        links.forEach(function (l) { l.classList.toggle('active', l.getAttribute('href') === '#' + e.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    ['about', 'groups', 'manager', 'gallery', 'hours', 'register'].forEach(function (id) { var el = document.getElementById(id); if (el) secObs.observe(el); });
  }

  /* ---------- reveal + counters ---------- */
  function countUp(el) {
    var target = +el.dataset.count, start = null, dur = 1400;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        $$('[data-count]', e.target).forEach(countUp);
        if (e.target.dataset.count) countUp(e.target);
        obs.unobserve(e.target);
      });
    }, { threshold: 0.12 });
    $$('.reveal').forEach(function (el) { obs.observe(el); });
  } else {
    $$('.reveal').forEach(function (el) { el.classList.add('in'); });
    $$('[data-count]').forEach(function (el) { el.textContent = el.dataset.count; });
  }

  /* ---------- lightbox ---------- */
  var items = $$('.g-item'), lb = $('#lightbox'), lbImg = $('#lb-img'), lbCap = $('#lb-caption'), cur = 0, lastFocus = null;
  function show(i) {
    cur = (i + items.length) % items.length;
    var img = $('img', items[cur]);
    lbImg.src = img.src; lbImg.alt = img.alt; lbCap.textContent = img.alt;
  }
  function openLb(i) { lastFocus = document.activeElement; show(i); lb.classList.remove('hidden'); document.body.style.overflow = 'hidden'; $('.lb-close', lb).focus(); }
  function closeLb() { lb.classList.add('hidden'); document.body.style.overflow = ''; if (lastFocus) lastFocus.focus(); }
  items.forEach(function (b, i) { b.addEventListener('click', function () { openLb(i); }); });
  $('.lb-close', lb).addEventListener('click', closeLb);
  $('.lb-prev', lb).addEventListener('click', function () { show(cur - 1); });
  $('.lb-next', lb).addEventListener('click', function () { show(cur + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) closeLb(); });
  document.addEventListener('keydown', function (e) {
    if (lb.classList.contains('hidden')) return;
    if (e.key === 'Escape') closeLb();
    if (e.key === 'ArrowRight') show(cur - 1);   // RTL: right = previous
    if (e.key === 'ArrowLeft') show(cur + 1);
  });
  var tx = null;
  lb.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    if (tx === null) return; var dx = e.changedTouches[0].clientX - tx; tx = null;
    if (Math.abs(dx) > 50) show(cur + (dx > 0 ? 1 : -1));
  });

  /* ---------- registration form ---------- */
  var form = $('#lead-form'), success = $('#form-success'), errBox = $('#form-error'), btn = $('#submit-btn');
  var birth = $('#birthDate'), hint = $('#age-hint'), groupSel = $('#group');

  var today = new Date();
  birth.max = today.toISOString().slice(0, 10);
  var minD = new Date(today); minD.setFullYear(today.getFullYear() - 6); birth.min = minD.toISOString().slice(0, 10);

  function ageInMonths(d) {
    var b = new Date(d); if (isNaN(b)) return null;
    var m = (today.getFullYear() - b.getFullYear()) * 12 + (today.getMonth() - b.getMonth());
    if (today.getDate() < b.getDate()) m--;
    return m;
  }
  function ageText(m) {
    var y = Math.floor(m / 12), mm = m % 12;
    var ys = y === 0 ? '' : (y === 1 ? 'שנה' : (y === 2 ? 'שנתיים' : y + ' שנים'));
    var ms = mm === 0 ? '' : (mm === 1 ? 'חודש' : mm + ' חודשים');
    return [ys, ms].filter(Boolean).join(' ו-') || 'פחות מחודש';
  }
  birth.addEventListener('change', function () {
    var m = ageInMonths(birth.value);
    if (m === null || m < 0) { hint.classList.add('hidden'); return; }
    hint.classList.remove('hidden', 'warn');
    var txt = 'גיל הילד/ה היום: ' + ageText(m) + '. ';
    if (m < 18) {
      txt += 'גילאי הרישום מתחילים משנה וחצי – נשמח לשריין מקום לקראת המועד המתאים 💛';
      hint.classList.add('warn');
    } else if (m < 24) {
      txt += 'הקבוצה המתאימה: הנרקיסים 🌼'; groupSel.value = 'נרקיסים (1.6-2)';
    } else if (m < 36) {
      txt += 'מתאים לקבוצות הסביונים / הסחלבים 🌸';
      if (groupSel.value.indexOf('נרקיסים') === 0 || !groupSel.value) groupSel.value = 'סביונים (2-3)';
    } else {
      txt += 'שימו לב: הגן מיועד לגילאי שנה וחצי עד 3. נשמח לדבר ולעזור 💛';
      hint.classList.add('warn');
    }
    hint.textContent = txt;
  });

  var validators = {
    parentName: function (v) { return v.trim().length >= 2; },
    phone: function (v) { var d = v.replace(/[^\d]/g, ''); return /^(0\d{8,9}|972\d{8,9})$/.test(d); },
    email: function (v) { return !v || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); },
    childName: function (v) { return v.trim().length >= 1; },
    birthDate: function (v) { return !!v; },
  };
  function validateField(name) {
    var el = form.elements[name], ok = validators[name](el.value);
    el.closest('.field').classList.toggle('invalid', !ok);
    el.setAttribute('aria-invalid', String(!ok));
    return ok;
  }
  Object.keys(validators).forEach(function (n) {
    var el = form.elements[n];
    el.addEventListener('blur', function () { if (el.value) validateField(n); });
    el.addEventListener('input', function () { if (el.closest('.field').classList.contains('invalid')) validateField(n); });
  });

  function collect() {
    var f = form.elements;
    var m = ageInMonths(f.birthDate.value);
    return {
      parentName: f.parentName.value.trim(),
      phone: f.phone.value.trim(),
      email: f.email.value.trim(),
      childName: f.childName.value.trim(),
      birthDate: f.birthDate.value,
      childAge: m === null ? '' : ageText(m),
      group: f.group.value || 'לא נבחרה',
      startDate: f.startDate.value,
      notes: f.notes.value.trim(),
      submittedAt: new Date().toLocaleString('he-IL'),
      source: location.href,
    };
  }
  function waLink(d) {
    var msg = [
      'שלום אילנה, אשמח לפרטים על הרשמה לפעוטון בית וגן 🦋',
      '',
      'שם ההורה: ' + d.parentName,
      'טלפון: ' + d.phone,
      d.email ? 'אימייל: ' + d.email : null,
      'שם הילד/ה: ' + d.childName,
      'תאריך לידה: ' + d.birthDate.split('-').reverse().join('/') + (d.childAge ? ' (' + d.childAge + ')' : ''),
      'קבוצה מבוקשת: ' + d.group,
      'מועד כניסה: ' + d.startDate,
      d.notes ? 'הערות: ' + d.notes : null,
    ].filter(function (x) { return x !== null; }).join('\n');
    return 'https://wa.me/' + (CFG.WHATSAPP_NUMBER || '972522640423') + '?text=' + encodeURIComponent(msg);
  }

  function setLoading(on) {
    btn.disabled = on;
    $('.btn-label', btn).textContent = on ? 'שולחים...' : 'שליחת פרטים';
    $('.btn-spinner', btn).classList.toggle('hidden', !on);
  }
  function showSuccess(d, viaWhatsapp) {
    form.classList.add('hidden');
    success.classList.remove('hidden');
    var wa = $('#success-wa');
    if (viaWhatsapp) {
      $('#success-text').textContent = 'נפתח חלון וואטסאפ עם הפרטים – רק ללחוץ "שליחה". אם החלון לא נפתח, לחצו על הכפתור למטה.';
      wa.textContent = 'פתיחת וואטסאפ עם הפרטים';
      wa.href = waLink(d); wa.classList.remove('hidden');
    } else {
      $('#success-text').textContent = 'הפרטים של ' + d.childName + ' התקבלו. אילנה תחזור אליכם בהקדם 💛';
      if (CFG.ALSO_OFFER_WHATSAPP) { wa.href = waLink(d); wa.classList.remove('hidden'); } else wa.classList.add('hidden');
    }
    success.focus();
    success.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  function send(d) {
    var ep = CFG.FORM_ENDPOINT;
    if (CFG.FORM_TYPE === 'formspree') {
      return fetch(ep, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(d) })
        .then(function (r) { if (!r.ok) throw new Error('HTTP ' + r.status); });
    }
    // google-sheets (Apps Script web app) – no-cors so the browser doesn't block the redirect
    var body = new URLSearchParams(); Object.keys(d).forEach(function (k) { body.append(k, d[k]); });
    return fetch(ep, { method: 'POST', mode: 'no-cors', body: body });
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    errBox.classList.add('hidden');
    if (form.elements._gotcha.value) return; // bot
    var ok = Object.keys(validators).map(validateField).every(Boolean);
    var consent = form.elements.consent;
    if (!consent.checked) { ok = false; consent.parentElement.classList.add('text-pinky-600'); }
    else consent.parentElement.classList.remove('text-pinky-600');
    if (!ok) {
      var first = $('.field.invalid input, .field.invalid select', form) || consent;
      first.focus();
      errBox.textContent = 'נא להשלים את השדות המסומנים';
      errBox.classList.remove('hidden');
      return;
    }
    var d = collect();

    if (!CFG.FORM_ENDPOINT) {
      window.open(waLink(d), '_blank', 'noopener');
      showSuccess(d, true);
      return;
    }
    setLoading(true);
    send(d).then(function () { showSuccess(d, false); })
      .catch(function () {
        errBox.innerHTML = 'אירעה תקלה בשליחה 😕 אפשר לנסות שוב, או <a class="underline font-bold" target="_blank" rel="noopener" href="' + waLink(d) + '">לשלוח את הפרטים בוואטסאפ</a>.';
        errBox.classList.remove('hidden');
      })
      .then(function () { setLoading(false); });
  });

  $('#form-again').addEventListener('click', function () {
    var keep = { parentName: form.elements.parentName.value, phone: form.elements.phone.value, email: form.elements.email.value };
    form.reset();
    Object.keys(keep).forEach(function (k) { form.elements[k].value = keep[k]; });
    form.elements.consent.checked = true;
    hint.classList.add('hidden');
    success.classList.add('hidden'); form.classList.remove('hidden');
    form.elements.childName.focus();
  });
})();
