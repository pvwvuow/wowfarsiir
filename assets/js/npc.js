/* npc.js — NPC database pages (Forever) — npc.html
   npc.html?id=<npcId>  -> one NPC: portrait, stats, spawn map, quests, vendor,
                           trainer, loot, dungeons (all from data/forever/db)
   npc.html             -> searchable NPC list (name / zone / level)
   Data (PR #164): npc-N, spawn-N, itemlite-N (N = id % 24), npc-index,
   zones-meta, ranks, dungeons, i18n/entities (NPC / zone / type names).
   Same components as the Forever item page (fex-*). English data for now;
   the namesNpc / namesZone / terms / uiLabels switches apply where a
   Persian name exists. A spawn pin is drawn ONLY on the verified zone image
   (data/forever/img/zones/<zoneId>.jpg, 20/20 pin test, <=3% error); zones
   without that image show the coordinates instead of a pin on a wrong map. */
(function () {
  'use strict';
  var V = '20261116b', DB = 'data/forever/db/';
  var ZAM = 'https://wow.zamimg.com/images/wow/icons/large/';
  var root = document.getElementById('npc-root');
  if (!root) return;
  var WF = window.WFTR || null;
  var cache = {};
  var META = {}, RANKS = {}, DUNG = {}, ENT = {}, ZBYNAME = {};
  var S = null, LS = null;
  var RK = { 'Normal': 0, 'Elite': 1, 'Rare Elite': 2, 'Boss': 3, 'Rare': 4 };
  var RQ = ['q1', 'q3', 'q4', 'q5', 'q2'];
  var FLAGS = {
    questgiver: ['کوئست‌دهنده', 'Quest giver'], gossip: ['گفت‌وگو', 'Gossip'], vendor: ['فروشنده', 'Vendor'],
    trainer: ['مربی', 'Trainer'], flightmaster: ['فلایت‌ماستر', 'Flight master'], innkeeper: ['مهمان‌دار', 'Innkeeper'],
    banker: ['بانکدار', 'Banker'], repair: ['تعمیرکار', 'Repair'], auctioneer: ['حراج‌دار', 'Auctioneer'],
    battlemaster: ['استاد نبرد', 'Battlemaster'], stablemaster: ['اصطبل‌دار', 'Stable master']
  };

  /* ---------- helpers ---------- */
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
  function grp(n) { return String(Math.round(n)).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }
  function pct(c) { return num(String(Math.round(c * 100) / 100)) + (on('uiLabels') ? '٪' : '%'); }
  function nz(s) {
    return String(s == null ? '' : s).replace(/\u064a/g, '\u06cc').replace(/\u0643/g, '\u06a9')
      .replace(/[\u200c\u200e\u200f]/g, ' ').toLowerCase().trim();
  }
  function getJSON(url) {
    if (!cache[url]) {
      cache[url] = fetch(url + (url.indexOf('?') < 0 ? '?' : '&') + 'v=' + V).then(function (r) {
        if (!r.ok) throw new Error(url + ' ' + r.status);
        return r.json();
      });
    }
    return cache[url];
  }
  function opt(url) { return getJSON(url).catch(function () { return null; }); }
  /* shard files may be {id: rec} or wrapped one level ({cat, npcs: {id: rec}}) */
  function pickRec(j, id) {
    var ks, i, v;
    if (!j) return null;
    id = String(id);
    if (j[id] != null) return j[id];
    ks = Object.keys(j);
    for (i = 0; i < ks.length; i++) {
      v = j[ks[i]];
      if (v && typeof v === 'object' && !Array.isArray(v) && v[id] != null) return v[id];
    }
    return null;
  }
  function trEnt(type, en) {
    var v = ENT[type] && ENT[type][en];
    return typeof v === 'string' ? v : '';
  }
  function npcFa(en) { return on('namesNpc') ? (trEnt('npc', en) || trEnt('creature', en)) : ''; }
  function zoneOf(z) { /* z = zones-meta entry -> html */
    if (!z) return '';
    return on('namesZone') && z.fa ? esc(z.fa) : enSpan(z.name);
  }
  function zoneByName(name) {
    var z = ZBYNAME[name], f;
    if (z) return zoneOf(z);
    f = on('namesZone') ? trEnt('zone', name) : '';
    return f ? esc(f) : enSpan(name);
  }
  function rankCode(r) { return RK[r] != null ? RK[r] : 0; }
  function rankName(rk) {
    var x = RANKS[rk];
    return x ? (on('uiLabels') ? x.fa : x.name) : '';
  }
  function lvText(a, b) {
    if (a == null) return '';
    return a === b || b == null ? num(a) : num(a) + '–' + num(b);
  }

  /* ---------- builders (same classes as the Forever item page) ---------- */
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
    if (!ic) return '<i class="fex-med" aria-hidden="true"></i>';
    return '<img class="npc-ic" src="icons/large/' + esc(ic) + '.jpg" data-ic="' + esc(ic) + '" alt="" loading="lazy">';
  }
  function itemRow(id, it, extra) {
    var q = it && it[2] != null ? it[2] : 1, nm = it && it[0] ? it[0] : '#' + id;
    return '<a class="fex-npc q' + q + '" href="item.html?ver=forever&amp;id=' + esc(id) + '">' + icon(it && it[1])
      + '<span class="fex-npc-nm npc-qn rt-en" dir="ltr">' + esc(nm) + '</span>' + (extra || '') + '</a>';
  }
  function linkRow(href, nm, lv) {
    return '<a class="fex-npc" href="' + esc(href) + '" target="_blank" rel="noopener"><i class="fex-med fex-objd" aria-hidden="true"></i>'
      + '<span class="fex-npc-nm rt-en" dir="ltr">' + esc(nm) + '</span>'
      + (lv ? '<span class="fex-lv">' + lbl('سطح', 'Lv') + ' ' + num(lv) + '</span>' : '') + '</a>';
  }
  function npcRow(id, name, minL, maxL, zoneHtml, rk) {
    var fa = npcFa(name), lv = lvText(minL, maxL);
    return '<a class="fex-npc" href="npc.html?id=' + esc(id) + '"><i class="fex-med fex-rk' + (rk || 0) + '" aria-hidden="true"></i>'
      + '<span class="fex-npc-nm' + (fa ? '' : ' rt-en') + '"' + (fa ? '' : ' dir="ltr"') + '>' + esc(fa || name) + '</span>'
      + (fa ? '<span class="fex-sub rt-en" dir="ltr">' + esc(name) + '</span>' : '')
      + (lv ? '<span class="fex-lv">' + lbl('سطح', 'Lv') + ' ' + lv + '</span>' : '')
      + (zoneHtml ? '<span class="fex-z">' + zoneHtml + '</span>' : '') + '</a>';
  }

  /* ---------- data ---------- */
  function loadCommon() {
    return Promise.all([opt(DB + 'zones-meta.json'), opt(DB + 'ranks.json'), opt(DB + 'dungeons.json'), opt('data/forever/i18n/entities.json')])
      .then(function (r) {
        var zs = r[0] && r[0].zones;
        if (zs) (Array.isArray(zs) ? zs : Object.keys(zs).map(function (k) { return zs[k]; })).forEach(function (z) {
          META[z.id] = z; ZBYNAME[z.name] = z;
        });
        ((r[1] && r[1].ranks) || []).forEach(function (x) { RANKS[x.code] = x; });
        ((r[2] && r[2].dungeons) || []).forEach(function (d) { DUNG[d.slug] = d; });
        ENT = (r[3] && r[3].types) || {};
      });
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
  function fail(msg) {
    root.innerHTML = '<p class="npc-loading">' + esc(msg || 'بارگذاری نشد.') + ' <a href="npc.html">' + esc('همهٔ NPCها') + '</a></p>';
  }

  /* ---------- spawn map ---------- */
  function spawnSplit(sp) {
    var zs = [], dg = [];
    Object.keys(sp || {}).forEach(function (k) {
      var v = sp[k], n = 0;
      if (/^\d+$/.test(k) && Array.isArray(v)) zs.push({ id: +k, pts: v });
      else if (v && typeof v === 'object') {
        Object.keys(v).forEach(function (f) { n += (v[f] || []).length; });
        dg.push({ slug: k, n: n });
      }
    });
    zs.sort(function (a, b) { return b.pts.length - a.pts.length; });
    return { zones: zs, dungeons: dg };
  }
  function mapHtml(zs, idx) {
    var z = zs[idx], meta = META[z.id], pts = z.pts, h, coords;
    var zn = meta ? zoneOf(meta) : enSpan('Zone ' + z.id);
    coords = pts.slice(0, 16).map(function (p) { return '<span class="fex-chip">' + num(p[0].toFixed(1)) + ' ، ' + num(p[1].toFixed(1)) + '</span>'; }).join('');
    h = '<div class="fsrc-map npc-map" data-i="' + idx + '"><div class="fsrc-mimg">'
      + '<img class="npc-mimg-img" src="data/forever/img/zones/' + z.id + '.jpg" alt="" loading="lazy">'
      + pts.slice(0, 150).map(function (p) {
        return '<i class="fsrc-pin" style="left:' + p[0] + '%;top:' + p[1] + '%" title="' + esc(p[0] + ' ، ' + p[1]) + '"></i>';
      }).join('') + '</div>'
      + '<div class="npc-nomap"><p>' + lbl('تصویر نقشهٔ این منطقه هنوز روی سایت نیست؛ مختصات (٪ از نقشه):', 'The map image for this zone is not on the site yet. Coordinates (% of map):') + '</p><div class="fex-hchips">' + coords + '</div></div>'
      + '<div class="fsrc-mcap"><b>' + zn + '</b><span>' + num(pts.length) + ' ' + lbl('نقطه', 'spawns') + '</span></div>';
    if (zs.length > 1) {
      h += '<div class="fsrc-mchips">' + zs.map(function (q, i) {
        var m = META[q.id];
        return '<button type="button" class="fsrc-mchip' + (i === idx ? ' on' : '') + '" data-i="' + i + '"' + (m && on('namesZone') && m.fa ? '' : ' dir="ltr"') + '>'
          + (m ? (on('namesZone') && m.fa ? esc(m.fa) : esc(m.name)) : 'Zone ' + q.id) + '</button>';
      }).join('') + '</div>';
    }
    return h + '</div>';
  }

  /* ---------- detail page ---------- */
  function paint() {
    var r = S.rec, rk = rankCode(r.rank), fa = npcFa(r.name), sp = spawnSplit(S.sp), meta = META[r.zoneId];
    var zoneHtml = meta ? zoneOf(meta) : (r.zone ? zoneByName(r.zone) : '');
    var typeFa = on('terms') ? trEnt('creature_type', r.type) : '';
    var st = r.stats || {}, hero, flags = [], A, B, i;

    document.title = (fa || r.name) + ' — NPC — wowfarsi';
    /* hero */
    hero = '<header class="fex-hero ' + RQ[rk] + ' fFade"><div class="fex-him">'
      + (r.imageUrl ? '<img class="npc-por" src="' + esc(r.imageUrl) + '" alt="" referrerpolicy="no-referrer">' : '<i class="npc-gem" aria-hidden="true"></i>')
      + '</div><div class="fex-hid"><p class="fex-eyebrow font-cinzel" dir="ltr"><i></i>NPC' + (rk ? ' · ' + esc((RANKS[rk] ? RANKS[rk].name : r.rank).toUpperCase()) : '') + '<i></i></p>'
      + '<h1' + (fa ? '>' : ' class="rt-en" dir="ltr">') + esc(fa || r.name) + '</h1>'
      + (fa ? '<p class="fx-ensub rt-en" dir="ltr">' + esc(r.name) + '</p>' : '')
      + (r.subName ? '<p class="fex-hsub rt-en" dir="ltr">&lt;' + esc(r.subName) + '&gt;</p>' : '')
      + '<div class="fex-hchips">'
      + (r.minLevel != null ? chip(lbl('سطح', 'Level'), lvText(r.minLevel, r.maxLevel)) : '')
      + (r.type ? chip(lbl('نوع', 'Type'), typeFa ? esc(typeFa) : enSpan(r.type)) : '')
      + (zoneHtml ? chip(lbl('منطقه', 'Zone'), zoneHtml) : '')
      + (st.health ? chip(lbl('جان', 'Health'), num(grp(st.health))) : '')
      + '</div></div></header>';

    /* facts */
    if (r.flags) r.flags.forEach(function (f) { flags.push(f); });
    if (r.tamable) flags.push('tamable');
    if (r.skinnable) flags.push('skinnable');
    if (r.pickpocketable) flags.push('pickpocketable');
    var FX = { tamable: ['رام‌شدنی', 'Tamable'], skinnable: ['پوست‌کن‌شدنی', 'Skinnable'], pickpocketable: ['جیب‌بُری‌شدنی', 'Pickpocketable'] };
    var fl = flags.map(function (f) {
      var p = FLAGS[f] || FX[f];
      return '<span class="fex-chip">' + (p ? lbl(p[0], p[1]) : enSpan(f)) + '</span>';
    }).join('');
    var friendly = r.friendlyTo === 'A' ? lbl('اتحاد', 'Alliance') : r.friendlyTo === 'H' ? lbl('هورد', 'Horde')
      : r.friendlyTo === 'AH' || r.friendlyTo === 'HA' ? lbl('اتحاد و هورد', 'Alliance & Horde') : '';
    var facts = frow(lbl('سطح', 'Level'), lvText(r.minLevel, r.maxLevel))
      + frow(lbl('رتبه', 'Rank'), '<i class="fex-rankb fex-rk' + rk + '">' + esc(rankName(rk)) + '</i>')
      + frow(lbl('نوع', 'Type'), r.type ? (typeFa ? esc(typeFa) : enSpan(r.type)) : '')
      + frow(lbl('خانواده', 'Family'), r.family ? enSpan(r.family) : '')
      + frow(lbl('منطقه', 'Zone'), zoneHtml)
      + frow(lbl('دوست با', 'Friendly to'), friendly)
      + frow(lbl('جان', 'Health'), st.health ? '<b>' + num(grp(st.health)) + '</b>' : '')
      + frow(lbl('زره', 'Armor'), st.armor ? num(grp(st.armor)) : '')
      + frow(lbl('آسیب نزدیک', 'Melee damage'), st.meleeDmg ? num(Math.round(st.meleeDmg[0])) + ' – ' + num(Math.round(st.meleeDmg[1])) : '')
      + frow(lbl('آسیب از دور', 'Ranged damage'), st.rangedDmg ? num(Math.round(st.rangedDmg[0])) + ' – ' + num(Math.round(st.rangedDmg[1])) : '')
      + frow(lbl('سرعت حمله', 'Attack speed'), st.attackSpeed ? num(st.attackSpeed) : '')
      + frow(lbl('کلاس رفتاری', 'Unit class'), st.unitClass ? enSpan(st.unitClass) : '')
      + (fl ? '<div class="fex-hchips npc-flags">' + fl + '</div>' : '');
    A = panel(lbl('مشخصات', 'Stats'), facts);

    /* where */
    var where = '';
    if (sp.zones.length) where += mapHtml(sp.zones, Math.min(S.mapIdx, sp.zones.length - 1));
    if (sp.dungeons.length || (r.dungeons && r.dungeons.length)) {
      var seen = {}, rows = '';
      sp.dungeons.forEach(function (d) { seen[d.slug] = d.n; });
      (r.dungeons || []).forEach(function (s) { if (!(s in seen)) seen[s] = 0; });
      Object.keys(seen).forEach(function (s) {
        var d = DUNG[s];
        rows += '<div class="fex-npc"><i class="fex-med fex-rk' + (d && d.type === 'raid' ? 3 : 1) + '" aria-hidden="true"></i>'
          + '<span class="fex-npc-nm rt-en" dir="ltr">' + esc(d ? d.name : s) + '</span>'
          + (d && d.levelRange ? '<span class="fex-lv">' + lbl('سطح', 'Lv') + ' ' + lvText(d.levelRange[0], d.levelRange[1]) + '</span>' : '')
          + (d ? '<span class="fex-z">' + lbl(d.type === 'raid' ? 'ریید' : d.type === 'worldboss' ? 'باس جهانی' : 'دانجن', d.type) + '</span>' : '') + '</div>';
      });
      where += '<div class="npc-dg">' + rows + '</div>'
        + '<p class="str-note npc-note">' + lbl('طبقهٔ دانجن در دیتای منبع مشخص نیست، پس روی نقشه پینی گذاشته نمی‌شود.', 'The floor of a dungeon spawn is not in the source data, so no map pin is drawn for it.') + '</p>';
    }
    if (!where) where = '<p class="npc-none">' + lbl('مختصاتی برای این NPC ثبت نشده.', 'No spawn coordinates recorded for this NPC.') + '</p>';
    A += panel(lbl('موقعیت', 'Location'), where);

    /* quests / vendor / trainer / loot */
    B = '';
    if (r.questStarts && r.questStarts.length) B += sec(lbl('کوئست‌هایی که شروع می‌کند', 'Quests started'), r.questStarts.length,
      r.questStarts.map(function (q) { return linkRow('https://www.wowhead.com/classic/quest=' + q[0], q[1], q[2]); }).join(''));
    if (r.questEnds && r.questEnds.length) B += sec(lbl('کوئست‌هایی که تحویل می‌گیرد', 'Quests completed here'), r.questEnds.length,
      r.questEnds.map(function (q) { return linkRow('https://www.wowhead.com/classic/quest=' + q[0], q[1], q[2]); }).join(''));
    if (r.vendor && r.vendor.length) B += sec(lbl('کالاهای فروشگاه', 'Vendor goods'), r.vendor.length,
      r.vendor.map(function (id) { return itemRow(id, S.items[id]); }).join(''));
    if (r.trainer && r.trainer.spells && r.trainer.spells.length) B += sec(lbl('آموزش‌ها', 'Trains'), r.trainer.spells.length,
      (r.trainer.kind ? '<p class="npc-kind">' + enSpan(r.trainer.kind) + '</p>' : '')
      + r.trainer.spells.map(function (s) { return linkRow('https://www.wowhead.com/classic/spell=' + s[0], s[1]); }).join(''));
    if (r.loot && r.loot.length) {
      var lt = r.loot.slice().sort(function (a, b) { return b.chance - a.chance; }), lim = S.lootAll ? lt.length : 25, body = '';
      for (i = 0; i < Math.min(lim, lt.length); i++) body += itemRow(lt[i].item, S.items[lt[i].item], '<span class="fex-ch">' + pct(lt[i].chance) + '</span>');
      if (lt.length > lim) body += '<button type="button" class="npcl-more" data-more="loot">' + lbl('نمایش همه', 'Show all') + ' (' + num(lt.length) + ')</button>';
      if (r.lootPools && r.lootPools.length) body += '<p class="str-note npc-note">' + lbl('+ ' + faNum(r.lootPools.length) + ' استخر لوت مشترک؛ ترکیب آیتمی استخرها هنوز منتشر نشده.',
        '+ ' + r.lootPools.length + ' shared loot pools; their item lists are not published yet.') + '</p>';
      B += sec(lbl('لوت', 'Loot'), r.loot.length, body);
    } else if (r.lootPools && r.lootPools.length) {
      B += sec(lbl('لوت', 'Loot'), null, '<p class="npc-none">' + lbl(faNum(r.lootPools.length) + ' استخر لوت مشترک (ترکیب آیتمی منتشر نشده).', r.lootPools.length + ' shared loot pools (item lists not published).') + '</p>');
    }
    if (!B) B = '<p class="npc-none">' + lbl('اطلاعات بیشتری (کوئست، فروشگاه، لوت) برای این NPC ثبت نشده.', 'No quests, vendor goods or loot recorded for this NPC.') + '</p>';

    root.innerHTML = '<nav class="rt-crumb"><a href="forever.html">Forever</a><i></i><a href="npc.html">' + lbl('پایگاه NPC', 'NPC database') + '</a><i></i><span>' + esc(fa || r.name) + '</span></nav>'
      + '<div class="fex">' + hero + '<div class="fex-grid"><div class="fex-colA">' + A + '</div><div class="fex-colB">' + B + '</div></div>'
      + '<div class="rt-tools"><a class="btn btn-stone btn-sm" href="npc.html">' + lbl('همهٔ NPCها', 'All NPCs') + '</a>'
      + '<a class="btn btn-stone btn-sm" href="https://www.wowhead.com/classic/npc=' + esc(r.id) + '" target="_blank" rel="noopener">Wowhead</a></div></div>';
  }
  function boot(id) {
    var n = +id % 24;
    root.innerHTML = '<p class="npc-loading">' + esc('در حال بارگذاری…') + '</p>';
    return Promise.all([getJSON(DB + 'npc-' + n + '.json'), opt(DB + 'spawn-' + n + '.json')]).then(function (rs) {
      var rec = pickRec(rs[0], id), ids = [];
      if (!rec) return fail('این NPC در پایگاه پیدا نشد.');
      (rec.vendor || []).forEach(function (x) { ids.push(x); });
      (rec.loot || []).forEach(function (x) { ids.push(x.item); });
      return loadItems(ids).then(function (items) {
        S = { id: id, rec: rec, sp: pickRec(rs[1], id) || null, items: items, mapIdx: 0, lootAll: false };
        paint();
      });
    }).catch(function () { fail(); });
  }

  /* ---------- list page ---------- */
  function listFilter() {
    var q = nz(LS.q), lo = parseInt(LS.lmin, 10), hi = parseInt(LS.lmax, 10), out = [], hasFa = /[\u0600-\u06FF]/.test(q);
    LS.all.forEach(function (a) {
      if (LS.zone && a[4] !== LS.zone) return;
      if (!isNaN(lo) && a[3] < lo) return;
      if (!isNaN(hi) && a[2] > hi) return;
      if (q) {
        if (hasFa) { if (nz(trEnt('npc', a[1]) || trEnt('creature', a[1])).indexOf(q) < 0) return; }
        else if (a[1].toLowerCase().indexOf(q) < 0) return;
      }
      out.push(a);
    });
    return out;
  }
  function listRows() {
    var res = listFilter(), box = document.getElementById('npcl-res'), cnt = document.getElementById('npcl-cnt'), h = '', i;
    if (!box) return;
    for (i = 0; i < Math.min(LS.shown, res.length); i++) {
      h += npcRow(res[i][0], res[i][1], res[i][2], res[i][3], res[i][4] ? zoneByName(res[i][4]) : '', 0);
    }
    if (res.length > LS.shown) h += '<button type="button" class="npcl-more" data-more="list">' + lbl('نمایش بیشتر', 'Show more') + '</button>';
    box.innerHTML = res.length ? h : '<p class="npc-none">' + lbl('چیزی پیدا نشد.', 'Nothing found.') + '</p>';
    if (cnt) cnt.innerHTML = lbl('نتیجه', 'Results') + ' <b>' + num(res.length) + '</b> ' + lbl('از', 'of') + ' ' + num(LS.all.length);
  }
  function listPaint() {
    var zopts = '<option value="">' + (on('uiLabels') ? 'همهٔ مناطق' : 'All zones') + '</option>' + LS.zones.map(function (z) {
      var m = ZBYNAME[z], t = m && on('namesZone') && m.fa ? m.fa : z;
      return '<option value="' + esc(z) + '"' + (z === LS.zone ? ' selected' : '') + '>' + esc(t) + '</option>';
    }).join('');
    document.title = 'NPC — wowfarsi';
    root.innerHTML = '<nav class="rt-crumb"><a href="forever.html">Forever</a><i></i><span>' + lbl('پایگاه NPC', 'NPC database') + '</span></nav>'
      + '<div class="fex"><header class="fex-hero q1 fFade"><div class="fex-hid"><p class="fex-eyebrow font-cinzel" dir="ltr"><i></i>FOREVER · NPC<i></i></p>'
      + '<h1>' + (on('uiLabels') ? 'پایگاه NPC' : '<span class="rt-en" dir="ltr">NPC database</span>') + '</h1>'
      + '<p class="fex-hsub">' + lbl('جست‌وجو بین NPCها، موجودها و باس‌های Forever؛ اسم‌ها فعلاً انگلیسی‌اند.', 'Search Forever NPCs, creatures and bosses; names are English for now.') + '</p></div></header>'
      + '<section class="fex-sec fFade"><div class="npcl-bar">'
      + '<div class="npcl-f npcl-grow"><label for="npcl-q">' + lbl('نام', 'Name') + '</label><input id="npcl-q" class="npcl-in" type="search" autocomplete="off" value="' + esc(LS.q) + '"></div>'
      + '<div class="npcl-f"><label for="npcl-z">' + lbl('منطقه', 'Zone') + '</label><select id="npcl-z" class="npcl-in">' + zopts + '</select></div>'
      + '<div class="npcl-f npcl-sm"><label for="npcl-lo">' + lbl('از سطح', 'Level from') + '</label><input id="npcl-lo" class="npcl-in" type="number" min="1" max="63" value="' + esc(LS.lmin) + '"></div>'
      + '<div class="npcl-f npcl-sm"><label for="npcl-hi">' + lbl('تا سطح', 'to') + '</label><input id="npcl-hi" class="npcl-in" type="number" min="1" max="63" value="' + esc(LS.lmax) + '"></div>'
      + '</div><p class="npcl-count" id="npcl-cnt"></p><div id="npcl-res" class="fex-secbd"></div></section></div>';
    listRows();
  }
  function bootList() {
    LS = { q: '', zone: '', lmin: '', lmax: '', shown: 80, all: null, zones: [] };
    root.innerHTML = '<p class="npc-loading">' + esc('در حال بارگذاری…') + '</p>';
    return getJSON(DB + 'npc-index.json').then(function (j) {
      var m = j.npcs || j, arr = [], zones = {};
      Object.keys(m).forEach(function (k) {
        var e = m[k];
        arr.push([+k, e[0], e[1], e[2], e[3]]);
        if (e[3]) zones[e[3]] = 1;
      });
      arr.sort(function (a, b) { return a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : a[0] - b[0]; });
      LS.all = arr; LS.zones = Object.keys(zones).sort();
      listPaint();
    }).catch(function () { fail(); });
  }

  /* ---------- events ---------- */
  root.addEventListener('error', function (ev) {
    var t = ev.target, m;
    if (!t || t.tagName !== 'IMG') return;
    if (t.classList.contains('npc-ic') && !t.getAttribute('data-fb')) {
      t.setAttribute('data-fb', '1'); t.src = ZAM + t.getAttribute('data-ic') + '.jpg';
    } else if (t.classList.contains('npc-mimg-img')) {
      m = t.closest('.npc-map'); if (m) m.classList.add('nomap');
    } else if (t.classList.contains('npc-por')) {
      t.style.visibility = 'hidden';
    }
  }, true);
  root.addEventListener('click', function (ev) {
    var b = ev.target && ev.target.closest ? ev.target.closest('button') : null, i, wrap;
    if (!b) return;
    if (b.classList.contains('fsrc-mchip') && S) {
      i = +b.getAttribute('data-i'); S.mapIdx = i;
      wrap = b.closest('.npc-map');
      if (wrap) wrap.outerHTML = mapHtml(spawnSplit(S.sp).zones, i);
    } else if (b.getAttribute('data-more') === 'loot' && S) { S.lootAll = true; paint(); }
    else if (b.getAttribute('data-more') === 'list' && LS) { LS.shown += 120; listRows(); }
  });
  root.addEventListener('input', function (ev) {
    var t = ev.target;
    if (!LS || !t) return;
    if (t.id === 'npcl-q') LS.q = t.value;
    else if (t.id === 'npcl-lo') LS.lmin = t.value;
    else if (t.id === 'npcl-hi') LS.lmax = t.value;
    else return;
    LS.shown = 80; listRows();
  });
  root.addEventListener('change', function (ev) {
    if (LS && ev.target && ev.target.id === 'npcl-z') { LS.zone = ev.target.value; LS.shown = 80; listRows(); }
  });

  /* ---------- boot ---------- */
  var id = new URLSearchParams(location.search).get('id');
  loadCommon().then(function () {
    if (id && /^\d+$/.test(id)) return boot(id);
    return bootList();
  });
  if (WF && WF.onChange) WF.onChange(function () { if (S) paint(); else if (LS && LS.all) listPaint(); });
})();
