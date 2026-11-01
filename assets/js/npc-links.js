/* npc-links.js — the Forever item card lists the NPCs that drop / sell an item
   (retail.js fsrNpcRow); those rows used to open Wowhead. Now they open our own
   NPC page: npc.html?id=<id>. retail.js is left untouched: this watcher
   rewrites the anchors whenever the card (re)paints. Only plain
   wowhead /classic/npc=<id> links are rewritten. */
(function () {
  'use strict';
  var RE = /^https?:\/\/www\.wowhead\.com\/classic\/npc=(\d+)(?:[/?#].*)?$/;
  function fix(root) {
    var as = (root || document).querySelectorAll('a.fex-npc[href*="wowhead.com/classic/npc="]'), i, m;
    for (i = 0; i < as.length; i++) {
      m = RE.exec(as[i].getAttribute('href') || '');
      if (!m) continue;
      as[i].setAttribute('href', 'npc.html?id=' + m[1]);
      as[i].removeAttribute('target');
      as[i].removeAttribute('rel');
    }
  }
  function start() {
    fix(document);
    if (!window.MutationObserver) return;
    var t = 0;
    new MutationObserver(function () {
      clearTimeout(t);
      t = setTimeout(function () { fix(document); }, 30);
    }).observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
