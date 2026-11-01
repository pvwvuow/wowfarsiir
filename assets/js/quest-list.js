/* quest-list.js: the quest database LIST (quest.html with no ?id=). quest.html renames #quest-root to
   #quest-list-root on the list view, so quest.js stays in charge of single quests only.
   Data: quest-index.json [name, zoneKey, level], quest-fa-titles.json, zones-meta.json.
   URL state: ?q= name/id, z= zone, lo/hi = level, t= fa|en (translated / not), s= name|fa (sort). */
(function () {
  'use strict';
  var V = '20261201f', DB = 'data/forever/db/', I18N = 'data/forever/i18n/';
  var root = document.getElementById('quest-list-root');
  if (!root) return;
  var WF = window.WFTR || null;
  var cache = {}, META = {}, ZBYKEY = {}, IDX = null, FT = {}, LANG = 'fa', S = null;
  var BANDS = [[1, 10], [11, 20], [21, 30], [31, 40], [41, 50], [51, 60]];
  try { if (localStorage.getItem('wfq-lang') === 'en') LANG = 'en'; } catch (e) { /* ignore */ }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function faNum(v) { return String(v).replace(/[0-9]/g, function (d) { return '۰۱۲۳۴۵۶۷۸۹'.charAt(+d); }); }
  function big(n) { return faNum(String(n).replace(/(.)(?=(...)+$)/g, '$1٬')); }
  function on(k) { try { return WF && WF.on ? !!WF.on(k) : true; } catch (e) { return true; } }
  function num(v) { return on('uiLabels') ? faNum(v) : String(v); }
  function lbl(fa, en) { return on('uiLabels') ? esc(fa) : '<span class="rt-en" dir="ltr">' + esc(en) + '</span>'; }
  function enSpan(t) { return '<span class="rt-en" dir="ltr">' + esc(t) + '</span>'; }
  function nz(s) {
    var o = '', i, c;
    s = String(s == null ? '' : s);
    for (i = 0; i < s.length; i++) {
      c = s.charCodeAt(i);
      if (c === 0x64a) c = 0x6cc;
      else if (c === 0x643) c = 0x6a9;
      else if (c === 0x200c || c === 0x200e || c === 0x200f) c = 32;
      o += String.fromCharCode(c);
    }
    return o.toLowerCase().trim();
  }
  function hasAr(s) {
    var i, c;
    for (i = 0; i < s.length; i++) { c = s.charCodeAt(i); if (c >= 0x600 && c <= 0x6ff) return true; }
    return false;
  }
  function slug(s) { return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''); }
  function cap(s) { return String(s || '').replace(/-/g, ' ').replace(/(^| )[a-z]/g, function (c) { return c.toUpperCase(); }); }
  function getJSON(url) {
    if (!cache[url]) {
      cache[url] = fetch(url + '?v=' + V).then(function (r) {
        if (!r.ok) throw new Error(url + ' ' + r.status);
        return r.json();
      });
    }
    return cache[url];
  }
  function opt(url) { return getJSON(url).catch(function () { return null; }); }

  function zoneText(key) {
    var z = ZBYKEY[key];
    if (z) return on('namesZone') && z.fa ? z.fa : z.name;
    return cap(String(key || '').replace(/^sort:/, ''));
  }
  function zoneHtml(key) {
    var z = ZBYKEY[key];
    if (z) return on('namesZone') && z.fa ? esc(z.fa) : enSpan(z.name);
    return enSpan(cap(String(key || '').replace(/^sort:/, '')));
  }

  /* ---------- state + url ---------- */
  function readUrl() {
    var p = new URLSearchParams(location.search), t = p.get('t'), s = p.get('s');
    return { q: p.get('q') || '', zone: p.get('z') || '', lo: p.get('lo') || '', hi: p.get('hi') || '',
      tr: t === 'fa' || t === 'en' ? t : 'all', sort: s === 'name' || s === 'fa' ? s : 'lvl', shown: 80 };
  }
  function writeUrl() {
    var p = new URLSearchParams(), qs;
    if (S.q) p.set('q', S.q);
    if (S.zone) p.set('z', S.zone);
    if (S.lo) p.set('lo', S.lo);
    if (S.hi) p.set('hi', S.hi);
    if (S.tr !== 'all') p.set('t', S.tr);
    if (S.sort !== 'lvl') p.set('s', S.sort);
    qs = p.toString();
    try { history.replaceState(null, '', location.pathname + (qs ? '?' + qs : '')); } catch (e) { /* ignore */ }
  }

  /* ---------- filter + sort ---------- */
  function cmp(a, b) {
    var la = a[3] == null ? 999 : a[3], lb = b[3] == null ? 999 : b[3];
    if (S.sort === 'name') return a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : a[0] - b[0];
    if (S.sort === 'fa' && a[4] !== b[4]) return a[4] ? -1 : 1;
    if (la !== lb) return la - lb;
    if (S.sort === 'lvl' && a[4] !== b[4]) return a[4] ? -1 : 1;
    return a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : a[0] - b[0];
  }
  function filtered() {
    var q = nz(S.q), lo = parseInt(S.lo, 10), hi = parseInt(S.hi, 10), isId = /^[0-9]+$/.test(q), fa = hasAr(q), out = [];
    S.all.forEach(function (a) {
      var t;
      if (S.zone && a[2] !== S.zone) return;
      if (!isNaN(lo) && (a[3] == null || a[3] < lo)) return;
      if (!isNaN(hi) && (a[3] == null || a[3] > hi)) return;
      if (S.tr === 'fa' && !a[4]) return;
      if (S.tr === 'en' && a[4]) return;
      if (q) {
        if (isId) { if (String(a[0]).indexOf(q) !== 0) return; }
        else if (fa) { t = FT[a[0]]; if (!t || nz(t).indexOf(q) < 0) return; }
        else if (a[1].toLowerCase().indexOf(q) < 0) return;
      }
      out.push(a);
    });
    return out.sort(cmp);
  }

  /* ---------- paint ---------- */
  function rowHtml(a) {
    var fa = a[4] && LANG === 'fa';
    return '<a class="ql-row" href="quest.html?id=' + esc(a[0]) + '"><i class="ql-d' + (a[4] ? ' on' : '') + '" aria-hidden="true"></i>'
      + '<span class="ql-lv">' + (a[3] ? num(a[3]) : '–') + '</span>'
      + '<span class="ql-t">' + (fa ? '<b>' + esc(FT[a[0]]) + '</b><small class="rt-en" dir="ltr">' + esc(a[1]) + '</small>'
        : '<b class="rt-en" dir="ltr">' + esc(a[1]) + '</b>') + '</span>'
      + '<span class="ql-z">' + (a[2] ? zoneHtml(a[2]) : '') + '</span></a>';
  }
  function rows() {
    var res = filtered(), box = document.getElementById('ql-res'), cnt = document.getElementById('ql-cnt'), h = '', i;
    if (!box) return;
    for (i = 0; i < Math.min(S.shown, res.length); i++) h += rowHtml(res[i]);
    if (res.length > S.shown) h += '<button type="button" class="npcl-more" data-more="1">' + lbl('نمایش بیشتر', 'Show more') + '</button>';
    box.innerHTML = res.length
      ? '<div class="ql-head"><span></span><span>' + lbl('سطح', 'Lv') + '</span><span>' + lbl('کوئست', 'Quest') + '</span><span>' + lbl('منطقه', 'Zone') + '</span></div>' + h
      : '<p class="npc-none">' + lbl('چیزی پیدا نشد؛ فیلترها را سبک‌تر کن.', 'Nothing found. Loosen the filters.') + '</p>';
    if (cnt) cnt.innerHTML = lbl('نتیجه', 'Results') + ' <b>' + num(res.length) + '</b> ' + lbl('از', 'of') + ' ' + num(S.all.length);
  }
  function sync() {
    var lo = parseInt(S.lo, 10), hi = parseInt(S.hi, 10);
    Array.prototype.forEach.call(root.querySelectorAll('.ql-chip[data-lo]'), function (b) {
      b.classList.toggle('on', +b.getAttribute('data-lo') === lo && +b.getAttribute('data-hi') === hi);
    });
    Array.prototype.forEach.call(root.querySelectorAll('button[data-t]'), function (b) {
      b.classList.toggle('on', b.getAttribute('data-t') === S.tr);
    });
    Array.prototype.forEach.call(root.querySelectorAll('button[data-l]'), function (b) {
      b.classList.toggle('on', b.getAttribute('data-l') === LANG);
    });
  }
  function update() { S.shown = 80; writeUrl(); sync(); rows(); }

  function paint() {
    var zopts = '<option value="">' + (on('uiLabels') ? 'همهٔ مناطق' : 'All zones') + '</option>' + S.zones.map(function (z) {
      return '<option value="' + esc(z) + '"' + (z === S.zone ? ' selected' : '') + '>' + esc(zoneText(z)) + '</option>';
    }).join('');
    var sopts = [['lvl', 'سطح (کم به زیاد)', 'Level'], ['fa', 'ترجمه‌شده‌ها اول', 'Translated first'], ['name', 'نام (A تا Z)', 'Name A-Z']].map(function (o) {
      return '<option value="' + o[0] + '"' + (o[0] === S.sort ? ' selected' : '') + '>' + (on('uiLabels') ? o[1] : o[2]) + '</option>';
    }).join('');
    var chips = BANDS.map(function (b) {
      return '<button type="button" class="ql-chip" data-lo="' + b[0] + '" data-hi="' + b[1] + '">' + num(b[0]) + '–' + num(b[1]) + '</button>';
    }).join('');
    document.title = (on('uiLabels') ? 'پایگاه کوئست' : 'Quest database') + ' — wowfarsi';
    root.innerHTML = '<nav class="rt-crumb"><a href="forever.html">Forever</a><i></i><span>' + lbl('پایگاه کوئست', 'Quest database') + '</span></nav>'
      + '<div class="fex"><header class="fex-hero q1 fFade"><div class="fex-hid"><p class="fex-eyebrow font-cinzel" dir="ltr"><i></i>FOREVER · QUESTS<i></i></p>'
      + '<h1>' + (on('uiLabels') ? 'پایگاه کوئست' : '<span class="rt-en" dir="ltr">Quest database</span>') + '</h1>'
      + '<p class="fex-hsub">' + lbl('همهٔ کوئست‌های Forever با سطح و منطقه؛ عنوان و متن فارسی هر کوئستی که ترجمه شده باشد نمایش داده می‌شود.', 'Every Forever quest with level and zone; Persian title and text are shown wherever a translation exists.') + '</p>'
      + '<div class="fex-hchips"><span class="fex-chip">' + lbl('کوئست', 'Quests') + ' <b>' + big(S.all.length) + '</b></span>'
      + '<span class="fex-chip">' + lbl('ترجمه‌شده', 'Translated') + ' <b>' + big(S.nfa) + '</b></span>'
      + '<span class="fex-chip">' + lbl('منطقه', 'Zones') + ' <b>' + big(S.zones.length) + '</b></span></div></div></header>'
      + '<section class="fex-sec fFade ql-panel"><div class="ql-top">'
      + '<div class="q-lang ql-seg" role="group" aria-label="نمایش"><button type="button" data-t="all">' + lbl('همه', 'All') + '</button><button type="button" data-t="fa">' + lbl('ترجمه‌شده', 'Translated') + '</button><button type="button" data-t="en">' + lbl('ترجمه‌نشده', 'Untranslated') + '</button></div>'
      + '<div class="q-lang" role="group" aria-label="زبان عنوان"><button type="button" data-l="fa">فارسی</button><button type="button" data-l="en" dir="ltr">English</button></div></div>'
      + '<div class="ql-bar"><div class="npcl-f"><label for="ql-q">' + lbl('نام یا شناسه', 'Name or ID') + '</label><input id="ql-q" class="npcl-in" type="search" autocomplete="off" value="' + esc(S.q) + '"></div>'
      + '<div class="npcl-f"><label for="ql-z">' + lbl('منطقه', 'Zone') + '</label><select id="ql-z" class="npcl-in">' + zopts + '</select></div>'
      + '<div class="npcl-f"><label for="ql-lo">' + lbl('از سطح', 'Level from') + '</label><input id="ql-lo" class="npcl-in" type="number" min="1" max="63" value="' + esc(S.lo) + '"></div>'
      + '<div class="npcl-f"><label for="ql-hi">' + lbl('تا سطح', 'to') + '</label><input id="ql-hi" class="npcl-in" type="number" min="1" max="63" value="' + esc(S.hi) + '"></div>'
      + '<div class="npcl-f"><label for="ql-s">' + lbl('مرتب‌سازی', 'Sort') + '</label><select id="ql-s" class="npcl-in">' + sopts + '</select></div></div>'
      + '<div class="ql-chips">' + chips + '<button type="button" class="ql-chip ql-reset" data-act="reset">' + lbl('پاک کردن فیلترها', 'Reset') + '</button></div>'
      + '<p class="npcl-count" id="ql-cnt"></p><div id="ql-res" class="fex-secbd"></div></section></div>';
    sync();
    rows();
  }

  /* ---------- boot ---------- */
  function boot() {
    var m, arr = [], zones = {}, nfa = 0;
    if (!IDX || !IDX.quests) {
      root.innerHTML = '<p class="npc-loading">فهرست کوئست‌ها بارگذاری نشد.</p>';
      return;
    }
    m = IDX.quests;
    Object.keys(m).forEach(function (k) {
      var e = m[k], has;
      if (!e || !e[0]) return; /* untitled records are not listed */
      has = !!FT[k];
      if (has) nfa++;
      arr.push([+k, e[0], e[1], e[2], has]);
      if (e[1]) zones[e[1]] = 1;
    });
    S = readUrl();
    S.all = arr;
    S.nfa = nfa;
    S.zones = Object.keys(zones).sort(function (a, b) { return zoneText(a) < zoneText(b) ? -1 : 1; });
    paint();
  }

  root.addEventListener('click', function (ev) {
    var b = ev.target && ev.target.closest ? ev.target.closest('button') : null, lo, hi;
    if (!b || !S) return;
    if (b.hasAttribute('data-l')) {
      LANG = b.getAttribute('data-l') === 'en' ? 'en' : 'fa';
      try { localStorage.setItem('wfq-lang', LANG); } catch (e) { /* ignore */ }
      sync(); rows();
    } else if (b.hasAttribute('data-t')) {
      S.tr = b.getAttribute('data-t');
      update();
    } else if (b.hasAttribute('data-lo')) {
      lo = b.getAttribute('data-lo'); hi = b.getAttribute('data-hi');
      if (S.lo === lo && S.hi === hi) { S.lo = ''; S.hi = ''; } else { S.lo = lo; S.hi = hi; }
      document.getElementById('ql-lo').value = S.lo;
      document.getElementById('ql-hi').value = S.hi;
      update();
    } else if (b.getAttribute('data-act') === 'reset') {
      S.q = ''; S.zone = ''; S.lo = ''; S.hi = ''; S.tr = 'all'; S.sort = 'lvl';
      paint(); update();
    } else if (b.hasAttribute('data-more')) { S.shown += 120; rows(); }
  });
  root.addEventListener('input', function (ev) {
    var t = ev.target;
    if (!S || !t) return;
    if (t.id === 'ql-q') S.q = t.value;
    else if (t.id === 'ql-lo') S.lo = t.value;
    else if (t.id === 'ql-hi') S.hi = t.value;
    else return;
    update();
  });
  root.addEventListener('change', function (ev) {
    var t = ev.target;
    if (!S || !t) return;
    if (t.id === 'ql-z') { S.zone = t.value; update(); }
    else if (t.id === 'ql-s') { S.sort = t.value; update(); }
  });

  Promise.all([opt(DB + 'zones-meta.json'), opt(DB + 'quest-index.json'), opt(I18N + 'quest-fa-titles.json')]).then(function (r) {
    var zs = r[0] && r[0].zones;
    if (zs) (Array.isArray(zs) ? zs : Object.keys(zs).map(function (k) { return zs[k]; })).forEach(function (z) {
      META[z.id] = z;
      ZBYKEY[slug(z.name)] = z;
      if (z.slug) ZBYKEY[z.slug] = z;
    });
    IDX = r[1] || null;
    FT = (r[2] && r[2].t) || {};
    boot();
  });
  if (WF && WF.onChange) WF.onChange(function () { if (S) paint(); });
})();
