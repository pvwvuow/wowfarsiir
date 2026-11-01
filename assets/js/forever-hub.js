/* forever-hub.js: live parts of the Forever hub (forever.html).
   1. dungeon / raid slideshow (art from data/forever/img/dungeons/<slug>/art.webp, crossfade, autoplay, dots)
   2. quest search with a few preview quests (quest-index + Persian titles), Enter opens the full database
   3. live counts on the panels (data/forever/db/index.json)
   Everything comes from the same JSON the database pages use; a failed fetch just leaves that block quiet. */
(function () {
  'use strict';
  var V = '20261201g', DB = 'data/forever/db/', I18N = 'data/forever/i18n/';
  var Z = String.fromCharCode(0x200c);
  function zw(s) { return String(s).split('~').join(Z); }
  function $(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function faNum(v) { return String(v).replace(/[0-9]/g, function (d) { return '۰۱۲۳۴۵۶۷۸۹'.charAt(+d); }); }
  function big(n) { return faNum(String(n).replace(/(.)(?=(...)+$)/g, '$1٬')); }
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
    return fetch(url + '?v=' + V).then(function (r) {
      if (!r.ok) throw new Error(url);
      return r.json();
    });
  }
  function opt(url) { return getJSON(url).catch(function () { return null; }); }
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 3. counts ---------- */
  opt(DB + 'index.json').then(function (j) {
    var w, m;
    if (!j) return;
    w = j.world || {};
    m = { npcs: w.npcs && w.npcs.count, quests: w.quests && w.quests.count, dungeons: w.dungeons && w.dungeons.count, items: j.count };
    Array.prototype.forEach.call(document.querySelectorAll('[data-c]'), function (e) {
      var v = m[e.getAttribute('data-c')];
      if (v) e.textContent = faNum(String(v)) + ' ' + e.getAttribute('data-u');
    });
  });

  /* ---------- 1. slideshow ---------- */
  var ORDER = ['molten-core', 'blackwing-lair', 'naxxramas', 'onyxia-s-lair', 'zul-gurub', 'ahn-qiraj-temple', 'ruins-of-ahn-qiraj',
    'blackrock-depths', 'stratholme', 'scholomance', 'blackrock-spire', 'deadmines', 'wailing-caverns', 'shadowfang-keep',
    'uldaman', 'zul-farrak', 'sunken-temple', 'gnomeregan', 'city-of-dalaran', 'ruins-of-lordaeron'];
  var KIND = { dungeon: ['دانجن', 'DUNGEON'], raid: ['ریید', 'RAID'], worldboss: [zw('ورلد~باس'), 'WORLD BOSS'] };
  function loadImg(src) {
    return new Promise(function (res) {
      var im = new Image();
      im.onload = function () { res(src); };
      im.onerror = function () { res(null); };
      im.src = src;
    });
  }
  function initShow(list, fa) {
    var box = $('fh-show'), by = {}, pick;
    if (!box || !list) return;
    list.forEach(function (d) { by[d.slug] = d; });
    pick = ORDER.map(function (s) { return by[s]; }).filter(function (d) { return d && !d.notOpen; });
    Promise.all(pick.map(function (d) { return loadImg('data/forever/img/dungeons/' + d.slug + '/art.webp'); })).then(function (srcs) {
      var slides = [], i = 0, timer = 0, paused = false, dots, n;
      pick.forEach(function (d, k) { if (srcs[k]) slides.push({ d: d, src: srcs[k] }); });
      if (!slides.length) { box.parentNode.hidden = true; return; }
      n = slides.length;
      box.innerHTML = slides.map(function (s, k) {
        var d = s.d, f = fa && fa.d && fa.d[d.slug] && fa.d[d.slug].n, kd = KIND[d.type] || [d.type, String(d.type).toUpperCase()], lv = d.levelRange || [];
        return '<div class="fh-slide' + (k === 0 ? ' on' : '') + '" data-k="' + k + '"><img src="' + esc(s.src) + '" alt="">'
          + '<div class="fh-cap"><p class="fh-kind font-cinzel" dir="ltr">' + esc(kd[1]) + '</p>'
          + '<h3 class="fh-st">' + esc(f || d.name) + '</h3>'
          + (f ? '<p class="fh-sen font-cinzel" dir="ltr">' + esc(d.name) + '</p>' : '')
          + '<p class="fh-sm">' + (lv[0] ? '<span class="fh-n">' + zw('سطح') + ' ' + faNum(lv[0] === lv[1] ? lv[0] : lv[0] + '–' + lv[1]) + '</span>' : '')
          + (d.bossCount ? '<span class="fh-n">' + faNum(d.bossCount) + ' ' + zw('باس') + '</span>' : '') + '</p>'
          + '<a class="btn btn-stone btn-sm" href="dungeon.html?d=' + esc(d.slug) + '" tabindex="' + (k === 0 ? '0' : '-1') + '">' + zw('ورود') + '</a></div></div>';
      }).join('')
        + '<button type="button" class="fh-ar fh-prev" aria-label="قبلی"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="m9 5 7 7-7 7"/></svg></button>'
        + '<button type="button" class="fh-ar fh-next" aria-label="بعدی"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="m15 5-7 7 7 7"/></svg></button>'
        + '<div class="fh-dots" role="tablist">' + slides.map(function (s, k) {
          return '<button type="button" role="tab" aria-label="' + (k + 1) + '" data-k="' + k + '"' + (k === 0 ? ' class="on"' : '') + '></button>';
        }).join('') + '</div>';
      dots = box.querySelectorAll('.fh-dots button');
      function go(k) {
        var els = box.querySelectorAll('.fh-slide');
        i = (k + n) % n;
        Array.prototype.forEach.call(els, function (e, j) {
          e.classList.toggle('on', j === i);
          e.querySelector('a').setAttribute('tabindex', j === i ? '0' : '-1');
        });
        Array.prototype.forEach.call(dots, function (e, j) { e.classList.toggle('on', j === i); });
      }
      function arm() {
        clearInterval(timer);
        if (reduce || n < 2) return;
        timer = setInterval(function () { if (!paused) go(i + 1); }, 6500);
      }
      box.addEventListener('click', function (ev) {
        var b = ev.target && ev.target.closest ? ev.target.closest('button') : null;
        if (!b) return;
        if (b.classList.contains('fh-prev')) go(i - 1);
        else if (b.classList.contains('fh-next')) go(i + 1);
        else if (b.hasAttribute('data-k')) go(+b.getAttribute('data-k'));
        else return;
        arm();
      });
      box.addEventListener('mouseenter', function () { paused = true; });
      box.addEventListener('mouseleave', function () { paused = false; });
      box.addEventListener('focusin', function () { paused = true; });
      box.addEventListener('focusout', function () { paused = false; });
      box.addEventListener('keydown', function (ev) {
        if (ev.key === 'ArrowLeft') { go(i + 1); arm(); }
        else if (ev.key === 'ArrowRight') { go(i - 1); arm(); }
      });
      var sx = null;
      box.addEventListener('touchstart', function (ev) { sx = ev.touches[0].clientX; }, { passive: true });
      box.addEventListener('touchend', function (ev) {
        var dx;
        if (sx == null) return;
        dx = ev.changedTouches[0].clientX - sx;
        sx = null;
        if (Math.abs(dx) > 40) { go(dx < 0 ? i + 1 : i - 1); arm(); }
      }, { passive: true });
      arm();
    });
  }
  Promise.all([opt(DB + 'dungeons.json'), opt(I18N + 'dungeon-fa.json')]).then(function (r) {
    initShow(r[0] && r[0].dungeons, r[1]);
  });

  /* ---------- 2. quests ---------- */
  var BANDS = [[3, 9], [14, 22], [27, 35], [42, 50], [54, 60]];
  function initQuests(idx, ft, zones) {
    var inp = $('fh-qs'), out = $('fh-qres'), note = $('fh-qnote'), all = [], zb = {}, feat = [], form = $('fh-qf');
    var FT = (ft && ft.t) || {};
    if (!inp || !out || !idx || !idx.quests) return;
    ((zones && zones.zones) ? (Array.isArray(zones.zones) ? zones.zones : Object.keys(zones.zones).map(function (k) { return zones.zones[k]; })) : []).forEach(function (z) {
      zb[slug(z.name)] = z;
      if (z.slug) zb[z.slug] = z;
    });
    Object.keys(idx.quests).forEach(function (k) {
      var e = idx.quests[k];
      if (!e || !e[0]) return;
      all.push([+k, e[0], e[1], e[2], !!FT[k]]);
    });
    all.sort(function (a, b) { return a[0] - b[0]; });
    BANDS.forEach(function (b) {
      var hit = all.filter(function (a) { return a[4] && a[3] >= b[0] && a[3] <= b[1] && a[1].length > 6 && a[2] && String(a[2]).indexOf('sort:') !== 0; })[3];
      if (hit) feat.push(hit);
    });
    function zname(key) {
      var z = zb[key];
      return z ? (z.fa || z.name) : cap(String(key || '').replace(/^sort:/, ''));
    }
    function row(a) {
      var t = FT[a[0]];
      return '<a class="fh-qr" href="quest.html?id=' + a[0] + '"><i class="ql-d' + (a[4] ? ' on' : '') + '" aria-hidden="true"></i>'
        + '<span class="fh-ql">' + (a[3] ? faNum(a[3]) : '–') + '</span>'
        + '<span class="fh-qt">' + (t ? '<b>' + esc(t) + '</b><small dir="ltr">' + esc(a[1]) + '</small>' : '<b class="fh-en2" dir="ltr">' + esc(a[1]) + '</b>') + '</span>'
        + '<span class="fh-qz">' + (a[2] ? esc(zname(a[2])) : '') + '</span></a>';
    }
    function show(q) {
      var s = nz(q), list, isId, fa;
      if (!s) {
        out.innerHTML = feat.map(row).join('');
        if (note) note.textContent = zw('نمونه~ای از کوئست~ها؛ بالا جست~وجو کن');
        return;
      }
      isId = /^[0-9]+$/.test(s);
      fa = hasAr(s);
      list = all.filter(function (a) {
        var t;
        if (isId) return String(a[0]).indexOf(s) === 0;
        if (fa) { t = FT[a[0]]; return !!t && nz(t).indexOf(s) >= 0; }
        return a[1].toLowerCase().indexOf(s) >= 0;
      });
      list.sort(function (a, b) { return (b[4] ? 1 : 0) - (a[4] ? 1 : 0) || (a[3] || 99) - (b[3] || 99); });
      out.innerHTML = list.length ? list.slice(0, 6).map(row).join('') : '<p class="fh-none">' + zw('چیزی پیدا نشد') + '</p>';
      if (note) note.textContent = list.length ? faNum(list.length) + ' ' + zw('نتیجه') + (list.length > 6 ? zw(' ؛ Enter برای دیدن همه') : '') : '';
    }
    show('');
    inp.addEventListener('input', function () { show(inp.value); });
    if (form) form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      location.href = 'quest.html' + (inp.value.trim() ? '?q=' + encodeURIComponent(inp.value.trim()) : '');
    });
  }
  Promise.all([opt(DB + 'quest-index.json'), opt(I18N + 'quest-fa-titles.json'), opt(DB + 'zones-meta.json')]).then(function (r) {
    initQuests(r[0], r[1], r[2]);
  });
})();
