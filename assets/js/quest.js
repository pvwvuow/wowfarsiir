/* quest.js — quest database, ONE quest — quest.html?id=<questId>
   (the quest LIST is quest-list.js; quest.html renames #quest-root to #quest-list-root when there is no ?id=)
   one quest: texts, level, zone / category, who gives / completes it (with spawn map), chain, reward items
   Data: quest-N (N = id % 24), quest-index, spawn-N, itemlite-N, quest-rw-N
   (reward items, built by tools/build_quest_aux.py from the item sources),
   i18n/quest-fa-N (Persian text, shown when it exists), i18n/quest-fa-titles.
   Quest-index keys that start with "sort:" are categories (class / profession / seasonal quests), not zones:
   the page labels them «کلاس» / «حرفه» / «دسته» instead of «منطقه» (quest-cats.js). The quest record itself only carries
   the English word as `zone`, so the category is read from the quest INDEX entry.
   Fields that the source data does not have (reward XP / money / reputation,
   race / class limits) are drawn ONLY when a quest record carries them:
   rewXp, rewMoney, rewItems [[id,n]], rewChoice [[id,n]], rewRep [[name,n]],
   reqRaces [name], reqClasses [name]. Nothing is invented. */
(function () {
  'use strict';
  var V = '20261201c', DB = 'data/forever/db/', I18N = 'data/forever/i18n/';
  var ZAM = 'https://wow.zamimg.com/images/wow/icons/large/';
  var root = document.getElementById('quest-root');
  if (!root) return;
  var WF = window.WFTR || null;
  var cache = {};
  var META = {}, ZBYNAME = {}, ZBYKEY = {}, DUNG = {}, ENT = {};
  var IDX = null, FAT = null, S = null, LANG = 'fa';
  try { if (localStorage.getItem('wfq-lang') === 'en') LANG = 'en'; } catch (e) { /* ignore */ }

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
  function slug(s) { return String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''); }
  function cap(s) { return String(s || '').replace(/-/g, ' ').replace(/(^| )[a-z]/g, function (c) { return c.toUpperCase(); }); }
  var QC = window.WFQCAT || {
    isCat: function (k) { return String(k == null ? '' : k).indexOf('sort:') === 0; },
    name: function (k) { return cap(String(k).slice(5)); },
    groupName: function () { return 'دسته'; }
  };
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
  /* shard files may be {id: rec} or wrapped one level ({build, quests: {id: rec}}) */
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
  function zoneOf(z) {
    if (!z) return '';
    return on('namesZone') && z.fa ? esc(z.fa) : enSpan(z.name);
  }
  function zoneByName(name) {
    var z = ZBYNAME[name], f;
    if (z) return zoneOf(z);
    f = on('namesZone') ? trEnt('zone', name) : '';
    return f ? esc(f) : enSpan(name);
  }
  function zoneByKey(key) {
    var z = ZBYKEY[key];
    if (QC.isCat(key)) return esc(QC.name(key));
    if (z) return zoneOf(z);
    return enSpan(cap(key));
  }
  /* the category key (sort:hunter) of a quest, from the index entry or the record */
  function catKey(q) {
    var e = IDX && IDX.quests && IDX.quests[q.id];
    if (e && e[1] && QC.isCat(e[1])) return e[1];
    if (q.zoneKey && QC.isCat(q.zoneKey)) return q.zoneKey;
    return '';
  }
  function money(c) {
    var g = Math.floor(c / 10000), s = Math.floor((c % 10000) / 100), k = c % 100, p = [];
    if (on('uiLabels')) {
      if (g) p.push(faNum(g) + ' طلا');
      if (s) p.push(faNum(s) + ' نقره');
      if (k || !p.length) p.push(faNum(k) + ' مس');
      return p.join('، ');
    }
    if (g) p.push(g + 'g');
    if (s) p.push(s + 's');
    if (k || !p.length) p.push(k + 'c');
    return p.join(' ');
  }
  function arr(v) { return Array.isArray(v) ? v : []; }

  /* game text -> safe html. Markers {{npc:EN|FA}}, colour codes, $N $B $g a:b; */
  /* source quirk: a $B paragraph break lost its '$', so every paragraph after the first starts with a stray 'B'
     ('BBring me...', 'BI shall...'). Same safe rule as tools/fa_missing.py: strip one 'B' only when a real word follows. */
  var LEAD_B = /^B(?=[A-Z][a-z]|[AI](?![A-Za-z0-9_])|<|[$]|[{][{])/;
  function junk(x) { return typeof x !== 'string' || !x.trim() || x.trim() === 'NULL' || /^[Bb]$/.test(x.trim()); }
  function fmt(t, isFa) {
    var s = esc(isFa ? t : String(t).replace(LEAD_B, ''));
    s = s.replace(/[{][{](?:npc|zn|it|sp):([^|{}]*)[|]([^|{}]*)[}][}]/g, function (m, en, fa) { return isFa ? fa : en; });
    s = s.replace(/[|]c[0-9a-fA-F]{2}([0-9a-fA-F]{6})(.*?)[|]r/g, '<span style="color:#$1">$2</span>');
    s = s.replace(/[|]r/g, '');
    s = s.replace(/[$][Gg]([^;$:]*):([^;$]*);/g, function (m, a, b) { return a.trim() + ' / ' + b.trim(); });
    s = s.replace(/[$][Nn]/g, isFa ? 'قهرمان' : '&lt;name&gt;');
    s = s.replace(/[$][Cc]/g, isFa ? 'کلاس تو' : '&lt;class&gt;');
    s = s.replace(/[$][Rr]/g, isFa ? 'نژاد تو' : '&lt;race&gt;');
    s = s.replace(/[$][Bb]/g, '<br>');
    s = s.replace(/[$][A-Za-z]/g, '');
    return s;
  }
  function paras(en, fa) {
    var a = arr(en).filter(function (x) { return !junk(x); });
    var f = arr(fa), n = Math.max(arr(en).length, f.length), i, h = '', e, p;
    if (!a.length && !f.length) return '';
    for (i = 0; i < n; i++) {
      e = arr(en)[i];
      p = f[i];
      if (junk(e)) e = null;
      if (LANG === 'fa' && typeof p === 'string' && p.trim()) h += '<p class="q-p">' + fmt(p, true) + '</p>';
      else if (typeof e === 'string') h += '<p class="q-p rt-en" dir="ltr">' + fmt(e, false) + '</p>';
    }
    return h;
  }

  /* ---------- builders (same classes as the NPC / item pages) ---------- */
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
  function extRow(href, nm) {
    return '<a class="fex-npc" href="' + esc(href) + '" target="_blank" rel="noopener"><i class="fex-med fex-objd" aria-hidden="true"></i>'
      + '<span class="fex-npc-nm rt-en" dir="ltr">' + esc(nm) + '</span></a>';
  }
  function npcLink(id, name) {
    var fa = npcFa(name);
    return '<a class="fex-npc" href="npc.html?id=' + esc(id) + '"><i class="fex-med fex-rk0" aria-hidden="true"></i>'
      + '<span class="fex-npc-nm' + (fa ? '' : ' rt-en') + '"' + (fa ? '' : ' dir="ltr"') + '>' + esc(fa || name) + '</span>'
      + (fa ? '<span class="fex-sub rt-en" dir="ltr">' + esc(name) + '</span>' : '') + '</a>';
  }
  function ftitle(id, en) {
    var t = FAT && FAT.t && FAT.t[id];
    return LANG === 'fa' && t ? { fa: true, t: t } : { fa: false, t: en };
  }
  function qLink(id) {
    var e = IDX && IDX.quests && IDX.quests[id], nm = e && e[0] ? e[0] : '#' + id, t = ftitle(id, nm);
    return '<a class="fex-npc" href="quest.html?id=' + esc(id) + '"><i class="fex-med fex-objd" aria-hidden="true"></i>'
      + '<span class="fex-npc-nm' + (t.fa ? '' : ' rt-en') + '"' + (t.fa ? '' : ' dir="ltr"') + '>' + esc(t.t) + '</span>'
      + (e && e[2] ? '<span class="fex-lv">' + lbl('سطح', 'Lv') + ' ' + num(e[2]) + '</span>' : '') + '</a>';
  }
  function langBar(show) {
    if (!show) return '';
    return '<div class="q-lang" role="group" aria-label="زبان متن کوئست"><button type="button" data-l="fa" class="' + (LANG === 'fa' ? 'on' : '') + '">فارسی</button>'
      + '<button type="button" data-l="en" dir="ltr" class="' + (LANG === 'en' ? 'on' : '') + '">English</button></div>';
  }

  /* ---------- data ---------- */
  function loadCommon() {
    return Promise.all([opt(DB + 'zones-meta.json'), opt(DB + 'dungeons.json'), opt(I18N + 'entities.json'),
      opt(DB + 'quest-index.json'), opt(I18N + 'quest-fa-titles.json')])
      .then(function (r) {
        var zs = r[0] && r[0].zones;
        if (zs) (Array.isArray(zs) ? zs : Object.keys(zs).map(function (k) { return zs[k]; })).forEach(function (z) {
          META[z.id] = z; ZBYNAME[z.name] = z;
          ZBYKEY[slug(z.name)] = z;
          if (z.slug) ZBYKEY[z.slug] = z;
        });
        ((r[1] && r[1].dungeons) || []).forEach(function (d) { DUNG[d.slug] = d; });
        ENT = (r[2] && r[2].types) || {};
        IDX = r[3] || null;
        FAT = r[4] || null;
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
  function fail(msg, id) {
    root.innerHTML = '<p class="npc-loading">' + esc(msg || 'بارگذاری نشد.') + ' <a href="quest.html">' + esc('همهٔ کوئست‌ها') + '</a>'
      + (id ? ' · <a href="https://www.wowhead.com/classic/quest=' + esc(id) + '" target="_blank" rel="noopener">Wowhead</a>' : '') + '</p>';
  }

  /* ---------- spawn map (same markup as npc.js) ---------- */
  function spawnSplit(sp) {
    var zs = [], dg = [];
    Object.keys(sp || {}).forEach(function (k) {
      var v = sp[k], n = 0;
      if (/^[0-9]+$/.test(k) && Array.isArray(v)) zs.push({ id: +k, pts: v });
      else if (v && typeof v === 'object') {
        Object.keys(v).forEach(function (f) { n += (v[f] || []).length; });
        dg.push({ slug: k, n: n });
      }
    });
    zs.sort(function (a, b) { return b.pts.length - a.pts.length; });
    return { zones: zs, dungeons: dg };
  }
  function mapHtml(zs, idx, key) {
    var z = zs[idx], meta = META[z.id], pts = z.pts, h, coords;
    var zn = meta ? zoneOf(meta) : enSpan('Zone ' + z.id);
    coords = pts.slice(0, 16).map(function (p) { return '<span class="fex-chip">' + num(p[0].toFixed(1)) + ' ، ' + num(p[1].toFixed(1)) + '</span>'; }).join('');
    h = '<div class="fsrc-map npc-map" data-k="' + esc(key) + '" data-i="' + idx + '"><div class="fsrc-mimg">'
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
  function dungeonRows(dg) {
    return dg.map(function (x) {
      var d = DUNG[x.slug];
      return '<div class="fex-npc"><i class="fex-med fex-rk1" aria-hidden="true"></i><span class="fex-npc-nm rt-en" dir="ltr">'
        + esc(d ? d.name : x.slug) + '</span><span class="fex-z">' + lbl(d && d.type === 'raid' ? 'ریید' : 'دانجن', 'Dungeon') + '</span></div>';
    }).join('');
  }
  function actorBlock(role, a, key) {
    var rows = '', sp = S.sp[key], map = '', sx;
    a = a || {};
    arr(a.npcs).forEach(function (n) { rows += npcLink(n.id, n.name); });
    arr(a.objects).forEach(function (o) { rows += extRow('https://www.wowhead.com/classic/object=' + o.id, o.name); });
    arr(a.items).forEach(function (it) {
      rows += '<a class="fex-npc" href="item.html?ver=forever&amp;id=' + esc(it.id) + '"><i class="fex-med fex-objd" aria-hidden="true"></i><span class="fex-npc-nm rt-en" dir="ltr">' + esc(it.name) + '</span></a>';
    });
    if (!rows) return '';
    if (sp) {
      sx = spawnSplit(sp.sp);
      if (sx.zones.length) map = '<p class="q-maplb">' + lbl('موقعیت', 'Location') + ': ' + esc(npcFa(sp.name) || sp.name) + '</p>' + mapHtml(sx.zones, 0, key);
      else if (sx.dungeons.length) map = '<p class="q-maplb">' + lbl('موقعیت', 'Location') + ': ' + esc(npcFa(sp.name) || sp.name) + '</p><div class="npc-dg">' + dungeonRows(sx.dungeons) + '</div>';
    }
    return sec(role, null, rows + map);
  }

  /* ---------- detail page ---------- */
  function money2(q) { return typeof q.rewMoney === 'number' && q.rewMoney > 0 ? q.rewMoney : 0; }
  function rewardsHtml(q) {
    var h = '', rw = S.rw, ch, it, hasAny = false, rep;
    if (typeof q.rewXp === 'number' && q.rewXp > 0) { h += frow(lbl('تجربه', 'Experience'), '<b>' + num(q.rewXp) + '</b> XP'); hasAny = true; }
    if (money2(q)) { h += frow(lbl('پول', 'Money'), '<b>' + esc(money(money2(q))) + '</b>'); hasAny = true; }
    rep = arr(q.rewRep);
    if (rep.length) {
      h += rep.map(function (r) { return frow(enSpan(r[0]), (r[1] > 0 ? '+' : '') + num(r[1])); }).join('');
      hasAny = true;
    }
    ch = arr(q.rewChoice);
    it = arr(q.rewItems);
    if (it.length) {
      h += '<p class="q-sub">' + (ch.length ? lbl('پاداش قطعی', 'You will receive') : lbl('آیتم‌های پاداش (قطعی یا انتخابی؛ منبع جدایشان نمی‌کند)', 'Reward items (fixed or choice; the source does not separate them)')) + '</p>' + it.map(function (x) { return itemRow(x[0], S.items[x[0]], x[1] > 1 ? '<span class="fex-ch">×' + num(x[1]) + '</span>' : ''); }).join('');
      hasAny = true;
    }
    if (ch.length) {
      h += '<p class="q-sub">' + lbl('یکی را انتخاب کن', 'Choose one') + '</p>' + ch.map(function (x) { return itemRow(x[0], S.items[x[0]], x[1] > 1 ? '<span class="fex-ch">×' + num(x[1]) + '</span>' : ''); }).join('');
      hasAny = true;
    }
    if (!it.length && !ch.length && rw.length) {
      h += '<p class="q-sub">' + lbl('آیتم‌های پاداش', 'Reward items') + '</p>' + rw.map(function (id) { return itemRow(id, S.items[id]); }).join('');
      hasAny = true;
    }
    if (!hasAny) return '<p class="npc-none">' + lbl('پاداش این کوئست هنوز در دیتا ثبت نشده.', 'No rewards recorded for this quest yet.') + '</p>';
    var mf = [], me = [];
    if (!(typeof q.rewXp === 'number' && q.rewXp > 0)) { mf.push('تجربه'); me.push('XP'); }
    if (!money2(q)) { mf.push('پول'); me.push('money'); }
    if (!rep.length) { mf.push('اعتبار'); me.push('reputation'); }
    if (mf.length) {
      h += '<p class="str-note npc-note">' + lbl(mf.join('، ') + ' در دیتای منبع نیست و نمایش داده نمی‌شود.', me.join(', ') + ' not in the source data yet.') + '</p>';
    }
    return h;
  }
  function paint() {
    var q = S.q, f = S.fa || {}, hasFa = !!(f.t || f.desc || f.obj || f.details || f.progress || f.completion);
    var fa = LANG === 'fa' && f.t ? f.t : '';
    var ck = catKey(q);
    var title = fa || q.name || ('#' + q.id);
    var zoneHtml = ck ? esc(QC.name(ck)) : (q.zone ? zoneByName(q.zone) : (q.zoneKey ? zoneByKey(q.zoneKey) : ''));
    var zl = ck ? lbl(QC.groupName(ck), 'Category') : lbl('منطقه', 'Zone');
    var hero, A = '', B = '', texts, ch = '', pre;

    document.title = title + ' — ' + (on('uiLabels') ? 'کوئست' : 'Quest') + ' — wowfarsi';
    hero = '<header class="fex-hero q1 fFade"><div class="fex-hid"><p class="fex-eyebrow font-cinzel" dir="ltr"><i></i>QUEST' + (q.repeatable ? ' · REPEATABLE' : '') + '<i></i></p>'
      + '<h1' + (fa ? '>' : ' class="rt-en" dir="ltr">') + esc(title) + '</h1>'
      + (fa && q.name ? '<p class="fx-ensub rt-en" dir="ltr">' + esc(q.name) + '</p>' : '')
      + '<div class="fex-hchips">'
      + (q.questLevel ? chip(lbl('سطح کوئست', 'Quest level'), num(q.questLevel)) : '')
      + (q.requiredLevel ? chip(lbl('حداقل سطح', 'Required level'), num(q.requiredLevel)) : '')
      + (zoneHtml ? chip(zl, zoneHtml) : '')
      + (q.repeatable ? chip(lbl('نوع', 'Type'), lbl('تکرارشدنی', 'Repeatable')) : '')
      + '</div></div></header>';

    /* texts */
    texts = '';
    if (arr(q.objectives).length || arr(f.obj).length) {
      texts += sec(lbl('هدف', 'Objectives'), null, paras(q.objectives, f.obj));
      texts += sec(lbl('شرح', 'Summary'), null, paras(q.desc, f.desc));
    } else {
      texts += sec(lbl('هدف', 'Objectives'), null, paras(q.desc, f.desc));
    }
    texts += sec(lbl('توضیح', 'Description'), null, paras(q.details, f.details));
    texts += sec(lbl('پیشرفت', 'Progress'), null, paras(q.progress, f.progress));
    texts += sec(lbl('تحویل', 'Completion'), null, paras(q.completion, f.completion));
    if (!texts) texts = '<p class="npc-none">' + lbl('متن این کوئست در دیتای منبع نیست.', 'The source data has no text for this quest.') + '</p>';
    A += (hasFa ? '' : '<p class="str-note npc-note">' + lbl('ترجمهٔ فارسی این کوئست هنوز آماده نیست؛ متن انگلیسی نشان داده می‌شود.', 'The Persian translation of this quest is not ready yet; English text is shown.') + '</p>') + texts;

    /* chain */
    pre = arr(q.preQuestSingle).concat(arr(q.preQuestGroup));
    if (pre.length) ch += sec(lbl('پیش‌نیاز', 'Requires'), pre.length, pre.map(qLink).join(''));
    if (q.nextQuestInChain) ch += sec(lbl('کوئست بعدی', 'Next in chain'), 1, qLink(q.nextQuestInChain));
    if (arr(q.exclusiveTo).length) ch += sec(lbl('ناسازگار با', 'Exclusive with'), q.exclusiveTo.length, q.exclusiveTo.map(qLink).join(''));
    A += ch;

    /* facts + where + rewards */
    B += panel(lbl('مشخصات', 'Details'),
      frow(lbl('سطح کوئست', 'Quest level'), q.questLevel ? num(q.questLevel) : '')
      + frow(lbl('حداقل سطح', 'Required level'), q.requiredLevel ? num(q.requiredLevel) : '')
      + frow(zl, zoneHtml)
      + frow(lbl('نژاد', 'Races'), arr(q.reqRaces).length ? q.reqRaces.map(enSpan).join('، ') : '')
      + frow(lbl('کلاس', 'Classes'), arr(q.reqClasses).length ? q.reqClasses.map(enSpan).join('، ') : '')
      + frow(lbl('شناسه', 'ID'), '<span dir="ltr">' + esc(q.id) + '</span>'));
    B += panel(lbl('پاداش', 'Rewards'), rewardsHtml(q));
    B += actorBlock(lbl('شروع از', 'Started by'), q.startedBy, 's');
    B += actorBlock(lbl('تحویل به', 'Turn in to'), q.finishedBy, 'e');

    root.innerHTML = '<nav class="rt-crumb"><a href="forever.html">Forever</a><i></i><a href="quest.html">' + lbl('پایگاه کوئست', 'Quest database') + '</a><i></i><span>' + esc(title) + '</span></nav>'
      + '<div class="fex">' + hero + langBar(hasFa) + '<div class="fex-grid"><div class="fex-colA">' + A + '</div><div class="fex-colB">' + B + '</div></div>'
      + '<div class="rt-tools"><a class="btn btn-stone btn-sm" href="quest.html">' + lbl('همهٔ کوئست‌ها', 'All quests') + '</a>'
      + '<a class="btn btn-stone btn-sm" href="https://www.wowhead.com/classic/quest=' + esc(q.id) + '" target="_blank" rel="noopener">Wowhead</a></div></div>';
  }
  function firstSpawn(a, shards) {
    var npcs = arr(a && a.npcs), i, id, sp;
    for (i = 0; i < npcs.length; i++) {
      id = npcs[i].id;
      sp = pickRec(shards[+id % 24], id);
      if (sp) return { sp: sp, name: npcs[i].name, id: id };
    }
    return null;
  }
  function boot(id) {
    var n = +id % 24;
    root.innerHTML = '<p class="npc-loading">در حال بارگذاری…</p>';
    return Promise.all([getJSON(DB + 'quest-' + n + '.json'), opt(I18N + 'quest-fa-' + n + '.json'), opt(DB + 'quest-rw-' + n + '.json')]).then(function (rs) {
      var q = pickRec(rs[0], id), fa = pickRec(rs[1], id), rw = arr(pickRec(rs[2], id)), need = {}, ids = [];
      if (!q) return fail('این کوئست در پایگاه پیدا نشد.', id);
      if (typeof q.id === 'undefined') q.id = +id;
      arr(q.startedBy && q.startedBy.npcs).slice(0, 4).concat(arr(q.finishedBy && q.finishedBy.npcs).slice(0, 4)).forEach(function (x) { need[+x.id % 24] = 1; });
      ids = rw.slice();
      arr(q.rewItems).concat(arr(q.rewChoice)).forEach(function (x) { ids.push(x[0]); });
      return Promise.all([Promise.all(Object.keys(need).map(function (k) { return opt(DB + 'spawn-' + k + '.json'); })), loadItems(ids)]).then(function (r2) {
        var shards = {}, ks = Object.keys(need), s, e;
        ks.forEach(function (k, i) { shards[k] = r2[0][i]; });
        s = firstSpawn(q.startedBy, shards);
        e = firstSpawn(q.finishedBy, shards);
        if (s && e && s.id === e.id) e = null;
        S = { id: id, q: q, fa: fa, rw: rw, items: r2[1], sp: { s: s, e: e } };
        paint();
      });
    }).catch(function () { fail('', id); });
  }

  /* ---------- events ---------- */
  root.addEventListener('error', function (ev) {
    var t = ev.target, m;
    if (!t || t.tagName !== 'IMG') return;
    if (t.classList.contains('npc-ic') && !t.getAttribute('data-fb')) {
      t.setAttribute('data-fb', '1'); t.src = ZAM + t.getAttribute('data-ic') + '.jpg';
    } else if (t.classList.contains('npc-mimg-img')) {
      m = t.closest('.npc-map'); if (m) m.classList.add('nomap');
    }
  }, true);
  root.addEventListener('click', function (ev) {
    var b = ev.target && ev.target.closest ? ev.target.closest('button') : null, wrap, key, sp, i;
    if (!b) return;
    if (b.parentNode && b.parentNode.classList.contains('q-lang')) {
      LANG = b.getAttribute('data-l') === 'en' ? 'en' : 'fa';
      try { localStorage.setItem('wfq-lang', LANG); } catch (e) { /* ignore */ }
      if (S) paint();
    } else if (b.classList.contains('fsrc-mchip') && S) {
      wrap = b.closest('.npc-map');
      if (!wrap) return;
      key = wrap.getAttribute('data-k');
      sp = S.sp[key];
      i = +b.getAttribute('data-i');
      if (sp) wrap.outerHTML = mapHtml(spawnSplit(sp.sp).zones, i, key);
    }
  });

  /* ---------- boot ---------- */
  var qid = new URLSearchParams(location.search).get('id');
  loadCommon().then(function () {
    if (qid == null || qid === '') return fail('شناسهٔ کوئست مشخص نیست.');
    if (!/^[0-9]{1,9}$/.test(qid)) return fail('شناسهٔ کوئست معتبر نیست.');
    return boot(String(+qid));
  });
  if (WF && WF.onChange) WF.onChange(function () { if (S) paint(); });
})();
