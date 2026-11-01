/* npc-list.js - NPC list page (npc.html without ?id) with filters (phase 6).
   Reads npc-index v3 tuples [name, minL, maxL, zone, rank, fl, type]:
   rank 0 Normal, 1 Elite, 2 Rare Elite, 3 Boss, 4 Rare;
   fl bits: 1 skinnable, 2 pickpocketable, 4 vendor, 8 trainer, 16 questgiver,
   32 dungeonBoss, 64 flightmaster, 128 innkeeper/banker/service, 256 hide (junk).
   The detail page stays in npc.js; npc.html loads one or the other. */
(function () {
  'use strict';
  var V = '20261201a', DB = 'data/forever/db/';
  var root = document.getElementById('npc-root');
  if (!root) return;
  var WF = window.WFTR || null;
  var cache = {}, META = {}, ZBYNAME = {}, ENT = {}, LS = null;
  var RANKS = [['0', 'Normal', '\u0645\u0639\u0645\u0648\u0644\u06cc'], ['1', 'Elite', '\u0627\u0644\u06cc\u062a'], ['2', 'Rare Elite', '\u06a9\u0645\u06cc\u0627\u0628 \u0627\u0644\u06cc\u062a'], ['3', 'Boss', '\u0628\u0627\u0633'], ['4', 'Rare', '\u06a9\u0645\u06cc\u0627\u0628']];
  var FLAGS = [
    [32, 'Dungeon boss', '\u0628\u0627\u0633 \u062f\u0627\u0646\u062c\u0646'], [1, 'Skinnable', '\u067e\u0648\u0633\u062a\u200c\u06a9\u0646\u200c\u0634\u062f\u0646\u06cc'],
    [2, 'Pickpocketable', '\u062c\u06cc\u0628\u200c\u0628\u064f\u0631\u06cc\u200c\u0634\u062f\u0646\u06cc'], [4, 'Vendor', '\u0641\u0631\u0648\u0634\u0646\u062f\u0647'],
    [8, 'Trainer', '\u0645\u0631\u0628\u06cc'], [16, 'Quest giver', '\u06a9\u0648\u0626\u0633\u062a\u200c\u062f\u0647\u0646\u062f\u0647'],
    [64, 'Flight master', '\u0641\u0644\u0627\u06cc\u062a\u200c\u0645\u0627\u0633\u062a\u0631'], [128, 'Inn / bank / service', '\u0645\u0647\u0645\u0627\u0646\u200c\u062f\u0627\u0631 \u0648 \u0628\u0627\u0646\u06a9']
  ];
  var TYPE_FA = { Beast: '\u062d\u06cc\u0648\u0627\u0646', Humanoid: '\u0627\u0646\u0633\u0627\u0646\u200c\u0646\u0645\u0627', Undead: '\u0645\u0631\u062f\u0647', Demon: '\u062f\u06cc\u0648', Elemental: '\u0627\u0644\u0645\u0646\u062a\u0627\u0644', Dragonkin: '\u0627\u0698\u062f\u0647\u0627\u0646\u0698\u0627\u062f', Mechanical: '\u0645\u06a9\u0627\u0646\u06cc\u06a9\u06cc', Critter: '\u062c\u0627\u0646\u0648\u0631 \u0631\u06cc\u0632', Totem: '\u062a\u0648\u062a\u0645', Giant: '\u063a\u0648\u0644' };

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }
  function faNum(v) { return String(v).replace(/[0-9]/g, function (d) { return '\u06f0\u06f1\u06f2\u06f3\u06f4\u06f5\u06f6\u06f7\u06f8\u06f9'.charAt(+d); }); }
  function on(k) { try { return WF && WF.on ? !!WF.on(k) : true; } catch (e) { return true; } }
  function num(v) { return on('uiLabels') ? faNum(v) : String(v); }
  function lbl(fa, en) { return on('uiLabels') ? esc(fa) : '<span class="rt-en" dir="ltr">' + esc(en) + '</span>'; }
  function tx(fa, en) { return on('uiLabels') ? fa : en; }
  function enSpan(t) { return '<span class="rt-en" dir="ltr">' + esc(t) + '</span>'; }
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
  function trEnt(type, en) {
    var v = ENT[type] && ENT[type][en];
    return typeof v === 'string' ? v : '';
  }
  function npcFa(en) { return on('namesNpc') ? (trEnt('npc', en) || trEnt('creature', en)) : ''; }
  function zoneByName(name) {
    var z = ZBYNAME[name], f;
    if (z) return on('namesZone') && z.fa ? esc(z.fa) : enSpan(z.name);
    f = on('namesZone') ? trEnt('zone', name) : '';
    return f ? esc(f) : enSpan(name);
  }
  function lvText(a, b) {
    if (a == null) return '';
    return a === b || b == null ? num(a) : num(a) + '\u2013' + num(b);
  }
  function npcRow(a) {
    var fa = npcFa(a[1]), lv = lvText(a[2], a[3]);
    return '<a class="fex-npc" href="npc.html?id=' + esc(a[0]) + '"><i class="fex-med fex-rk' + (a[5] || 0) + '" aria-hidden="true"></i>'
      + '<span class="fex-npc-nm' + (fa ? '' : ' rt-en') + '"' + (fa ? '' : ' dir="ltr"') + '>' + esc(fa || a[1]) + '</span>'
      + (fa ? '<span class="fex-sub rt-en" dir="ltr">' + esc(a[1]) + '</span>' : '')
      + (lv ? '<span class="fex-lv">' + lbl('\u0633\u0637\u062d', 'Lv') + ' ' + lv + '</span>' : '')
      + (a[4] ? '<span class="fex-z">' + zoneByName(a[4]) + '</span>' : '') + '</a>';
  }

  /* a = [id, name, minL, maxL, zone, rank, fl, type] */
  function match(a, q, hasFa) {
    var lo = parseInt(LS.lmin, 10), hi = parseInt(LS.lmax, 10);
    if ((a[7] & 256) && !LS.junk) return false;
    if (LS.zone && a[4] !== LS.zone) return false;
    if (LS.rank !== '' && String(a[5]) !== LS.rank) return false;
    if (LS.type && a[8] !== LS.type) return false;
    if (LS.fl && (a[7] & LS.fl) !== LS.fl) return false;
    if (!isNaN(lo) && a[3] < lo) return false;
    if (!isNaN(hi) && a[2] > hi) return false;
    if (q) {
      if (hasFa) { if (nz(trEnt('npc', a[1]) || trEnt('creature', a[1])).indexOf(q) < 0) return false; }
      else if (a[1].toLowerCase().indexOf(q) < 0) return false;
    }
    return true;
  }
  function rows() {
    var q = nz(LS.q), hasFa = /[\u0600-\u06FF]/.test(q), res = [], i, h = '';
    var box = document.getElementById('npcl-res'), cnt = document.getElementById('npcl-cnt');
    if (!box) return;
    for (i = 0; i < LS.all.length; i++) if (match(LS.all[i], q, hasFa)) res.push(LS.all[i]);
    for (i = 0; i < Math.min(LS.shown, res.length); i++) h += npcRow(res[i]);
    if (res.length > LS.shown) h += '<button type="button" class="npcl-more" data-more="list">' + lbl('\u0646\u0645\u0627\u06cc\u0634 \u0628\u06cc\u0634\u062a\u0631', 'Show more') + '</button>';
    box.innerHTML = res.length ? h : '<p class="npc-none">' + lbl('\u0686\u06cc\u0632\u06cc \u067e\u06cc\u062f\u0627 \u0646\u0634\u062f.', 'Nothing found.') + '</p>';
    if (cnt) cnt.innerHTML = lbl('\u0646\u062a\u06cc\u062c\u0647', 'Results') + ' <b>' + num(res.length) + '</b> ' + lbl('\u0627\u0632', 'of') + ' ' + num(LS.junk ? LS.all.length : LS.visible);
    syncUrl();
  }
  function syncUrl() {
    var p = new URLSearchParams();
    if (LS.q) p.set('q', LS.q);
    if (LS.zone) p.set('zone', LS.zone);
    if (LS.rank !== '') p.set('rank', LS.rank);
    if (LS.type) p.set('type', LS.type);
    if (LS.fl) p.set('fl', LS.fl);
    if (LS.lmin) p.set('lmin', LS.lmin);
    if (LS.lmax) p.set('lmax', LS.lmax);
    if (LS.junk) p.set('junk', '1');
    try { history.replaceState(null, '', location.pathname + (p.toString() ? '?' + p.toString() : '')); } catch (e) { /* ignore */ }
  }
  function paint() {
    var zopts = '<option value="">' + tx('\u0647\u0645\u0647\u0654 \u0645\u0646\u0627\u0637\u0642', 'All zones') + '</option>' + LS.zones.map(function (z) {
      var m = ZBYNAME[z], t = m && on('namesZone') && m.fa ? m.fa : z;
      return '<option value="' + esc(z) + '"' + (z === LS.zone ? ' selected' : '') + '>' + esc(t) + '</option>';
    }).join('');
    var ropts = '<option value="">' + tx('\u0647\u0645\u0647\u0654 \u0631\u062a\u0628\u0647\u200c\u0647\u0627', 'All ranks') + '</option>' + RANKS.map(function (r) {
      return '<option value="' + r[0] + '"' + (r[0] === LS.rank ? ' selected' : '') + '>' + esc(tx(r[2], r[1])) + '</option>';
    }).join('');
    var topts = '<option value="">' + tx('\u0647\u0645\u0647\u0654 \u0646\u0648\u0639\u200c\u0647\u0627', 'All types') + '</option>' + LS.types.map(function (t) {
      return '<option value="' + esc(t) + '"' + (t === LS.type ? ' selected' : '') + '>' + esc(on('terms') && TYPE_FA[t] ? TYPE_FA[t] : t) + '</option>';
    }).join('');
    var chips = FLAGS.map(function (f) {
      return '<button type="button" class="npcl-chip' + ((LS.fl & f[0]) ? ' on' : '') + '" data-fl="' + f[0] + '" aria-pressed="' + ((LS.fl & f[0]) ? 'true' : 'false') + '">' + esc(tx(f[2], f[1])) + '</button>';
    }).join('');
    document.title = tx('\u067e\u0627\u06cc\u06af\u0627\u0647 NPC', 'NPC database') + ' \u2014 wowfarsi';
    root.innerHTML = '<nav class="rt-crumb"><a href="forever.html">Forever</a><i></i><span>' + lbl('\u067e\u0627\u06cc\u06af\u0627\u0647 NPC', 'NPC database') + '</span></nav>'
      + '<div class="fex"><header class="fex-hero q1 fFade"><div class="fex-hid"><p class="fex-eyebrow font-cinzel" dir="ltr"><i></i>FOREVER \u00b7 NPC<i></i></p>'
      + '<h1>' + (on('uiLabels') ? '\u067e\u0627\u06cc\u06af\u0627\u0647 NPC' : '<span class="rt-en" dir="ltr">NPC database</span>') + '</h1>'
      + '<p class="fex-hsub">' + lbl('\u062c\u0633\u062a\u200c\u0648\u062c\u0648 \u0628\u06cc\u0646 NPC\u0647\u0627\u060c \u0645\u0648\u062c\u0648\u062f\u0647\u0627 \u0648 \u0628\u0627\u0633\u200c\u0647\u0627\u06cc Forever\u061b \u0628\u0627 \u0641\u06cc\u0644\u062a\u0631 \u0631\u062a\u0628\u0647\u060c \u0646\u0642\u0634 \u0648 \u0646\u0648\u0639.', 'Search Forever NPCs, creatures and bosses; filter by rank, role and type.') + '</p></div></header>'
      + '<section class="fex-sec fFade"><div class="npcl-bar">'
      + '<div class="npcl-f npcl-grow"><label for="npcl-q">' + lbl('\u0646\u0627\u0645', 'Name') + '</label><input id="npcl-q" class="npcl-in" type="search" autocomplete="off" value="' + esc(LS.q) + '"></div>'
      + '<div class="npcl-f"><label for="npcl-z">' + lbl('\u0645\u0646\u0637\u0642\u0647', 'Zone') + '</label><select id="npcl-z" class="npcl-in">' + zopts + '</select></div>'
      + '<div class="npcl-f"><label for="npcl-r">' + lbl('\u0631\u062a\u0628\u0647', 'Rank') + '</label><select id="npcl-r" class="npcl-in">' + ropts + '</select></div>'
      + '<div class="npcl-f"><label for="npcl-t">' + lbl('\u0646\u0648\u0639', 'Type') + '</label><select id="npcl-t" class="npcl-in">' + topts + '</select></div>'
      + '<div class="npcl-f npcl-sm"><label for="npcl-lo">' + lbl('\u0627\u0632 \u0633\u0637\u062d', 'Level from') + '</label><input id="npcl-lo" class="npcl-in" type="number" min="1" max="63" value="' + esc(LS.lmin) + '"></div>'
      + '<div class="npcl-f npcl-sm"><label for="npcl-hi">' + lbl('\u062a\u0627 \u0633\u0637\u062d', 'to') + '</label><input id="npcl-hi" class="npcl-in" type="number" min="1" max="63" value="' + esc(LS.lmax) + '"></div>'
      + '</div><div class="npcl-chips">' + chips + '</div>'
      + '<label class="npcl-junk"><input type="checkbox" id="npcl-junk"' + (LS.junk ? ' checked' : '') + '> ' + lbl('\u0646\u0645\u0627\u06cc\u0634 NPC\u0647\u0627\u06cc \u0622\u0632\u0645\u0627\u06cc\u0634\u06cc \u0648 GM', 'Show test / GM NPCs') + '</label>'
      + '<p class="npcl-count" id="npcl-cnt"></p><div id="npcl-res" class="fex-secbd"></div></section></div>';
    rows();
  }
  function injectCss() {
    var st;
    if (document.getElementById('npcl-css')) return;
    st = document.createElement('style'); st.id = 'npcl-css';
    st.textContent = '.npcl-chips{display:flex;flex-wrap:wrap;gap:.4rem;margin:.7rem 0 .2rem}'
      + '.npcl-chip{cursor:pointer;font:inherit;font-size:12.5px;padding:.2rem .75rem;border-radius:999px;border:1px solid rgba(214,178,94,.28);background:rgba(20,16,10,.55);color:#bdb7a6;transition:color .2s,background .2s,border-color .2s}'
      + '.npcl-chip:hover{color:#f6e0a3}'
      + '.npcl-chip.on{color:#f6e0a3;background:rgba(240,199,94,.13);border-color:rgba(240,199,94,.5)}'
      + '.npcl-junk{display:inline-flex;gap:.4rem;align-items:center;font-size:12.5px;color:#bdb7a6;margin:.5rem 0 0;cursor:pointer}';
    document.head.appendChild(st);
  }
  function start() {
    injectCss();
    var p = new URLSearchParams(location.search);
    LS = { q: p.get('q') || '', zone: p.get('zone') || '', rank: p.get('rank') || '', type: p.get('type') || '',
      fl: parseInt(p.get('fl'), 10) || 0, lmin: p.get('lmin') || '', lmax: p.get('lmax') || '', junk: p.get('junk') === '1',
      shown: 80, all: null, zones: [], types: [], visible: 0 };
    root.innerHTML = '<p class="npc-loading">' + esc('\u062f\u0631 \u062d\u0627\u0644 \u0628\u0627\u0631\u06af\u0630\u0627\u0631\u06cc\u2026') + '</p>';
    return Promise.all([getJSON(DB + 'npc-index.json'), opt(DB + 'zones-meta.json'), opt('data/forever/i18n/entities.json')]).then(function (r) {
      var m = r[0].npcs || r[0], arr = [], zones = {}, types = {}, zs = r[1] && r[1].zones, junk = 0;
      if (zs) (Array.isArray(zs) ? zs : Object.keys(zs).map(function (k) { return zs[k]; })).forEach(function (z) { META[z.id] = z; ZBYNAME[z.name] = z; });
      ENT = (r[2] && r[2].types) || {};
      Object.keys(m).forEach(function (k) {
        var e = m[k];
        if (!Array.isArray(e)) return;
        arr.push([+k, e[0], e[1], e[2], e[3], e[4] || 0, 0, e[5] || 0, e[6] || '']);
        if (e[3]) zones[e[3]] = 1;
        if (e[6]) types[e[6]] = 1;
        if ((e[5] || 0) & 256) junk++;
      });
      arr.sort(function (a, b) { return a[1] < b[1] ? -1 : a[1] > b[1] ? 1 : a[0] - b[0]; });
      LS.all = arr; LS.zones = Object.keys(zones).sort(); LS.types = Object.keys(types).sort();
      LS.visible = arr.length - junk;
      paint();
    }).catch(function () {
      root.innerHTML = '<p class="npc-loading">' + esc('\u0628\u0627\u0631\u06af\u0630\u0627\u0631\u06cc \u0646\u0634\u062f.') + '</p>';
    });
  }

  root.addEventListener('click', function (ev) {
    var b = ev.target && ev.target.closest ? ev.target.closest('button') : null, f;
    if (!b || !LS) return;
    if (b.getAttribute('data-more') === 'list') { LS.shown += 120; rows(); return; }
    f = parseInt(b.getAttribute('data-fl'), 10);
    if (f) {
      LS.fl = (LS.fl & f) ? (LS.fl & ~f) : (LS.fl | f);
      b.classList.toggle('on', !!(LS.fl & f));
      b.setAttribute('aria-pressed', (LS.fl & f) ? 'true' : 'false');
      LS.shown = 80; rows();
    }
  });
  root.addEventListener('input', function (ev) {
    var t = ev.target;
    if (!LS || !t) return;
    if (t.id === 'npcl-q') LS.q = t.value;
    else if (t.id === 'npcl-lo') LS.lmin = t.value;
    else if (t.id === 'npcl-hi') LS.lmax = t.value;
    else return;
    LS.shown = 80; rows();
  });
  root.addEventListener('change', function (ev) {
    var t = ev.target;
    if (!LS || !t) return;
    if (t.id === 'npcl-z') LS.zone = t.value;
    else if (t.id === 'npcl-r') LS.rank = t.value;
    else if (t.id === 'npcl-t') LS.type = t.value;
    else if (t.id === 'npcl-junk') { LS.junk = t.checked; }
    else return;
    LS.shown = 80; rows();
  });
  start();
  if (WF && WF.onChange) WF.onChange(function () { if (LS && LS.all) paint(); });
})();
