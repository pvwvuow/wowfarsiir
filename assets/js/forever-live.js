/* forever-live.js: live numbers for the Forever-first pages (index, forever, status).
   ONE place reads the published JSON and fills every element that names a key, so no page ever
   carries a hand-typed count again:
     data-live="items.pct"   -> text (Persian digits)
     data-live-w="items"     -> style.width = that group's percent
     data-live-hide          -> wrapper stays hidden until one of its data-live keys resolves
     data-live-raids         -> chips with the raids of the next announced phase
   Sources (all already published with the site): data/forever/coverage.json (translation counts,
   built by tools/translation_coverage.py), build.json (client build), phases.json (official
   Blizzard dates), changes/latest.json (what the newest client build changed), db/dungeons.json +
   i18n/dungeon-fa.json (raid names). A key that cannot be read keeps the element's placeholder:
   never a stale or invented number. Fetches are bucketed per 10 minutes (the site's own cache).
   window.WFLIVE = { ready: Promise<{m, C, B, P, X}>, faNum, faInt, faPct, pctOf, ago, faDate } */
(function () {
  'use strict';
  var T = Math.floor(Date.now() / 6e5);
  var BASE = 'data/forever/';
  var FD = '\u06f0\u06f1\u06f2\u06f3\u06f4\u06f5\u06f6\u06f7\u06f8\u06f9';
  var PCT = '\u066a';
  function get(p) {
    return fetch(BASE + p + '?t=' + T).then(function (r) {
      if (!r.ok) throw new Error(p);
      return r.json();
    }).catch(function () { return null; });
  }
  function faNum(v) { return String(v).replace(/[0-9]/g, function (d) { return FD.charAt(+d); }); }
  function faInt(n) {
    n = Math.round(Number(n));
    if (!isFinite(n)) return null;
    return faNum(String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '\u066c'));
  }
  /* 100 only when really complete; otherwise floor to one decimal (99.96 never shows as 100) */
  function pctOf(done, total) {
    done = Number(done); total = Number(total);
    if (!(total > 0)) return null;
    if (done >= total) return 100;
    return Math.min(99.9, Math.floor(done / total * 1000) / 10);
  }
  function faPct(p) {
    if (p == null || !isFinite(p)) return null;
    return faNum(String(p)).replace('.', '\u066b') + PCT;
  }
  function ago(iso) {
    var t = Date.parse(iso), m, h;
    if (!t) return null;
    m = Math.max(0, Math.round((Date.now() - t) / 6e4));
    if (m < 2) return '\u0647\u0645\u06cc\u0646 \u0627\u0644\u0627\u0646';
    if (m < 60) return faNum(m) + ' \u062f\u0642\u06cc\u0642\u0647 \u067e\u06cc\u0634';
    h = Math.round(m / 60);
    if (h < 24) return faNum(h) + ' \u0633\u0627\u0639\u062a \u067e\u06cc\u0634';
    return faNum(Math.round(h / 24)) + ' \u0631\u0648\u0632 \u067e\u06cc\u0634';
  }
  function faDate(iso) {
    try {
      return new Date(iso).toLocaleDateString('fa-IR', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Tehran' });
    } catch (e) { return null; }
  }
  function sec(C, id) {
    var s = (C && C.sections) || [], i;
    for (i = 0; i < s.length; i++) if (s[i] && s[i].id === id) return s[i];
    return null;
  }
  function sum(C, ids) {
    var d = 0, t = 0, ok = false;
    ids.forEach(function (id) {
      var x = sec(C, id);
      if (x && Number(x.total) > 0) { d += Number(x.done) || 0; t += Number(x.total); ok = true; }
    });
    return ok ? { done: d, total: t, pct: pctOf(d, t) } : null;
  }
  /* the six groups a reader understands; each is one or more coverage sections */
  var GROUPS = {
    items: ['item_names', 'item_tips'],
    quests: ['quests_all', 'quest_texts'],
    npcs: ['npc_pages'],
    spells: ['spells'],
    dungeons: ['dungeons'],
    zones: ['zones_meta']
  };
  function model(C, B, P, X, D, DF, now) {
    var m = { _g: {} }, all = { done: 0, total: 0 }, x, b, next = null;
    now = now || Date.now();
    function put(k, v) { if (v != null && v !== '') m[k] = v; }
    Object.keys(GROUPS).forEach(function (g) {
      var s = sum(C, GROUPS[g]);
      if (!s) return;
      m._g[g] = s;
      put(g + '.done', faInt(s.done));
      put(g + '.total', faInt(s.total));
      put(g + '.left', faInt(s.total - s.done));
      put(g + '.pct', faPct(s.pct));
      all.done += s.done; all.total += s.total;
    });
    if ((x = sec(C, 'item_names'))) put('count.items', faInt(x.total));
    if ((x = sec(C, 'quests_all'))) { put('count.quests', faInt(x.total)); put('count.questsFa', faInt(x.done)); }
    if ((x = sec(C, 'npc_pages'))) put('count.npcs', faInt(x.total));
    if ((x = sec(C, 'zones_meta'))) put('count.zones', faInt(x.total));
    if ((x = sec(C, 'spells'))) put('count.spells', faInt(x.total));
    if ((x = sec(C, 'item_tips'))) put('count.tips', faInt(x.total));
    if ((x = sec(C, 'dungeons')) && x.groups) x.groups.forEach(function (g) { if (g.id === 'd_name') put('count.dungeons', faInt(g.total)); });
    if (all.total) {
      m._g.fa = { done: all.done, total: all.total, pct: pctOf(all.done, all.total) };
      put('fa.pct', faPct(m._g.fa.pct));
      put('fa.total', faInt(all.total));
      put('fa.done', faInt(all.done));
      put('fa.left', faInt(all.total - all.done));
    }
    if (C && C.generated) { put('updated', ago(C.generated)); put('updatedDate', faDate(C.generated)); }
    b = (B && B.build) || (C && C.build);
    if (b) put('build', b);
    if (B && B.fetched_at) put('buildDate', faDate(B.fetched_at));
    /* the next officially announced phase (Tehran midnight of the unlock day) */
    ((P && P.phases) || []).forEach(function (ph) {
      var t = Date.parse(String(ph.unlock || '') + 'T00:00:00+03:30');
      if (t && t + 864e5 > now && (!next || t < next.t)) next = { t: t, ph: ph };
    });
    if (next) {
      var days = Math.max(0, Math.ceil((next.t - now) / 864e5)), raids = [];
      put('phase.date', next.ph.unlockFa || faDate(next.ph.unlock));
      put('phase.days', days ? faNum(days) + ' \u0631\u0648\u0632 \u0645\u0627\u0646\u062f\u0647' : '\u0627\u0645\u0631\u0648\u0632');
      (next.ph.instances || []).forEach(function (id) {
        var d = ((D && D.dungeons) || []).filter(function (e) { return e && e.mapId === id; })[0];
        if (!d) return;
        var f = DF && DF.d && DF.d[d.slug] && DF.d[d.slug].n;
        raids.push({ fa: f || '', en: d.name, href: 'dungeon.html?d=' + d.slug });
      });
      (next.ph.pending || []).forEach(function (r) { if (r && r.name) raids.push({ fa: '', en: r.name, href: '', soon: true }); });
      m._raids = raids;
      if (raids.length) put('phase.n', faNum(raids.length));
    }
    if (X && X.totals) {
      put('chg.added', faInt(X.totals.added));
      put('chg.changed', faInt(X.totals.changed));
      put('chg.removed', faInt(X.totals.removed));
      put('chg.build', X.build);
      put('chg.prev', X.previous_build);
      if (X.generated) put('chg.when', ago(X.generated));
    }
    return m;
  }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; });
  }
  function fill(m, root) {
    root = root || document;
    Array.prototype.forEach.call(root.querySelectorAll('[data-live]'), function (el) {
      var k = el.getAttribute('data-live'), h;
      if (m[k] == null) return;
      el.textContent = m[k];
      el.classList.add('lv-on');
      h = el.closest ? el.closest('[data-live-hide]') : null;
      if (h) h.hidden = false;
    });
    Array.prototype.forEach.call(root.querySelectorAll('[data-live-w]'), function (el) {
      var g = m._g[el.getAttribute('data-live-w')];
      if (g && g.pct != null) el.style.width = g.pct + '%';
    });
    Array.prototype.forEach.call(root.querySelectorAll('[data-live-raids]'), function (el) {
      var r = m._raids || [];
      if (!r.length) return;
      el.innerHTML = r.map(function (x) {
        var t = x.fa ? '<b>' + esc(x.fa) + '</b><small dir="ltr">' + esc(x.en) + '</small>' : '<b dir="ltr">' + esc(x.en) + '</b>';
        return x.href ? '<a class="lv-raid" href="' + esc(x.href) + '">' + t + '</a>'
          : '<span class="lv-raid' + (x.soon ? ' lv-soon' : '') + '">' + t + '</span>';
      }).join('');
    });
  }
  var api = { faNum: faNum, faInt: faInt, faPct: faPct, pctOf: pctOf, ago: ago, faDate: faDate, model: model, fill: fill, sec: sec, GROUPS: GROUPS };
  if (typeof module !== 'undefined' && module.exports) { module.exports = api; return; }
  window.WFLIVE = api;
  api.ready = Promise.all([get('coverage.json'), get('build.json'), get('phases.json'), get('changes/latest.json'),
    get('db/dungeons.json'), get('i18n/dungeon-fa.json')]).then(function (r) {
    var m = model(r[0], r[1], r[2], r[3], r[4], r[5]);
    function go() { fill(m); }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', go); else go();
    return { m: m, C: r[0], B: r[1], P: r[2], X: r[3] };
  });
})();
