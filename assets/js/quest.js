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
   rewXp, rewMoney, rewItems [[id,n]], rewChoice [[id,n]], rewRep [[factionId|name,n]],
   reqRaces [name], reqClasses [name], faction 'horde'|'alliance' (side chip),
   startPoi / endPoi [{map,x,y,…}] (Forever uiMap ids — coordinates, no image guess).
   quest-hunt v2 also stores killTargets / collectItems on the record (shown later).
   English text is always the fallback when no Persian exists (rt-en, dir=ltr),
   and the «translation not ready» note keeps saying so. Nothing is invented.
   Quest parity (v20261102x): the page has NO language button of its own any more. Every part obeys the global
   translation-style switches (tr.js): titles + chain titles namesQuest, quest texts textDesc, markers inside the
   Persian text their own family switch, items namesItem, objects namesObj, classes namesClass, NPCs namesNpc,
   zones namesZone, labels uiLabels. The quick bar English / فارسی / saved styles is tr-prof.js (WFTRP.bar). */
(function () {
  'use strict';
  var V = '20261103d', DB = 'data/forever/db/', I18N = 'data/forever/i18n/';
  var ZAM = 'https://wow.zamimg.com/images/wow/icons/large/';
  var root = document.getElementById('quest-root');
  if (!root) return;
  var WF = window.WFTR || null;
  var cache = {};
  var META = {}, ZBYNAME = {}, ZBYKEY = {}, DUNG = {}, ENT = {};
  var IDX = null, FAT = null, UIM = null, S = null;
  /* game map icons (map-poi pack): "!" pickup, "?" turn-in, used on the quest map pins */
  var MICON = { s: 'assets/img/map-icons/questgiver.png', e: 'assets/img/map-icons/quest-turnin.png' };
  /* marker family inside the Persian quest text -> the switch that owns it (tr.js MK) */
  var MKSW = { npc: 'namesNpc', zn: 'namesZone', it: 'namesItem', sp: 'namesSpell', ob: 'namesObj', qs: 'namesQuest', cls: 'namesClass', tm: 'terms' };
  /* lane-a9 D: |cn<NAME> quality tokens -> the site quality colours (tr.js gameCodes mirror;
     the site QCOL: 0 poor, 1 common, 2 uncommon, 3 rare, 4 epic, 5 legendary, 6 artifact, 7 heirloom) */
  var CNQ = { IQ0: '#b4b4b4', IQ1: '#ffffff', IQ2: '#1eff00', IQ3: '#3a9bff', IQ4: '#c06cff', IQ5: '#ff8000', IQ6: '#e6cc80', IQ7: '#00cc98',
    EPIC_PURPLE_COLOR: '#c06cff', RARE_BLUE_COLOR: '#3a9bff' };

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
  /* lane-c17: html-safe twin of lbl() for string-built html. lbl() returns a MARKUP
     string in EN mode (the rt-en span); putting it through esc() again (or through
     textContent) paints the tags on the page. lblHtml escapes each language exactly
     once and builds the span only from already-escaped text — DOM-node safety, in
     the string idiom every renderer in this file already uses. */
  function lblHtml(fa, en) { return on('uiLabels') ? esc(fa) : enSpan(en); }
  function enSpan(t) { return '<span class="rt-en" dir="ltr">' + esc(t) + '</span>'; }
  /* quest titles can quote a name: {{fam:EN|FA}}. Each marker follows ITS switch (like the text body); plain text for
     document.title and search */
  var TMK = /\{\{(npc|zn|it|sp|ob|qs|cls|tm):([^|{}]*)\|([^|{}]*)\}\}/g;
  function tt(t) {
    return esc(t).replace(TMK, function (m, mk, en, fa) {
      return on(MKSW[mk]) ? fa : '<span class="rt-en" dir="ltr">' + en + '</span>';
    });
  }
  function tplain(t) { return String(t == null ? '' : t).replace(TMK, '$3'); }
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
  function itemFa(en) { return en && on('namesItem') ? (trEnt('item_ref', en) || trEnt('item', en)) : ''; }
  function itemFaOf(it, en) { return on('namesItem') ? ((it && it[3]) || itemFa(en)) : ''; }
  function objFa(en) { return en && on('namesObj') ? (trEnt('object', en) || trEnt('gameobject', en)) : ''; }
  function clsFa(en) { return on('namesClass') && WF && WF.CLASSES && typeof WF.CLASSES[en] === 'string' ? WF.CLASSES[en] : ''; }
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

  /* ---------- translation badges (tr-badge.js, the owner's two stars) ----------
     fa = does Persian EXIST for this section; sw = does the section obey the translation-style switches.
     Since quest parity every quest part reads its switch (ok:true). Still NOT connected, honestly:
     race names (no Persian race table in the data yet) and reputation factions (ids / names without a map). */
  var TB = window.WFTRB || null, BL = [];
  function bd(o) { if (!TB || !o) return ''; BL.push(o); return TB.badge(o); }
  function swl(k) { return TB ? TB.label(k) : k; }
  function fas(have, tot) { return !tot ? 'none' : (have >= tot ? 'full' : (have > 0 ? 'part' : 'none')); }
  function nOf(have, tot, unit) { return faNum(have) + ' \u0627\u0632 ' + faNum(tot) + ' ' + unit + ' \u0641\u0627\u0631\u0633\u06cc \u062f\u0627\u0631\u062f'; }
  function swOff(k) { return !!(WF && WF.on && !WF.on(k)); }
  function npcHas(nm) { return !!(trEnt('npc', nm) || trEnt('creature', nm)); }
  function itemHas(nm) { return !!(trEnt('item_ref', nm) || trEnt('item', nm)); }
  function onNote(k) { return '\u0627\u0632 \u06a9\u0644\u06cc\u062f \u00ab' + swl(k) + '\u00bb \u067e\u06cc\u0631\u0648\u06cc \u0645\u06cc\u200c\u06a9\u0646\u062f'; }
  function offNote(k) { return ' (\u06a9\u0644\u06cc\u062f \u00ab' + swl(k) + '\u00bb \u062f\u0631 \u0633\u0628\u06a9 \u0641\u0639\u0644\u06cc \u062a\u0648 \u062e\u0627\u0645\u0648\u0634 \u0627\u0633\u062a\u060c \u0628\u0631\u0627\u06cc \u0647\u0645\u06cc\u0646 \u0627\u0646\u06af\u0644\u06cc\u0633\u06cc \u0645\u06cc\u200c\u0628\u06cc\u0646\u06cc)'; }
  function txtB(en, fa) {
    var a = arr(en), f = arr(fa), n = Math.max(a.length, f.length), i, parts = [], hp;
    for (i = 0; i < n; i++) {
      hp = typeof f[i] === 'string' && !!f[i].trim();
      if (hp || !junk(a[i])) parts.push({ has: hp, k: 'textDesc', ok: true });
    }
    return partsB(parts, '\u067e\u0627\u0631\u0627\u06af\u0631\u0627\u0641');
  }
  function titleB(has) {
    var o = { fa: has ? 'full' : 'none', faNote: has ? '\u0639\u0646\u0648\u0627\u0646 \u0641\u0627\u0631\u0633\u06cc \u062f\u0627\u0631\u062f' : '\u0639\u0646\u0648\u0627\u0646 \u0641\u0627\u0631\u0633\u06cc \u0647\u0646\u0648\u0632 \u0646\u06cc\u0633\u062a', sw: 'on', key: 'namesQuest',
      swNote: onNote('namesQuest') };
    if (has && swOff('namesQuest')) o.faNote += offNote('namesQuest');
    return o;
  }
  /* parts: [{has, k, ok}] has = Persian exists, k = the switch that owns it, ok = this page reads that switch.
     key = the switch the diamond flashes: the CONNECTED one for on/part (toggling it visibly changes the
     section), the missing one only when nothing is connected (owner: half diamond -> drawer -> nothing changed). */
  function partsB(parts, unit) {
    var tot = parts.length, have = 0, okN = 0, miss = '', k0 = '', offNow = '', i, p, o, sw;
    if (!tot) return null;
    for (i = 0; i < tot; i++) {
      p = parts[i];
      if (p.has) have++;
      if (p.ok) {
        okN++;
        if (!k0) k0 = p.k;
        if (p.has && !offNow && swOff(p.k)) offNow = p.k;
      } else if (!miss) miss = p.k;
    }
    sw = okN === tot ? 'on' : (okN ? 'part' : 'off');
    o = { fa: fas(have, tot), faNote: nOf(have, tot, unit), sw: sw, key: sw === 'off' ? miss : k0 };
    o.swNote = sw === 'on' ? onNote(k0)
      : (sw === 'part' ? '\u0628\u062e\u0634\u06cc \u0648\u0635\u0644 \u0627\u0633\u062a (\u00ab' + swl(k0) + '\u00bb)\u061b \u00ab' + swl(miss) + '\u00bb \u0647\u0646\u0648\u0632 \u0648\u0635\u0644 \u0646\u06cc\u0633\u062a' : '\u0628\u0647 \u06a9\u0644\u06cc\u062f \u00ab' + swl(miss) + '\u00bb \u0648\u0635\u0644 \u0646\u06cc\u0633\u062a');
    if (offNow) o.faNote += offNote(offNow);
    return o;
  }
  function qParts(ids) {
    return ids.map(function (id) { return { has: !!(FAT && FAT.t && FAT.t[id]), k: 'namesQuest', ok: true }; });
  }
  function itemParts(list) {
    return list.map(function (x) {
      var it = S.items[x], nm = it && it[0] ? it[0] : '';
      return { has: (!!nm && itemHas(nm)) || !!(it && it[3]), k: 'namesItem', ok: true };
    });
  }
  function actorB(a) {
    var parts = [];
    a = a || {};
    arr(a.npcs).forEach(function (n) { parts.push({ has: npcHas(n.name), k: 'namesNpc', ok: true }); });
    arr(a.objects).forEach(function (o) { parts.push({ has: !!(trEnt('object', o.name) || trEnt('gameobject', o.name)), k: 'namesObj', ok: true }); });
    arr(a.items).forEach(function (it) { parts.push({ has: itemHas(it.name), k: 'namesItem', ok: true }); });
    if (!parts.length) parts.push({ has: true, k: 'uiLabels', ok: true });
    return partsB(parts, '\u0627\u0633\u0645');
  }
  function factsB(q, ck, side) {
    var parts = [], z;
    if (ck) parts.push({ has: true, k: 'uiLabels', ok: true });
    else if (q.zone || q.zoneKey) {
      z = q.zone ? ZBYNAME[q.zone] : ZBYKEY[q.zoneKey];
      parts.push({ has: !!((z && z.fa) || (q.zone && trEnt('zone', q.zone))), k: 'namesZone', ok: true });
    }
    if (side) parts.push({ has: !!trEnt('faction', side), k: 'namesNpc', ok: true });
    arr(q.reqRaces).forEach(function () { parts.push({ has: false, k: 'textReq', ok: false }); });
    arr(q.reqClasses).forEach(function (c) { parts.push({ has: !!(WF && WF.CLASSES && WF.CLASSES[c]), k: 'namesClass', ok: true }); });
    parts.push({ has: true, k: 'uiLabels', ok: true });
    return partsB(parts, '\u0645\u0648\u0631\u062f');
  }
  function rewardsB(q) {
    var parts = [], ids = [];
    arr(q.rewRep).forEach(function () { parts.push({ has: false, k: 'namesNpc', ok: false }); });
    arr(q.rewItems).concat(arr(q.rewChoice)).forEach(function (x) { ids.push(x[0]); });
    if (!ids.length) ids = S.rw.slice();
    return partsB(parts.concat(itemParts(ids)).concat([{ has: true, k: 'uiLabels', ok: true }]), '\u0645\u0648\u0631\u062f');
  }

  /* game text -> safe html. Markers {{npc:EN|FA}}, colour codes, $N $B $g a:b; */
  /* source quirk: a $B paragraph break lost its '$', so every paragraph after the first starts with a stray 'B'
     ('BBring me...', 'BI shall...'). Same safe rule as tools/fa_missing.py: strip one 'B' only when a real word follows. */
  var LEAD_B = /^B(?=[A-Z][a-z]|[AI](?![A-Za-z0-9_])|<|[$]|[{][{])/;
  function junk(x) { return typeof x !== 'string' || !x.trim() || x.trim() === 'NULL' || /^[Bb]$/.test(x.trim()); }
  /* comparable English of a text block (objectives vs desc are often the same sentence) */
  function enKey(v) {
    return arr(v).filter(function (x) { return !junk(x); }).map(function (x) {
      return String(x).replace(LEAD_B, '').replace(/\s+/g, ' ').trim();
    }).join('\n');
  }
  function fmt(t, isFa) {
    var s = esc(isFa ? t : String(t).replace(LEAD_B, ''));
    /* a marker inside the Persian text follows ITS OWN switch (npc -> namesNpc, it -> namesItem ...) */
    s = s.replace(/[{][{](npc|zn|it|sp|ob|qs|cls|tm):([^|{}]*)[|]([^|{}]*)[}][}]/g, function (m, mk, en, fa) {
      if (!isFa) return en;
      return on(MKSW[mk]) ? fa : '<span class="rt-en" dir="ltr">' + en + '</span>';
    });
    s = s.replace(/[|]c[0-9a-fA-F]{2}([0-9a-fA-F]{6})(.*?)[|]r/g, '<span style="color:#$1">$2</span>');
    /* lane-a10 (inbox/18 C): the |cn<NAME>:…|r pair replace moved INSIDE the {{...}}
       split (same as tr.js gameCodes) — run before the split it could match INTO a
       marker: "|cnIQ1:x {{i:1|rough|1}}" has no closer before the marker, so the old
       pre-loop pair regex matched the marker's "|rough" as its |r and ate it */
    var fparts = s.split(/([{][{][^}]*[}][}])/), fout = [], fi;
    for (fi = 0; fi < fparts.length; fi++) {
      if (fi % 2) { fout.push(fparts[fi]); continue; } /* marker segment — untouched */
      if (fparts[fi]) fout.push(fparts[fi]
        .replace(/[|]cn([A-Za-z0-9_]+):((?:(?![|]r).)*)[|]r/g, function (m, name, inner) {
          var c = CNQ[name];
          return c ? '<span style="color:' + c + '">' + inner + '</span>' : inner;
        })
        .replace(/[|]r/g, '')
        .replace(/[|]cn[A-Za-z0-9_]+:/g, '')); /* unpaired opener — inner stays plain */
    }
    s = fout.join('');
    s = s.replace(/[$][Gg]([^;$:]*):([^;$]*);/g, function (m, a, b) { return a.trim() + ' / ' + b.trim(); });
    s = s.replace(/[$][Nn]/g, isFa ? 'قهرمان' : '&lt;name&gt;');
    s = s.replace(/[$][Cc]/g, isFa ? 'کلاس تو' : '&lt;class&gt;');
    s = s.replace(/[$][Rr]/g, isFa ? 'نژاد تو' : '&lt;race&gt;');
    s = s.replace(/[$][Bb]/g, '<br>');
    /* lane-a9 D: spell variables the game computes ("$/1000;s1", "$439164s1")
       never show raw — the small game chip (tr.js gameCodes), raw token in the
       tooltip; runs BEFORE the generic $-code drop so it can win the match */
    s = s.replace(/[$](?:[\/]\d+;[sS]|\d+[sS])\d+/g, function (m) { return '<span class="tk" title="' + m + '"></span>'; });
    s = s.replace(/[$][A-Za-z]/g, '');
    return s;
  }
  function paras(en, fa) {
    var a = arr(en).filter(function (x) { return !junk(x); });
    var f = arr(fa), n = Math.max(arr(en).length, f.length), i, h = '', e, p, faOn = on('textDesc');
    if (!a.length && !f.length) return '';
    for (i = 0; i < n; i++) {
      e = arr(en)[i];
      p = f[i];
      if (junk(e)) e = null;
      if (faOn && typeof p === 'string' && p.trim()) h += '<p class="q-p">' + fmt(p, true) + '</p>';
      else if (typeof e === 'string') h += '<p class="q-p rt-en" dir="ltr">' + fmt(e, false) + '</p>';
    }
    return h;
  }

  /* ---------- builders (same classes as the NPC / item pages) ---------- */
  function sec(title, count, body, b) {
    if (!body) return '';
    return '<section class="fex-sec fFade"><h3 class="fex-sh"><span>' + title + '</span>' + bd(b)
      + (count != null ? '<b class="fex-n">' + num(count) + '</b>' : '') + '</h3><div class="fex-secbd">' + body + '</div></section>';
  }
  function panel(title, body, b) {
    return body ? '<section class="fex-panel fFade"><h2 class="fex-ph"><span>' + title + '</span>' + bd(b) + '<i></i></h2>' + body + '</section>' : '';
  }
  function frow(l, v) { return v ? '<div class="fex-frow"><span>' + l + '</span><span>' + v + '</span></div>' : ''; }
  function chip(l, v) { return '<span class="fex-chip">' + l + ' <b>' + v + '</b></span>'; }
  function icon(ic) {
    if (!ic) return '<i class="fex-med" aria-hidden="true"></i>';
    return '<img class="npc-ic" src="icons/large/' + esc(ic) + '.jpg" data-ic="' + esc(ic) + '" alt="" loading="lazy">';
  }
  /* a name cell: Persian (with the English below) when the switch is on and Persian exists, else English */
  function nmCell(fa, en, cls) {
    return '<span class="fex-npc-nm' + (cls ? ' ' + cls : '') + (fa ? '' : ' rt-en') + '"' + (fa ? '' : ' dir="ltr"') + '>' + esc(fa || en) + '</span>'
      + (fa ? '<span class="fex-sub rt-en" dir="ltr">' + esc(en) + '</span>' : '');
  }
  function itemRow(id, it, extra) {
    var q = it && it[2] != null ? it[2] : 1, nm = it && it[0] ? it[0] : '#' + id;
    return '<a class="fex-npc q' + q + '" href="item.html?ver=forever&amp;id=' + esc(id) + '">' + icon(it && it[1])
      + nmCell(it && it[0] ? itemFaOf(it, it[0]) : '', nm, 'npc-qn') + (extra || '') + '</a>';
  }
  /* objects have no page on the site: a plain row, no Wowhead link */
  function extRow(href, nm, fa) {
    return '<div class="fex-npc"><i class="fex-med fex-objd" aria-hidden="true"></i>'
      + nmCell(fa, nm) + '</div>';
  }
  function npcLink(id, name) {
    var fa = npcFa(name);
    /* quest-hunt v2 carries a few name-only npc rows (no id) — render plain, no dead link */
    if (id == null) return '<div class="fex-npc"><i class="fex-med fex-rk0" aria-hidden="true"></i>'
      + '<span class="fex-npc-nm' + (fa ? '' : ' rt-en') + '"' + (fa ? '' : ' dir="ltr"') + '>' + esc(fa || name) + '</span>'
      + (fa ? '<span class="fex-sub rt-en" dir="ltr">' + esc(name) + '</span>' : '') + '</div>';
    return '<a class="fex-npc" href="npc.html?id=' + esc(id) + '"><i class="fex-med fex-rk0" aria-hidden="true"></i>'
      + '<span class="fex-npc-nm' + (fa ? '' : ' rt-en') + '"' + (fa ? '' : ' dir="ltr"') + '>' + esc(fa || name) + '</span>'
      + (fa ? '<span class="fex-sub rt-en" dir="ltr">' + esc(name) + '</span>' : '') + '</a>';
  }
  function ftitle(id, en) {
    var t = FAT && FAT.t && FAT.t[id];
    return on('namesQuest') && t ? { fa: true, t: t } : { fa: false, t: en };
  }
  function qLink(id) {
    var e = IDX && IDX.quests && IDX.quests[id], nm = e && e[0] ? e[0] : '#' + id, t = ftitle(id, nm);
    return '<a class="fex-npc" href="quest.html?id=' + esc(id) + '"><i class="q-bang" aria-hidden="true">!</i>'
      + '<span class="fex-npc-nm' + (t.fa ? '' : ' rt-en') + '"' + (t.fa ? '' : ' dir="ltr"') + '>' + (t.fa ? tt(t.t) : esc(t.t)) + '</span>'
      + (e && e[2] ? '<span class="fex-lv">' + lbl('سطح', 'Lv') + ' ' + num(e[2]) + '</span>' : '') + '</a>';
  }
  /* the global quick bar (tr-prof.js): English · فارسی · saved styles */
  function styleBar() {
    var P = window.WFTRP;
    return P && P.bar ? P.bar('q-lang') : '';
  }

  /* ---------- data ---------- */
  function loadCommon() {
    return Promise.all([opt(DB + 'zones-meta.json'), opt(DB + 'dungeons.json'), opt(I18N + 'entities.json'),
      opt(DB + 'quest-index.json'), opt(I18N + 'quest-fa-titles.json'), opt(DB + 'uimap-zones.json')])
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
        UIM = (r[5] && r[5].map) || null;
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
  /* ---- ONE map section (map v2): start (!) and end (?) positions, grouped by zone image ----
     Pins are the game's own icons: questgiver.png (AvailableQuest "!") and quest-turnin.png
     (ActiveQuest "?"). poi positions resolve their Forever uiMap id through uimap-zones.json
     (DB2 UiMapAssignment + empirical npc votes); a poi with no mapped zone image stays a
     coordinate chip labelled with the right icon. Same NPC at the same point for start and
     end renders only the "?" pin. */
  function npcNameOf(id) {
    var a = arr(S.q.startedBy && S.q.startedBy.npcs).concat(arr(S.q.finishedBy && S.q.finishedBy.npcs)), i;
    for (i = 0; i < a.length; i++) if (a[i] && a[i].id === id) return a[i].name;
    return null;
  }
  function mapPins() {
    var byZone = {}, order = [];
    function add(role, zone, x, y, name, nid) {
      if (!zone || !META[zone] || typeof x !== 'number' || typeof y !== 'number') return;
      if (!byZone[zone]) { byZone[zone] = []; order.push(zone); }
      byZone[zone].push({ role: role, x: x, y: y, name: name, nid: nid });
    }
    ['s', 'e'].forEach(function (key) {
      var sp = S.sp[key], sx;
      if (sp) {
        sx = spawnSplit(sp.sp);
        sx.zones.forEach(function (z) {
          z.pts.slice(0, 150).forEach(function (pt) { add(key, z.id, pt[0], pt[1], npcFa(sp.name) || sp.name, sp.id); });
        });
      }
    });
    [['startPoi', 's'], ['endPoi', 'e']].forEach(function (kv) {
      arr(S.q[kv[0]]).forEach(function (p) {
        if (!p || p.map == null) return;
        var mv = UIM && UIM[String(p.map)];
        if (mv && mv.zone && META[mv.zone]) add(kv[1], mv.zone, p.x, p.y, npcNameOf(p.npcId), p.npcId);
      });
    });
    order.forEach(function (z) {
      var pts = byZone[z], eAt = {};
      pts.forEach(function (p) { if (p.role === 'e') eAt[p.x.toFixed(1) + ':' + p.y.toFixed(1)] = p.nid; });
      byZone[z] = pts.filter(function (p) {
        return !(p.role === 's' && eAt[p.x.toFixed(1) + ':' + p.y.toFixed(1)] === p.nid);
      });
    });
    order = order.filter(function (z) { return byZone[z].length; });
    return { order: order, byZone: byZone };
  }
  function mapZoneHtml(i) {
    var z = S.mpin.order[i], pts = S.mpin.byZone[z], meta = META[z], h, zn;
    zn = meta ? zoneOf(meta) : enSpan('Zone ' + z);
    h = '<div class="fsrc-map npc-map"><div class="fsrc-mimg">'
      + '<img class="npc-mimg-img" src="data/forever/img/zones/' + z + '.jpg" alt="" loading="lazy">'
      + pts.map(function (p) {
          return '<img class="fsrc-gpin fsrc-gpin-' + p.role + '" src="' + MICON[p.role] + '" style="left:' + p.x + '%;top:' + p.y + '%"'
            + ' title="' + esc((p.name || lbl('NPC', 'NPC')) + ' (' + p.x.toFixed(1) + '، ' + p.y.toFixed(1) + ')') + '" alt="">';
        }).join('') + '</div>'
      + '<div class="fsrc-mcap"><b>' + zn + '</b><span dir="ltr">' + num(pts.filter(function (p) { return p.role === 's'; }).length)
      + ' ! · ' + num(pts.filter(function (p) { return p.role === 'e'; }).length) + ' ?</span></div>';
    if (S.mpin.order.length > 1) {
      h += '<div class="fsrc-mchips">' + S.mpin.order.map(function (q, i2) {
        var m = META[q];
        return '<button type="button" class="fsrc-mchip' + (i2 === i ? ' on' : '') + '" data-i="' + i2 + '"' + (m && on('namesZone') && m.fa ? '' : ' dir="ltr"') + '>'
          + (m ? (on('namesZone') && m.fa ? esc(m.fa) : esc(m.name)) : 'Zone ' + q) + '</button>';
      }).join('') + '</div>';
    }
    return h + '</div>';
  }
  function poiChips() {
    /* poi with no mapped zone image: coordinate chips, labelled with the right icon(s) */
    var by = {}, ks, h = '';
    [['startPoi', 's'], ['endPoi', 'e']].forEach(function (kv) {
      arr(S.q[kv[0]]).forEach(function (p) {
        if (!p || p.map == null || typeof p.x !== 'number' || typeof p.y !== 'number') return;
        var mv = UIM && UIM[String(p.map)];
        if (mv && mv.zone && META[mv.zone]) return;
        (by[p.map] = by[p.map] || {})[kv[1]] = (by[p.map][kv[1]] || []).concat([p]);
      });
    });
    ks = Object.keys(by);
    ks.forEach(function (m) {
      var ico = (by[m].s ? '<img class="q-lgico" src="' + MICON.s + '" alt="">' : '')
        + (by[m].e ? '<img class="q-lgico" src="' + MICON.e + '" alt="">' : '');
      h += '<p class="q-maplb">' + ico + lbl('مختصات (٪ از نقشهٔ', 'Coordinates (% of map')
        + ' <span dir="ltr">' + esc(m) + '</span>' + lbl(' — شناسهٔ نقشهٔ Forever)', ' — Forever uiMap id)') + '</p>'
        + '<div class="fex-hchips">' + by[m].s.concat(by[m].e || []).slice(0, 16).map(function (p) {
            return '<span class="fex-chip">' + num(p.x.toFixed(1)) + ' ، ' + num(p.y.toFixed(1)) + '</span>';
          }).join('') + '</div>';
    });
    return h;
  }
  function mapSection() {
    var h, lb, dgn = {};
    S.mpin = mapPins();
    ['s', 'e'].forEach(function (k) {
      var sp = S.sp[k];
      if (sp) spawnSplit(sp.sp).dungeons.forEach(function (d) { dgn[d.slug] = 1; });
    });
    if (!S.mpin.order.length && !Object.keys(dgn).length) return poiChips();
    lb = '<p class="q-maplb q-maplegend"><img class="q-lgico" src="' + MICON.s + '" alt=""> ' + lbl('شروع کوئست', 'Take the quest')
      + ' · <img class="q-lgico" src="' + MICON.e + '" alt=""> ' + lbl('تحویل کوئست', 'Turn in') + '</p>';
    h = lb;
    if (S.mpin.order.length) h += mapZoneHtml(0) + poiChips();
    else h += poiChips();
    if (Object.keys(dgn).length) h += '<div class="npc-dg">' + dungeonRows(Object.keys(dgn).map(function (s) { return { slug: s, n: 0 }; })) + '</div>';
    return sec(lbl('نقشه', 'Map'), null, h, null);
  }
  function dungeonRows(dg) {
    return dg.map(function (x) {
      var d = DUNG[x.slug];
      return '<div class="fex-npc"><i class="fex-med fex-rk1" aria-hidden="true"></i><span class="fex-npc-nm rt-en" dir="ltr">'
        + esc(d ? d.name : x.slug) + '</span><span class="fex-z">' + lbl(d && d.type === 'raid' ? 'ریید' : 'دانجن', 'Dungeon') + '</span></div>';
    }).join('');
  }
  /* startPoi / endPoi are handled by the unified map section (mapSection / poiChips). */
  function actorBlock(role, a) {
    var rows = '';
    a = a || {};
    arr(a.npcs).forEach(function (n) { rows += npcLink(n.id, n.name); });
    arr(a.objects).forEach(function (o) { rows += extRow('https://www.wowhead.com/classic/object=' + o.id, o.name, objFa(o.name)); });
    arr(a.items).forEach(function (it) {
      var lit = S.items[it.id];
      rows += '<a class="fex-npc" href="item.html?ver=forever&amp;id=' + esc(it.id) + '"><i class="fex-med fex-objd" aria-hidden="true"></i>' + nmCell(itemFaOf(lit, it.name), it.name) + '</a>';
    });
    if (!rows) return '';
    return sec(role, null, rows, actorB(a));
  }

  /* ---------- detail page ---------- */
  /* W3b (lane-b5) + lane-b6: per-field provenance (docs/SOURCES.md Quests table —
     the record's "tsrc" map, field -> [t, via]). ONE note per page, not five:
     when every TEXT field the record carries (name, desc, objectives, details,
     progress, completion) has the SAME tier 3/4, the ONE note renders under the
     hero title and the sections stay quiet; when the text blocks differ, a note
     renders ONLY on the blocks whose tier differs from the title's (name) tier.
     The rewards block keeps its own single note, by the same within-block rule.
     T4 "Classic or wiki, not confirmed in Forever", T3 "ForeverDB"; T1/T2 blocks
     and old records without tails show nothing (no crash). The note always
     speaks about the ENGLISH source the text (and its Persian translation) came
     from — the fa record's own pack id is separate and never shown here. */
  /* QUEST-LABEL-BEGIN */
  var Q_TEXT_FIELDS = ["name", "desc", "objectives", "details", "progress", "completion"];
  function qFieldTier(q, f) {
    var t = q && q.tsrc && q.tsrc[f];
    return (t && t.length) ? t[0] : null;
  }
  function qCarries(q, f) {
    if (!q) return false;
    var v = q[f];
    if (v == null || v === "") return false;
    if (typeof v === "object" && v.length === 0) return false;
    return true;
  }
  function qTierNote(t) {
    if (t === 4) return { fa: "این متن از Classic یا ویکی است و در Forever تأیید نشده", en: "This text is from Classic or a wiki, not confirmed in Forever" };
    if (t === 3) return { fa: "منبع: ForeverDB", en: "Source: ForeverDB" };
    return null;   /* T1/T2 (observed / client build) and anything else: nothing */
  }
  function qPageNote(q) {
    /* the ONE page note: every carried TEXT field the same tier 3/4 */
    var t0 = null, i, f, t, n = 0;
    if (!q) return null;
    for (i = 0; i < Q_TEXT_FIELDS.length; i++) {
      f = Q_TEXT_FIELDS[i];
      if (!qCarries(q, f)) continue;
      t = qFieldTier(q, f);
      if (t == null) return null;            /* carried but unattributed -> no page claim */
      if (t !== 3 && t !== 4) return null;   /* T1/T2/estimate among the texts -> no page note */
      if (t0 == null) t0 = t; else if (t !== t0) return null;   /* mixed -> block notes instead */
      n++;
    }
    return n ? qTierNote(t0) : null;
  }
  function qBlockTier(q, fields) {
    var ts = [], i, t;
    for (i = 0; i < (fields || []).length; i++) {
      t = q && q.tsrc && q.tsrc[fields[i]];
      if (!t || !t.length) return null;   /* a block field without a tail -> unknown block */
      ts.push(t[0]);
    }
    return ts.length ? ts : null;
  }
  function qBlockNote(q, fields) {
    var ts = qBlockTier(q, fields), t0, i;
    if (!ts) return null;
    t0 = ts[0];
    for (i = 1; i < ts.length; i++) if (ts[i] !== t0) return null;   /* mixed tiers -> nothing */
    return qTierNote(t0);
  }
  function qSecNote(q, fields) {
    /* lane-b6: uniform page -> the hero title carries the one note, sections
       quiet; mixed page -> a note only on the blocks whose tier differs from
       the title's (name) tier; no title tier -> every 3/4 block speaks. */
    if (qPageNote(q)) return null;
    var ts = qBlockTier(q, fields), t, a;
    if (!ts) return null;
    t = ts[0];
    if (t !== 3 && t !== 4) return null;
    a = qFieldTier(q, "name");
    if (a != null && t === a) return null;
    return qBlockNote(q, fields);
  }
  function qXpEst(q) {
    /* lane-b6: tier 0 "estimate (curve)" — a computed XP is not a source value */
    var t = q && q.tsrc && q.tsrc.rewXp;
    return !!(t && t.length && t[0] === 0);
  }
  /* QUEST-LABEL-END */
  function qPageNoteHtml(q) {
    var nt = qPageNote(q);
    return nt ? '<p class="npc-note">' + lblHtml(nt.fa, nt.en) + '</p>' : '';
  }
  function qSecNoteHtml(q, fields) {
    var nt = qSecNote(q, fields);
    return nt ? '<p class="npc-note">' + lblHtml(nt.fa, nt.en) + '</p>' : '';
  }
  function qNoteHtml(q, fields) {
    var nt = qBlockNote(q, fields);
    return nt ? '<p class="npc-note">' + lblHtml(nt.fa, nt.en) + '</p>' : '';
  }
  function money2(q) { return typeof q.rewMoney === 'number' && q.rewMoney > 0 ? q.rewMoney : 0; }
  function rewardsHtml(q) {
    var h = '', rw = S.rw, ch, it, hasAny = false, rep;
    /* W3b: the rewards block note — over the fields the record actually carries */
    var rf = [];
    if (typeof q.rewXp === 'number' && q.rewXp > 0) rf.push('rewXp');
    if (money2(q)) rf.push('rewMoney');
    if (arr(q.rewRep).length) rf.push('rewRep');
    if (arr(q.rewItems).length) rf.push('rewItems');
    if (arr(q.rewChoice).length) rf.push('rewChoice');
    h = qNoteHtml(q, rf);
    /* lane-b6: a tier-0 "estimate (curve)" XP is a computed value, not a source
       value — shown as ≈ <xp> with a small muted «تخمینی، تأیید نشده» label;
       ForeverDB / cache XP (tiers 3/1) render unchanged */
    var xpEst = qXpEst(q);
    if (typeof q.rewXp === 'number' && q.rewXp > 0) { h += frow(lbl('تجربه', 'Experience'), (xpEst ? '≈ ' : '') + '<b>' + num(q.rewXp) + '</b> XP' + (xpEst ? ' <small class="fex-xpest">' + lbl('تخمینی، تأیید نشده', 'estimated, unconfirmed') + '</small>' : '')); hasAny = true; }
    if (money2(q)) { h += frow(lbl('پول', 'Money'), '<b>' + esc(money(money2(q))) + '</b>'); hasAny = true; }
    rep = arr(q.rewRep);
    if (rep.length) {
      /* quest-hunt v2: reputation may carry the faction ID (no offline name map;
         shown as-is, never guessed) or the name as before */
      h += rep.map(function (r) {
        var fn = typeof r[0] === 'number' ? 'Faction #' + r[0] : r[0];
        return frow(enSpan(fn), (r[1] > 0 ? '+' : '') + num(r[1]));
      }).join('');
      hasAny = true;
    }
    ch = arr(q.rewChoice);
    /* the source repeats choice items inside rewItems: show them only under "choose one" */
    it = arr(q.rewItems).filter(function (x) {
      return !ch.some(function (c) { return c[0] === x[0]; });
    });
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
    var faT = f.t || (FAT && FAT.t && FAT.t[q.id]) || '';
    var fa = on('namesQuest') && faT ? faT : '';
    var ck = catKey(q);
    var side = q.faction === 'horde' ? 'Horde' : (q.faction === 'alliance' ? 'Alliance' : '');
    var sideFa = side && on('namesNpc') ? trEnt('faction', side) : '';
    var sideHtml = side ? (sideFa ? esc(sideFa) : enSpan(side)) : '';
    var title = fa || q.name || ('#' + q.id);
    var zoneHtml = ck ? esc(QC.name(ck)) : (q.zone ? zoneByName(q.zone) : (q.zoneKey ? zoneByKey(q.zoneKey) : ''));
    var zl = ck ? lbl(QC.groupName(ck), 'Category') : lbl('منطقه', 'Zone');
    var hero, A = '', B = '', texts, ch = '', pre, hb;

    BL = [];
    document.title = tplain(title) + ' — ' + (on('uiLabels') ? 'کوئست' : 'Quest') + ' — wowfarsi';
    hb = bd(titleB(!!faT));
    /* the title dot sits inside the h1; the legend is filled into <!--trb-leg--> once every section is known */
    hero = '<header class="fex-hero q1 fFade"><div class="fex-hid"><p class="fex-eyebrow font-cinzel" dir="ltr"><i></i>QUEST' + (q.repeatable ? ' · REPEATABLE' : '') + '<i></i></p>'
      + '<h1' + (fa ? '>' : ' class="rt-en" dir="ltr">') + (fa ? tt(title) : esc(title)) + hb + '</h1>'
      + (fa && q.name ? '<p class="fx-ensub rt-en" dir="ltr">' + esc(q.name) + '</p>' : '')
      + qPageNoteHtml(q)
      + '<div class="fex-hchips">'
      + (q.questLevel ? chip(lbl('سطح کوئست', 'Quest level'), num(q.questLevel)) : '')
      + (q.requiredLevel ? chip(lbl('حداقل سطح', 'Required level'), num(q.requiredLevel)) : '')
      + (zoneHtml ? chip(zl, zoneHtml) : '')
      + (sideHtml ? chip(lbl('طرف', 'Side'), sideHtml) : '')
      + (q.repeatable ? chip(lbl('نوع', 'Type'), lbl('تکرارشدنی', 'Repeatable')) : '')
      + '</div><!--trb-leg--></div></header>';

    /* texts */
    texts = '';
    if (arr(q.objectives).length || arr(f.obj).length) {
      /* the DB often stores the objectives sentence as `desc` too: then it is ONE block (هدف), and its
         Persian may live in fa.obj OR fa.desc (owner: شرح showed the Persian of هدف next to the English هدف) */
      var same = !!enKey(q.objectives) && enKey(q.objectives) === enKey(q.desc);
      var objFaTxt = arr(f.obj).length ? f.obj : (same ? f.desc : f.obj);
      var objHtml = paras(q.objectives, objFaTxt), sumHtml = paras(q.desc, f.desc);
      texts += sec(lbl('هدف', 'Objectives'), null, qSecNoteHtml(q, ['objectives']) + objHtml, txtB(q.objectives, objFaTxt));
      if (!same && sumHtml !== objHtml) texts += sec(lbl('شرح', 'Summary'), null, qSecNoteHtml(q, ['desc']) + sumHtml, txtB(q.desc, f.desc));
    } else {
      texts += sec(lbl('هدف', 'Objectives'), null, qSecNoteHtml(q, ['desc']) + paras(q.desc, f.desc), txtB(q.desc, f.desc));
    }
    texts += sec(lbl('توضیح', 'Description'), null, qSecNoteHtml(q, ['details']) + paras(q.details, f.details), txtB(q.details, f.details));
    texts += sec(lbl('پیشرفت', 'Progress'), null, qSecNoteHtml(q, ['progress']) + paras(q.progress, f.progress), txtB(q.progress, f.progress));
    texts += sec(lbl('تحویل', 'Completion'), null, qSecNoteHtml(q, ['completion']) + paras(q.completion, f.completion), txtB(q.completion, f.completion));
    /* quest-hunt v2 targets: creatures to kill / items to collect */
    if (arr(q.killTargets).length) {
      texts += sec(lbl('شکار', 'Kill targets'), q.killTargets.length,
        q.killTargets.map(function (k) { return k && k.id ? npcLink(k.id, k.name) : ''; }).join(''),
        partsB(q.killTargets.filter(function (k) { return k && k.id; }).map(function (k) { return { has: npcHas(k.name), k: 'namesNpc', ok: true }; }), '\u0627\u0633\u0645'));
    }
    if (arr(q.collectItems).length) {
      texts += sec(lbl('جمع‌آوری', 'Collect'), q.collectItems.length,
        q.collectItems.map(function (c) {
          if (!c || c.id == null) return '';
          return itemRow(c.id, S.items[c.id], c.count > 1 ? '<span class="fex-ch">×' + num(c.count) + '</span>' : '');
        }).join(''),
        partsB(itemParts(q.collectItems.filter(function (c) { return c && c.id != null; }).map(function (c) { return c.id; })), '\u0627\u0633\u0645'));
    }
    if (!texts) texts = '<p class="npc-none">' + lbl('متن این کوئست در دیتای منبع نیست.', 'The source data has no text for this quest.') + '</p>';
    A += (hasFa ? '' : '<p class="str-note npc-note">' + lbl('ترجمهٔ فارسی این کوئست هنوز آماده نیست؛ متن انگلیسی نشان داده می‌شود.', 'The Persian translation of this quest is not ready yet; English text is shown.') + '</p>') + texts;

    /* chain */
    pre = arr(q.preQuestSingle).concat(arr(q.preQuestGroup));
    if (pre.length) ch += sec(lbl('پیش‌نیاز', 'Requires'), pre.length, pre.map(qLink).join(''), partsB(qParts(pre), '\u0639\u0646\u0648\u0627\u0646'));
    if (q.nextQuestInChain) ch += sec(lbl('کوئست بعدی', 'Next in chain'), 1, qLink(q.nextQuestInChain), partsB(qParts([q.nextQuestInChain]), '\u0639\u0646\u0648\u0627\u0646'));
    /* branching forks (quest-hunt v2): several successors, kept as a list */
    if (arr(q.nextQuests).length) ch += sec(lbl('کوئست‌های بعدی', 'Next quests'), q.nextQuests.length, q.nextQuests.map(qLink).join(''), partsB(qParts(q.nextQuests), '\u0639\u0646\u0648\u0627\u0646'));
    if (arr(q.exclusiveTo).length) ch += sec(lbl('ناسازگار با', 'Exclusive with'), q.exclusiveTo.length, q.exclusiveTo.map(qLink).join(''), partsB(qParts(q.exclusiveTo), '\u0639\u0646\u0648\u0627\u0646'));
    A += ch;

    /* facts + where + rewards */
    B += panel(lbl('مشخصات', 'Details'),
      frow(lbl('سطح کوئست', 'Quest level'), q.questLevel ? num(q.questLevel) : '')
      + frow(lbl('حداقل سطح', 'Required level'), q.requiredLevel ? num(q.requiredLevel) : '')
      + frow(zl, zoneHtml)
      + frow(lbl('طرف', 'Side'), sideHtml)
      + frow(lbl('نژاد', 'Races'), arr(q.reqRaces).length ? q.reqRaces.map(enSpan).join('، ') : '')
      + frow(lbl('کلاس', 'Classes'), arr(q.reqClasses).length ? q.reqClasses.map(function (c) { var cf = clsFa(c); return cf ? esc(cf) : enSpan(c); }).join('، ') : '')
      + frow(lbl('شناسه', 'ID'), '<span dir="ltr">' + esc(q.id) + '</span>'), factsB(q, ck, side));
    B += panel(lbl('پاداش', 'Rewards'), rewardsHtml(q), rewardsB(q));
    B += actorBlock(lbl('شروع از', 'Started by'), q.startedBy);
    B += actorBlock(lbl('تحویل به', 'Turn in to'), q.finishedBy);
    B += mapSection();

    root.innerHTML = '<nav class="rt-crumb"><a href="forever.html">Forever</a><i></i><a href="quest.html">' + lbl('پایگاه کوئست', 'Quest database') + '</a><i></i><span>' + (fa ? tt(title) : esc(title)) + '</span></nav>'
      + '<div class="fex">' + hero.replace('<!--trb-leg-->', TB && TB.legend ? TB.legend(BL) : '') + styleBar() + '<div class="fex-grid"><div class="fex-colA">' + A + '</div><div class="fex-colB">' + B + '</div></div>'
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
      arr(q.collectItems).forEach(function (c) { if (c && c.id != null) ids.push(c.id); });
      arr((q.startedBy || {}).items).concat(arr((q.finishedBy || {}).items)).forEach(function (x) { if (x && x.id != null) ids.push(x.id); });
      return Promise.all([Promise.all(Object.keys(need).map(function (k) { return opt(DB + 'spawn-' + k + '.json'); })), loadItems(ids)]).then(function (r2) {
        var shards = {}, ks = Object.keys(need), s, e;
        ks.forEach(function (k, i) { shards[k] = r2[0][i]; });
        s = firstSpawn(q.startedBy, shards);
        e = firstSpawn(q.finishedBy, shards);
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
  /* the style bar's clicks are handled by tr-prof.js (delegated); only the map chips live here */
  root.addEventListener('click', function (ev) {
    var b = ev.target && ev.target.closest ? ev.target.closest('button') : null, wrap, i;
    if (!b) return;
    if (b.classList.contains('fsrc-mchip') && S && S.mpin) {
      wrap = b.closest('.npc-map');
      if (!wrap) return;
      i = +b.getAttribute('data-i');
      if (S.mpin.order[i] != null) wrap.outerHTML = mapZoneHtml(i);
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
