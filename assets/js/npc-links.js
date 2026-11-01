/* npc-links.js — extras for the Forever item card (item.html?ver=forever&id=),
   kept OUT of retail.js. Runs again after every (re)paint of the card:
   1) NPC rows (retail.js fsrNpcRow) open our NPC page npc.html?id=<id>
      instead of Wowhead.
   2) Drop chance: retail.js leaves the chance slot empty because src-N rows
      carry no chance; the real item -> NPC chances live in
      data/forever/db/drop-<itemId%24>.json {drops:{itemId:[{n,c,k,f}]}}.
      Each NPC row that drops this item gets its % and the rows of that
      section are sorted by chance (highest first).
   3) Rank filter: a section with 4+ ranked NPC rows gets chips
      All / Boss / Elite / Rare / Normal (counts from the row medals).
      «باس» keeps rank-3 rows AND every row whose NPC is a boss of its
      dungeon (data/forever/db/bosses.json, aggregated from dungeon/<slug>.json)
      — the Forever API flags only 151 NPCs as Boss, so Deadmines-style
      dungeon bosses would otherwise be unreachable from the chip.
   Everything is idempotent (data-* marks) so the MutationObserver settles. */
(function () {
  'use strict';
  var V = '20261116d';
  var RE = /^https?:\/\/www\.wowhead\.com\/classic\/npc=(\d+)(?:[/?#].*)?$/;
  var P = new URLSearchParams(location.search);
  var ITEM = P.get('ver') === 'forever' && /^\d+$/.test(P.get('id') || '') ? P.get('id') : null;
  var DROPS = null, asked = false;
  var BOSS = null, bossAsked = false;
  var GROUPS = [
    { k: 'all', fa: 'همه', en: 'All', rk: null },
    { k: 'boss', fa: 'باس', en: 'Boss', rk: [3] },
    { k: 'elite', fa: 'ایلیت', en: 'Elite', rk: [1, 2] },
    { k: 'rare', fa: 'کمیاب', en: 'Rare', rk: [2, 4] },
    { k: 'normal', fa: 'عادی', en: 'Normal', rk: [0] }
  ];

  function fa() { try { return !window.WFTR || !window.WFTR.on || window.WFTR.on('uiLabels'); } catch (e) { return true; } }
  function faNum(v) { return String(v).replace(/[0-9]/g, function (d) { return '۰۱۲۳۴۵۶۷۸۹'.charAt(+d); }).replace('.', '٫'); }
  function pct(c) {
    var s = String(c >= 10 ? Math.round(c * 10) / 10 : c >= 1 ? Math.round(c * 100) / 100 : Math.round(c * 1000) / 1000);
    return fa() ? faNum(s) + '٪' : s + '%';
  }
  function rowId(a) {
    var h = a.getAttribute('href') || '', m = /npc\.html\?id=(\d+)/.exec(h);
    return m ? m[1] : null;
  }
  function rowRank(a) {
    var m = a.querySelector('.fex-med'), r = m && /fex-rk(\d)/.exec(m.className);
    return r ? +r[1] : 0;
  }
  function rowIsBoss(a) {
    return rowRank(a) === 3 || (BOSS ? BOSS.has(+rowId(a) || 0) : false);
  }

  /* 1) links */
  function links(root) {
    var as = root.querySelectorAll('a.fex-npc[href*="wowhead.com/classic/npc="]'), i, m;
    for (i = 0; i < as.length; i++) {
      m = RE.exec(as[i].getAttribute('href') || '');
      if (!m) continue;
      as[i].setAttribute('href', 'npc.html?id=' + m[1]);
      as[i].removeAttribute('target');
      as[i].removeAttribute('rel');
    }
  }

  /* 2) chances */
  function loadDrops(cb) {
    if (DROPS || asked || !ITEM) { if (DROPS) cb(); return; }
    asked = true;
    fetch('data/forever/db/drop-' + (+ITEM % 24) + '.json?v=' + V).then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.json();
    }).then(function (j) {
      var list = (j && j.drops && j.drops[ITEM]) || [], m = {};
      list.forEach(function (d) { if (d && d.n != null && d.c != null && (m[d.n] == null || d.c > m[d.n])) m[d.n] = d.c; });
      DROPS = m;
      cb();
    }).catch(function () { DROPS = {}; });
  }
  function loadBosses(cb) {
    if (BOSS || bossAsked || !ITEM) { if (BOSS) cb(); return; }
    bossAsked = true;
    fetch('data/forever/db/bosses.json?v=' + V).then(function (r) {
      if (!r.ok) throw new Error(r.status);
      return r.json();
    }).then(function (j) {
      BOSS = new Set((j && j.ids) || []);
      cb();
    }).catch(function () { BOSS = new Set(); cb(); });
  }
  function chances(root) {    var secs = root.querySelectorAll('.fex-secbd'), s, rows, i, a, id, c, ch, z, got, sorted;
    for (s = 0; s < secs.length; s++) {
      rows = secs[s].querySelectorAll(':scope > a.fex-npc');
      got = 0;
      for (i = 0; i < rows.length; i++) {
        a = rows[i];
        if (a.getAttribute('data-ch')) { if (a.getAttribute('data-ch') !== '-') got++; continue; }
        id = rowId(a);
        c = id != null ? DROPS[id] : null;
        if (c == null) { a.setAttribute('data-ch', '-'); continue; }
        a.setAttribute('data-ch', String(c));
        got++;
        if (!a.querySelector('.fex-ch')) {
          ch = document.createElement('span');
          ch.className = 'fex-ch';
          ch.textContent = pct(c);
          z = a.querySelector('.fex-z');
          if (z) a.insertBefore(ch, z); else a.appendChild(ch);
        }
      }
      if (got < 2 || secs[s].getAttribute('data-sorted')) continue;
      sorted = Array.prototype.slice.call(rows).map(function (r, k) {
        var v = r.getAttribute('data-ch');
        return { r: r, k: k, c: v && v !== '-' ? +v : -1 };
      }).sort(function (x, y) { return y.c - x.c || x.k - y.k; });
      secs[s].setAttribute('data-sorted', '1');
      var anchor = rows[0].previousSibling, frag = document.createDocumentFragment();
      sorted.forEach(function (o) { frag.appendChild(o.r); });
      secs[s].insertBefore(frag, anchor ? anchor.nextSibling : secs[s].firstChild);
    }
  }

  /* 3) rank filter */
  function rankCounts(rows) {
    var cnt = {};
    Array.prototype.forEach.call(rows, function (r) { var k = rowRank(r); cnt[k] = (cnt[k] || 0) + 1; });
    return cnt;
  }
  function chipCount(g, rows, cnt) {
    if (!g.rk) return rows.length;
    if (g.k === 'boss') {
      var n = cnt[3] || 0;
      if (BOSS) Array.prototype.forEach.call(rows, function (r) {
        if (rowRank(r) !== 3 && BOSS.has(+rowId(r) || 0)) n++;
      });
      return n;
    }
    return g.rk.reduce(function (t, k) { return t + (cnt[k] || 0); }, 0);
  }
  function buildBar(rows, cnt, act) {
    return GROUPS.map(function (g) {
      var n = chipCount(g, rows, cnt);
      if (!n) return '';
      return '<button type="button" class="fsrc-mchip' + (g.k === act ? ' on' : '') + '" data-rf="' + g.k + '">'
        + (fa() ? g.fa : g.en) + ' ' + (fa() ? faNum(n) : n) + '</button>';
    }).join('');
  }
  function applyFilter(sec, k) {
    var g = GROUPS.filter(function (x) { return x.k === k; })[0] || GROUPS[0];
    Array.prototype.forEach.call(sec.querySelectorAll(':scope > a.fex-npc, :scope > span.fex-npc'), function (r) {
      var keep;
      if (!g.rk) keep = true;
      else if (g.k === 'boss') keep = rowIsBoss(r);
      else keep = g.rk.indexOf(rowRank(r)) >= 0;
      r.style.display = keep ? '' : 'none';
    });
  }
  function filters(root) {
    var secs = root.querySelectorAll('.fex-secbd'), s, rows, ranked;
    for (s = 0; s < secs.length; s++) {
      if (secs[s].getAttribute('data-rf')) continue;
      rows = secs[s].querySelectorAll(':scope > a.fex-npc, :scope > span.fex-npc');
      ranked = 0;
      Array.prototype.forEach.call(rows, function (r) { if (r.querySelector('.fex-med')) ranked++; });
      if (ranked < 4) continue;
      secs[s].setAttribute('data-rf', '1');
      var bar = document.createElement('div');
      bar.className = 'fsrc-mchips npcf-bar';
      bar.innerHTML = buildBar(rows, rankCounts(rows), 'all');
      secs[s].insertBefore(bar, secs[s].firstChild);
    }
  }
  /* boss ids arrive late (fetch): re-count the chips and re-apply the active one */
  function refresh(root) {
    var secs = root.querySelectorAll('.fex-secbd[data-rf="1"]'), s, rows, bar, act;
    for (s = 0; s < secs.length; s++) {
      rows = secs[s].querySelectorAll(':scope > a.fex-npc, :scope > span.fex-npc');
      bar = secs[s].querySelector('.npcf-bar');
      if (!bar || !rows.length) continue;
      act = 'all';
      var on = bar.querySelector('button[data-rf].on');
      if (on) act = on.getAttribute('data-rf');
      bar.innerHTML = buildBar(rows, rankCounts(rows), act);
      applyFilter(secs[s], act);
    }
  }
  document.addEventListener('click', function (ev) {
    var b = ev.target && ev.target.closest ? ev.target.closest('button[data-rf]') : null, sec;
    if (!b) return;
    sec = b.closest('.fex-secbd');
    if (!sec) return;
    Array.prototype.forEach.call(b.parentNode.children, function (x) { x.classList.toggle('on', x === b); });
    applyFilter(sec, b.getAttribute('data-rf'));
  });

  function run() {
    links(document);
    if (!ITEM) return;
    filters(document);
    if (DROPS) chances(document); else loadDrops(function () { chances(document); });
    if (BOSS) refresh(document); else loadBosses(function () { refresh(document); });
  }
  function start() {
    run();
    if (!window.MutationObserver) return;
    var t = 0;
    new MutationObserver(function () {
      clearTimeout(t);
      t = setTimeout(run, 40);
    }).observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
