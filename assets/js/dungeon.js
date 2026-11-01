/* dungeon.js: dungeon / raid / world boss database (Forever): dungeon.html
   dungeon.html?d=<slug>  -> one instance: description, floor maps with boss pins, bosses with loot, chests, entrance
   dungeon.html           -> filterable list (dungeon / raid / world boss)
   Data: db/dungeons.json (list), db/dungeon/<slug>.json (detail), db/itemlite-N.json (loot item names),
   db/boss-audit.json (the audited boss list per instance: real encounters, rare / optional bosses, hidden non-bosses),
   i18n/dungeon-fa.json (OPTIONAL, written by the translation import: {d:{slug:{n,loc,desc}}, floors, chests, sub, boss}),
   i18n/entities.json (npc names), db/zones-meta.json. Nothing is invented: an instance with no bosses / no
   map says so. */
(function () {
  'use strict';
  var V = '20261201c', DB = 'data/forever/db/', I18N = 'data/forever/i18n/';
  var ZAM = 'https://wow.zamimg.com/images/wow/icons/large/';
  var ART = ['art.webp', 'art.jpg', 'art-6.webp', 'og-1.jpg'];
  var root = document.getElementById('dg-root');
  if (!root) return;
  var WF = window.WFTR || null;
  var cache = {}, ZBYNAME = {}, ENT = {}, FA = null, LIST = null, S = null, LS = null, AU = null, LANG = 'fa';
  try { if (localStorage.getItem('wfq-lang') === 'en') LANG = 'en'; } catch (e) { /* ignore */ }

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function faNum(v) { return String(v).replace(/[0-9]/g, function (d) { return '۰۱۲۳۴۵۶۷۸۹'.charAt(+d); }); }
  function on(k) { try { return WF && WF.on ? !!WF.on(k) : true; } catch (e) { return true; } }
  function num(v) { return on('uiLabels') ? faNum(v) : String(v); }
  function lbl(fa, en) { return on('uiLabels') ? esc(fa) : '<span class="rt-en" dir="ltr">' + esc(en) + '</span>'; }
  function enSpan(t) { return '<span class="rt-en" dir="ltr">' + esc(t) + '</span>'; }
  function arr(v) { return Array.isArray(v) ? v : []; }
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
  function safeSrc(u) {
    var ok = false, i, P = ['data/', '/data/', 'dungeons/', '/dungeons/', 'wow-ui/', '/wow-ui/', 'https://wow.zamimg.com/'];
    u = String(u || '');
    if (!/^[A-Za-z0-9_./%:-]+$/.test(u) || u.indexOf('..') >= 0) return '';
    for (i = 0; i < P.length; i++) { if (u.indexOf(P[i]) === 0) ok = true; }
    return ok ? u : '';
  }
  function pct(c) {
    var s = String(Math.round(+c * 10) / 10);
    return on('uiLabels') ? faNum(s).replace('.', '٫') + '٪' : s + '%';
  }
  var TYPE = { dungeon: ['دانجن', 'Dungeon'], raid: ['ریید', 'Raid'], worldboss: ['ورلد‌باس', 'World boss'] };
  var RANK = { elite: ['الیت', 'Elite'], 'rare elite': ['الیت کمیاب', 'Rare elite'], rare: ['کمیاب', 'Rare'], boss: ['باس', 'Boss'] };
  function typeLbl(t) { var x = TYPE[t]; return x ? lbl(x[0], x[1]) : esc(t || ''); }
  function lvl(r) {
    r = arr(r);
    if (!r.length || !+r[0]) return '';
    return r[0] === r[1] || r.length < 2 ? num(r[0]) : num(r[0]) + '–' + num(r[1]);
  }
  function artUrl(slug, i) { return 'data/forever/img/dungeons/' + slug + '/' + ART[i]; }

  /* ---------- audited boss list ---------- */
  function auFor(slug) { return AU && AU.d && AU.d[slug] ? AU.d[slug] : null; }
  function bossN(d) { var a = auFor(d.slug); return a ? a.n : d.bossCount; }
  function mergeLoot(a, b) {
    var by = {}, out = [];
    arr(a).concat(arr(b)).forEach(function (l) {
      if (!l || l.item == null) return;
      if (by[l.item] == null) { by[l.item] = out.length; out.push({ item: l.item, chance: +l.chance || 0 }); }
      else if ((+l.chance || 0) > out[by[l.item]].chance) out[by[l.item]].chance = +l.chance || 0;
    });
    return out;
  }
  /* split the raw boss list into the real encounters, the rare / optional ones and the hidden non-bosses */
  function split(d, slug) {
    var all = arr(d.bosses), A = auFor(slug), by = {}, used = {}, main = [], rare = [], hide = {};
    if (!A) return { main: all, rare: [], hide: {}, audited: false };
    all.forEach(function (b) { by[b.npcId] = b; });
    arr(A.keep).forEach(function (id) {
      var b = by[id], also = [], loot, w;
      if (!b) return;
      used[id] = 1;
      loot = arr(b.loot);
      w = A['with'] && A['with'][id];
      arr(w).forEach(function (cid) {
        var c = by[cid];
        if (!c) return;
        used[cid] = 1;
        hide[cid] = id;
        also.push(c.name);
        loot = mergeLoot(loot, c.loot);
      });
      b = JSON.parse(JSON.stringify(b));
      b.loot = loot;
      b.also = also;
      main.push(b);
    });
    arr(A.rare).forEach(function (id) { if (by[id]) { used[id] = 1; rare.push(by[id]); } });
    arr(A.drop).forEach(function (id) { used[id] = 1; hide[id] = -1; });
    all.forEach(function (b) { if (!used[b.npcId]) rare.push(b); });
    return { main: main, rare: rare, hide: hide, audited: true };
  }
  function pinHidden(p) {
    var h = S && S.sp && S.sp.hide ? S.sp.hide[p.npcId] : null;
    if (h == null) return false;
    if (h === -1) return true;
    return !!S.pinned[h];
  }

  /* ---------- Persian lookups (all optional) ---------- */
  function dFa(slug) { return FA && FA.d && FA.d[slug] ? FA.d[slug] : {}; }
  function mapFa(group, en) {
    var v = FA && FA[group] && FA[group][en];
    return typeof v === 'string' && v.trim() ? v : '';
  }
  function entFa(en) {
    var v = (ENT.npc && ENT.npc[en]) || (ENT.creature && ENT.creature[en]);
    return typeof v === 'string' ? v : '';
  }
  function bossFa(en) { return on('namesNpc') ? (mapFa('boss', en) || entFa(en)) : ''; }
  function zoneFa(name) {
    var z = ZBYNAME[name];
    return on('namesZone') && z && z.fa ? z.fa : '';
  }
  function zoneHtml(name) { var f = zoneFa(name); return f ? esc(f) : enSpan(name); }
  function dTitle(d) {
    var f = LANG === 'fa' && on('namesZone') ? dFa(d.slug).n : '';
    return f ? { fa: true, t: f } : { fa: false, t: d.name };
  }

  /* ---------- builders ---------- */
  function sec(title, count, body) {
    if (!body) return '';
    return '<section class="fex-sec fFade"><h3 class="fex-sh"><span>' + title + '</span>'
      + (count != null ? '<b class="fex-n">' + num(count) + '</b>' : '') + '</h3><div class="fex-secbd">' + body + '</div></section>';
  }
  function panel(title, body) {
    return body ? '<section class="fex-panel fFade"><h2 class="fex-ph"><span>' + title + '</span><i></i></h2>' + body + '</section>' : '';
  }
  function frow(l, v) { return v ? '<div class="fex-frow"><span>' + l + '</span><span>' + v + '</span></div>' : ''; }
  function chip(l, v) { return '<span class="fex-chip">' + l + ' <b>' + v + '</b></span>'; }
  function icon(ic) {
    if (!ic || !/^[A-Za-z0-9_.-]+$/.test(String(ic))) return '<i class="fex-med" aria-hidden="true"></i>';
    return '<img class="npc-ic" src="icons/large/' + esc(ic) + '.jpg" data-ic="' + esc(ic) + '" alt="" loading="lazy">';
  }
  function itemRow(id, it, extra) {
    var q = it && it[2] != null ? it[2] : 1, nm = it && it[0] ? it[0] : '#' + id;
    return '<a class="fex-npc q' + q + '" href="item.html?ver=forever&amp;id=' + esc(id) + '">' + icon(it && it[1])
      + '<span class="fex-npc-nm npc-qn rt-en" dir="ltr">' + esc(nm) + '</span>' + (extra || '') + '</a>';
  }
  function langBar() {
    return '<div class="q-lang" role="group" aria-label="زبان متن"><button type="button" data-l="fa" class="' + (LANG === 'fa' ? 'on' : '') + '">فارسی</button>'
      + '<button type="button" data-l="en" dir="ltr" class="' + (LANG === 'en' ? 'on' : '') + '">English</button></div>';
  }
  function fail(msg) {
    root.innerHTML = '<p class="npc-loading">' + esc(msg || 'بارگذاری نشد.') + ' <a href="dungeon.html">' + esc('همهٔ دانجن‌ها') + '</a></p>';
  }
  function status(d) {
    if (d.notOpen) return lbl('هنوز باز نشده', 'Not open yet');
    if (!bossN(d)) return lbl('بدون دیتای باس', 'No boss data');
    if (d.isNew) return lbl('جدید در Forever', 'New in Forever');
    return '';
  }

  /* ---------- maps ---------- */
  function mapImg(f) {
    var c = [safeSrc(f.localSrc), safeSrc(f.src), safeSrc(f.siteSrc)].filter(Boolean);
    return c.length ? '<img class="npc-mimg-img dg-mimg" src="' + esc(c[0]) + '" data-alt="' + esc(c.slice(1).join(' ')) + '" alt="" loading="lazy">' : '';
  }
  var GATE = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 21V10a7 7 0 0 1 14 0v11"/><path d="M9 21v-6a3 3 0 0 1 6 0v6"/></svg>';
  function pinHtml(p, n, ent) {
    var pos = 'left:' + (+p.x || 0) + '%;top:' + (+p.y || 0) + '%';
    if (ent) return '<i class="dg-pin dg-ent" style="' + pos + '" title="' + esc(p.label || 'Entrance') + '">' + GATE + '</i>';
    var im = safeSrc(p.icon), nm = bossFa(p.label) || p.label || '';
    return '<button type="button" class="dg-pin' + (im ? '' : ' noimg') + '" data-b="' + esc(p.label || '') + '" style="' + pos + '" title="' + esc(n + ' ' + nm) + '">'
      + (im ? '<img src="' + esc(im) + '" alt="" loading="lazy">' : '') + '<b>' + num(n) + '</b></button>';
  }
  function floorHtml(fl, idx) {
    var f = fl[idx], all = arr(f.pins).filter(function (p) { return !(p && p.kind !== 'entrance' && pinHidden(p)); });
    var pins = all.filter(function (p) { return p && p.kind !== 'entrance'; }), n = 0, bn = 0, coords = '';
    pins.forEach(function (p) { n++; coords += '<span class="fex-chip">' + num(n) + ' ' + esc(bossFa(p.label) || p.label) + '</span>'; });
    var h = '<div class="fsrc-map npc-map dg-map" data-i="' + idx + '"><div class="fsrc-mimg">' + mapImg(f)
      + all.slice(0, 80).map(function (p) {
        if (p.kind === 'entrance') return pinHtml(p, 0, true);
        bn++;
        return pinHtml(p, bn, false);
      }).join('') + '</div>'
      + '<div class="npc-nomap"><p>' + lbl('تصویر نقشهٔ این طبقه هنوز روی سایت نیست؛ محل باس‌ها:', 'The map image for this floor is not on the site yet. Boss spots:') + '</p><div class="fex-hchips">' + coords + '</div></div>'
      + '<div class="fsrc-mcap"><b>' + (f.name ? enSpan(f.name) : lbl('طبقه', 'Floor') + ' ' + num(idx + 1)) + '</b><span>' + num(pins.length) + ' ' + lbl('باس', 'bosses') + '</span></div>'
      + (pins.length ? '<div class="dg-pinlist">' + coords + '</div>' : '');
    if (fl.length > 1) {
      h += '<div class="fsrc-mchips">' + fl.map(function (x, i) {
        var nm = mapFa('floors', x.name) || x.name || (lbl('طبقه', 'Floor') + ' ' + (i + 1));
        return '<button type="button" class="fsrc-mchip' + (i === idx ? ' on' : '') + '" data-i="' + i + '">' + esc(nm.replace(/<[^>]*>/g, '')) + '</button>';
      }).join('') + '</div>';
    }
    return h + '</div>';
  }
  function entranceHtml(en) {
    var zid = +en.zoneId;
    if (!en || en.x == null || en.y == null || !zid) return '';
    return '<div class="fsrc-map npc-map dg-map"><div class="fsrc-mimg"><img class="npc-mimg-img dg-mimg" src="data/forever/img/zones/' + zid + '.jpg" alt="" loading="lazy">'
      + pinHtml({ x: en.x, y: en.y, label: 'Entrance' }, 0, true) + '</div>'
      + '<div class="npc-nomap"><p>' + lbl('مختصات ورودی (٪ از نقشه):', 'Entrance coordinates (% of map):') + ' <b dir="ltr">' + num(en.x) + ' , ' + num(en.y) + '</b></p></div>'
      + '<div class="fsrc-mcap"><b>' + zoneHtml(en.zoneName) + '</b><span>' + lbl('ورودی', 'Entrance') + '</span></div></div>';
  }

  /* ---------- detail page ---------- */
  function bossHtml(b, items) {
    var loot = arr(b.loot).slice().sort(function (a, c) { return c.chance - a.chance; });
    var fa = bossFa(b.name), nm = fa ? esc(fa) + '<span class="fex-sub rt-en" dir="ltr">' + esc(b.name) + '</span>' : enSpan(b.name);
    var sub = mapFa('sub', b.subName) || b.subName || '';
    var rk = RANK[b.rank], lv = lvl(b.level);
    var ph = safeSrc(b.imageUrl) || safeSrc(b.icon);
    var also = arr(b.also).map(function (x) { return esc(bossFa(x) || x); }).join('، ');
    var head = (ph ? '<img class="dg-bp" src="' + esc(ph) + '" alt="" loading="lazy">' : '<i class="dg-bp dg-bp0" aria-hidden="true"></i>')
      + '<span class="dg-bn">' + nm + '</span>'
      + (sub ? '<span class="dg-bsub">' + esc(sub) + '</span>' : '')
      + (also ? '<span class="dg-bsub">' + lbl('همراه با', 'With') + ' ' + also + '</span>' : '')
      + (lv ? '<span class="fex-lv">' + lbl('سطح', 'Lv') + ' ' + lv + '</span>' : '')
      + (rk ? '<span class="fex-z">' + lbl(rk[0], rk[1]) + '</span>' : '');
    var link = +b.npcId > 0 ? '<a class="dg-blink" href="npc.html?id=' + esc(b.npcId) + '">' + lbl('صفحهٔ NPC', 'NPC page') + '</a>' : '';
    var body = loot.length ? loot.map(function (l) {
      return itemRow(l.item, items[l.item], '<span class="fex-ch">' + pct(l.chance) + '</span>');
    }).join('') : '<p class="npc-none">' + lbl('لوت این باس در دیتا ثبت نشده.', 'No loot recorded for this boss.') + '</p>';
    return '<details class="dg-boss" data-bn="' + esc(b.name) + '"><summary>' + head + '<b class="dg-lc">' + num(loot.length) + '</b></summary>' + link + '<div class="dg-loot">' + body + '</div></details>';
  }
  function artHtml(slug) {
    return '<img class="dg-art" src="' + esc(artUrl(slug, 0)) + '" data-s="' + esc(slug) + '" data-i="0" alt="" loading="lazy">';
  }
  function paint() {
    var d = S.d, L = S.l, f = dFa(L.slug), t = dTitle(L), tx = TYPE[d.type] || [d.type, d.type];
    var sp = S.sp, bosses = sp.main, rare = sp.rare, floors = arr(d.mapFloors), A = '', B = '', desc = '', hero, st = status(L);
    document.title = t.t + ' — ' + (on('uiLabels') ? tx[0] : tx[1]) + ' — wowfarsi';
    hero = '<header class="fex-hero q1 fFade"><div class="fex-hid"><p class="fex-eyebrow font-cinzel" dir="ltr"><i></i>' + esc(String(tx[1]).toUpperCase()) + (d.abbrev ? ' · ' + esc(d.abbrev) : '') + '<i></i></p>'
      + '<h1' + (t.fa ? '>' : ' class="rt-en" dir="ltr">') + esc(t.t) + '</h1>'
      + (t.fa ? '<p class="fx-ensub rt-en" dir="ltr">' + esc(L.name) + '</p>' : '')
      + '<div class="fex-hchips">' + chip(lbl('نوع', 'Type'), typeLbl(d.type))
      + (lvl(d.levelRange) ? chip(lbl('سطح', 'Level'), lvl(d.levelRange)) : '')
      + (bosses.length ? chip(lbl('باس', 'Bosses'), num(bosses.length)) : '')
      + (d.entrance && d.entrance.zoneName ? chip(lbl('منطقه', 'Zone'), zoneHtml(d.entrance.zoneName)) : '')
      + (st ? '<span class="fex-chip dg-st">' + st + '</span>' : '') + '</div></div></header>';

    A += artHtml(L.slug);
    if (LANG === 'fa' && f.desc) desc = '<p class="q-p">' + esc(f.desc) + '</p>';
    else if (d.descriptionEn) desc = '<p class="q-p rt-en" dir="ltr">' + esc(d.descriptionEn) + '</p>';
    if (desc) A += sec(lbl('درباره', 'About'), null,
      (LANG === 'fa' && !f.desc ? '<p class="str-note npc-note">' + lbl('ترجمهٔ فارسی این توضیح هنوز آماده نیست؛ متن انگلیسی نشان داده می‌شود.', 'The Persian text is not ready yet; English is shown.') + '</p>' : '') + desc);
    if (floors.length) A += sec(lbl('نقشه', 'Map'), floors.length, floorHtml(floors, 0));
    A += sec(lbl('باس‌ها و لوت', 'Bosses & loot'), bosses.length || null,
      bosses.length ? bosses.map(function (b) { return bossHtml(b, S.items); }).join('')
        : '<p class="npc-none">' + lbl('این مورد هنوز دیتای باس ندارد.', 'No boss data for this one yet.') + '</p>');
    if (rare.length) A += sec(lbl('کمیاب و اختیاری', 'Rare & optional'), rare.length,
      '<p class="str-note npc-note">' + lbl('این‌ها جزو باس‌های اصلی نیستند: اسپاون کمیاب، باس احضاری یا اختیاری.', 'Not part of the main boss count: rare spawns, summoned or optional bosses.') + '</p>'
      + rare.map(function (b) { return bossHtml(b, S.items); }).join(''));

    B += panel(lbl('مشخصات', 'Details'),
      frow(lbl('نوع', 'Type'), typeLbl(d.type))
      + frow(lbl('سطح', 'Level'), lvl(d.levelRange))
      + frow(lbl('تعداد باس', 'Bosses'), bosses.length ? num(bosses.length) : '')
      + frow(lbl('منطقه', 'Zone'), d.entrance && d.entrance.zoneName ? zoneHtml(d.entrance.zoneName) : '')
      + frow(lbl('محل', 'Location'), (LANG === 'fa' && f.loc) ? esc(f.loc) : (d.location ? enSpan(d.location) : ''))
      + frow(lbl('تعداد طبقه', 'Floors'), floors.length ? num(floors.length) : '')
      + frow(lbl('مخفف', 'Abbr.'), d.abbrev ? enSpan(d.abbrev) : ''));
    if (d.entrance) B += sec(lbl('ورودی', 'Entrance'), null, entranceHtml(d.entrance));
    var ch = arr(d.chests).filter(function (c) { return c && c.name; });
    if (ch.length) B += sec(lbl('صندوق‌ها', 'Chests'), ch.length, ch.map(function (c) {
      var its = arr(c.items).map(function (it) { var id = it && it.item != null ? it.item : it; return itemRow(id, S.items[id]); }).join('');
      return '<p class="q-sub">' + esc(mapFa('chests', c.name) || c.name) + '</p>' + its;
    }).join(''));

    root.innerHTML = '<nav class="rt-crumb"><a href="forever.html">Forever</a><i></i><a href="dungeon.html">' + lbl('دانجن‌ها', 'Dungeons') + '</a><i></i><span>' + esc(t.t) + '</span></nav>'
      + '<div class="fex">' + hero + langBar() + '<div class="fex-grid"><div class="fex-colA">' + A + '</div><div class="fex-colB">' + B + '</div></div>'
      + '<div class="rt-tools"><a class="btn btn-stone btn-sm" href="dungeon.html">' + lbl('همهٔ دانجن‌ها', 'All dungeons') + '</a></div></div>';
  }
  function loadItems(ids) {
    var shards = {}, out = {};
    ids.forEach(function (id) { shards[+id % 24] = 1; });
    return Promise.all(Object.keys(shards).map(function (n) { return opt(DB + 'itemlite-' + n + '.json'); })).then(function (rs) {
      rs.forEach(function (j) {
        var m = j && (j.items || j);
        if (m) Object.keys(m).forEach(function (k) { out[k] = m[k]; });
      });
      return out;
    });
  }
  function boot(slug) {
    var l = LIST.filter(function (x) { return x.slug === slug; })[0];
    if (!l) return fail('این مورد در پایگاه پیدا نشد.');
    root.innerHTML = '<p class="npc-loading">در حال بارگذاری…</p>';
    return getJSON(DB + 'dungeon/' + slug + '.json').then(function (d) {
      var ids = [], sp = split(d, slug), pinned = {};
      sp.main.concat(sp.rare).forEach(function (b) { arr(b.loot).forEach(function (x) { ids.push(x.item); }); });
      arr(d.chests).forEach(function (c) { arr(c.items).forEach(function (x) { ids.push(x && x.item != null ? x.item : x); }); });
      arr(d.mapFloors).forEach(function (fl) { arr(fl.pins).forEach(function (p) { if (p && p.npcId != null) pinned[p.npcId] = 1; }); });
      return loadItems(ids).then(function (items) { S = { d: d, l: l, items: items, sp: sp, pinned: pinned }; paint(); });
    }).catch(function () { fail('بارگذاری نشد.'); });
  }

  /* ---------- list page ---------- */
  var FILTERS = [['', 'همه', 'All'], ['dungeon', 'دانجن', 'Dungeons'], ['raid', 'ریید', 'Raids'], ['worldboss', 'ورلد‌باس', 'World bosses'], ['new', 'جدید در Forever', 'New in Forever']];
  function listFilter() {
    var q = nz(LS.q);
    return LIST.filter(function (d) {
      var nm;
      if (LS.type === 'new') { if (!d.isNew) return false; }
      else if (LS.type && d.type !== LS.type) return false;
      if (q) {
        nm = nz(d.name + ' ' + (dFa(d.slug).n || '') + ' ' + (d.location || ''));
        if (nm.indexOf(q) < 0) return false;
      }
      return true;
    });
  }
  function cardHtml(d) {
    var t = dTitle(d), st = status(d), en = d.entrance || {}, meta = [], bn = bossN(d);
    if (lvl(d.levelRange)) meta.push(lbl('سطح', 'Lv') + ' ' + lvl(d.levelRange));
    if (bn) meta.push(num(bn) + ' ' + lbl('باس', 'bosses'));
    if (en.zoneName) meta.push(zoneHtml(en.zoneName));
    return '<a class="dg-card dg-t-' + esc(d.type) + (d.notOpen ? ' off' : '') + '" href="dungeon.html?d=' + esc(d.slug) + '">'
      + '<span class="dg-th"><img src="' + esc(artUrl(d.slug, 0)) + '" data-s="' + esc(d.slug) + '" data-i="0" alt="" loading="lazy"><i class="dg-gl" aria-hidden="true"></i></span>'
      + '<span class="dg-ct"><span class="dg-tp">' + typeLbl(d.type) + '</span>' + (st ? '<span class="dg-st">' + st + '</span>' : '') + '</span>'
      + '<span class="dg-cb"><b class="dg-cn' + (t.fa ? '' : ' rt-en') + '"' + (t.fa ? '' : ' dir="ltr"') + '>' + esc(t.t) + '</b>'
      + (t.fa ? '<small class="rt-en" dir="ltr">' + esc(d.name) + '</small>' : '')
      + '<span class="dg-cm">' + meta.join('<i></i>') + '</span></span></a>';
  }
  function listRows() {
    var res = listFilter(), box = document.getElementById('dg-res'), cnt = document.getElementById('dg-cnt');
    if (!box) return;
    box.innerHTML = res.length ? res.map(cardHtml).join('') : '<p class="npc-none">' + lbl('چیزی پیدا نشد.', 'Nothing found.') + '</p>';
    if (cnt) cnt.innerHTML = lbl('نتیجه', 'Results') + ' <b>' + num(res.length) + '</b> ' + lbl('از', 'of') + ' ' + num(LIST.length);
  }
  function listPaint() {
    document.title = (on('uiLabels') ? 'دانجن‌ها' : 'Dungeons') + ' — wowfarsi';
    root.innerHTML = '<nav class="rt-crumb"><a href="forever.html">Forever</a><i></i><span>' + lbl('دانجن‌ها', 'Dungeons') + '</span></nav>'
      + '<div class="fex"><header class="fex-hero q1 fFade"><div class="fex-hid"><p class="fex-eyebrow font-cinzel" dir="ltr"><i></i>FOREVER · DUNGEONS<i></i></p>'
      + '<h1>' + (on('uiLabels') ? 'دانجن‌ها و رییدها' : '<span class="rt-en" dir="ltr">Dungeons &amp; raids</span>') + '</h1>'
      + '<p class="fex-hsub">' + lbl('همهٔ دانجن‌ها، رییدها و ورلد‌باس‌های Forever با نقشه، باس‌ها و لوت. موردهای ناقص با برچسب مشخص شده‌اند.', 'Every Forever dungeon, raid and world boss with maps, bosses and loot. Incomplete ones are labelled.') + '</p></div></header>'
      + langBar()
      + '<section class="fex-sec fFade"><div class="npcl-bar">'
      + '<div class="npcl-f npcl-grow"><label for="dg-q">' + lbl('نام', 'Name') + '</label><input id="dg-q" class="npcl-in" type="search" autocomplete="off" value="' + esc(LS.q) + '"></div>'
      + '<div class="npcl-f"><div class="q-lang dg-types" role="group">' + FILTERS.map(function (x) {
        return '<button type="button" data-t="' + x[0] + '" class="' + (LS.type === x[0] ? 'on' : '') + '">' + lbl(x[1], x[2]) + '</button>';
      }).join('') + '</div></div>'
      + '</div><p class="npcl-count" id="dg-cnt"></p><div id="dg-res" class="dg-grid"></div></section></div>';
    listRows();
  }

  /* ---------- events ---------- */
  /* art fallback chain: art.webp -> art.jpg -> art-6.webp -> og-1.jpg -> (card glyph / hidden) */
  function nextArt(t) {
    var s = t.getAttribute('data-s'), i = +t.getAttribute('data-i') + 1;
    if (!s || i >= ART.length) return false;
    t.setAttribute('data-i', String(i));
    t.src = artUrl(s, i);
    return true;
  }
  root.addEventListener('load', function (ev) {
    var t = ev.target;
    /* a 520 byte placeholder loads fine but is blank: treat anything tiny as missing */
    if (t && t.tagName === 'IMG' && t.getAttribute('data-s') && t.naturalWidth && t.naturalWidth < 200) {
      if (!nextArt(t)) { if (t.classList.contains('dg-art')) t.style.display = 'none'; else if (t.parentNode) t.parentNode.classList.add('noimg'); }
    }
  }, true);
  root.addEventListener('error', function (ev) {
    var t = ev.target, alt;
    if (!t || t.tagName !== 'IMG') return;
    if (t.getAttribute('data-s') && (t.classList.contains('dg-art') || (t.parentNode && t.parentNode.classList.contains('dg-th')))) {
      if (nextArt(t)) return;
      if (t.classList.contains('dg-art')) t.style.display = 'none'; else t.parentNode.classList.add('noimg');
      return;
    }
    if (t.classList.contains('npc-ic') && !t.getAttribute('data-fb')) {
      t.setAttribute('data-fb', '1'); t.src = ZAM + t.getAttribute('data-ic') + '.jpg';
    } else if (t.classList.contains('dg-mimg')) {
      alt = (t.getAttribute('data-alt') || '').split(' ').filter(Boolean);
      if (alt.length) { t.setAttribute('data-alt', alt.slice(1).join(' ')); t.src = alt[0]; }
      else { var m = t.closest('.npc-map'); if (m) m.classList.add('nomap'); }
    } else if (t.parentNode && t.parentNode.classList.contains('dg-pin')) { t.parentNode.classList.add('noimg'); t.style.display = 'none'; }
    else if (t.classList.contains('dg-bp')) { t.style.visibility = 'hidden'; }
  }, true);
  root.addEventListener('click', function (ev) {
    var b = ev.target && ev.target.closest ? ev.target.closest('button') : null, wrap, i;
    if (!b) return;
    if (b.classList.contains('dg-pin')) {
      var want = b.getAttribute('data-b'), hit = null;
      Array.prototype.forEach.call(root.querySelectorAll('.dg-boss'), function (x) { if (x.getAttribute('data-bn') === want) hit = x; });
      if (hit) {
        hit.open = true; hit.classList.add('flash');
        hit.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(function () { hit.classList.remove('flash'); }, 1600);
      }
      return;
    }
    if (b.parentNode && b.parentNode.classList.contains('dg-types')) {
      LS.type = b.getAttribute('data-t') || '';
      Array.prototype.forEach.call(b.parentNode.children, function (x) { x.classList.toggle('on', x === b); });
      listRows();
    } else if (b.parentNode && b.parentNode.classList.contains('q-lang')) {
      LANG = b.getAttribute('data-l') === 'en' ? 'en' : 'fa';
      try { localStorage.setItem('wfq-lang', LANG); } catch (e) { /* ignore */ }
      if (S) paint(); else if (LS) listPaint();
    } else if (b.classList.contains('fsrc-mchip') && S) {
      wrap = b.closest('.dg-map');
      i = +b.getAttribute('data-i');
      if (wrap && arr(S.d.mapFloors)[i]) wrap.outerHTML = floorHtml(arr(S.d.mapFloors), i);
    }
  });
  root.addEventListener('input', function (ev) {
    if (LS && ev.target && ev.target.id === 'dg-q') { LS.q = ev.target.value; listRows(); }
  });

  /* ---------- boot ---------- */
  var slug = new URLSearchParams(location.search).get('d');
  Promise.all([opt(DB + 'zones-meta.json'), opt(I18N + 'entities.json'), opt(I18N + 'dungeon-fa.json'), getJSON(DB + 'dungeons.json').catch(function () { return null; }), opt(DB + 'boss-audit.json')]).then(function (r) {
    var zs = r[0] && r[0].zones;
    if (zs) (Array.isArray(zs) ? zs : Object.keys(zs).map(function (k) { return zs[k]; })).forEach(function (z) { ZBYNAME[z.name] = z; });
    ENT = (r[1] && r[1].types) || {};
    FA = r[2] || null;
    LIST = r[3] && r[3].dungeons ? r[3].dungeons : null;
    AU = r[4] || null;
    if (!LIST) return fail('فهرست دانجن‌ها بارگذاری نشد.');
    if (slug == null || slug === '') { LS = { q: '', type: '' }; return listPaint(); }
    if (!/^[a-z0-9-]{1,60}$/.test(slug)) return fail('شناسهٔ دانجن معتبر نیست.');
    return boot(slug);
  });
  if (WF && WF.onChange) WF.onChange(function () { if (S) paint(); else if (LS && LIST) listPaint(); });
})();
