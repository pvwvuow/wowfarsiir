/* forever-hub.js: live parts of the Forever hub (forever.html). v6
   1. dungeon / raid slideshow: every open instance that has art, filter tabs (all / raid / dungeon / world boss / new),
      slow zoom, progress line, counter, lazy images. Art: data/forever/img/dungeons/<slug>/ (art.webp, art.jpg or
      art-6.webp); boss counts from the audited list (db/boss-audit.json)
   2. quest log: search with a few preview quests (quest-index + Persian titles), "!" = has Persian, Enter opens the database
   3. live counts on the panels (data/forever/db/index.json)
   4. classes: a character-creation stage (db/classes.json + db/<class>.json trees): the crest on a turning circle,
      class-colour aura, the three talent trees, talent / spell counts, the way into talents and spellbook; a rail of
      round medallions picks the class (click, arrow keys); the pick is remembered (wf-hub-cls)
   5. the world as game frames: TARGET (a bestiary plate: a world or raid boss from db/dungeon/<slug>.json, arrows = next target), its LOOT
      (itemlite shards, quality colours) and the MINIMAP of the zone it stands in (entrance point pinging)
   Everything comes from the same JSON the database pages use; a failed fetch just leaves that block quiet. */
(function () {
  'use strict';
  var V = '20261102k', DB = 'data/forever/db/', I18N = 'data/forever/i18n/';
  var ZAM = 'https://wow.zamimg.com/images/wow/icons/large/';
  var Z = String.fromCharCode(0x200c);
  function zw(s) { return String(s).split('~').join(Z); }
  function $(id) { return document.getElementById(id); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function faInt(v) { var n = Number(v); return isNaN(n) ? faNum(v) : faNum(n.toLocaleString('en-US')).replace(/,/g, '\u066c'); }
  function faNum(v) { return String(v).replace(/[0-9]/g, function (d) { return '\u06f0\u06f1\u06f2\u06f3\u06f4\u06f5\u06f6\u06f7\u06f8\u06f9'.charAt(+d); }); }
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
  /* translation style: names follow their switch (tr.js / WFTR), Persian when no style engine is on the page */
  function sw(k) { return !(window.WFTR && WFTR.on) || WFTR.on(k) !== false; }
  var ON_TR = [];
  function onTr(fn) { ON_TR.push(fn); }
  (function hook(n) {
    if (window.WFTR && WFTR.onChange) { WFTR.onChange(function () { ON_TR.forEach(function (f) { f(); }); }); ON_TR.forEach(function (f) { f(); }); return; }
    if (n < 30) setTimeout(function () { hook(n + 1); }, 200);
  })(0);

  /* ---------- 3. counts ---------- */
  opt(DB + 'index.json').then(function (j) {
    var w, m;
    if (!j) return;
    w = j.world || {};
    m = { npcs: w.npcs && w.npcs.count, quests: w.quests && w.quests.count, dungeons: w.dungeons && w.dungeons.count, items: j.count };
    Array.prototype.forEach.call(document.querySelectorAll('[data-c]'), function (e) {
      var v = m[e.getAttribute('data-c')];
      if (v) e.textContent = faInt(v) + ' ' + e.getAttribute('data-u');
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
  var KIND = { dungeon: ['\u062f\u0627\u0646\u062c\u0646', 'DUNGEON'], raid: ['\u0631\u06cc\u06cc\u062f', 'RAID'], worldboss: [zw('\u0648\u0631\u0644\u062f~\u0628\u0627\u0633'), 'WORLD BOSS'] };
  var TABS = [['', '\u0647\u0645\u0647'], ['raid', '\u0631\u06cc\u06cc\u062f'], ['dungeon', '\u062f\u0627\u0646\u062c\u0646'], ['worldboss', zw('\u0648\u0631\u0644\u062f~\u0628\u0627\u0633')], ['new', '\u062c\u062f\u06cc\u062f \u062f\u0631 Forever']];
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
      return '<button type="button" class="fh-tab' + (k === '' ? ' on' : '') + '" role="tab" data-t="' + k + '"><span>' + esc(t[1]) + '</span><small>' + faNum(c) + '</small></button>';
    }).join('');
    wrap.insertBefore(tabsEl, box);

    function slideHtml(d, k) {
      var f = fa && fa.d && fa.d[d.slug] && fa.d[d.slug].n, kd = KIND[d.type] || [d.type, String(d.type).toUpperCase()], lv = d.levelRange || [], b = bn(d);
      return '<div class="fh-slide' + (k === 0 ? ' on' : '') + '" data-k="' + k + '"><img ' + (k < 2 ? 'src' : 'data-src') + '="' + esc(artFor(d.slug)) + '" alt="">'
        + '<div class="fh-cap"><p class="fh-kind font-cinzel" dir="ltr">' + esc(kd[1]) + (d.isNew ? ' \u00b7 <span class="fh-newtag">NEW IN FOREVER</span>' : '') + '</p>'
        + '<h3 class="fh-st">' + esc(f || d.name) + '</h3>'
        + (f ? '<p class="fh-sen font-cinzel" dir="ltr">' + esc(d.name) + '</p>' : '')
        + '<p class="fh-sm">' + (lv[0] ? '<span class="fh-n">' + zw('\u0633\u0637\u062d') + ' ' + faNum(lv[0] === lv[1] ? lv[0] : lv[0] + '\u2013' + lv[1]) + '</span>' : '')
        + (b ? '<span class="fh-n">' + faNum(b) + ' ' + zw('\u0628\u0627\u0633') + '</span>' : '') + '</p>'
        + '<a class="btn btn-stone btn-sm" href="dungeon.html?d=' + esc(d.slug) + '" tabindex="' + (k === 0 ? '0' : '-1') + '">' + zw('\u0648\u0631\u0648\u062f') + '</a></div></div>';
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
        + '<button type="button" class="fh-ar fh-prev" aria-label="\u0642\u0628\u0644\u06cc"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="m9 5 7 7-7 7"/></svg></button>'
        + '<button type="button" class="fh-ar fh-next" aria-label="\u0628\u0639\u062f\u06cc"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="m15 5-7 7 7 7"/></svg></button>'
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

  /* ---------- 2. quest log ---------- */
  var BANDS = [[3, 9], [14, 22], [27, 35], [42, 50], [54, 60]];
  function zoneList(zones) {
    return (zones && zones.zones) ? (Array.isArray(zones.zones) ? zones.zones : Object.keys(zones.zones).map(function (k) { return zones.zones[k]; })) : [];
  }
  function initQuests(idx, ft, zones) {
    var inp = $('fh-qs'), out = $('fh-qres'), note = $('fh-qnote'), all = [], zb = {}, feat = [], form = $('fh-qf');
    var FT = (ft && ft.t) || {};
    if (!inp || !out || !idx || !idx.quests) return;
    zoneList(zones).forEach(function (z) {
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
      var hits = all.filter(function (a) { return a[4] && a[3] >= b[0] && a[3] <= b[1] && a[1].length > 6 && a[2] && String(a[2]).indexOf('sort:') !== 0; });
      if (hits[3]) feat.push(hits[3]);
      if (hits[11]) feat.push(hits[11]);
    });
    feat = feat.slice(0, 8);
    function zname(key) {
      var z = zb[key];
      return z ? (sw('namesZone') && z.fa ? z.fa : z.name) : cap(String(key || '').replace(/^sort:/, ''));
    }
    function row(a) {
      var t = sw('namesQuest') ? FT[a[0]] : '';
      return '<a class="fh-qr" href="quest.html?id=' + a[0] + '"><i class="fh-qx' + (a[4] ? ' on' : '') + '" aria-hidden="true">!</i>'
        + '<span class="fh-ql">' + (a[3] ? faNum(a[3]) : '\u2013') + '</span>'
        + '<span class="fh-qt">' + (t ? '<b>' + esc(t) + '</b><small dir="ltr">' + esc(a[1]) + '</small>' : '<b class="fh-en2" dir="ltr">' + esc(a[1]) + '</b>') + '</span>'
        + '<span class="fh-qz">' + (a[2] ? esc(zname(a[2])) : '') + '</span></a>';
    }
    function show(q) {
      var s = nz(q), list, isId, fa;
      if (!s) {
        out.innerHTML = feat.map(row).join('');
        if (note) note.textContent = zw('\u0686\u0646\u062f \u06a9\u0648\u0626\u0633\u062a \u0627\u0632 \u0633\u0637\u062d\u200c\u0647\u0627\u06cc \u0645\u062e\u062a\u0644\u0641\u061b \u0628\u0627\u0644\u0627 \u062c\u0633\u062a~\u0648\u062c\u0648 \u06a9\u0646 \u00b7 ! \u0637\u0644\u0627\u06cc\u06cc = \u0641\u0627\u0631\u0633\u06cc \u062f\u0627\u0631\u062f');
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
      out.innerHTML = list.length ? list.slice(0, 8).map(row).join('') : '<p class="fh-none">' + zw('\u0686\u06cc\u0632\u06cc \u067e\u06cc\u062f\u0627 \u0646\u0634\u062f') + '</p>';
      if (note) note.textContent = list.length ? faNum(list.length) + ' ' + zw('\u0646\u062a\u06cc\u062c\u0647') + (list.length > 8 ? zw(' \u061b Enter \u0628\u0631\u0627\u06cc \u062f\u06cc\u062f\u0646 \u0647\u0645\u0647') : '') : '';
    }
    show('');
    inp.addEventListener('input', function () { show(inp.value); });
    onTr(function () { show(inp.value); });
    if (form) form.addEventListener('submit', function (ev) {
      ev.preventDefault();
      location.href = 'quest.html' + (inp.value.trim() ? '?q=' + encodeURIComponent(inp.value.trim()) : '');
    });
  }

  /* ---------- 4. classes: the character-creation stage ---------- */
  var CLS0 = [['warrior', 'Warrior', '\u062c\u0646\u06af\u0627\u0648\u0631', '#C69B6D', 'classicon_warrior'], ['paladin', 'Paladin', '\u067e\u0627\u0644\u0627\u062f\u06cc\u0646', '#F48CBA', 'classicon_paladin'],
    ['hunter', 'Hunter', '\u0634\u06a9\u0627\u0631\u0686\u06cc', '#AAD372', 'classicon_hunter'], ['rogue', 'Rogue', '\u0631\u0627\u0647\u0632\u0646', '#FFF468', 'classicon_rogue'],
    ['priest', 'Priest', '\u0631\u0648\u062d\u0627\u0646\u06cc', '#FFFFFF', 'classicon_priest'], ['shaman', 'Shaman', '\u0634\u0645\u0646', '#0070DD', 'classicon_shaman'],
    ['mage', 'Mage', '\u062c\u0627\u062f\u0648\u06af\u0631', '#3FC7EB', 'classicon_mage'], ['warlock', 'Warlock', '\u0627\u062d\u0636\u0627\u0631\u06a9\u0646\u0646\u062f\u0647', '#8788EE', 'classicon_warlock'],
    ['druid', 'Druid', '\u062f\u0631\u0648\u0626\u06cc\u062f', '#FF7C0A', 'classicon_druid']];
  var CKEY = 'wf-hub-cls';
  function ring(r, n, dash) {
    var h = '<circle cx="0" cy="0" r="' + r + '" fill="none" stroke="currentColor" stroke-opacity=".55" stroke-width="1" stroke-dasharray="' + dash + '"/>', k, a;
    for (k = 0; k < n; k++) {
      a = k * 360 / n;
      h += '<rect x="-3" y="' + (-r - 3) + '" width="6" height="6" fill="currentColor" fill-opacity=".85" transform="rotate(' + a + ') rotate(45 0 ' + (-r) + ')"/>';
    }
    return h;
  }
  function initClasses(cj) {
    var box = $('fh-cls'), list, cur, stage, rail, med, img, flash, info, TREES = {}, k;
    if (!box) return;
    list = (cj && cj.classes && cj.classes.length) ? cj.classes
      : CLS0.map(function (c) { return { slug: c[0], name: c[1], fa: c[2], color: c[3], icon: c[4] }; });
    function find(s) { for (var i = 0; i < list.length; i++) if (list[i].slug === s) return list[i]; return null; }
    function col(c) { return /^#[0-9a-f]{3,8}$/i.test(c.color || '') ? c.color : '#d8bf80'; }
    function nm(c) { return sw('namesClass') && c.fa ? (window.WFCLS && WFCLS.name ? WFCLS.name(c.name, c.fa) : c.fa) : c.name; }
    function icon(c) { return 'icons/large/' + esc(c.icon || ('classicon_' + c.slug)) + '.jpg'; }
    function tname(t) {
      var m = String(t.fa || '').match(/^(.*\S)\s+[A-Za-z]+$/), f = m ? m[1] : t.fa;
      if (!sw('namesClass') || !f) return t.n || '';
      return window.WFCLS && WFCLS.name ? WFCLS.name(t.n, f) : f;
    }
    try { cur = localStorage.getItem(CKEY); } catch (e) { cur = null; }
    if (!find(cur)) cur = list[0].slug;
    var motes = '';
    for (k = 0; k < 14; k++) motes += '<i class="fh-cmote" style="left:' + (8 + (k * 53) % 84) + '%;animation-delay:' + ((k * 0.73) % 9).toFixed(2) + 's;animation-duration:' + (7 + (k % 5)) + 's"></i>';
    box.innerHTML = '<div class="fh-cstage" id="fh-cstage"><div class="fh-caura"></div>' + motes
      + '<div class="fh-ccrest"><svg class="fh-crun fh-crun1" viewBox="-125 -125 250 250" aria-hidden="true">' + ring(118, 12, '1 7') + '<circle r="108" fill="none" stroke="currentColor" stroke-opacity=".25"/></svg>'
      + '<svg class="fh-crun fh-crun2" viewBox="-100 -100 200 200" aria-hidden="true">' + ring(94, 6, '16 9') + '</svg>'
      + '<i class="fh-cflash"></i><span class="fh-cmed"><img alt=""></span></div>'
      + '<div class="fh-cinfo" aria-live="polite"></div></div>'
      + '<div class="fh-crail" role="tablist" aria-label="' + zw('\u06a9\u0644\u0627\u0633\u200c\u0647\u0627') + '"></div>';
    stage = $('fh-cstage');
    rail = box.querySelector('.fh-crail');
    med = box.querySelector('.fh-cmed');
    img = med.querySelector('img');
    flash = box.querySelector('.fh-cflash');
    info = box.querySelector('.fh-cinfo');
    img.addEventListener('error', function () {
      if (!img.getAttribute('data-f')) { img.setAttribute('data-f', '1'); img.src = ZAM + (find(cur).icon || 'classicon_' + cur) + '.jpg'; }
      else med.classList.add('bad');
    });
    function railHtml() {
      return list.map(function (c) {
        var on = c.slug === cur;
        return '<button type="button" class="fh-cb' + (on ? ' on' : '') + '" role="tab" aria-selected="' + on + '" tabindex="' + (on ? '0' : '-1') + '" data-cls="' + esc(c.slug) + '" style="--c:' + col(c) + '">'
          + '<span class="fh-ci"><img src="' + icon(c) + '" alt="" width="58" height="58" loading="lazy"></span><b>' + esc(nm(c)) + '</b></button>';
      }).join('');
    }
    function treesHtml(c) {
      var d = TREES[c.slug];
      if (!d) return '<div class="fh-ctrees"><span class="fh-ctree ph"><b></b></span><span class="fh-ctree ph"><b></b></span><span class="fh-ctree ph"><b></b></span></div>';
      if (!d.length) return '<div class="fh-ctrees"></div>';
      return '<div class="fh-ctrees">' + d.map(function (t) {
        var f = tname(t);
        return '<span class="fh-ctree"><b' + (f === t.n ? ' dir="ltr"' : '') + '>' + esc(f) + '</b>' + (f !== t.n ? '<small dir="ltr">' + esc(t.n) + '</small>' : '') + '</span>';
      }).join('') + '</div>';
    }
    function infoHtml(c) {
      var s = encodeURIComponent(c.slug), main = nm(c);
      return '<p class="fh-ckick" dir="ltr">CLASS \u00b7 ' + esc(String(c.name || '').toUpperCase()) + '</p>'
        + '<h3 class="fh-cname"' + (main === c.name ? ' dir="ltr"' : '') + '>' + esc(main) + '</h3>'
        + treesHtml(c)
        + '<div class="fh-cnums">' + (c.talents ? '<span class="fh-cnum"><b>' + faNum(c.talents) + '</b><span>' + zw('\u062a\u0644\u0646\u062a') + '</span></span>' : '')
        + (c.spells ? '<span class="fh-cnum"><b>' + faNum(c.spells) + '</b><span>' + zw('\u0627\u0633\u067e\u0644') + '</span></span>' : '') + '<span class="fh-cnum"><b>' + faNum(3) + '</b><span>' + zw('\u062f\u0631\u062e\u062a \u062a\u0644\u0646\u062a') + '</span></span></div>'
        + '<div class="fh-ccta"><a class="btn btn-stone fh-go1" href="forever-talents.html?class=' + s + '">' + zw('\u0633\u0627\u062e\u062a \u0628\u06cc\u0644\u062f \u062a\u0644\u0646\u062a') + '</a>'
        + '<a class="btn btn-stone" href="spellbook.html#' + s + '">' + zw('\u06a9\u062a\u0627\u0628 \u0627\u0633\u067e\u0644\u200c\u0647\u0627\u06cc ') + esc(main) + '</a></div>';
    }
    function paint(anim) {
      var c = find(cur);
      stage.style.setProperty('--cc', col(c));
      img.removeAttribute('data-f');
      med.classList.remove('bad');
      img.src = icon(c);
      info.innerHTML = infoHtml(c);
      Array.prototype.forEach.call(rail.children, function (b) {
        var on = b.getAttribute('data-cls') === cur;
        b.classList.toggle('on', on);
        b.setAttribute('aria-selected', on ? 'true' : 'false');
        b.setAttribute('tabindex', on ? '0' : '-1');
      });
      if (anim && !reduce) {
        med.classList.remove('pop'); flash.classList.remove('go');
        void med.offsetWidth;
        med.classList.add('pop'); flash.classList.add('go');
      }
      if (!TREES[c.slug]) {
        TREES[c.slug] = null;
        opt(DB + c.slug + '.json').then(function (d) {
          TREES[c.slug] = (d && d.trees || []).slice(0, 3).map(function (t) { return { n: t.n || '', fa: t.fa || '' }; });
          if (cur === c.slug) { var tr = info.querySelector('.fh-ctrees'); if (tr) tr.outerHTML = treesHtml(c); }
        });
      }
    }
    function pick(s, focus) {
      if (!find(s) || s === cur) return;
      cur = s;
      try { localStorage.setItem(CKEY, s); } catch (e) {}
      paint(true);
      if (focus) { var b = rail.querySelector('[data-cls="' + s + '"]'); if (b) b.focus(); }
    }
    rail.innerHTML = railHtml();
    rail.addEventListener('click', function (ev) {
      var b = ev.target && ev.target.closest ? ev.target.closest('.fh-cb') : null;
      if (b) pick(b.getAttribute('data-cls'));
    });
    rail.addEventListener('keydown', function (ev) {
      var i = -1, j;
      list.forEach(function (c, n) { if (c.slug === cur) i = n; });
      if (ev.key === 'ArrowLeft') j = i + 1; else if (ev.key === 'ArrowRight') j = i - 1;
      else if (ev.key === 'Home') j = 0; else if (ev.key === 'End') j = list.length - 1; else return;
      ev.preventDefault();
      pick(list[(j + list.length) % list.length].slug, true);
    });
    rail.addEventListener('error', function (ev) {
      var t = ev.target;
      if (t && t.tagName === 'IMG' && t.parentNode) {
        if (!t.getAttribute('data-f')) { t.setAttribute('data-f', '1'); t.src = ZAM + t.src.split('/').pop(); }
        else t.parentNode.classList.add('bad');
      }
    }, true);
    paint(false);
    onTr(function () { rail.innerHTML = railHtml(); paint(false); });
  }

  /* ---------- 5. the world: target \u00b7 loot \u00b7 minimap ---------- */
  var QC = ['#9d9d9d', '#ffffff', '#1eff00', '#0070dd', '#a335ee', '#ff8000', '#e6cc80'];
  var CHEV = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3.5 10.5 8 6 12.5" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  var SKULL = '<svg viewBox="0 0 16 16" aria-hidden="true"><path fill="currentColor" d="M8 1.2C4.6 1.2 2.3 3.6 2.3 6.6c0 1.9.9 3.2 2 4v1.8c0 .5.4.9.9.9h.6v-1.3h.9v1.3h1.6v-1.3h.9v1.3h.6c.5 0 .9-.4.9-.9v-1.8c1.1-.8 2-2.1 2-4 0-3-2.3-5.4-5.7-5.4zM5.6 8.9a1.4 1.4 0 1 1 0-2.8 1.4 1.4 0 0 1 0 2.8zm4.8 0a1.4 1.4 0 1 1 0-2.8 1.4 1.4 0 0 1 0 2.8z"/></svg>';
  function initWorld(dlist, dfa, zones) {
    var tf = $('fh-tf'), lt = $('fh-loot'), mmw = $('fh-mm'), pool, i, ZB = {}, ZN = {}, IL = {}, cache = {}, busy = false, last = null;
    if (!tf || !dlist) return;
    zoneList(zones).forEach(function (z) { ZB[z.id] = z; ZN[z.name] = z; });
    pool = dlist.filter(function (d) { return !d.notOpen && (d.type === 'worldboss' || d.type === 'raid'); });
    pool.sort(function (a, b) { return (a.type === 'worldboss' ? 0 : 1) - (b.type === 'worldboss' ? 0 : 1) || cmp(a, b); });
    if (!pool.length) return;
    i = Math.floor(Date.now() / 864e5) % pool.length;
    function dfaName(s) { return dfa && dfa.d && dfa.d[s] && dfa.d[s].n; }
    function zoneFa(name, id) {
      var z = (id != null && ZB[id]) || ZN[name];
      return z ? (sw('namesZone') && z.fa ? z.fa : z.name) : (name || '');
    }
    function itemsFor(ids) {
      var need = {};
      ids.forEach(function (id) { if (!IL[id % 24]) need[id % 24] = 1; });
      return Promise.all(Object.keys(need).map(function (n) {
        return opt(DB + 'itemlite-' + n + '.json').then(function (j) { IL[n] = (j && (j.items || j)) || {}; });
      }));
    }
    function draw(d, x) {
      var boss = d.type === 'raid' ? x.bosses[x.bosses.length - 1] : x.bosses[0], f, nmMain, nmEn, ent = x.entrance || {}, lv, loot, loc, art, kd, lvn, href;
      if (!boss) return;
      last = { d: d, x: x };
      f = d.type === 'worldboss' && sw('namesNpc') ? dfaName(d.slug) : '';
      nmMain = f || boss.name;
      nmEn = f ? boss.name : '';
      lv = boss.level || [];
      loc = d.type === 'raid' ? (sw('namesZone') && dfaName(d.slug) ? dfaName(d.slug) : d.name) : zoneFa(ent.zoneName, ent.zoneId);
      art = x.images && x.images.art ? String(x.images.art).replace(/^\//, '') : '';
      kd = (KIND[d.type] || ['', ''])[0];
      lvn = lv[1] || lv[0];
      href = 'npc.html?id=' + esc(boss.npcId);
      /* bestiary plate: the instance's own loading art, the boss model breathing out of it, name engraved below */
      tf.innerHTML = '<div class="fh-bst">'
        + '<a class="fh-bpl" href="' + href + '" aria-label="' + esc(nmMain) + '">'
        + (art ? '<span class="fh-bart" style="background-image:url(&quot;' + esc(art) + '&quot;)"></span>' : '<span class="fh-bart fh-bart0"></span>')
        + (boss.imageUrl ? '<img class="fh-bmod" src="' + esc(boss.imageUrl) + '" alt="" loading="lazy">' : '')
        + '<span class="fh-bkind">' + esc(kd) + '</span>'
        + (boss.rank === 'boss' ? '<span class="fh-bsk" title="' + zw('\u0631\u0626\u06cc\u0633') + '">' + SKULL + '</span>' : '')
        + '</a>'
        + '<a class="fh-bnm" href="' + href + '"><b' + (f ? '' : ' dir="ltr" class="fh-lat"') + '>' + esc(nmMain) + '</b>'
        + (nmEn ? '<small dir="ltr">' + esc(nmEn) + '</small>' : '') + '</a>'
        + '<p class="fh-bmeta">' + (lvn ? '<span>' + zw('\u0633\u0637\u062d') + ' ' + faNum(lvn) + '</span><i aria-hidden="true"></i>' : '')
        + '<bdi>' + esc(loc) + '</bdi></p>'
        + '<div class="fh-bnav"><button type="button" class="fh-bnv" data-s="-1" aria-label="' + zw('\u0647\u062f\u0641 \u0642\u0628\u0644\u06cc') + '">' + CHEV + '</button>'
        + '<span class="fh-bct" aria-live="polite">' + faNum(i + 1) + '<i>/</i>' + faNum(pool.length) + '</span>'
        + '<button type="button" class="fh-bnv fh-bnx" data-s="1" aria-label="' + zw('\u0647\u062f\u0641 \u0628\u0639\u062f\u06cc') + '">' + CHEV + '</button></div>'
        + '</div>';
      tf.classList.remove('sw'); void tf.offsetWidth; tf.classList.add('sw');
      /* loot */
      loot = (boss.loot || []).slice().sort(function (a, b) { return (b.chance || 0) - (a.chance || 0); }).slice(0, 6);
      if (lt) {
        lt.innerHTML = loot.length ? loot.map(function () { return '<div class="fh-lph"></div>'; }).join('') : '<p class="fh-lnone">' + zw('\u063a\u0646\u06cc\u0645\u062a\u06cc \u062b\u0628\u062a \u0646\u0634\u062f\u0647') + '</p>';
        itemsFor(loot.map(function (l) { return l.item; })).then(function () {
          if (!last || last.x !== x) return;
          var rows = loot.map(function (l) {
            var it = (IL[l.item % 24] || {})[l.item], q = it && it[2] != null ? it[2] : 1, nm = it && it[0] ? it[0] : '#' + l.item, ic = it && it[1];
            return '<a class="fh-lr" href="item.html?ver=forever&amp;id=' + esc(l.item) + '" style="--q:' + (QC[q] || QC[1]) + '"><i>'
              + (ic ? '<img src="icons/large/' + esc(ic) + '.jpg" data-ic="' + esc(ic) + '" alt="" loading="lazy">' : '') + '</i>'
              + '<b dir="ltr">' + esc(nm) + '</b><small>' + (l.chance != null ? faNum(Math.round(l.chance)) + '\u066a' : '') + '</small></a>';
          });
          lt.innerHTML = '<div class="fh-loot">' + rows.join('') + '</div>';
          lt.classList.remove('sw'); void lt.offsetWidth; lt.classList.add('sw');
        });
      }
      /* minimap */
      if (mmw) {
        var src = ent.zoneMap || (ent.zoneId != null ? '/data/forever/img/zones/' + ent.zoneId + '.jpg' : '');
        var zn = $('fh-mmz'), xy = $('fh-mmxy'), mi = mmw.querySelector('.fh-mmi');
        if (zn) zn.textContent = zoneFa(ent.zoneName, ent.zoneId) || zw('\u0622\u0632\u0631\u064f\u062b');
        if (xy) xy.textContent = (ent.x != null ? faNum(ent.x.toFixed(1)) + ' \u060c ' + faNum(ent.y.toFixed(1)) : '');
        if (mi && src && ent.x != null) {
          var S = mi.offsetWidth || 230, W = S * 2.4, H = W * 668 / 1002;
          mi.style.backgroundImage = 'url("' + src.replace(/^\//, '') + '")';
          mi.style.backgroundSize = W.toFixed(0) + 'px ' + H.toFixed(0) + 'px';
          /* keep the zone art covering the whole disc: an entrance near the map edge pulls the view in, not past the edge */
          var px = Math.min(0, Math.max(S - W, S / 2 - ent.x / 100 * W)), py = Math.min(0, Math.max(S - H, S / 2 - ent.y / 100 * H));
          mi.style.backgroundPosition = px.toFixed(0) + 'px ' + py.toFixed(0) + 'px';
          var pg = mmw.querySelector('.fh-mmp');
          /* the art layer overhangs the disc (inset -12%), so the ping is placed in disc coordinates */
          var C = (mi.parentNode && mi.parentNode.offsetWidth) || S, o = (S - C) / 2;
          if (pg) { pg.style.left = ((ent.x / 100 * W + px - o) / C * 100).toFixed(1) + '%'; pg.style.top = ((ent.y / 100 * H + py - o) / C * 100).toFixed(1) + '%'; }
        }
      }
    }
    function load(k, tries) {
      var d = pool[k];
      tries = tries || 0;
      busy = true;
      (cache[d.slug] ? Promise.resolve(cache[d.slug]) : opt(DB + 'dungeon/' + d.slug + '.json')).then(function (x) {
        busy = false;
        /* a target with no boss file is skipped, so the frame is never left empty */
        if (!x || !x.bosses || !x.bosses.length) {
          if (tries < pool.length - 1) { i = (k + 1) % pool.length; load(i, tries + 1); }
          return;
        }
        cache[d.slug] = x;
        draw(d, x);
      });
    }
    function step(n) {
      if (busy) return;
      i = (i + n + pool.length) % pool.length;
      load(i);
    }
    tf.addEventListener('click', function (ev) {
      var b = ev.target && ev.target.closest ? ev.target.closest('.fh-bnv') : null;
      if (b) step(+b.getAttribute('data-s'));
    });
    /* arrows cycle targets while the frame has focus (RTL: left = next) */
    tf.addEventListener('keydown', function (ev) {
      if (ev.key === 'ArrowLeft') step(1); else if (ev.key === 'ArrowRight') step(-1); else return;
      ev.preventDefault();
    });
    document.addEventListener('error', function (ev) {
      var t = ev.target;
      if (!t || t.tagName !== 'IMG') return;
      if (t.classList && t.classList.contains('fh-bmod')) t.parentNode.classList.add('nomod');
      else if (t.getAttribute('data-ic') && !t.getAttribute('data-f')) { t.setAttribute('data-f', '1'); t.src = ZAM + t.getAttribute('data-ic') + '.jpg'; }
    }, true);
    onTr(function () { if (last) draw(last.d, last.x); });
    load(i);
  }

  /* ---------- boot ---------- */
  var ZM = opt(DB + 'zones-meta.json');
  Promise.all([opt(DB + 'dungeons.json'), opt(I18N + 'dungeon-fa.json'), opt(DB + 'boss-audit.json'), ZM]).then(function (r) {
    var list = r[0] && r[0].dungeons;
    initShow(list, r[1], r[2]);
    initWorld(list, r[1], r[3]);
  });
  Promise.all([opt(DB + 'quest-index.json'), opt(I18N + 'quest-fa-titles.json'), ZM]).then(function (r) {
    initQuests(r[0], r[1], r[2]);
  });
  opt(DB + 'classes.json').then(initClasses);
})();
