/* forever-hub.js: live parts of the Forever hub (forever.html).
   1. dungeon / raid slideshow: every open instance that has art, filter tabs (all / raid / dungeon / world boss / new),
      slow zoom, progress line, counter, lazy images. Art comes from data/forever/img/dungeons/<slug>/ (art.webp, art.jpg or
      art-6.webp); boss counts come from the audited list (db/boss-audit.json)
   2. quest search with a few preview quests (quest-index + Persian titles), Enter opens the full database
   3. live counts on the panels (data/forever/db/index.json)
   Everything comes from the same JSON the database pages use; a failed fetch just leaves that block quiet. */
(function () {
  'use strict';
  var V = '20261201h', DB = 'data/forever/db/', I18N = 'data/forever/i18n/';
  var Z = String.fromCharCode(0x200c);
  function zw(s) { return String(s).split('~').join(Z); }
  function $(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function faNum(v) { return String(v).replace(/[0-9]/g, function (d) { return '۰۱۲۳۴۵۶۷۸۹'.charAt(+d); }); }
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
  var CSS = '.fh-tabs{display:flex;flex-wrap:wrap;justify-content:center;gap:.3rem 1.5rem;margin:0 0 1.3rem}'
    + '.fh-tab{position:relative;padding:.4rem .15rem;font:inherit;font-size:13.5px;cursor:pointer;border:0;border-radius:0;background:none;color:var(--parch-dim,#bdb7a6);transition:color .25s ease}'
    + '.fh-tab small{margin-inline-start:.4rem;font-size:11px;color:var(--mut,#8f8a7b)}'
    + '.fh-tab::after{content:"";position:absolute;inset-inline:0;bottom:0;height:1px;background:linear-gradient(90deg,transparent,rgba(240,199,94,.95),transparent);transform:scaleX(0);transition:transform .35s ease}'
    + '.fh-tab:hover,.fh-tab:focus-visible,.fh-tab.on{color:#f6e0a3;outline:none}'
    + '.fh-tab.on::after,.fh-tab:hover::after{transform:scaleX(1)}'
    + '.fh-cnt{position:absolute;z-index:3;top:1.1rem;inset-inline-start:1.7rem;font-size:11px;letter-spacing:.34em;color:var(--mut,#8f8a7b);pointer-events:none}'
    + '.fh-cnt b{color:var(--gold-2,#d8bf80);font-weight:600}'
    + '.fh-pg{position:absolute;z-index:3;left:9%;right:9%;bottom:0;height:1px;pointer-events:none;transform-origin:right center;transform:scaleX(0);'
    + 'background:linear-gradient(90deg,transparent,#f0c75e 30%,#f0c75e 70%,transparent);animation:fhpg 6.5s linear forwards}'
    + '.fh-show:hover .fh-pg,.fh-show:focus-within .fh-pg{animation-play-state:paused}'
    + '@keyframes fhpg{to{transform:scaleX(1)}}'
    + '.fh-newtag{color:#f0c75e}'
    + '.fh-dots.many{display:none}'
    + '.fh-slide.fh-bad>img{display:none}'
    + '.fh-slide.fh-bad{background:radial-gradient(ellipse 60% 70% at 50% 35%,rgba(240,199,94,.1),transparent 70%)}'
    + '@media (prefers-reduced-motion:reduce){.fh-pg{animation:none;transform:scaleX(0)}.fh-tab::after{transition:none}}';
  var RAID_ORDER = ['molten-core', 'blackwing-lair', 'naxxramas', 'onyxia-s-lair', 'zul-gurub', 'ahn-qiraj-temple', 'ruins-of-ahn-qiraj'];
  /* twin art (same picture as a sibling wing) and the blank placeholder are left out of the show */
  var SKIP = { 'dire-maul-east': 1, 'dire-maul-west': 1, 'scarlet-monastery-graveyard': 1, 'scarlet-monastery-library': 1, 'molten-core': 1 };
  var JPG = { 'ahn-qiraj-temple': 1, azuregos: 1, 'blackwing-lair': 1, emeriss: 1, lethon: 1, 'lord-kazzak': 1, naxxramas: 1, 'onyxia-s-lair': 1,
    'ruins-of-ahn-qiraj': 1, taerar: 1, ysondre: 1, 'zul-gurub': 1 };
  var ART6 = { 'the-drowned-city': 1, 'kroldok-stronghold': 1 };
  var KIND = { dungeon: ['دانجن', 'DUNGEON'], raid: ['ریید', 'RAID'], worldboss: [zw('ورلد~باس'), 'WORLD BOSS'] };
  var TABS = [['', 'همه'], ['raid', 'ریید'], ['dungeon', 'دانجن'], ['worldboss', zw('ورلد~باس')], ['new', 'جدید در Forever']];
  function artFor(s) { return 'data/forever/img/dungeons/' + s + '/' + (JPG[s] ? 'art.jpg' : ART6[s] ? 'art-6.webp' : 'art.webp'); }
  function rank(d) {
    var t = d.type === 'raid' ? 0 : d.type === 'dungeon' ? 1 : 2, r = RAID_ORDER.indexOf(d.slug);
    if (t === 0) return [0, r < 0 ? 99 : r, 0];
    return [t, 0, (d.levelRange && d.levelRange[0]) || 0];
  }
  function cmp(a, b) {
    var x = rank(a), y = rank(b);
    return x[0] - y[0] || x[1] - y[1] || x[2] - y[2] || (a.name < b.name ? -1 : 1);
  }
  function pad(n) { return n < 10 ? '0' + n : String(n); }
  function initShow(list, fa, au) {
    var box = $('fh-show'), wrap, tabsEl, open, cur = [], i = 0, timer = 0, hov = false, key = '', n = 0, pg = null, cnt = null, dots = null, st;
    if (!box || !list) return;
    wrap = box.parentNode;
    st = document.createElement('style');
    st.textContent = CSS;
    document.head.appendChild(st);
    open = list.filter(function (d) { return !d.notOpen && !SKIP[d.slug]; });
    open.sort(cmp);
    if (!open.length) { wrap.hidden = true; return; }
    function match(d) { return key === 'new' ? !!d.isNew : (!key || d.type === key); }
    function bn(d) { var a = au && au.d && au.d[d.slug]; return a ? a.n : d.bossCount; }
    tabsEl = document.createElement('div');
    tabsEl.className = 'fh-tabs';
    tabsEl.setAttribute('role', 'tablist');
    tabsEl.innerHTML = TABS.map(function (t) {
      var c, k = t[0];
      c = open.filter(function (d) { return k === 'new' ? !!d.isNew : (!k || d.type === k); }).length;
      if (!c) return '';
      return '<button type="button" class="fh-tab' + (k === '' ? ' on' : '') + '" role="tab" data-t="' + k + '">' + esc(t[1]) + '<small>' + faNum(c) + '</small></button>';
    }).join('');
    wrap.insertBefore(tabsEl, box);

    function slideHtml(d, k) {
      var f = fa && fa.d && fa.d[d.slug] && fa.d[d.slug].n, kd = KIND[d.type] || [d.type, String(d.type).toUpperCase()], lv = d.levelRange || [], b = bn(d);
      return '<div class="fh-slide' + (k === 0 ? ' on' : '') + '" data-k="' + k + '"><img ' + (k < 2 ? 'src' : 'data-src') + '="' + esc(artFor(d.slug)) + '" alt="">'
        + '<div class="fh-cap"><p class="fh-kind font-cinzel" dir="ltr">' + esc(kd[1]) + (d.isNew ? ' · <span class="fh-newtag">NEW IN FOREVER</span>' : '') + '</p>'
        + '<h3 class="fh-st">' + esc(f || d.name) + '</h3>'
        + (f ? '<p class="fh-sen font-cinzel" dir="ltr">' + esc(d.name) + '</p>' : '')
        + '<p class="fh-sm">' + (lv[0] ? '<span class="fh-n">' + zw('سطح') + ' ' + faNum(lv[0] === lv[1] ? lv[0] : lv[0] + '–' + lv[1]) + '</span>' : '')
        + (b ? '<span class="fh-n">' + faNum(b) + ' ' + zw('باس') + '</span>' : '') + '</p>'
        + '<a class="btn btn-stone btn-sm" href="dungeon.html?d=' + esc(d.slug) + '" tabindex="' + (k === 0 ? '0' : '-1') + '">' + zw('ورود') + '</a></div></div>';
    }
    function ensure(k) {
      var el = box.querySelectorAll('.fh-slide')[(k + n) % n], im = el && el.querySelector('img');
      if (im && !im.getAttribute('src') && im.getAttribute('data-src')) im.setAttribute('src', im.getAttribute('data-src'));
    }
    function restartPg() {
      if (!pg) return;
      pg.style.animation = 'none';
      void pg.offsetWidth;
      pg.style.animation = '';
    }
    function go(k) {
      var els = box.querySelectorAll('.fh-slide');
      i = (k + n) % n;
      ensure(i);
      ensure(i + 1);
      Array.prototype.forEach.call(els, function (e, j) {
        e.classList.toggle('on', j === i);
        e.querySelector('a').setAttribute('tabindex', j === i ? '0' : '-1');
      });
      if (dots) Array.prototype.forEach.call(dots, function (e, j) { e.classList.toggle('on', j === i); });
      if (cnt) cnt.innerHTML = '<b>' + pad(i + 1) + '</b> / ' + pad(n);
    }
    function arm() {
      clearTimeout(timer);
      restartPg();
      if (reduce || n < 2 || hov) return;
      timer = setTimeout(function () { go(i + 1); arm(); }, 6500);
    }
    function render() {
      cur = open.filter(match);
      n = cur.length;
      i = 0;
      if (!n) { box.innerHTML = ''; return; }
      box.innerHTML = cur.map(slideHtml).join('')
        + '<button type="button" class="fh-ar fh-prev" aria-label="قبلی"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="m9 5 7 7-7 7"/></svg></button>'
        + '<button type="button" class="fh-ar fh-next" aria-label="بعدی"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="m15 5-7 7 7 7"/></svg></button>'
        + '<span class="fh-cnt font-cinzel" dir="ltr"></span>'
        + '<div class="fh-dots' + (n > 12 ? ' many' : '') + '" role="tablist">' + cur.map(function (d, k) {
          return '<button type="button" role="tab" aria-label="' + (k + 1) + '" data-k="' + k + '"' + (k === 0 ? ' class="on"' : '') + '></button>';
        }).join('') + '</div><i class="fh-pg"></i>';
      dots = box.querySelectorAll('.fh-dots button');
      cnt = box.querySelector('.fh-cnt');
      pg = box.querySelector('.fh-pg');
      go(0);
      arm();
    }
    tabsEl.addEventListener('click', function (ev) {
      var b = ev.target && ev.target.closest ? ev.target.closest('.fh-tab') : null;
      if (!b) return;
      key = b.getAttribute('data-t') || '';
      Array.prototype.forEach.call(tabsEl.children, function (x) { x.classList.toggle('on', x === b); });
      render();
    });
    box.addEventListener('click', function (ev) {
      var b = ev.target && ev.target.closest ? ev.target.closest('button') : null;
      if (!b) return;
      if (b.classList.contains('fh-prev')) go(i - 1);
      else if (b.classList.contains('fh-next')) go(i + 1);
      else if (b.hasAttribute('data-k')) go(+b.getAttribute('data-k'));
      else return;
      arm();
    });
    box.addEventListener('error', function (ev) {
      var t = ev.target, sl;
      if (!t || t.tagName !== 'IMG') return;
      sl = t.parentNode;
      if (sl && sl.classList) sl.classList.add('fh-bad');
    }, true);
    box.addEventListener('load', function (ev) {
      var t = ev.target;
      if (t && t.tagName === 'IMG' && t.naturalWidth && t.naturalWidth < 200 && t.parentNode) t.parentNode.classList.add('fh-bad');
    }, true);
    box.addEventListener('mouseenter', function () { hov = true; clearTimeout(timer); });
    box.addEventListener('mouseleave', function () { hov = false; arm(); });
    box.addEventListener('focusin', function () { hov = true; clearTimeout(timer); });
    box.addEventListener('focusout', function () { hov = false; arm(); });
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
    render();
  }
  Promise.all([opt(DB + 'dungeons.json'), opt(I18N + 'dungeon-fa.json'), opt(DB + 'boss-audit.json')]).then(function (r) {
    initShow(r[0] && r[0].dungeons, r[1], r[2]);
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
