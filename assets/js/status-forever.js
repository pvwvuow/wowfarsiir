/* status-forever.js v2: the Forever part of status.html, simple and live.
   Draws six cards a reader understands (items, quests, NPCs, spells, dungeons, zones), each with
   one big percent, one bar and one plain sentence, then a short "what is still left" list with
   real links. Every number comes from data/forever/coverage.json through forever-live.js
   (window.WFLIVE); nothing on this page is typed by hand. */
(function () {
  'use strict';
  var L = window.WFLIVE;
  var cards = document.getElementById('fv-cards'), left = document.getElementById('fv-left');
  if (!L || !L.ready || !cards) return;
  function esc(s) { return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  var CARDS = [
    ['items', '\u0622\u06cc\u062a\u0645\u200c\u0647\u0627', '\u0627\u0633\u0645 \u0647\u0631 \u0622\u06cc\u062a\u0645 \u0648 \u0647\u0645\u0647\u0654 \u062e\u0637\u200c\u0647\u0627\u06cc \u062a\u0648\u0644\u062a\u06cc\u067e\u0634', 'count.items', '\u0622\u06cc\u062a\u0645', 'item.html?ver=forever'],
    ['quests', '\u06a9\u0648\u0626\u0633\u062a\u200c\u0647\u0627', '\u0639\u0646\u0648\u0627\u0646 \u0648 \u0645\u062a\u0646 \u06a9\u0627\u0645\u0644 \u06a9\u0648\u0626\u0633\u062a\u200c\u0647\u0627: \u0647\u062f\u0641\u060c \u062f\u0627\u0633\u062a\u0627\u0646 \u0648 \u062a\u062d\u0648\u06cc\u0644', 'count.quests', '\u06a9\u0648\u0626\u0633\u062a', 'quest.html'],
    ['npcs', 'NPC\u200c\u0647\u0627', '\u0627\u0633\u0645 \u0634\u062e\u0635\u06cc\u062a\u200c\u0647\u0627 \u0648 \u0645\u0648\u062c\u0648\u062f\u0627\u062a \u062f\u0646\u06cc\u0627\u06cc \u0628\u0627\u0632\u06cc', 'count.npcs', 'NPC', 'npc.html'],
    ['spells', '\u0627\u0633\u067e\u0644\u200c\u0647\u0627', '\u0627\u0633\u0645 \u0648 \u062a\u0648\u0636\u06cc\u062d \u0627\u0633\u067e\u0644\u200c\u0647\u0627\u06cc \u06a9\u0644\u0627\u0633\u200c\u0647\u0627', 'count.spells', '\u0627\u0633\u067e\u0644', 'spellbook.html'],
    ['dungeons', '\u062f\u0627\u0646\u062c\u0646\u200c\u0647\u0627 \u0648 \u0631\u06cc\u06cc\u062f\u0647\u0627', '\u0627\u0633\u0645\u060c \u062a\u0648\u0636\u06cc\u062d\u060c \u0637\u0628\u0642\u0647\u200c\u0647\u0627\u060c \u0628\u0627\u0633\u200c\u0647\u0627 \u0648 \u0635\u0646\u062f\u0648\u0642\u200c\u0647\u0627', 'count.dungeons', '\u062f\u0627\u0646\u062c\u0646 \u0648 \u0631\u06cc\u06cc\u062f', 'dungeon.html'],
    ['zones', '\u0645\u0646\u0627\u0637\u0642 \u0648 \u0646\u0642\u0634\u0647\u200c\u0647\u0627', '\u0627\u0633\u0645 \u0647\u0645\u0647\u0654 \u0632\u0648\u0646\u200c\u0647\u0627\u060c \u0634\u0647\u0631\u0647\u0627 \u0648 \u0646\u0642\u0634\u0647\u200c\u0647\u0627', 'count.zones', '\u0646\u0642\u0634\u0647', 'forever.html#maps']
  ];
  var OF = ' \u0627\u0632 ', DONE = '\u06a9\u0627\u0645\u0644', LEFT = ' \u0645\u0627\u0646\u062f\u0647';
  L.ready.then(function (R) {
    var m = R.m, C = R.C;
    if (!C || !m._g.fa) {
      cards.innerHTML = '<p class="fs-none">\u062f\u0627\u062f\u0647\u0654 \u0634\u0645\u0627\u0631\u0634 \u0641\u0639\u0644\u0627\u064b \u062f\u0631 \u062f\u0633\u062a\u0631\u0633 \u0646\u06cc\u0633\u062a\u061b \u0686\u0646\u062f \u062f\u0642\u06cc\u0642\u0647 \u0628\u0639\u062f \u062f\u0648\u0628\u0627\u0631\u0647 \u0633\u0631 \u0628\u0632\u0646.</p>';
      return;
    }
    cards.innerHTML = CARDS.map(function (c) {
      var g = m._g[c[0]];
      if (!g) return '';
      var full = g.done >= g.total;
      return '<a class="fs-card' + (full ? ' fs-full' : '') + '" href="' + esc(c[5]) + '">'
        + '<div class="fs-top"><b class="fs-name">' + esc(c[1]) + '</b>'
        + (m[c[3]] ? '<span class="fs-cnt">' + esc(m[c[3]]) + ' ' + esc(c[4]) + '</span>' : '') + '</div>'
        + '<p class="fs-pct">' + esc(m[c[0] + '.pct']) + '</p>'
        + '<span class="fs-bar"><i style="width:' + g.pct + '%"></i></span>'
        + '<p class="fs-sub">' + esc(m[c[0] + '.done']) + OF + esc(m[c[0] + '.total']) + ' \u0645\u062a\u0646 \u0648 \u0627\u0633\u0645 \u0641\u0627\u0631\u0633\u06cc \u0634\u062f\u0647'
        + (full ? ' \u00b7 <span class="fs-ok">' + DONE + '</span>' : ' \u00b7 <span class="fs-left">' + esc(m[c[0] + '.left']) + LEFT + '</span>') + '</p>'
        + '<p class="fs-what">' + esc(c[2]) + '</p></a>';
    }).join('');
    if (!left) return;
    /* what is still left: every section that is not complete, with its real pages */
    var rows = (C.sections || []).filter(function (x) { return x && Number(x.total) > Number(x.done); });
    if (!rows.length) {
      left.innerHTML = '<p class="fs-allok">\u0647\u0645\u0647\u0654 \u0628\u062e\u0634\u200c\u0647\u0627 \u06a9\u0627\u0645\u0644 \u0641\u0627\u0631\u0633\u06cc \u0627\u0633\u062a.</p>';
      return;
    }
    left.innerHTML = '<ul class="fs-list">' + rows.map(function (x) {
      var n = Number(x.total) - Number(x.done), links = [];
      (x.samples || []).slice(0, 5).forEach(function (s) {
        if (s && s.u) links.push('<a href="' + esc(s.u) + '" dir="ltr">' + esc(s.l || s.u) + '</a>');
      });
      (x.missing || []).slice(0, 5).forEach(function (s) {
        if (s && s.k) links.push('<span dir="ltr">' + esc(String(s.k).split('|')[0]) + '</span>');
      });
      return '<li><b>' + esc(x.fa || x.en) + '</b><span class="fs-n">' + esc(L.faInt(n)) + ' \u0645\u0648\u0631\u062f</span>'
        + (links.length ? '<span class="fs-ex">' + links.join('\u060c ') + '</span>' : '') + '</li>';
    }).join('') + '</ul>';
  });
})();
